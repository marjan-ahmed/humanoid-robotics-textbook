---
sidebar_position: 12
title: "Submodule 5: Middleware Control"
---

# Submodule 5: Middleware Control

## Introduction to Middleware Control in ROS 2

Middleware control in ROS 2 refers to the mechanisms and techniques used to manage, coordinate, and control the distributed components of a robotic system. For humanoid robots, which typically consist of dozens of sensors, actuators, and computational nodes, effective middleware control is essential for achieving coordinated behavior and maintaining system stability.

Middleware control encompasses both the architectural patterns used to organize system components and the specific techniques for managing their interactions, ensuring real-time performance, and handling failures gracefully.

## Middleware Control Architecture

### Hierarchical Control Structure

Humanoid robots typically implement a hierarchical control structure that manages complexity:

```
┌─────────────────────────────────────────────────────────────┐
│                    Task Level                               │
│              (High-level behaviors)                         │
├─────────────────────────────────────────────────────────────┤
│                    Motion Level                             │
│              (Trajectory planning, gait)                    │
├─────────────────────────────────────────────────────────────┤
│                    Joint Level                              │
│              (Individual joint control)                     │
├─────────────────────────────────────────────────────────────┤
│                    Hardware Level                           │
│              (Motor drivers, sensors)                       │
└─────────────────────────────────────────────────────────────┘
```

### Control Node Organization

Middleware control nodes are organized to handle different aspects of robot operation:

**Centralized Control Nodes**
- Single point of coordination for the entire system
- Coordinate between different subsystems
- Handle high-level decision making
- Examples: main controller, behavior manager

**Distributed Control Nodes**
- Specialized control for specific subsystems
- Reduce communication overhead
- Improve system robustness
- Examples: arm controller, leg controller, balance controller

**Hybrid Control Approach**
- Combination of centralized and distributed control
- Balance coordination with performance
- Allow for system evolution and modification

## Real-Time Control Considerations

### Real-Time Requirements for Humanoid Robots

Humanoid robots have strict real-time requirements due to their dynamic nature:

**High-Frequency Control Loops**
- Joint position control: 1000 Hz
- Balance control: 100-200 Hz
- Sensor processing: 50-100 Hz
- Motion planning: 10-50 Hz

**Latency Constraints**
- Safety-critical responses: `<1ms`
- Balance corrections: `<10ms`
- Planned motion execution: `<100ms`

### Real-Time Middleware Configuration

```python
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, DurabilityPolicy, ReliabilityPolicy
from std_msgs.msg import Float64MultiArray
from control_msgs.msg import JointTrajectoryControllerState

class RealTimeController(Node):
    def __init__(self):
        super().__init__('real_time_controller')

        # Configure QoS for real-time performance
        rt_qos = QoSProfile(
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.VOLATILE,
            history=rclpy.qos.HistoryPolicy.KEEP_LAST,
            depth=1
        )

        # Publishers for joint commands
        self.joint_cmd_pub = self.create_publisher(
            Float64MultiArray, '/joint_group_position_controller/commands', rt_qos
        )

        # Subscribers for sensor feedback
        self.joint_state_sub = self.create_subscription(
            JointTrajectoryControllerState, '/joint_states',
            self.joint_state_callback, rt_qos
        )

        # Create high-frequency timer (1000 Hz for joint control)
        self.control_timer = self.create_timer(
            0.001,  # 1ms period = 1000 Hz
            self.high_freq_control_loop,
            clock=self.get_clock()
        )

        # Initialize control parameters
        self.current_positions = []
        self.desired_positions = []
        self.control_gains = {'p': 100.0, 'i': 0.1, 'd': 10.0}

    def high_freq_control_loop(self):
        """High-frequency control loop for joint control."""
        try:
            # Calculate control commands based on error
            errors = [
                desired - current
                for desired, current in zip(self.desired_positions, self.current_positions)
            ]

            # Apply PID control
            control_commands = [
                self.control_gains['p'] * err +
                self.control_gains['i'] * self.integral_error[i] +
                self.control_gains['d'] * self.derivative_error[i]
                for i, err in enumerate(errors)
            ]

            # Publish commands
            cmd_msg = Float64MultiArray()
            cmd_msg.data = control_commands
            self.joint_cmd_pub.publish(cmd_msg)

        except Exception as e:
            self.get_logger().error(f'Control loop error: {e}')

    def joint_state_callback(self, msg):
        """Update current joint positions."""
        self.current_positions = list(msg.actual.positions)
```

