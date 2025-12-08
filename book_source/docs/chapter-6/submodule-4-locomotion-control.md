---
sidebar_position: 36
title: "Submodule 4: Locomotion Control"
---

# Submodule 4: Locomotion Control

## Introduction to Humanoid Locomotion Control

Humanoid locomotion control represents one of the most challenging problems in robotics, requiring the coordination of multiple degrees of freedom to achieve stable, efficient, and human-like walking. Unlike wheeled or tracked robots, humanoid robots must maintain balance while moving, making locomotion control a complex interplay of balance control, trajectory planning, and real-time feedback control.

The challenge of humanoid locomotion lies in the need to maintain dynamic balance while achieving forward progression. This requires sophisticated control algorithms that can handle the inherent instability of bipedal walking, adapt to varying terrains, and respond to disturbances in real-time. This submodule explores the theoretical foundations, control strategies, and implementation techniques for achieving stable and efficient humanoid locomotion.

## Fundamentals of Humanoid Locomotion

### Bipedal Walking Principles

Humanoid locomotion is fundamentally different from other forms of robotic mobility due to the need to maintain balance on two legs:

```python
import numpy as np
import math
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState, Imu
from geometry_msgs.msg import Twist, Vector3
from std_msgs.msg import Float32
import time

class LocomotionFundamentals:
    def __init__(self):
        # Physical parameters
        self.robot_height = 1.5  # meters
        self.robot_mass = 75.0   # kg
        self.gravity = 9.81      # m/s^2

        # Locomotion parameters
        self.step_length = 0.3   # meters
        self.step_height = 0.05  # meters
        self.step_duration = 1.0 # seconds
        self.dsp_ratio = 0.2     # Double Support Phase ratio

        # Balance parameters
        self.com_height = 0.85   # Center of Mass height
        self.foot_separation = 0.2  # Distance between feet

    def calculate_zero_moment_point(self, com_position, com_velocity, com_acceleration):
        """
        Calculate Zero Moment Point (ZMP) for balance control
        ZMP = [x, y] position where net moment about point is zero
        """
        x_com, y_com, z_com = com_position
        x_dot, y_dot, z_dot = com_velocity
        x_ddot, y_ddot, z_ddot = com_acceleration

        # ZMP calculation (simplified)
        zmp_x = x_com - (z_com * x_ddot) / self.gravity
        zmp_y = y_com - (z_com * y_ddot) / self.gravity

        return np.array([zmp_x, zmp_y])

    def calculate_capture_point(self, com_position, com_velocity):
        """
        Calculate Capture Point for balance recovery
        Point where robot should step to stop motion
        """
        x_com, y_com, z_com = com_position
        x_dot, y_dot, _ = com_velocity

        # Time constant for inverted pendulum
        omega = math.sqrt(self.gravity / z_com)

        # Capture point calculation
        capture_x = x_com + x_dot / omega
        capture_y = y_com + y_dot / omega

        return np.array([capture_x, capture_y])

    def generate_com_trajectory(self, start_pos, end_pos, duration, height=None):
        """
        Generate Center of Mass trajectory for smooth motion
        Uses 5th order polynomial for smooth acceleration/deceleration
        """
        if height is None:
            height = self.com_height

        # Time vector
        t = np.linspace(0, duration, int(duration * 100))  # 100 Hz sampling

        # 5th order polynomial coefficients for smooth trajectory
        # q(t) = a0 + a1*t + a2*t^2 + a3*t^3 + a4*t^4 + a5*t^5
        a0 = start_pos
        a1 = 0  # zero initial velocity
        a2 = 0  # zero initial acceleration
        a3 = 10 * (end_pos - start_pos) / duration**3
        a4 = -15 * (end_pos - start_pos) / duration**4
        a5 = 6 * (end_pos - start_pos) / duration**5

        # Generate trajectory
        trajectory = a0 + a1*t + a2*t**2 + a3*t**3 + a4*t**4 + a5*t**5
        velocity = a1 + 2*a2*t + 3*a3*t**2 + 4*a4*t**3 + 5*a5*t**4
        acceleration = 2*a2 + 6*a3*t + 12*a4*t**2 + 20*a5*t**3

        return trajectory, velocity, acceleration

    def calculate_support_polygon(self, left_foot, right_foot):
        """
        Calculate support polygon for balance
        For biped: convex hull of foot positions
        """
        # Simple rectangular approximation of support polygon
        # In reality, this would be based on foot geometry
        min_x = min(left_foot[0], right_foot[0]) - 0.1  # Add margin
        max_x = max(left_foot[0], right_foot[0]) + 0.1
        min_y = min(left_foot[1], right_foot[1]) - 0.1
        max_y = max(left_foot[1], right_foot[1]) + 0.1

        return {
            'min_x': min_x,
            'max_x': max_x,
            'min_y': min_y,
            'max_y': max_y,
            'center': np.array([(min_x + max_x)/2, (min_y + max_y)/2])
        }

    def is_balance_stable(self, zmp, support_polygon):
        """
        Check if ZMP is within support polygon (balance stability)
        """
        return (support_polygon['min_x'] <= zmp[0] <= support_polygon['max_x'] and
                support_polygon['min_y'] <= zmp[1] <= support_polygon['max_y'])

class WalkingPatternGenerator:
    def __init__(self):
        self.step_params = {
            'step_length': 0.3,
            'step_width': 0.2,
            'step_height': 0.05,
            'step_duration': 1.0,
            'dsp_ratio': 0.2
        }

    def generate_walk_pattern(self, num_steps, direction='forward'):
        """
        Generate walking pattern for multiple steps
        Returns foot positions and timing for each step
        """
        steps = []

        for i in range(num_steps):
            # Calculate step parameters based on step number
            if direction == 'forward':
                x_offset = i * self.step_params['step_length']
            elif direction == 'backward':
                x_offset = -i * self.step_params['step_length']
            elif direction == 'sideways':
                x_offset = 0
            else:
                x_offset = i * self.step_params['step_length']

            # Left foot step
            left_foot = {
                'position': np.array([x_offset, self.step_params['step_width']/2, 0]),
                'time': i * self.step_params['step_duration'],
                'phase': 'swing' if i % 2 == 0 else 'support'
            }

            # Right foot step
            right_foot = {
                'position': np.array([x_offset, -self.step_params['step_width']/2, 0]),
                'time': (i + 0.5) * self.step_params['step_duration'],
                'phase': 'swing' if i % 2 == 1 else 'support'
            }

            steps.append({
                'step_number': i,
                'left_foot': left_foot,
                'right_foot': right_foot,
                'step_duration': self.step_params['step_duration']
            })

        return steps

    def generate_foot_trajectory(self, start_pos, end_pos, step_height, duration):
        """
        Generate smooth foot trajectory with appropriate step height
        """
        t = np.linspace(0, duration, int(duration * 200))  # 200 Hz sampling

        # Horizontal movement (5th order polynomial)
        x_start, y_start, z_start = start_pos
        x_end, y_end, z_end = end_pos

        # Horizontal trajectory
        x_coeffs = self.fifth_order_polynomial(x_start, x_end, 0, 0, 0, 0, duration)
        y_coeffs = self.fifth_order_polynomial(y_start, y_end, 0, 0, 0, 0, duration)

        x_traj = np.polyval(x_coeffs[::-1], t)
        y_traj = np.polyval(y_coeffs[::-1], t)

        # Vertical trajectory (parabolic for step height)
        z_traj = np.zeros_like(t)
        for idx, time_step in enumerate(t):
            if time_step < duration / 2:
                # Ascending phase
                z_traj[idx] = z_start + (step_height * (2 * time_step / duration)**2)
            else:
                # Descending phase
                z_traj[idx] = z_start + step_height - (step_height * (2 * (time_step - duration/2) / duration)**2)

        return np.column_stack([x_traj, y_traj, z_traj])

    def fifth_order_polynomial(self, x0, x1, v0, v1, a0, a1, duration):
        """
        Calculate coefficients for 5th order polynomial
        q(t) = a0 + a1*t + a2*t^2 + a3*t^3 + a4*t^4 + a5*t^5
        """
        A = np.array([
            [1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 0],
            [1, duration, duration**2, duration**3, duration**4, duration**5],
            [0, 1, 2*duration, 3*duration**2, 4*duration**3, 5*duration**4],
            [0, 0, 2, 6*duration, 12*duration**2, 20*duration**3]
        ])

        b = np.array([x0, v0, a0, x1, v1, a1])
        coeffs = np.linalg.solve(A, b)

        return coeffs
```