### Quality of Service (QoS) for Control

Different control aspects require different QoS profiles:

**Safety-Critical Control**
```python
safety_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.VOLATILE,
    history=HistoryPolicy.KEEP_LAST,
    depth=1,
    deadline=rclpy.duration.Duration(seconds=0.01)  # 10ms deadline
)
```

**Sensor Data**
```python
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    durability=DurabilityPolicy.VOLATILE,
    history=HistoryPolicy.KEEP_LAST,
    depth=10
)
```

**Configuration Data**
```python
config_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    history=HistoryPolicy.KEEP_LAST,
    depth=1
)
```

## Control Patterns and Design Patterns

### Publisher-Subscriber Control Pattern

The most common pattern for real-time control:

```python
class JointController(Node):
    def __init__(self):
        super().__init__('joint_controller')

        # Subscribe to joint commands
        self.cmd_sub = self.create_subscription(
            JointTrajectory, '/joint_trajectory',
            self.trajectory_callback, 10
        )

        # Publish individual joint commands
        self.joint_cmd_pubs = {}
        joint_names = [
            'left_hip', 'left_knee', 'left_ankle',
            'right_hip', 'right_knee', 'right_ankle'
        ]

        for joint_name in joint_names:
            self.joint_cmd_pubs[joint_name] = self.create_publisher(
                Float64MultiArray, f'/{joint_name}_position_controller/command', 10
            )

    def trajectory_callback(self, msg):
        """Process trajectory and send individual joint commands."""
        for point in msg.points:
            # Send position commands to individual joints
            for i, joint_name in enumerate(msg.joint_names):
                if joint_name in self.joint_cmd_pubs:
                    cmd_msg = Float64MultiArray()
                    cmd_msg.data = [point.positions[i]]
                    self.joint_cmd_pubs[joint_name].publish(cmd_msg)
```

### Service-Based Control

For configuration and non-real-time control operations:

```python
from control_msgs.srv import SwitchController

class ControllerManager(Node):
    def __init__(self):
        super().__init__('controller_manager')

        # Service for switching controllers
        self.switch_service = self.create_service(
            SwitchController, 'switch_controller', self.switch_callback
        )

        # Client for calling controller services
        self.switch_client = self.create_client(
            SwitchController, '/controller_manager/switch_controller'
        )

    def switch_callback(self, request, response):
        """Handle controller switching requests."""
        try:
            # Wait for service to be available
            while not self.switch_client.wait_for_service(timeout_sec=1.0):
                self.get_logger().info('Controller manager service not available')

            # Call the actual controller manager
            future = self.switch_client.call_async(request)
            future.add_done_callback(self.switch_response_callback)

            response.ok = True
            return response
        except Exception as e:
            self.get_logger().error(f'Controller switch failed: {e}')
            response.ok = False
            return response

    def switch_response_callback(self, future):
        """Handle controller switch response."""
        try:
            result = future.result()
            if result.ok:
                self.get_logger().info('Controller switched successfully')
            else:
                self.get_logger().error('Controller switch failed')
        except Exception as e:
            self.get_logger().error(f'Controller switch response error: {e}')
```

### Action-Based Control

For long-running control operations:

```python
from rclpy.action import ActionServer
from control_msgs.action import FollowJointTrajectory
from trajectory_msgs.msg import JointTrajectoryPoint

class TrajectoryController(Node):
    def __init__(self):
        super().__init__('trajectory_controller')

        self._action_server = ActionServer(
            self,
            FollowJointTrajectory,
            'follow_joint_trajectory',
            self.execute_trajectory
        )

        # Joint command publisher
        self.joint_cmd_pub = self.create_publisher(
            JointTrajectory, '/joint_trajectory', 10
        )

    def execute_trajectory(self, goal_handle):
        """Execute a joint trajectory."""
        self.get_logger().info('Executing trajectory...')

        feedback_msg = FollowJointTrajectory.Feedback()
        result = FollowJointTrajectory.Result()

        trajectory = goal_handle.request.trajectory
        n_points = len(trajectory.points)

        for i, point in enumerate(trajectory.points):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                result.error_code = -1
                return result

            # Publish trajectory point
            single_point_trajectory = JointTrajectory()
            single_point_trajectory.joint_names = trajectory.joint_names
            single_point_trajectory.points = [point]
            self.joint_cmd_pub.publish(single_point_trajectory)

            # Provide feedback
            feedback_msg.actual.positions = point.positions
            feedback_msg.desired = point
            feedback_msg.error.positions = [0.0] * len(point.positions)
            goal_handle.publish_feedback(feedback_msg)

            # Calculate progress
            progress = (i + 1) / n_points * 100
            self.get_logger().debug(f'Trajectory progress: {progress:.1f}%')

            # Sleep to match trajectory timing
            if i < len(trajectory.points) - 1:
                next_point = trajectory.points[i + 1]
                time_diff = next_point.time_from_start.sec + next_point.time_from_start.nanosec * 1e-9
                self.get_clock().sleep_until(
                    self.get_clock().now() + rclpy.duration.Duration(seconds=time_diff)
                )

        goal_handle.succeed()
        result.error_code = 0
        return result
```

## Middleware Control for Balance and Locomotion

### Balance Control System

```python
from sensor_msgs.msg import Imu
from geometry_msgs.msg import Vector3
import numpy as np

class BalanceController(Node):
    def __init__(self):
        super().__init__('balance_controller')

        # Subscribe to IMU data for balance feedback
        self.imu_sub = self.create_subscription(
            Imu, '/imu/data', self.imu_callback, 10
        )

        # Subscribe to joint states
        self.joint_state_sub = self.create_subscription(
            JointState, '/joint_states', self.joint_state_callback, 10
        )

        # Publish balance correction commands
        self.balance_cmd_pub = self.create_publisher(
            JointTrajectory, '/balance_correction', 10
        )

        # Control timer (200 Hz for balance)
        self.balance_timer = self.create_timer(0.005, self.balance_control_loop)

        # Balance control parameters
        self.roll_pid = {'p': 5.0, 'i': 0.1, 'd': 1.0}
        self.pitch_pid = {'p': 5.0, 'i': 0.1, 'd': 1.0}

        # Current state
        self.current_roll = 0.0
        self.current_pitch = 0.0
        self.current_joint_positions = []

    def imu_callback(self, msg):
        """Process IMU data to extract orientation."""
        # Convert quaternion to roll/pitch/yaw
        quat = msg.orientation
        self.current_roll, self.current_pitch, _ = self.quaternion_to_rpy(
            quat.x, quat.y, quat.z, quat.w
        )

    def quaternion_to_rpy(self, x, y, z, w):
        """Convert quaternion to roll-pitch-yaw."""
        # Roll (x-axis rotation)
        sinr_cosp = 2 * (w * x + y * z)
        cosr_cosp = 1 - 2 * (x * x + y * y)
        roll = np.arctan2(sinr_cosp, cosr_cosp)

        # Pitch (y-axis rotation)
        sinp = 2 * (w * y - z * x)
        if np.abs(sinp) >= 1:
            pitch = np.copysign(np.pi / 2, sinp)
        else:
            pitch = np.arcsin(sinp)

        # Yaw (z-axis rotation)
        siny_cosp = 2 * (w * z + x * y)
        cosy_cosp = 1 - 2 * (y * y + z * z)
        yaw = np.arctan2(siny_cosp, cosy_cosp)

        return roll, pitch, yaw

    def balance_control_loop(self):
        """Main balance control loop."""
        # Calculate balance errors
        roll_error = 0.0 - self.current_roll  # Target: 0 roll
        pitch_error = 0.0 - self.current_pitch  # Target: 0 pitch

        # Apply PID control
        roll_correction = (
            self.roll_pid['p'] * roll_error +
            self.roll_pid['i'] * self.integrate_error(roll_error, 'roll') +
            self.roll_pid['d'] * self.differentiate_error(roll_error, 'roll')
        )

        pitch_correction = (
            self.pitch_pid['p'] * pitch_error +
            self.pitch_pid['i'] * self.integrate_error(pitch_error, 'pitch') +
            self.pitch_pid['d'] * self.differentiate_error(pitch_error, 'pitch')
        )

        # Generate balance correction commands
        self.apply_balance_correction(roll_correction, pitch_correction)

    def apply_balance_correction(self, roll_corr, pitch_corr):
        """Apply balance corrections to joints."""
        # This is a simplified example - real balance control is more complex
        cmd_msg = JointTrajectory()
        cmd_msg.joint_names = ['left_hip_roll', 'right_hip_roll',
                              'left_hip_pitch', 'right_hip_pitch']

        point = JointTrajectoryPoint()
        point.positions = [roll_corr * 0.1, -roll_corr * 0.1,
                          pitch_corr * 0.1, pitch_corr * 0.1]
        point.time_from_start.sec = 0
        point.time_from_start.nanosec = 5000000  # 5ms

        cmd_msg.points = [point]
        self.balance_cmd_pub.publish(cmd_msg)
```