## Balance Control Systems

### Center of Mass Control

Maintaining balance is critical for humanoid locomotion:

```python
class BalanceController:
    def __init__(self):
        # PID controller gains for balance
        self.balance_gains = {
            'zmp_x': {'kp': 10.0, 'ki': 1.0, 'kd': 0.5},
            'zmp_y': {'kp': 10.0, 'ki': 1.0, 'kd': 0.5},
            'roll': {'kp': 8.0, 'ki': 0.5, 'kd': 0.3},
            'pitch': {'kp': 8.0, 'ki': 0.5, 'kd': 0.3}
        }

        # Integral windup protection
        self.integral_limits = {
            'zmp_x': 10.0,
            'zmp_y': 10.0,
            'roll': 1.0,
            'pitch': 1.0
        }

        # Error history for derivative calculation
        self.error_history = {
            'zmp_x': [],
            'zmp_y': [],
            'roll': [],
            'pitch': []
        }

        # Target values
        self.target_zmp = np.array([0.0, 0.0])
        self.target_orientation = np.array([0.0, 0.0, 0.0, 1.0])  # quaternion

    def update_balance_control(self, current_state):
        """
        Update balance control based on current state
        current_state: {com_position, com_velocity, orientation, angular_velocity, zmp}
        """
        # Calculate errors
        zmp_error = self.target_zmp - current_state['zmp']
        orientation_error = self.calculate_orientation_error(
            current_state['orientation'],
            self.target_orientation
        )

        # Calculate balance control commands
        zmp_correction = self.pid_control(
            'zmp', zmp_error, current_state.get('zmp_derivative', np.zeros(2))
        )

        orientation_correction = self.pid_control(
            'orientation', orientation_error[:2],  # Use roll and pitch only
            current_state.get('angular_velocity', np.zeros(3))[:2]
        )

        # Combine corrections
        balance_command = {
            'zmp_correction': zmp_correction,
            'orientation_correction': orientation_correction,
            'joint_commands': self.calculate_joint_commands(zmp_correction, orientation_correction)
        }

        return balance_command

    def pid_control(self, control_type, error, derivative=None):
        """
        PID controller for balance control
        """
        if control_type == 'zmp':
            gains = self.balance_gains['zmp_x']  # Use same gains for both x and y
            integral_limit = self.integral_limits['zmp_x']
        elif control_type == 'orientation':
            gains = self.balance_gains['roll']  # Use same gains for roll and pitch
            integral_limit = self.integral_limits['roll']
        else:
            gains = {'kp': 1.0, 'ki': 0.0, 'kd': 0.0}
            integral_limit = 1.0

        # Proportional term
        p_term = gains['kp'] * error

        # Integral term with windup protection
        if control_type not in self.error_history:
            self.error_history[control_type] = []

        self.error_history[control_type].append(error)
        if len(self.error_history[control_type]) > 10:  # Keep last 10 errors
            self.error_history[control_type].pop(0)

        integral = np.sum(self.error_history[control_type])
        # Apply integral limit to prevent windup
        integral = np.clip(integral, -integral_limit, integral_limit)
        i_term = gains['ki'] * integral

        # Derivative term
        if derivative is not None:
            d_term = gains['kd'] * derivative
        else:
            # Approximate derivative if not provided
            if len(self.error_history[control_type]) >= 2:
                dt = 0.01  # Assume 100Hz control rate
                d_term = gains['kd'] * (error - self.error_history[control_type][-2]) / dt
            else:
                d_term = np.zeros_like(error)

        return p_term + i_term + d_term

    def calculate_orientation_error(self, current_quat, target_quat):
        """
        Calculate orientation error as euler angles
        """
        # Convert quaternions to rotation matrices
        current_rot = self.quaternion_to_rotation_matrix(current_quat)
        target_rot = self.quaternion_to_rotation_matrix(target_quat)

        # Calculate relative rotation
        relative_rot = np.dot(target_rot.T, current_rot)

        # Convert to euler angles
        euler = self.rotation_matrix_to_euler(relative_rot)

        return euler

    def quaternion_to_rotation_matrix(self, quat):
        """
        Convert quaternion to rotation matrix
        """
        x, y, z, w = quat

        r11 = 1 - 2*(y**2 + z**2)
        r12 = 2*(x*y - w*z)
        r13 = 2*(x*z + w*y)
        r21 = 2*(x*y + w*z)
        r22 = 1 - 2*(x**2 + z**2)
        r23 = 2*(y*z - w*x)
        r31 = 2*(x*z - w*y)
        r32 = 2*(y*z + w*x)
        r33 = 1 - 2*(x**2 + y**2)

        return np.array([[r11, r12, r13],
                        [r21, r22, r23],
                        [r31, r32, r33]])

    def rotation_matrix_to_euler(self, rot_matrix):
        """
        Convert rotation matrix to euler angles (roll, pitch, yaw)
        """
        # Extract euler angles from rotation matrix
        sy = math.sqrt(rot_matrix[0,0] * rot_matrix[0,0] + rot_matrix[1,0] * rot_matrix[1,0])

        singular = sy < 1e-6

        if not singular:
            x = math.atan2(rot_matrix[2,1], rot_matrix[2,2])
            y = math.atan2(-rot_matrix[2,0], sy)
            z = math.atan2(rot_matrix[1,0], rot_matrix[0,0])
        else:
            x = math.atan2(-rot_matrix[1,2], rot_matrix[1,1])
            y = math.atan2(-rot_matrix[2,0], sy)
            z = 0

        return np.array([x, y, z])

    def calculate_joint_commands(self, zmp_correction, orientation_correction):
        """
        Calculate joint commands to achieve balance corrections
        This is a simplified model - real implementation would use inverse kinematics
        """
        # Simple mapping from balance corrections to joint commands
        # In reality, this would involve complex inverse kinematics and dynamics
        joint_commands = {}

        # Map ZMP corrections to hip and ankle torques
        joint_commands['left_hip_roll'] = zmp_correction[1] * 50  # Scale factor
        joint_commands['right_hip_roll'] = -zmp_correction[1] * 50
        joint_commands['left_ankle_pitch'] = zmp_correction[0] * 30
        joint_commands['right_ankle_pitch'] = zmp_correction[0] * 30

        # Map orientation corrections to hip and torso joints
        joint_commands['torso_pitch'] = orientation_correction[1] * 20
        joint_commands['torso_roll'] = orientation_correction[0] * 20

        return joint_commands

class CapturePointController:
    def __init__(self):
        self.stability_margin = 0.1  # meters
        self.step_timing = 0.8  # seconds
        self.max_step_size = 0.4  # meters

    def calculate_step_location(self, current_capture_point, support_foot, com_state):
        """
        Calculate where to place next foot based on capture point
        """
        # Current capture point
        cp_x, cp_y = current_capture_point

        # Current support foot position
        support_x, support_y, support_z = support_foot

        # Calculate desired step location with safety margin
        step_x = cp_x
        step_y = -support_y if support_y > 0 else -support_y  # Alternate foot placement

        # Apply constraints
        step_x = np.clip(step_x, support_x - self.max_step_size, support_x + self.max_step_size)
        step_y = np.clip(step_y, support_y - 0.3, support_y + 0.3)  # Foot placement limits

        return np.array([step_x, step_y, support_z])

    def predict_stability(self, com_state, foot_positions):
        """
        Predict stability of current COM state with given foot positions
        """
        # Calculate support polygon
        support_polygon = self.calculate_support_polygon(foot_positions)

        # Calculate current ZMP
        zmp = self.calculate_current_zmp(com_state)

        # Check if ZMP is within support polygon
        is_stable = self.is_zmp_in_support(zmp, support_polygon)

        # Calculate stability margin
        margin = self.calculate_stability_margin(zmp, support_polygon)

        return {
            'is_stable': is_stable,
            'stability_margin': margin,
            'zmp_position': zmp,
            'support_polygon': support_polygon
        }

    def calculate_support_polygon(self, foot_positions):
        """
        Calculate support polygon from foot positions
        """
        if len(foot_positions) < 2:
            return None

        # For two feet, create rectangular support polygon
        left_foot = foot_positions[0]
        right_foot = foot_positions[1]

        center_x = (left_foot[0] + right_foot[0]) / 2
        center_y = (left_foot[1] + right_foot[1]) / 2

        width = abs(left_foot[1] - right_foot[1])
        length = max(abs(left_foot[0] - right_foot[0]), 0.2)  # Minimum length

        return {
            'center': np.array([center_x, center_y]),
            'width': width,
            'length': length
        }

    def calculate_current_zmp(self, com_state):
        """
        Calculate current Zero Moment Point
        """
        com_pos = com_state['position']
        com_vel = com_state['velocity']
        com_acc = com_state['acceleration']

        zmp_x = com_pos[0] - (com_pos[2] * com_acc[0]) / 9.81
        zmp_y = com_pos[1] - (com_pos[2] * com_acc[1]) / 9.81

        return np.array([zmp_x, zmp_y])

    def is_zmp_in_support(self, zmp, support_polygon):
        """
        Check if ZMP is within support polygon
        """
        if support_polygon is None:
            return False

        center = support_polygon['center']
        width = support_polygon['width']
        length = support_polygon['length']

        return (abs(zmp[0] - center[0]) <= length/2 and
                abs(zmp[1] - center[1]) <= width/2)

    def calculate_stability_margin(self, zmp, support_polygon):
        """
        Calculate distance from ZMP to edge of support polygon
        """
        if support_polygon is None:
            return -1.0  # No support

        center = support_polygon['center']
        width = support_polygon['width']
        length = support_polygon['length']

        # Calculate distances to edges
        dx = abs(zmp[0] - center[0]) - length/2
        dy = abs(zmp[1] - center[1]) - width/2

        # Return minimum distance (negative if outside support)
        return min(dx, dy)
```

## Walking Pattern Generation

### Trajectory Planning for Locomotion

Generating stable walking patterns is essential for humanoid locomotion:

```python
class WalkingPatternGenerator:
    def __init__(self):
        self.step_parameters = {
            'step_length': 0.3,      # Forward step length
            'step_width': 0.2,       # Lateral foot separation
            'step_height': 0.05,     # Foot lift height
            'step_duration': 1.0,    # Total step duration
            'double_support_ratio': 0.2,  # DSP duration ratio
            'swing_phase_ratio': 0.6   # Swing phase duration ratio
        }

    def generate_walk_trajectory(self, num_steps, walking_speed=0.3, step_height=None):
        """
        Generate complete walking trajectory for specified number of steps
        """
        if step_height is None:
            step_height = self.step_parameters['step_height']

        trajectory = {
            'time': [],
            'left_foot': [],
            'right_foot': [],
            'com_trajectory': [],
            'zmp_trajectory': [],
            'joint_angles': []
        }

        # Initial positions
        current_left = np.array([-0.1, self.step_parameters['step_width']/2, 0.0])
        current_right = np.array([-0.1, -self.step_parameters['step_width']/2, 0.0])

        total_time = 0

        for step in range(num_steps):
            # Determine which foot is swing foot for this step
            is_left_swing = step % 2 == 0

            # Calculate step target
            target_x = -0.1 + (step + 1) * self.step_parameters['step_length']

            if is_left_swing:
                # Left foot swings forward, right foot supports
                swing_start = current_left.copy()
                swing_end = np.array([target_x, self.step_parameters['step_width']/2, 0.0])

                # Generate left foot trajectory
                left_foot_traj = self.generate_foot_trajectory(
                    swing_start, swing_end, step_height,
                    self.step_parameters['step_duration']
                )
                right_foot_traj = np.tile(current_right, (len(left_foot_traj), 1))

                # Update current position
                current_left = swing_end
            else:
                # Right foot swings forward, left foot supports
                swing_start = current_right.copy()
                swing_end = np.array([target_x, -self.step_parameters['step_width']/2, 0.0])

                # Generate right foot trajectory
                right_foot_traj = self.generate_foot_trajectory(
                    swing_start, swing_end, step_height,
                    self.step_parameters['step_duration']
                )
                left_foot_traj = np.tile(current_left, (len(right_foot_traj), 1))

                # Update current position
                current_right = swing_end

            # Generate time vector for this step
            step_times = np.linspace(
                total_time,
                total_time + self.step_parameters['step_duration'],
                len(left_foot_traj)
            )

            # Calculate CoM trajectory to maintain balance
            com_traj = self.calculate_balanced_com_trajectory(
                left_foot_traj, right_foot_traj, walking_speed
            )

            # Calculate ZMP trajectory
            zmp_traj = self.calculate_zmp_trajectory(com_traj)

            # Store trajectory segments
            trajectory['time'].extend(step_times)
            trajectory['left_foot'].extend(left_foot_traj.tolist())
            trajectory['right_foot'].extend(right_foot_traj.tolist())
            trajectory['com_trajectory'].extend(com_traj.tolist())
            trajectory['zmp_trajectory'].extend(zmp_traj.tolist())

            total_time += self.step_parameters['step_duration']

        return trajectory

    def generate_foot_trajectory(self, start_pos, end_pos, step_height, duration):
        """
        Generate smooth foot trajectory with appropriate lift and landing
        """
        # Time vector
        t = np.linspace(0, duration, int(duration * 200))  # 200 Hz sampling

        # Horizontal movement (cubic polynomial for smooth motion)
        x_start, y_start, z_start = start_pos
        x_end, y_end, z_end = end_pos

        # Horizontal trajectory (cubic for smooth acceleration/deceleration)
        x_coeffs = np.polyfit([0, duration/2, duration], [x_start, (x_start+x_end)/2, x_end], 2)
        y_coeffs = np.polyfit([0, duration/2, duration], [y_start, (y_start+y_end)/2, y_end], 2)

        x_traj = np.polyval(x_coeffs, t)
        y_traj = np.polyval(y_coeffs, t)

        # Vertical trajectory (parabolic for natural foot lift)
        z_traj = np.full_like(t, z_start)  # Default to ground level

        # Calculate lift phase (first half of swing)
        lift_duration = duration * 0.7  # 70% of swing for lift/land
        for i, time_step in enumerate(t):
            if time_step <= lift_duration / 2:
                # Ascending phase
                z_traj[i] = z_start + step_height * (2 * time_step / lift_duration)**2
            elif time_step <= lift_duration:
                # Descending phase
                z_traj[i] = z_start + step_height - step_height * (2 * (time_step - lift_duration/2) / lift_duration)**2
            # For remaining time, foot stays on ground at z_start

        return np.column_stack([x_traj, y_traj, z_traj])

    def calculate_balanced_com_trajectory(self, left_foot_traj, right_foot_traj, walking_speed):
        """
        Calculate CoM trajectory that maintains balance during walking
        """
        com_trajectory = []

        for i in range(len(left_foot_traj)):
            # Calculate support polygon center
            support_center_x = (left_foot_traj[i][0] + right_foot_traj[i][0]) / 2
            support_center_y = (left_foot_traj[i][1] + right_foot_traj[i][1]) / 2

            # CoM should track support center with small offset for dynamic balance
            com_x = support_center_x + walking_speed * 0.1  # Small forward offset
            com_y = support_center_y  # Track lateral support
            com_z = 0.85  # Maintain nominal CoM height

            com_trajectory.append([com_x, com_y, com_z])

        return np.array(com_trajectory)

    def calculate_zmp_trajectory(self, com_trajectory):
        """
        Calculate ZMP trajectory from CoM trajectory
        """
        zmp_trajectory = []

        # Calculate velocities and accelerations using finite differences
        dt = 0.005  # 200 Hz control rate

        for i in range(len(com_trajectory)):
            if i == 0:
                # Forward difference for first point
                if len(com_trajectory) > 1:
                    vel = (com_trajectory[i+1] - com_trajectory[i]) / dt
                    if len(com_trajectory) > 2:
                        acc = (com_trajectory[i+2] - 2*com_trajectory[i+1] + com_trajectory[i]) / dt**2
                    else:
                        acc = np.zeros(3)
                else:
                    vel = np.zeros(3)
                    acc = np.zeros(3)
            elif i == len(com_trajectory) - 1:
                # Backward difference for last point
                vel = (com_trajectory[i] - com_trajectory[i-1]) / dt
                acc = (com_trajectory[i] - 2*com_trajectory[i-1] + com_trajectory[i-2]) / dt**2
            else:
                # Central difference for middle points (more accurate)
                vel = (com_trajectory[i+1] - com_trajectory[i-1]) / (2*dt)
                acc = (com_trajectory[i+1] - 2*com_trajectory[i] + com_trajectory[i-1]) / dt**2

            # Calculate ZMP
            com_pos = com_trajectory[i]
            zmp_x = com_pos[0] - (com_pos[2] * acc[0]) / 9.81
            zmp_y = com_pos[1] - (com_pos[2] * acc[1]) / 9.81

            zmp_trajectory.append([zmp_x, zmp_y])

        return np.array(zmp_trajectory)

class FootstepPlanner:
    def __init__(self):
        self.min_step_length = 0.1
        self.max_step_length = 0.5
        self.min_step_width = 0.1
        self.max_step_width = 0.3
        self.max_step_rotation = 0.2  # radians

    def plan_footsteps(self, start_pose, goal_pose, terrain_map=None):
        """
        Plan sequence of footsteps from start to goal
        start_pose: [x, y, theta]
        goal_pose: [x, y, theta]
        """
        footsteps = []

        # Calculate required displacement
        dx = goal_pose[0] - start_pose[0]
        dy = goal_pose[1] - start_pose[1]
        dtheta = goal_pose[2] - start_pose[2]

        # Calculate distance and direction
        total_distance = math.sqrt(dx**2 + dy**2)
        direction_angle = math.atan2(dy, dx)

        # Calculate number of steps needed
        num_steps = int(total_distance / self.max_step_length) + 1

        # Generate footsteps
        current_pose = start_pose.copy()

        for step in range(num_steps):
            # Calculate step size based on remaining distance
            remaining_distance = math.sqrt(
                (goal_pose[0] - current_pose[0])**2 +
                (goal_pose[1] - current_pose[1])**2
            )

            if remaining_distance < self.min_step_length:
                # Final adjustment step
                step_size = remaining_distance
            else:
                step_size = min(self.max_step_length, remaining_distance)

            # Calculate next foot position
            next_x = current_pose[0] + step_size * math.cos(direction_angle)
            next_y = current_pose[1] + step_size * math.sin(direction_angle)
            next_theta = current_pose[2] + (dtheta / num_steps)  # Distribute rotation

            # Determine which foot to step with (alternating)
            is_left_step = step % 2 == 0

            # Add footstep to plan
            footstep = {
                'step_number': step,
                'position': [next_x, next_y, 0.0],  # z=0 for ground contact
                'orientation': next_theta,
                'foot': 'left' if is_left_step else 'right',
                'timing': step * 1.0  # 1 second per step
            }

            footsteps.append(footstep)

            # Update current pose
            current_pose = [next_x, next_y, next_theta]

        return footsteps

    def validate_footstep(self, footstep, terrain_map):
        """
        Validate if footstep is feasible on given terrain
        """
        if terrain_map is None:
            return True  # No terrain map, assume valid

        # Check if footstep location is on stable ground
        x, y, z = footstep['position']

        # This would check terrain map for obstacles, slopes, etc.
        # For now, return True
        return True

    def optimize_footsteps(self, footsteps):
        """
        Optimize footsteps for stability and efficiency
        """
        # Apply optimizations such as:
        # - Adjust step width for better stability
        # - Modify step length for smoother motion
        # - Adjust timing for natural gait

        optimized_steps = []

        for i, step in enumerate(footsteps):
            optimized_step = step.copy()

            # Adjust step width for stability (wider for turns)
            if i > 0:
                prev_step = footsteps[i-1]
                heading_change = abs(step['orientation'] - prev_step['orientation'])
                if heading_change > 0.1:  # Significant turn
                    # Increase step width for better stability during turns
                    optimized_step['step_width'] = min(
                        self.max_step_width,
                        self.min_step_width + 0.1
                    )
                else:
                    optimized_step['step_width'] = self.min_step_width + 0.05

            optimized_steps.append(optimized_step)

        return optimized_steps
```