### Locomotion Control

```python
from geometry_msgs.msg import Twist
from nav_msgs.msg import Path
from geometry_msgs.msg import PoseStamped

class LocomotionController(Node):
    def __init__(self):
        super().__init__('locomotion_controller')

        # Subscribe to navigation goals
        self.nav_goal_sub = self.create_subscription(
            PoseStamped, '/move_base_simple/goal',
            self.navigation_goal_callback, 10
        )

        # Subscribe to velocity commands
        self.cmd_vel_sub = self.create_subscription(
            Twist, '/cmd_vel', self.velocity_callback, 10
        )

        # Publish walking patterns
        self.step_pattern_pub = self.create_publisher(
            JointTrajectory, '/step_pattern', 10
        )

        # Control timer
        self.loco_timer = self.create_timer(0.02, self.locomotion_loop)

        # Walking state
        self.current_velocity = Twist()
        self.is_walking = False
        self.step_phase = 0.0  # 0.0 to 1.0

    def velocity_callback(self, msg):
        """Update desired velocity."""
        self.current_velocity = msg
        self.is_walking = abs(msg.linear.x) > 0.01 or abs(msg.angular.z) > 0.01

    def locomotion_loop(self):
        """Main locomotion control loop."""
        if not self.is_walking:
            return

        # Generate walking pattern based on desired velocity
        step_pattern = self.generate_step_pattern(
            self.current_velocity.linear.x,
            self.current_velocity.angular.z
        )

        # Publish step pattern
        self.step_pattern_pub.publish(step_pattern)

        # Update step phase
        self.step_phase = (self.step_phase + 0.02) % 1.0  # Assuming 50Hz loop

    def generate_step_pattern(self, linear_vel, angular_vel):
        """Generate step pattern based on desired velocity."""
        # Simplified walking pattern generation
        # In reality, this would involve complex gait planning
        cmd_msg = JointTrajectory()
        cmd_msg.joint_names = [
            'left_hip', 'left_knee', 'left_ankle',
            'right_hip', 'right_knee', 'right_ankle'
        ]

        point = JointTrajectoryPoint()

        # Generate joint positions based on walking phase and desired velocity
        # This is a highly simplified example
        base_positions = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        step_modulation = [
            np.sin(self.step_phase * 2 * np.pi) * linear_vel * 0.1,
            np.cos(self.step_phase * 2 * np.pi) * linear_vel * 0.05,
            np.sin(self.step_phase * 2 * np.pi + np.pi/2) * linear_vel * 0.05,
            -np.sin(self.step_phase * 2 * np.pi) * linear_vel * 0.1,
            -np.cos(self.step_phase * 2 * np.pi) * linear_vel * 0.05,
            -np.sin(self.step_phase * 2 * np.pi + np.pi/2) * linear_vel * 0.05
        ]

        point.positions = [pos + mod for pos, mod in zip(base_positions, step_modulation)]
        point.time_from_start.sec = 0
        point.time_from_start.nanosec = 20000000  # 20ms

        cmd_msg.points = [point]
        return cmd_msg
```

## Distributed Control Systems

### Multi-Node Coordination