## Advanced Locomotion Control

### Model-Predictive Control for Walking

Model Predictive Control (MPC) provides advanced control for humanoid walking:

```python
class ModelPredictiveController:
    def __init__(self, prediction_horizon=10, control_horizon=5):
        self.prediction_horizon = prediction_horizon  # N steps ahead
        self.control_horizon = control_horizon        # M control moves
        self.dt = 0.1  # Time step (100ms)

        # Walking model parameters
        self.omega = math.sqrt(9.81 / 0.85)  # sqrt(g/h) for CoM height

        # Cost function weights
        self.Q = np.eye(2) * 10  # State cost (ZMP tracking)
        self.R = np.eye(2) * 1   # Control cost (foot placement)
        self.P = np.eye(2) * 50  # Terminal cost

    def solve_mpc(self, current_state, reference_trajectory):
        """
        Solve MPC optimization problem
        current_state: [x_zmp, y_zmp, x_com, y_com, x_com_dot, y_com_dot]
        reference_trajectory: desired ZMP trajectory
        """
        import cvxpy as cp

        # Prediction horizon variables
        N = self.prediction_horizon
        X = cp.Variable((6, N+1))  # State trajectory [zmp_x, zmp_y, com_x, com_y, com_x_dot, com_y_dot]
        U = cp.Variable((2, N))    # Control inputs [foot_x, foot_y]

        # Cost function
        cost = 0

        # Running cost
        for k in range(N):
            # State deviation cost
            if k < len(reference_trajectory):
                ref = reference_trajectory[k]
                cost += cp.quad_form(X[:2, k] - ref, self.Q)
            else:
                cost += cp.quad_form(X[:2, k], self.Q)  # Zero reference for remaining steps

            # Control effort cost
            cost += cp.quad_form(U[:, k], self.R)

        # Terminal cost
        if len(reference_trajectory) > N:
            final_ref = reference_trajectory[N]
            cost += cp.quad_form(X[:2, N] - final_ref, self.P)
        else:
            cost += cp.quad_form(X[:2, N], self.P)  # Zero terminal state

        # Dynamics constraints (simplified inverted pendulum model)
        constraints = []

        # Initial state
        constraints.append(X[:, 0] == current_state)

        # System dynamics
        A = self.get_system_matrix()
        B = self.get_input_matrix()

        for k in range(N):
            # x[k+1] = A*x[k] + B*u[k]
            constraints.append(X[:, k+1] == A @ X[:, k] + B @ U[:, k])

        # Solve optimization problem
        problem = cp.Problem(cp.Minimize(cost), constraints)

        try:
            problem.solve(solver=cp.OSQP, verbose=False)

            if problem.status == cp.OPTIMAL:
                # Return first control action
                return U[:, 0].value
            else:
                # Return zero control if optimization failed
                return np.zeros(2)
        except:
            # Return zero control if solver failed
            return np.zeros(2)

    def get_system_matrix(self):
        """
        Get state transition matrix A for inverted pendulum model
        State: [zmp_x, zmp_y, com_x, com_y, com_x_dot, com_y_dot]
        """
        dt = self.dt
        omega = self.omega

        # Simplified model: ZMP = CoM - (CoM_height / g) * CoM_acceleration
        # For MPC, we linearize around nominal walking
        A = np.zeros((6, 6))

        # ZMP dynamics (ZMP tracks CoM with delay)
        A[0, 2] = 1.0  # zmp_x = com_x (simplified)
        A[1, 3] = 1.0  # zmp_y = com_y (simplified)

        # CoM position integration
        A[2, 2] = 1.0
        A[2, 4] = dt
        A[3, 3] = 1.0
        A[3, 5] = dt

        # CoM velocity update (with gravity effect)
        A[4, 2] = omega**2 * dt  # Acceleration due to gravity
        A[4, 4] = 1.0
        A[5, 3] = omega**2 * dt
        A[5, 5] = 1.0

        return A

    def get_input_matrix(self):
        """
        Get input matrix B for foot placement control
        """
        dt = self.dt

        # Effect of foot placement on CoM (simplified)
        B = np.zeros((6, 2))

        # Foot placement affects ZMP directly
        B[0, 0] = 1.0  # x foot placement -> x ZMP
        B[1, 1] = 1.0  # y foot placement -> y ZMP

        # Foot placement affects CoM through balance
        B[2, 0] = 0.1  # x foot -> x CoM
        B[3, 1] = 0.1  # y foot -> y CoM

        return B

    def update_reference_trajectory(self, desired_velocity, current_com):
        """
        Update reference ZMP trajectory based on desired velocity
        """
        ref_trajectory = []

        # Generate reference ZMP that supports desired motion
        for k in range(self.prediction_horizon):
            t = k * self.dt

            # Reference ZMP that would achieve desired velocity
            ref_x = current_com[2] + desired_velocity[0] * t * 0.1  # Lead factor
            ref_y = current_com[3] + desired_velocity[1] * t * 0.1

            ref_trajectory.append(np.array([ref_x, ref_y]))

        return ref_trajectory

class AdaptiveLocomotionController:
    def __init__(self):
        self.step_adaptation = StepAdaptationSystem()
        self.terrain_classifier = TerrainClassificationSystem()
        self.disturbance_observer = DisturbanceObserver()
        self.learning_adaptor = LearningBasedAdaptor()

    def adapt_locomotion(self, current_state, terrain_sensors, imu_data):
        """
        Adapt locomotion parameters based on current conditions
        """
        adaptation_result = {}

        # Classify terrain
        terrain_type = self.terrain_classifier.classify_terrain(terrain_sensors)
        adaptation_result['terrain_type'] = terrain_type

        # Observe disturbances
        disturbances = self.disturbance_observer.observe(imu_data)
        adaptation_result['disturbances'] = disturbances

        # Adapt step parameters based on terrain and disturbances
        adapted_params = self.step_adaptation.adapt_to_conditions(
            terrain_type, disturbances, current_state
        )
        adaptation_result['adapted_parameters'] = adapted_params

        # Learn from experience
        self.learning_adaptor.update_model(current_state, adapted_params)

        return adaptation_result

class StepAdaptationSystem:
    def __init__(self):
        self.base_parameters = {
            'step_length': 0.3,
            'step_width': 0.2,
            'step_height': 0.05,
            'step_timing': 1.0
        }

        self.adaptation_rules = {
            'uneven_terrain': {
                'step_length': 0.8,
                'step_height': 1.5,
                'step_timing': 1.2
            },
            'slippery_surface': {
                'step_length': 0.6,
                'step_width': 1.2,
                'step_timing': 1.5
            },
            'narrow_path': {
                'step_width': 0.7,
                'step_length': 0.9
            }
        }

    def adapt_to_conditions(self, terrain_type, disturbances, current_state):
        """
        Adapt step parameters based on terrain and disturbances
        """
        adapted_params = self.base_parameters.copy()

        # Apply terrain-based adaptations
        if terrain_type in self.adaptation_rules:
            rules = self.adaptation_rules[terrain_type]
            for param, multiplier in rules.items():
                if param in adapted_params:
                    adapted_params[param] *= multiplier

        # Apply disturbance-based adaptations
        if disturbances['magnitude'] > 0.5:  # Significant disturbance
            adapted_params['step_width'] *= 1.2  # Wider stance for stability
            adapted_params['step_length'] *= 0.8  # Shorter steps for control
            adapted_params['step_timing'] *= 1.1  # Slower steps for stability

        # Apply safety limits
        adapted_params['step_length'] = np.clip(
            adapted_params['step_length'], 0.1, 0.5
        )
        adapted_params['step_width'] = np.clip(
            adapted_params['step_width'], 0.15, 0.3
        )
        adapted_params['step_height'] = np.clip(
            adapted_params['step_height'], 0.02, 0.1
        )
        adapted_params['step_timing'] = np.clip(
            adapted_params['step_timing'], 0.7, 2.0
        )

        return adapted_params

class TerrainClassificationSystem:
    def __init__(self):
        self.terrain_features = {
            'flat': {'roughness': 0.01, 'slope': 0.0, 'friction': 0.8},
            'uneven': {'roughness': 0.1, 'slope': 0.1, 'friction': 0.7},
            'slippery': {'roughness': 0.02, 'slope': 0.0, 'friction': 0.2},
            'soft': {'roughness': 0.05, 'slope': 0.0, 'friction': 0.5}
        }

    def classify_terrain(self, sensor_data):
        """
        Classify terrain type based on sensor data
        """
        # Extract features from sensor data
        roughness = self.calculate_roughness(sensor_data)
        slope = self.calculate_slope(sensor_data)
        friction = self.estimate_friction(sensor_data)

        # Compare with known terrain types
        best_match = 'flat'
        min_distance = float('inf')

        for terrain_type, features in self.terrain_features.items():
            distance = (
                (roughness - features['roughness'])**2 +
                (slope - features['slope'])**2 +
                (friction - features['friction'])**2
            )

            if distance < min_distance:
                min_distance = distance
                best_match = terrain_type

        return best_match

    def calculate_roughness(self, sensor_data):
        """Calculate terrain roughness from sensor data"""
        # This would process force/torque sensors, vision, etc.
        return 0.05  # Placeholder

    def calculate_slope(self, sensor_data):
        """Calculate terrain slope from sensor data"""
        # This would use IMU, vision, or other sensors
        return 0.02  # Placeholder

    def estimate_friction(self, sensor_data):
        """Estimate surface friction from sensor data"""
        # This would analyze slip detection, force measurements, etc.
        return 0.7  # Placeholder

class DisturbanceObserver:
    def __init__(self):
        self.disturbance_history = []
        self.filter_coefficients = [0.1, 0.2, 0.4, 0.2, 0.1]  # Moving average

    def observe(self, imu_data):
        """
        Observe external disturbances from IMU data
        """
        # Extract acceleration data
        linear_acc = np.array([
            imu_data.linear_acceleration.x,
            imu_data.linear_acceleration.y,
            imu_data.linear_acceleration.z
        ])

        angular_vel = np.array([
            imu_data.angular_velocity.x,
            imu_data.angular_velocity.y,
            imu_data.angular_velocity.z
        ])

        # Calculate disturbance magnitude
        linear_disturbance = np.linalg.norm(linear_acc) - 9.81  # Remove gravity
        angular_disturbance = np.linalg.norm(angular_vel)

        total_disturbance = linear_disturbance + angular_disturbance

        # Apply filtering
        self.disturbance_history.append(total_disturbance)
        if len(self.disturbance_history) > 5:
            self.disturbance_history.pop(0)

        # Calculate filtered disturbance
        filtered_disturbance = 0
        for i, coeff in enumerate(self.filter_coefficients):
            if i < len(self.disturbance_history):
                filtered_disturbance += coeff * self.disturbance_history[-(i+1)]

        return {
            'magnitude': filtered_disturbance,
            'linear': linear_disturbance,
            'angular': angular_disturbance,
            'timestamp': time.time()
        }
```