```python
from actionlib_msgs.msg import GoalStatusArray
from std_msgs.msg import Bool

class DistributedController(Node):
    def __init__(self):
        super().__init__('distributed_controller')

        # Publishers for coordinating with other nodes
        self.coordination_pub = self.create_publisher(Bool, '/control_sync', 10)
        self.status_pub = self.create_publisher(String, '/system_status', 10)

        # Subscribers for coordination
        self.coordination_sub = self.create_subscription(
            Bool, '/control_sync', self.coordination_callback, 10
        )

        # Timer for coordination
        self.coordination_timer = self.create_timer(0.01, self.coordination_loop)

        # Control synchronization
        self.sync_counter = 0
        self.expected_nodes = 5  # Number of control nodes
        self.ready_nodes = set()

    def coordination_callback(self, msg):
        """Handle coordination signals from other nodes."""
        # In a real system, this would handle more complex coordination
        pass

    def coordination_loop(self):
        """Coordinate with other control nodes."""
        # Send coordination signal
        sync_msg = Bool()
        sync_msg.data = True
        self.coordination_pub.publish(sync_msg)

        # Update system status
        status_msg = String()
        status_msg.data = f'Control nodes: {len(self.ready_nodes)}/{self.expected_nodes}'
        self.status_pub.publish(status_msg)

        # Increment sync counter
        self.sync_counter += 1
```

### Master-Slave Control Architecture

```python
class MasterController(Node):
    def __init__(self):
        super().__init__('master_controller')

        # Clients for slave controllers
        self.arm_client = self.create_client(JointTrajectory, '/left_arm_controller/follow_joint_trajectory')
        self.leg_client = self.create_client(JointTrajectory, '/leg_controller/follow_joint_trajectory')
        self.head_client = self.create_client(JointTrajectory, '/head_controller/follow_joint_trajectory')

        # Subscriber for high-level commands
        self.high_level_cmd_sub = self.create_subscription(
            String, '/behavior_commands', self.high_level_callback, 10
        )

    def high_level_callback(self, msg):
        """Handle high-level behavior commands."""
        command = msg.data

        if command == 'wave':
            self.execute_wave_behavior()
        elif command == 'walk':
            self.execute_walk_behavior()
        elif command == 'look_around':
            self.execute_look_around_behavior()

    def execute_wave_behavior(self):
        """Execute waving behavior using multiple controllers."""
        # Send coordinated commands to multiple controllers
        arm_trajectory = self.create_wave_trajectory()
        head_trajectory = self.create_attention_head_trajectory()

        # Send to arm controller
        arm_future = self.arm_client.call_async(arm_trajectory)

        # Send to head controller
        head_future = self.head_client.call_async(head_trajectory)

        # Wait for completion or handle asynchronously
        # Implementation depends on specific requirements
```

## Middleware Control Security

### Authentication and Authorization

```python
class SecureController(Node):
    def __init__(self):
        super().__init__('secure_controller')

        # Subscribe to commands with authentication
        self.secure_cmd_sub = self.create_subscription(
            SecureCommand, '/secure_commands',
            self.secure_command_callback, 10
        )

        # Service for authentication
        self.auth_service = self.create_service(
            Authenticate, '/authenticate', self.auth_callback
        )

        # Track authenticated sessions
        self.authenticated_sessions = {}

    def secure_command_callback(self, msg):
        """Handle secure commands with authentication."""
        # Verify authentication token
        if msg.session_id not in self.authenticated_sessions:
            self.get_logger().warn(f'Unauthorized command from {msg.source}')
            return

        # Check if session is still valid
        session = self.authenticated_sessions[msg.session_id]
        if self.get_clock().now().nanoseconds > session.expiry_time:
            del self.authenticated_sessions[msg.session_id]
            self.get_logger().warn('Session expired')
            return

        # Execute command
        self.execute_authenticated_command(msg.command)

    def execute_authenticated_command(self, command):
        """Execute a verified command."""
        # Implementation of command execution
        pass
```

## Performance Monitoring and Diagnostics

### Control System Monitoring

```python
from diagnostic_msgs.msg import DiagnosticArray, DiagnosticStatus
from std_msgs.msg import Float64

class ControlMonitor(Node):
    def __init__(self):
        super().__init__('control_monitor')

        # Publishers for diagnostics
        self.diag_pub = self.create_publisher(DiagnosticArray, '/diagnostics', 10)
        self.control_freq_pub = self.create_publisher(Float64, '/control_frequency', 10)

        # Timer for monitoring
        self.monitor_timer = self.create_timer(1.0, self.monitor_system)

        # Control timing tracking
        self.control_timings = []
        self.last_control_time = self.get_clock().now()

    def monitor_system(self):
        """Monitor control system performance."""
        diag_array = DiagnosticArray()
        diag_array.header.stamp = self.get_clock().now().to_msg()

        # Control frequency diagnostic
        status = DiagnosticStatus()
        status.name = 'Control Frequency'

        # Calculate actual control frequency
        avg_period = np.mean(self.control_timings) if self.control_timings else 0.0
        actual_freq = 1.0 / avg_period if avg_period > 0 else 0.0

        status.message = f'Actual: {actual_freq:.2f} Hz, Target: 1000 Hz'

        if actual_freq > 950:  # Allow 5% tolerance
            status.level = DiagnosticStatus.OK
        elif actual_freq > 900:
            status.level = DiagnosticStatus.WARN
        else:
            status.level = DiagnosticStatus.ERROR

        # Add key-value pairs
        status.values.append(KeyValue(key='Target Frequency', value='1000 Hz'))
        status.values.append(KeyValue(key='Actual Frequency', value=f'{actual_freq:.2f} Hz'))
        status.values.append(KeyValue(key='Min Period (ms)', value=f'{min(self.control_timings)*1000:.2f}' if self.control_timings else 'N/A'))
        status.values.append(KeyValue(key='Max Period (ms)', value=f'{max(self.control_timings)*1000:.2f}' if self.control_timings else 'N/A'))

        diag_array.status.append(status)
        self.diag_pub.publish(diag_array)

        # Publish control frequency for other nodes
        freq_msg = Float64()
        freq_msg.data = actual_freq
        self.control_freq_pub.publish(freq_msg)

        # Reset timing buffer
        self.control_timings = []
```

## Fault Tolerance and Recovery

### Control System Fault Handling

```python
class FaultTolerantController(Node):
    def __init__(self):
        super().__init__('fault_tolerant_controller')

        # Publishers for different control modes
        self.normal_control_pub = self.create_publisher(JointTrajectory, '/joint_trajectory', 10)
        self.emergency_stop_pub = self.create_publisher(Bool, '/emergency_stop', 10)

        # Subscribers for fault detection
        self.fault_sub = self.create_subscription(
            FaultReport, '/fault_reports', self.fault_callback, 10
        )

        # Timer for fault monitoring
        self.fault_monitor_timer = self.create_timer(0.1, self.monitor_faults)

        # Fault state tracking
        self.faults = {}
        self.fallback_active = False

    def fault_callback(self, msg):
        """Handle fault reports from other nodes."""
        self.faults[msg.source] = {
            'severity': msg.severity,
            'timestamp': self.get_clock().now(),
            'description': msg.description
        }

    def monitor_faults(self):
        """Monitor system for faults and take appropriate action."""
        critical_faults = [source for source, fault in self.faults.items()
                          if fault['severity'] == 'CRITICAL']

        if critical_faults and not self.fallback_active:
            self.activate_fallback_mode(critical_faults)

    def activate_fallback_mode(self, fault_sources):
        """Activate safe fallback mode."""
        self.get_logger().error(f'Activating fallback mode due to faults: {fault_sources}')

        self.fallback_active = True

        # Send emergency stop command
        stop_msg = Bool()
        stop_msg.data = True
        self.emergency_stop_pub.publish(stop_msg)

        # Log fault information
        for source in fault_sources:
            fault_info = self.faults[source]
            self.get_logger().error(f'Fault from {source}: {fault_info["description"]}')

    def deactivate_fallback_mode(self):
        """Deactivate fallback mode when safe."""
        if self.fallback_active:
            self.fallback_active = False
            self.get_logger().info('Fallback mode deactivated')
```

## Integration with ros2_control

### ros2_control Bridge