## Real-time Locomotion Control

### Implementation Considerations

Real-time implementation of locomotion control requires careful optimization:

```python
import threading
import queue
from collections import deque

class RealTimeLocomotionController:
    def __init__(self):
        self.control_frequency = 1000  # Hz
        self.estimation_frequency = 500  # Hz
        self.trajectory_frequency = 100  # Hz

        # Real-time data structures
        self.sensor_queue = queue.Queue(maxsize=10)
        self.command_queue = queue.Queue(maxsize=10)
        self.state_estimate = {
            'com': np.zeros(3),
            'com_dot': np.zeros(3),
            'zmp': np.zeros(2),
            'orientation': np.array([0, 0, 0, 1]),
            'angular_velocity': np.zeros(3)
        }

        # Control threads
        self.estimation_thread = None
        self.control_thread = None
        self.trajectory_thread = None

        # Real-time flags
        self.running = False
        self.control_enabled = False

    def start_real_time_control(self):
        """Start real-time locomotion control threads"""
        self.running = True

        # Start estimation thread
        self.estimation_thread = threading.Thread(
            target=self.estimation_loop,
            daemon=True
        )
        self.estimation_thread.start()

        # Start control thread
        self.control_thread = threading.Thread(
            target=self.control_loop,
            daemon=True
        )
        self.control_thread.start()

        # Start trajectory thread
        self.trajectory_thread = threading.Thread(
            target=self.trajectory_loop,
            daemon=True
        )
        self.trajectory_thread.start()

    def estimation_loop(self):
        """State estimation loop running at high frequency"""
        while self.running:
            start_time = time.time()

            # Get latest sensor data
            if not self.sensor_queue.empty():
                try:
                    sensor_data = self.sensor_queue.get_nowait()
                    self.update_state_estimate(sensor_data)
                except queue.Empty:
                    pass

            # Calculate ZMP and other derived quantities
            self.calculate_derived_state()

            # Maintain frequency
            elapsed = time.time() - start_time
            sleep_time = max(0, (1.0 / self.estimation_frequency) - elapsed)
            time.sleep(sleep_time)

    def control_loop(self):
        """Main control loop running at highest frequency"""
        while self.running:
            start_time = time.time()

            if self.control_enabled:
                # Calculate control commands
                control_cmd = self.calculate_balance_control()

                # Send to actuators
                self.send_control_commands(control_cmd)

            # Maintain frequency
            elapsed = time.time() - start_time
            sleep_time = max(0, (1.0 / self.control_frequency) - elapsed)
            time.sleep(sleep_time)

    def trajectory_loop(self):
        """Trajectory generation loop running at lower frequency"""
        while self.running:
            start_time = time.time()

            if self.control_enabled:
                # Update walking pattern if needed
                self.update_walking_pattern()

            # Maintain frequency
            elapsed = time.time() - start_time
            sleep_time = max(0, (1.0 / self.trajectory_frequency) - elapsed)
            time.sleep(sleep_time)

    def update_state_estimate(self, sensor_data):
        """Update state estimate from sensor data"""
        # This would implement sensor fusion (IMU, encoders, F/T sensors)
        # For now, update from simulated sensor data

        # Update COM position (simplified)
        self.state_estimate['com'] = sensor_data.get('com_position', self.state_estimate['com'])
        self.state_estimate['com_dot'] = sensor_data.get('com_velocity', self.state_estimate['com_dot'])

        # Update orientation
        self.state_estimate['orientation'] = sensor_data.get('orientation', self.state_estimate['orientation'])

        # Update angular velocity
        self.state_estimate['angular_velocity'] = sensor_data.get('angular_velocity', self.state_estimate['angular_velocity'])

    def calculate_derived_state(self):
        """Calculate derived state quantities like ZMP"""
        # Calculate ZMP from current state
        com_pos = self.state_estimate['com']
        com_vel = self.state_estimate['com_dot']

        # Simplified ZMP calculation
        zmp_x = com_pos[0] - (com_pos[2] * com_vel[0]) / 9.81
        zmp_y = com_pos[1] - (com_pos[2] * com_vel[1]) / 9.81

        self.state_estimate['zmp'] = np.array([zmp_x, zmp_y])

    def calculate_balance_control(self):
        """Calculate balance control commands"""
        # Use current state estimate for control
        current_state = self.state_estimate.copy()

        # Calculate balance correction
        balance_controller = BalanceController()
        balance_command = balance_controller.update_balance_control(current_state)

        return balance_command

    def send_control_commands(self, control_cmd):
        """Send control commands to actuators"""
        # This would interface with the robot's joint controllers
        # For simulation, just store commands
        if not self.command_queue.full():
            self.command_queue.put(control_cmd)

    def update_walking_pattern(self):
        """Update walking pattern based on current state"""
        # This would adjust the walking pattern based on speed, direction, etc.
        pass

    def emergency_stop(self):
        """Emergency stop for safety"""
        self.control_enabled = False

        # Send zero commands to all joints
        zero_cmd = {'joint_commands': {}}
        self.command_queue.put(zero_cmd)

class LocomotionSafetySystem:
    def __init__(self):
        self.safety_limits = {
            'roll': math.radians(20),    # 20 degrees
            'pitch': math.radians(20),   # 20 degrees
            'zmp_margin': 0.05,          # 5cm safety margin
            'joint_limits': {},          # Joint-specific limits
            'velocity_limits': 2.0       # 2 m/s max velocity
        }

        self.safety_states = {
            'normal': 0,
            'caution': 1,
            'warning': 2,
            'emergency': 3
        }

        self.current_safety_state = 'normal'

    def check_safety_conditions(self, robot_state):
        """Check all safety conditions"""
        safety_violations = []

        # Check orientation limits
        orientation = robot_state.get('orientation', [0, 0, 0, 1])
        euler = self.quaternion_to_euler(orientation)

        if abs(euler[0]) > self.safety_limits['roll']:
            safety_violations.append('roll_limit_exceeded')

        if abs(euler[1]) > self.safety_limits['pitch']:
            safety_violations.append('pitch_limit_exceeded')

        # Check ZMP stability
        zmp = robot_state.get('zmp', [0, 0])
        support_polygon = robot_state.get('support_polygon', {})

        if support_polygon:
            if not self.is_zmp_stable(zmp, support_polygon):
                safety_violations.append('zmp_outside_support')

        # Check velocity limits
        velocity = robot_state.get('velocity', [0, 0, 0])
        speed = np.linalg.norm(velocity)

        if speed > self.safety_limits['velocity_limits']:
            safety_violations.append('velocity_limit_exceeded')

        return safety_violations

    def is_zmp_stable(self, zmp, support_polygon):
        """Check if ZMP is within stable region"""
        # This would check if ZMP is within support polygon with safety margin
        return True  # Placeholder

    def handle_safety_violation(self, violations):
        """Handle safety violations appropriately"""
        if not violations:
            self.current_safety_state = 'normal'
            return {'action': 'continue', 'state': 'normal'}

        # Determine safety state based on violation severity
        if any('limit_exceeded' in v for v in violations):
            self.current_safety_state = 'warning'
            return {'action': 'slow_down', 'state': 'warning'}

        if any('outside_support' in v for v in violations):
            self.current_safety_state = 'caution'
            return {'action': 'adjust_balance', 'state': 'caution'}

        # For severe violations, consider emergency stop
        if self.current_safety_state == 'emergency':
            return {'action': 'emergency_stop', 'state': 'emergency'}

        return {'action': 'caution', 'state': self.current_safety_state}

    def quaternion_to_euler(self, quat):
        """Convert quaternion to euler angles"""
        x, y, z, w = quat

        # Convert to rotation matrix first
        r11 = 1 - 2*(y**2 + z**2)
        r12 = 2*(x*y - w*z)
        r21 = 2*(x*y + w*z)
        r22 = 1 - 2*(x**2 + z**2)
        r31 = 2*(x*z - w*y)
        r32 = 2*(y*z + w*x)
        r33 = 1 - 2*(x**2 + y**2)

        # Calculate euler angles
        pitch = math.asin(-r31)
        roll = math.atan2(r32, r33)
        yaw = math.atan2(r21, r11)

        return np.array([roll, pitch, yaw])
```