```python
class Ros2ControlBridge(Node):
    def __init__(self):
        super().__init__('ros2_control_bridge')

        # Interface with ros2_control controller manager
        self.switch_client = self.create_client(
            SwitchController, '/controller_manager/switch_controller'
        )
        self.list_client = self.create_client(
            ListControllers, '/controller_manager/list_controllers'
        )

        # Publishers for control commands
        self.joint_cmd_pub = self.create_publisher(
            JointTrajectory, '/position_trajectory_controller/joint_trajectory', 10
        )

        # Timer for controller status updates
        self.status_timer = self.create_timer(1.0, self.update_controller_status)

    def switch_controllers(self, start_controllers, stop_controllers):
        """Switch between different controllers."""
        if not self.switch_client.wait_for_service(timeout_sec=1.0):
            self.get_logger().error('Controller manager service not available')
            return False

        request = SwitchController.Request()
        request.start_controllers = start_controllers
        request.stop_controllers = stop_controllers
        request.strictness = SwitchController.Request.BEST_EFFORT

        future = self.switch_client.call_async(request)
        future.add_done_callback(self.switch_response_callback)

        return True

    def switch_response_callback(self, future):
        """Handle controller switch response."""
        try:
            response = future.result()
            if response.ok:
                self.get_logger().info('Controllers switched successfully')
            else:
                self.get_logger().error('Controller switch failed')
        except Exception as e:
            self.get_logger().error(f'Controller switch error: {e}')
```

## Middleware Control Best Practices

### Performance Optimization

```python
class OptimizedController(Node):
    def __init__(self):
        super().__init__('optimized_controller')

        # Pre-allocate messages to reduce allocation overhead
        self.cmd_msg_cache = JointTrajectory()
        self.feedback_msg_cache = JointTrajectoryControllerState()

        # Use intra-process communication where possible
        # Configure appropriate QoS settings
        optimized_qos = QoSProfile(
            reliability=ReliabilityPolicy.RELIABLE,
            history=HistoryPolicy.KEEP_LAST,
            depth=1,
            avoid_ros_namespace_conventions=True
        )

        self.optimized_pub = self.create_publisher(
            JointTrajectory, '/optimized_commands', optimized_qos
        )

        # Timer with appropriate callback group
        self.optimized_timer = self.create_timer(
            0.001, self.optimized_control_loop
        )

    def optimized_control_loop(self):
        """Optimized control loop with reduced overhead."""
        # Reuse message objects
        self.cmd_msg_cache.header.stamp = self.get_clock().now().to_msg()

        # Update only necessary fields
        # Avoid unnecessary computations
        # Use efficient data structures
        self.optimized_pub.publish(self.cmd_msg_cache)
```

### Resource Management

```python
class ResourceManagedController(Node):
    def __init__(self):
        super().__init__('resource_managed_controller')

        # Track resource usage
        self.cpu_usage = 0.0
        self.memory_usage = 0.0
        self.network_usage = 0.0

        # Resource monitoring timer
        self.resource_timer = self.create_timer(5.0, self.check_resources)

    def check_resources(self):
        """Monitor system resources."""
        import psutil

        # Check CPU usage
        self.cpu_usage = psutil.cpu_percent()
        if self.cpu_usage > 80:
            self.get_logger().warn(f'High CPU usage: {self.cpu_usage}%')

        # Check memory usage
        memory = psutil.virtual_memory()
        self.memory_usage = memory.percent
        if self.memory_usage > 85:
            self.get_logger().warn(f'High memory usage: {self.memory_usage}%')

        # Adjust control frequency based on resources
        if self.cpu_usage > 90 or self.memory_usage > 90:
            self.reduce_control_frequency()
        else:
            self.restore_control_frequency()

    def reduce_control_frequency(self):
        """Reduce control frequency to conserve resources."""
        # Implementation to reduce control loop frequency
        pass

    def restore_control_frequency(self):
        """Restore normal control frequency."""
        # Implementation to restore normal frequency
        pass
```

## Summary

Middleware control in ROS 2 is critical for managing the complex interactions required by humanoid robots. Effective middleware control requires understanding real-time constraints, implementing appropriate communication patterns, and ensuring fault tolerance and security.

The hierarchical control structure, combined with proper QoS settings and performance optimization techniques, enables humanoid robots to operate reliably in dynamic environments. As humanoid robotics continues to advance, middleware control will become increasingly sophisticated, incorporating AI-driven decision making and adaptive control strategies.

## Key Takeaways

- Middleware control manages the distributed components of humanoid robots
- Real-time requirements demand careful QoS configuration and timing
- Hierarchical control structures manage system complexity
- Security and fault tolerance are essential for safe operation
- Performance monitoring ensures system reliability
- Integration with ros2_control provides standardized interfaces
- Optimization techniques improve system efficiency
- Middleware control is fundamental to humanoid robot operation