## Locomotion Control Integration

### ROS 2 Integration for Humanoid Locomotion

Integrating locomotion control with ROS 2 for humanoid robots:

```python
class HumanoidLocomotionNode(Node):
    def __init__(self):
        super().__init__('humanoid_locomotion')

        # Initialize locomotion components
        self.balance_controller = BalanceController()
        self.pattern_generator = WalkingPatternGenerator()
        self.trajectory_planner = FootstepPlanner()
        self.safety_system = LocomotionSafetySystem()

        # ROS 2 interfaces
        self.joint_state_sub = self.create_subscription(
            JointState, 'joint_states', self.joint_state_callback, 10)
        self.imu_sub = self.create_subscription(
            Imu, 'imu/data', self.imu_callback, 10)
        self.foot_pressure_sub = self.create_subscription(
            # Custom foot pressure message
            String, 'foot_pressure', self.foot_pressure_callback, 10)

        # Command publishers
        self.joint_cmd_pub = self.create_publisher(JointState, 'joint_commands', 10)
        self.com_pub = self.create_publisher(Vector3, 'com_position', 10)
        self.zmp_pub = self.create_publisher(Vector3, 'zmp_position', 10)

        # Service servers
        self.walk_srv = self.create_service(
            Trigger, 'start_walking', self.start_walking_callback)
        self.stop_srv = self.create_service(
            Trigger, 'stop_walking', self.stop_walking_callback)
        self.step_srv = self.create_service(
            SetBool, 'step_assist', self.step_assist_callback)

        # Control timer
        self.control_timer = self.create_timer(0.01, self.locomotion_control_loop)  # 100 Hz

        # Internal state
        self.current_joint_states = JointState()
        self.current_imu_data = Imu()
        self.is_walking = False
        self.walk_target = None
        self.foot_contact = {'left': False, 'right': False}

    def joint_state_callback(self, msg):
        """Handle joint state updates"""
        self.current_joint_states = msg
        self.update_robot_state()

    def imu_callback(self, msg):
        """Handle IMU updates"""
        self.current_imu_data = msg
        self.update_balance_estimate()

    def foot_pressure_callback(self, msg):
        """Handle foot pressure sensor updates"""
        # Parse foot pressure data
        pressure_data = eval(msg.data)  # In practice, use proper parsing
        self.foot_contact['left'] = pressure_data.get('left', 0) > 10.0  # Threshold
        self.foot_contact['right'] = pressure_data.get('right', 0) > 10.0

    def locomotion_control_loop(self):
        """Main locomotion control loop"""
        if not self.is_walking:
            return

        # Update state estimates
        self.update_state_estimates()

        # Check safety conditions
        safety_violations = self.safety_system.check_safety_conditions(self.get_robot_state())
        safety_action = self.safety_system.handle_safety_violation(safety_violations)

        if safety_action['action'] == 'emergency_stop':
            self.emergency_stop()
            return

        # Calculate locomotion commands
        if safety_action['state'] == 'normal':
            commands = self.calculate_locomotion_commands()
        else:
            commands = self.calculate_safe_commands(safety_action)

        # Publish commands
        self.publish_joint_commands(commands)

        # Publish state for monitoring
        self.publish_state_feedback()

    def calculate_locomotion_commands(self):
        """Calculate normal locomotion commands"""
        # Get current state
        current_state = self.get_robot_state()

        # Update balance control
        balance_command = self.balance_controller.update_balance_control(current_state)

        # Generate walking pattern if needed
        if self.walk_target:
            footsteps = self.trajectory_planner.plan_footsteps(
                self.get_current_pose(), self.walk_target
            )
            walk_pattern = self.pattern_generator.generate_walk_trajectory(
                len(footsteps)
            )

        # Combine balance and walking commands
        final_commands = self.combine_commands(balance_command, self.walk_target)

        return final_commands

    def calculate_safe_commands(self, safety_action):
        """Calculate safe commands during safety conditions"""
        if safety_action['action'] == 'slow_down':
            # Reduce walking speed
            pass
        elif safety_action['action'] == 'adjust_balance':
            # Focus on balance recovery
            current_state = self.get_robot_state()
            return self.balance_controller.update_balance_control(current_state)
        elif safety_action['action'] == 'emergency_stop':
            return self.emergency_stop_commands()

        return self.balance_controller.update_balance_control(self.get_robot_state())

    def combine_commands(self, balance_cmd, walk_target):
        """Combine balance and walking commands"""
        # This would intelligently combine balance and walking commands
        # In practice, this involves complex optimization
        return balance_cmd['joint_commands']

    def get_robot_state(self):
        """Get current robot state for control"""
        return {
            'com_position': self.estimate_com_position(),
            'com_velocity': self.estimate_com_velocity(),
            'orientation': [self.current_imu_data.orientation.x,
                           self.current_imu_data.orientation.y,
                           self.current_imu_data.orientation.z,
                           self.current_imu_data.orientation.w],
            'angular_velocity': [self.current_imu_data.angular_velocity.x,
                                self.current_imu_data.angular_velocity.y,
                                self.current_imu_data.angular_velocity.z],
            'zmp': self.calculate_zmp(),
            'foot_contact': self.foot_contact
        }

    def estimate_com_position(self):
        """Estimate Center of Mass position"""
        # This would use forward kinematics and link masses
        # For now, return estimated position
        return [0.0, 0.0, 0.85]  # Nominal CoM height

    def calculate_zmp(self):
        """Calculate Zero Moment Point"""
        # Simplified calculation
        return [0.0, 0.0]

    def publish_joint_commands(self, commands):
        """Publish joint commands to robot"""
        joint_cmd = JointState()
        joint_cmd.header.stamp = self.get_clock().now().to_msg()
        joint_cmd.name = list(commands.keys())
        joint_cmd.position = list(commands.values())

        self.joint_cmd_pub.publish(joint_cmd)

    def publish_state_feedback(self):
        """Publish state feedback for monitoring"""
        # Publish CoM position
        com_msg = Vector3()
        com_pos = self.estimate_com_position()
        com_msg.x, com_msg.y, com_msg.z = com_pos
        self.com_pub.publish(com_msg)

    def start_walking_callback(self, request, response):
        """Service callback to start walking"""
        self.is_walking = True
        response.success = True
        response.message = "Walking started"
        return response

    def stop_walking_callback(self, request, response):
        """Service callback to stop walking"""
        self.is_walking = False
        response.success = True
        response.message = "Walking stopped"
        return response

    def step_assist_callback(self, request, response):
        """Service callback for step assistance"""
        if request.data:
            # Provide step assistance
            self.provide_step_assistance()
            response.success = True
            response.message = "Step assistance enabled"
        else:
            response.success = True
            response.message = "Step assistance disabled"

        return response

    def provide_step_assistance(self):
        """Provide step assistance for balance recovery"""
        # This would implement step adjustment algorithms
        pass

    def emergency_stop(self):
        """Emergency stop procedure"""
        self.is_walking = False

        # Send zero commands
        zero_cmd = JointState()
        zero_cmd.header.stamp = self.get_clock().now().to_msg()
        zero_cmd.name = self.current_joint_states.name
        zero_cmd.position = [0.0] * len(self.current_joint_states.name)

        self.joint_cmd_pub.publish(zero_cmd)

def main(args=None):
    rclpy.init(args=args)

    locomotion_node = HumanoidLocomotionNode()

    try:
        rclpy.spin(locomotion_node)
    except KeyboardInterrupt:
        pass
    finally:
        locomotion_node.emergency_stop()
        locomotion_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Summary

Humanoid locomotion control represents a complex integration of balance control, trajectory planning, and real-time feedback systems. The key to successful implementation lies in understanding the fundamental principles of bipedal walking, including Zero Moment Point (ZMP) control, Center of Mass (CoM) management, and the dynamic balance required for stable locomotion.

Modern approaches to humanoid locomotion control incorporate advanced techniques such as Model Predictive Control (MPC), adaptive control systems, and machine learning to handle the challenges of real-world environments. The control system must be capable of real-time operation, safety management, and adaptation to varying terrains and disturbances.

The success of humanoid locomotion depends on the seamless integration of perception, planning, and control systems, with each component contributing to the overall stability and mobility of the robot. As humanoid robotics continues to advance, locomotion control systems will become increasingly sophisticated, enabling robots to navigate complex environments with human-like capabilities.

## Key Takeaways

- Bipedal locomotion requires sophisticated balance control and coordination
- ZMP and CoM control are fundamental to stable walking
- Walking pattern generation must account for dynamic balance
- Real-time control systems require high-frequency operation
- Safety systems are critical for humanoid locomotion
- Adaptive control handles varying terrains and disturbances
- MPC provides advanced control for complex walking patterns
- ROS 2 integration enables modular locomotion control
- Sensor fusion provides accurate state estimation
- Emergency stop procedures ensure safety