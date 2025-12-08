---
sidebar_position: 28
title: "Submodule 2: Action Spaces"
---

# Submodule 2: Action Spaces

## Introduction to Action Spaces in VLA Systems

Action spaces define the set of possible actions that a Vision-Language-Action (VLA) system can execute. In robotics, action spaces bridge the gap between high-level language commands and low-level motor controls. The design of action spaces is crucial for VLA systems as it determines how effectively the system can translate multimodal understanding into physical behavior.

The challenge in VLA systems is creating action spaces that are both expressive enough to capture the rich semantics of natural language while being precise enough for accurate robot control. This submodule explores various approaches to action space design and their implications for robotic systems.

## Types of Action Spaces

### Discrete Action Spaces

Discrete action spaces define a finite set of possible actions. These are often used in high-level task planning:

```python
import numpy as np
from enum import Enum

class DiscreteRobotActions(Enum):
    MOVE_FORWARD = 0
    MOVE_BACKWARD = 1
    TURN_LEFT = 2
    TURN_RIGHT = 3
    GRASP = 4
    RELEASE = 5
    MOVE_ARM_UP = 6
    MOVE_ARM_DOWN = 7
    STOP = 8

class DiscreteActionSpace:
    def __init__(self):
        self.n = len(DiscreteRobotActions)
        self.actions = list(DiscreteRobotActions)

    def sample(self):
        """Sample a random action"""
        return np.random.randint(0, self.n)

    def convert_to_robot_command(self, action_idx):
        """Convert discrete action to robot command"""
        action = DiscreteRobotActions(action_idx)

        command_mapping = {
            DiscreteRobotActions.MOVE_FORWARD: {'linear_x': 0.5, 'angular_z': 0.0},
            DiscreteRobotActions.MOVE_BACKWARD: {'linear_x': -0.5, 'angular_z': 0.0},
            DiscreteRobotActions.TURN_LEFT: {'linear_x': 0.0, 'angular_z': 0.5},
            DiscreteRobotActions.TURN_RIGHT: {'linear_x': 0.0, 'angular_z': -0.5},
            DiscreteRobotActions.GRASP: {'gripper': 'close'},
            DiscreteRobotActions.RELEASE: {'gripper': 'open'},
            DiscreteRobotActions.MOVE_ARM_UP: {'arm_joint': 0.1},
            DiscreteRobotActions.MOVE_ARM_DOWN: {'arm_joint': -0.1},
            DiscreteRobotActions.STOP: {'linear_x': 0.0, 'angular_z': 0.0, 'gripper': 'neutral'}
        }

        return command_mapping[action]

# Example usage
action_space = DiscreteActionSpace()
random_action = action_space.sample()
robot_command = action_space.convert_to_robot_command(random_action)
print(f"Random action: {random_action}, Command: {robot_command}")
```

### Continuous Action Spaces

Continuous action spaces allow for more precise control with real-valued action parameters:

```python
import numpy as np
import torch
import torch.nn as nn

class ContinuousActionSpace:
    def __init__(self, low, high, size):
        """
        Continuous action space
        low: Lower bounds for each action dimension
        high: Upper bounds for each action dimension
        size: Number of action dimensions
        """
        self.low = np.array(low)
        self.high = np.array(high)
        self.size = size
        self.action_range = self.high - self.low

    def sample(self):
        """Sample a random action within bounds"""
        return np.random.uniform(self.low, self.high)

    def normalize_action(self, action):
        """Normalize action to [-1, 1] range"""
        normalized = 2.0 * (action - self.low) / self.action_range - 1.0
        return np.clip(normalized, -1.0, 1.0)

    def unnormalize_action(self, normalized_action):
        """Convert normalized action back to original range"""
        denormalized = (normalized_action + 1.0) * self.action_range / 2.0 + self.low
        return np.clip(denormalized, self.low, self.high)

# Example: 7-DOF robotic arm action space
arm_action_space = ContinuousActionSpace(
    low=[-1.5, -1.0, -2.0, -2.0, -2.5, -1.0, -1.5],  # Joint limits (radians)
    high=[1.5, 1.0, 2.0, 2.0, 2.5, 1.0, 1.5],
    size=7
)

# Example: Mobile base action space (linear and angular velocities)
mobile_action_space = ContinuousActionSpace(
    low=[-1.0, -1.0],  # Linear and angular velocity limits
    high=[1.0, 1.0],
    size=2
)
```

### Hybrid Action Spaces

Hybrid action spaces combine discrete and continuous components:

```python
class HybridActionSpace:
    def __init__(self, discrete_actions, continuous_bounds):
        """
        Hybrid action space combining discrete and continuous components
        discrete_actions: Number of discrete action types
        continuous_bounds: Tuple of (low, high, size) for continuous part
        """
        self.discrete_size = discrete_actions
        self.continuous_space = ContinuousActionSpace(*continuous_bounds)
        self.total_size = 1 + self.continuous_space.size  # 1 for discrete selection + continuous parameters

    def decode_hybrid_action(self, action_vector):
        """
        Decode hybrid action vector into discrete selection and continuous parameters
        action_vector: [discrete_idx, continuous_params...]
        """
        discrete_idx = int(action_vector[0])
        continuous_params = action_vector[1:]

        return discrete_idx, continuous_params

    def encode_hybrid_action(self, discrete_idx, continuous_params):
        """Encode discrete and continuous components into single action vector"""
        action_vector = np.zeros(self.total_size)
        action_vector[0] = discrete_idx
        action_vector[1:] = continuous_params

        return action_vector

# Example: Hybrid action space for mobile manipulator
# Discrete: 0=move_base, 1=move_arm, 2=grasp, 3=release
# Continuous: velocity parameters for each action type
hybrid_space = HybridActionSpace(
    discrete_actions=4,
    continuous_bounds=([-1.0, -1.0, -1.0, -1.0], [1.0, 1.0, 1.0, 1.0], 4)
)
```

## Action Space Mapping in VLA Systems

### Language-to-Action Mapping

Mapping natural language commands to action spaces requires understanding the semantics of the command:

```python
class LanguageToActionMapper:
    def __init__(self, action_space):
        self.action_space = action_space
        self.command_keywords = {
            'move_forward': ['forward', 'ahead', 'go', 'straight'],
            'move_backward': ['backward', 'back', 'reverse'],
            'turn_left': ['left', 'port', 'anti-clockwise'],
            'turn_right': ['right', 'starboard', 'clockwise'],
            'grasp': ['grasp', 'grab', 'pick', 'take', 'catch'],
            'release': ['release', 'drop', 'let go', 'put down'],
            'stop': ['stop', 'halt', 'pause', 'wait']
        }

    def parse_command(self, command_text):
        """Parse natural language command to determine action type"""
        command_text = command_text.lower()

        for action_type, keywords in self.command_keywords.items():
            for keyword in keywords:
                if keyword in command_text:
                    return action_type

        return 'unknown'

    def map_to_action(self, command_text, vision_features=None):
        """Map command and vision to specific action"""
        action_type = self.parse_command(command_text)

        if action_type == 'move_forward':
            if 'slowly' in command_text:
                return np.array([0, 0.2, 0.0])  # [discrete_idx, linear_vel, angular_vel]
            else:
                return np.array([0, 0.5, 0.0])
        elif action_type == 'turn_left':
            return np.array([2, 0.0, 0.3])
        elif action_type == 'turn_right':
            return np.array([3, 0.0, -0.3])
        elif action_type == 'grasp':
            return np.array([4, 0.0, 0.0])
        elif action_type == 'release':
            return np.array([5, 0.0, 0.0])
        elif action_type == 'stop':
            return np.array([8, 0.0, 0.0])
        else:
            return np.array([8, 0.0, 0.0])  # Default to stop

# Example usage
mapper = LanguageToActionMapper(None)
action = mapper.map_to_action("Please move forward slowly")
print(f"Mapped action: {action}")
```

### Vision-Grounded Action Selection

Incorporating visual information to refine action selection:

```python
class VisionGroundedActionSelector(nn.Module):
    def __init__(self, vision_encoder, language_encoder, action_predictor, action_space_dim):
        super().__init__()

        self.vision_encoder = vision_encoder
        self.language_encoder = language_encoder
        self.action_predictor = action_predictor

        # Fusion network to combine vision and language for action prediction
        self.fusion_network = nn.Sequential(
            nn.Linear(1024, 512),  # Assuming 1024-dim fused features
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(512, action_space_dim)
        )

    def forward(self, image, text_command):
        """
        Predict action based on image and text command
        """
        # Encode vision and language
        vision_features = self.vision_encoder(image)
        language_features = self.language_encoder(text_command)

        # Fuse vision and language features
        fused_features = torch.cat([vision_features, language_features], dim=-1)

        # Predict action logits
        action_logits = self.fusion_network(fused_features)

        return action_logits

    def select_action(self, image, text_command, temperature=1.0):
        """
        Select action with optional temperature scaling for exploration
        """
        with torch.no_grad():
            action_logits = self.forward(image, text_command)

            # Apply temperature scaling
            scaled_logits = action_logits / temperature

            # Sample action using Gumbel-Softmax trick or argmax
            action_probs = torch.softmax(scaled_logits, dim=-1)
            action = torch.argmax(action_probs, dim=-1)

        return action, action_probs
```

## Hierarchical Action Spaces

### High-Level vs Low-Level Actions

Hierarchical action spaces separate high-level task planning from low-level execution:

```python
class HierarchicalActionSpace:
    def __init__(self):
        # High-level action space
        self.high_level_actions = {
            'navigate_to_object': 0,
            'grasp_object': 1,
            'transport_object': 2,
            'place_object': 3,
            'explore_environment': 4,
            'return_to_home': 5
        }

        # Low-level action space
        self.low_level_actions = ContinuousActionSpace(
            low=[-1.0, -1.0, -1.0],  # linear_x, linear_y, angular_z
            high=[1.0, 1.0, 1.0],
            size=3
        )

        self.current_high_level_task = None
        self.low_level_controller = None

    def execute_high_level_command(self, command, vision_features):
        """Execute high-level command by decomposing into low-level actions"""
        high_level_action = self.parse_high_level_command(command)

        if high_level_action == 'navigate_to_object':
            return self.navigate_to_object(vision_features)
        elif high_level_action == 'grasp_object':
            return self.grasp_object(vision_features)
        elif high_level_action == 'transport_object':
            return self.transport_object(vision_features)
        elif high_level_action == 'place_object':
            return self.place_object(vision_features)
        else:
            return self.execute_low_level_action(np.array([0.0, 0.0, 0.0]))

    def parse_high_level_command(self, command):
        """Parse high-level command to determine task"""
        command = command.lower()

        if any(word in command for word in ['go to', 'navigate to', 'move to', 'find']):
            return 'navigate_to_object'
        elif any(word in command for word in ['grasp', 'grab', 'pick up', 'take']):
            return 'grasp_object'
        elif any(word in command for word in ['transport', 'carry', 'move', 'bring']):
            return 'transport_object'
        elif any(word in command for word in ['place', 'put', 'set down', 'release']):
            return 'place_object'
        else:
            return 'explore_environment'

    def navigate_to_object(self, vision_features):
        """Generate low-level actions for navigation task"""
        # This would use vision features to determine navigation direction
        # For simplicity, returning a forward motion
        return np.array([0.3, 0.0, 0.0])  # Move forward at 30% speed

    def grasp_object(self, vision_features):
        """Generate low-level actions for grasping task"""
        # This would use vision to determine grasp pose
        # For simplicity, returning a grasp command
        return np.array([0.0, 0.0, 0.0])  # Placeholder for grasp action

    def execute_low_level_action(self, action):
        """Execute low-level action on robot"""
        # This would interface with actual robot hardware
        return action
```

## Action Space Learning and Adaptation

### Learning Action Representations

Learning effective action representations from data:

```python
class ActionRepresentationLearner(nn.Module):
    def __init__(self, observation_dim, action_dim, hidden_dim=256):
        super().__init__()

        # Encode observations
        self.observation_encoder = nn.Sequential(
            nn.Linear(observation_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU()
        )

        # Learn action representations
        self.action_encoder = nn.Sequential(
            nn.Linear(action_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU()
        )

        # Predict next observation from current observation and action
        self.transition_predictor = nn.Sequential(
            nn.Linear(hidden_dim * 2, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, observation_dim)
        )

        # Predict action from observation and next observation
        self.inverse_dynamics = nn.Sequential(
            nn.Linear(observation_dim * 2, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim)
        )

    def forward(self, obs, action, next_obs):
        """Forward pass for action representation learning"""
        obs_encoded = self.observation_encoder(obs)
        action_encoded = self.action_encoder(action)

        # Transition prediction: predict next_obs from obs and action
        obs_action_cat = torch.cat([obs_encoded, action_encoded], dim=-1)
        predicted_next_obs = self.transition_predictor(obs_action_cat)

        # Inverse dynamics: predict action from obs and next_obs
        obs_next_cat = torch.cat([obs, next_obs], dim=-1)
        predicted_action = self.inverse_dynamics(obs_next_cat)

        return predicted_next_obs, predicted_action

    def compute_loss(self, obs, action, next_obs):
        """Compute loss for action representation learning"""
        pred_next_obs, pred_action = self.forward(obs, action, next_obs)

        # Reconstruction loss for transition prediction
        transition_loss = nn.MSELoss()(pred_next_obs, next_obs)

        # Reconstruction loss for inverse dynamics
        inverse_loss = nn.MSELoss()(pred_action, action)

        # Total loss
        total_loss = transition_loss + inverse_loss

        return total_loss, transition_loss, inverse_loss
```

### Action Space Adaptation

Adapting action spaces to new environments or tasks:

```python
class ActionSpaceAdaptor:
    def __init__(self, base_action_space, adaptation_network):
        self.base_action_space = base_action_space
        self.adaptation_network = adaptation_network
        self.environment_context = None

    def adapt_action_space(self, environment_features, task_description):
        """
        Adapt action space based on environment and task
        """
        # Encode environment and task context
        context_vector = self.encode_context(environment_features, task_description)

        # Adapt action parameters based on context
        adapted_params = self.adaptation_network(context_vector)

        # Return adapted action space
        return self.create_adapted_action_space(adapted_params)

    def encode_context(self, env_features, task_desc):
        """Encode environment and task context"""
        # This would typically use a neural network to encode the context
        # For simplicity, returning a concatenated representation
        return torch.cat([env_features, task_desc], dim=-1)

    def create_adapted_action_space(self, params):
        """Create adapted action space from parameters"""
        # Example: adapt velocity limits based on environment
        new_low = self.base_action_space.low * params['scale_factor'] + params['offset']
        new_high = self.base_action_space.high * params['scale_factor'] + params['offset']

        return ContinuousActionSpace(
            low=new_low,
            high=new_high,
            size=self.base_action_space.size
        )

# Example of domain adaptation
def adapt_to_new_environment(base_action_space, source_env_data, target_env_data):
    """
    Adapt action space from source environment to target environment
    """
    # Compute domain adaptation parameters
    source_stats = compute_environment_statistics(source_env_data)
    target_stats = compute_environment_statistics(target_env_data)

    # Compute adaptation parameters
    scale_factor = target_stats['std'] / source_stats['std']
    offset = target_stats['mean'] - source_stats['mean'] * scale_factor

    # Create adapted action space
    adapted_space = ContinuousActionSpace(
        low=base_action_space.low * scale_factor + offset,
        high=base_action_space.high * scale_factor + offset,
        size=base_action_space.size
    )

    return adapted_space

def compute_environment_statistics(env_data):
    """Compute statistics for environment adaptation"""
    # This would compute mean and std of environment features
    # For simplicity, returning dummy values
    return {'mean': 0.0, 'std': 1.0}
```

## Action Space for Humanoid Robots

### Humanoid-Specific Action Spaces

Humanoid robots require specialized action spaces that account for their complex kinematics:

```python
class HumanoidActionSpace:
    def __init__(self):
        # Define humanoid-specific action components
        self.joint_names = [
            # Left leg
            'left_hip_roll', 'left_hip_yaw', 'left_hip_pitch',
            'left_knee', 'left_ankle_pitch', 'left_ankle_roll',
            # Right leg
            'right_hip_roll', 'right_hip_yaw', 'right_hip_pitch',
            'right_knee', 'right_ankle_pitch', 'right_ankle_roll',
            # Left arm
            'left_shoulder_pitch', 'left_shoulder_roll', 'left_shoulder_yaw', 'left_elbow',
            # Right arm
            'right_shoulder_pitch', 'right_shoulder_roll', 'right_shoulder_yaw', 'right_elbow',
            # Torso and head
            'torso_yaw', 'torso_pitch', 'neck_pitch', 'neck_yaw'
        ]

        # Define joint limits (example values)
        self.joint_limits = {
            name: (-2.0, 2.0) for name in self.joint_names  # Simplified limits
        }

        # For walking gaits
        self.gait_actions = {
            'walk_forward': 0,
            'walk_backward': 1,
            'turn_left': 2,
            'turn_right': 3,
            'stand': 4,
            'sit': 5,
            'step_left': 6,
            'step_right': 7
        }

    def create_pose_action(self, pose_type, speed=1.0):
        """
        Create action for predefined poses
        """
        if pose_type == 'stand':
            # Default standing position
            joint_positions = np.array([
                0.0, 0.0, 0.0,  # Left hip
                0.0, 0.0, 0.0,  # Left ankle
                0.0, 0.0, 0.0,  # Right hip
                0.0, 0.0, 0.0,  # Right ankle
                0.0, 0.0, 0.0, 0.0,  # Left arm
                0.0, 0.0, 0.0, 0.0,  # Right arm
                0.0, 0.0, 0.0, 0.0   # Torso, neck
            ])
        elif pose_type == 'ready':
            # Ready position for manipulation
            joint_positions = np.array([
                0.0, 0.0, 0.1,  # Left hip (slight flex)
                0.0, 0.0, 0.0,
                0.0, 0.0, 0.1,  # Right hip (slight flex)
                0.0, 0.0, 0.0,
                0.2, 0.1, -0.1, 0.5,  # Left arm (ready position)
                0.2, 0.1, -0.1, 0.5,  # Right arm (ready position)
                0.0, 0.0, 0.0, 0.0
            ])
        else:
            # Default to zero position
            joint_positions = np.zeros(len(self.joint_names))

        return joint_positions * speed

    def create_walking_pattern(self, gait_type, step_size=0.1, step_height=0.05):
        """
        Create walking pattern for humanoid locomotion
        """
        # This would implement complex walking patterns
        # For simplicity, returning a basic pattern
        if gait_type == 'walk_forward':
            # Generate a sequence of joint positions for walking
            pattern = {
                'left_leg_trajectory': self.generate_leg_trajectory(step_size, step_height, 'left'),
                'right_leg_trajectory': self.generate_leg_trajectory(step_size, step_height, 'right'),
                'arm_swing': self.generate_arm_swing()
            }
            return pattern
        else:
            return None

    def generate_leg_trajectory(self, step_size, step_height, leg_side):
        """Generate trajectory for leg movement"""
        # Simplified trajectory generation
        # In practice, this would use inverse kinematics and gait planning
        trajectory = []

        # Example: simple 5-point trajectory
        for i in range(5):
            t = i / 4.0  # Normalize to [0, 1]

            # Calculate position based on trajectory phase
            x = step_size * t if leg_side == 'left' else 0
            z = step_height * np.sin(np.pi * t)  # Parabolic step

            trajectory.append({'x': x, 'z': z, 'phase': t})

        return trajectory

    def generate_arm_swing(self):
        """Generate natural arm swing for walking"""
        # Natural arm swing to counterbalance leg movement
        return {
            'left_arm': {'shoulder_roll': -0.1, 'elbow': 0.2},
            'right_arm': {'shoulder_roll': 0.1, 'elbow': -0.2}
        }
```

### Action Space for Complex Manipulation

```python
class ManipulationActionSpace:
    def __init__(self):
        # Define manipulation primitive actions
        self.primitives = {
            'reach': 0,
            'grasp': 1,
            'lift': 2,
            'move': 3,
            'place': 4,
            'release': 5,
            'retract': 6
        }

        # Define hand configuration space
        self.hand_config = {
            'gripper_width': (0.0, 0.1),  # meters
            'gripper_force': (0.0, 100.0),  # Newtons
            'wrist_orientation': (3,),  # roll, pitch, yaw
            'finger_positions': (5,)  # Assuming 5 fingers
        }

    def create_manipulation_sequence(self, object_pose, target_pose):
        """
        Create a sequence of manipulation actions
        """
        sequence = []

        # 1. Reach to object
        reach_action = self.plan_reach_action(object_pose)
        sequence.append(('reach', reach_action))

        # 2. Grasp object
        grasp_action = self.plan_grasp_action(object_pose)
        sequence.append(('grasp', grasp_action))

        # 3. Lift object
        lift_action = self.plan_lift_action()
        sequence.append(('lift', lift_action))

        # 4. Move to target
        move_action = self.plan_move_action(target_pose)
        sequence.append(('move', move_action))

        # 5. Place object
        place_action = self.plan_place_action(target_pose)
        sequence.append(('place', place_action))

        # 6. Release object
        release_action = self.plan_release_action()
        sequence.append(('release', release_action))

        # 7. Retract
        retract_action = self.plan_retract_action()
        sequence.append(('retract', retract_action))

        return sequence

    def plan_reach_action(self, target_pose):
        """Plan reaching action to target pose"""
        # This would involve inverse kinematics
        # For simplicity, returning a direct movement command
        return {
            'target_position': target_pose[:3],
            'target_orientation': target_pose[3:],
            'speed': 0.2  # m/s
        }

    def plan_grasp_action(self, object_pose):
        """Plan grasping action for object"""
        # Determine appropriate grasp based on object properties
        grasp_type = self.select_grasp_type(object_pose)

        return {
            'grasp_type': grasp_type,
            'gripper_width': 0.05,  # Adjust based on object size
            'gripper_force': 20.0,
            'approach_direction': [0, 0, -1]  # Approach from above
        }

    def select_grasp_type(self, object_pose):
        """Select appropriate grasp type based on object"""
        # This would analyze object shape, size, and orientation
        # For simplicity, returning a power grasp
        return 'power_grasp'
```

## Action Space Evaluation and Validation

### Action Space Quality Metrics

Evaluating the effectiveness of action spaces:

```python
class ActionSpaceEvaluator:
    def __init__(self, action_space, environment):
        self.action_space = action_space
        self.environment = environment

    def evaluate_expressiveness(self):
        """
        Evaluate how well the action space can represent needed behaviors
        """
        # Measure the range of behaviors achievable with the action space
        behaviors = self.generate_behavior_coverage()
        expressiveness_score = len(behaviors) / self.maximum_possible_behaviors()

        return expressiveness_score

    def evaluate_controllability(self):
        """
        Evaluate how precisely actions can control the robot
        """
        # Test precision of control for critical tasks
        precision_tests = [
            self.test_positioning_precision(),
            self.test_orientation_precision(),
            self.test_force_control_precision()
        ]

        controllability_score = sum(precision_tests) / len(precision_tests)
        return controllability_score

    def evaluate_efficiency(self):
        """
        Evaluate action space efficiency (how many actions needed for tasks)
        """
        # Measure average number of actions needed to complete common tasks
        task_complexities = self.measure_task_complexities()
        efficiency_score = 1.0 / (1.0 + np.mean(task_complexities))

        return efficiency_score

    def generate_behavior_coverage(self):
        """Generate set of achievable behaviors"""
        behaviors = set()

        # Sample random actions and observe resulting behaviors
        for _ in range(1000):
            action = self.action_space.sample()
            behavior = self.environment.execute_action(action)
            behaviors.add(behavior.signature())

        return behaviors

    def maximum_possible_behaviors(self):
        """Estimate maximum possible behaviors for the environment"""
        # This is environment-specific
        # For a mobile robot, might be based on configuration space
        return 10000  # Placeholder

    def test_positioning_precision(self):
        """Test precision of position control"""
        target_positions = [
            [0.1, 0.1, 0.0],
            [0.5, 0.5, 0.0],
            [-0.2, 0.3, 0.0]
        ]

        errors = []
        for target in target_positions:
            achieved = self.environment.move_to_position(target)
            error = np.linalg.norm(np.array(target) - np.array(achieved))
            errors.append(error)

        # Return inverse of average error (higher is better)
        return 1.0 / (1.0 + np.mean(errors))

    def measure_task_complexities(self):
        """Measure complexity of common tasks"""
        tasks = [
            'move_forward_1m',
            'turn_90_degrees',
            'grasp_object',
            'navigate_to_location'
        ]

        complexities = []
        for task in tasks:
            complexity = self.measure_task_complexity(task)
            complexities.append(complexity)

        return complexities

    def measure_task_complexity(self, task):
        """Measure how many actions are needed for a task"""
        # This would run the task and count actions
        # For simplicity, returning placeholder values
        task_action_counts = {
            'move_forward_1m': 10,
            'turn_90_degrees': 5,
            'grasp_object': 8,
            'navigate_to_location': 15
        }

        return task_action_counts.get(task, 10)
```

## Summary

Action spaces in VLA systems serve as the critical interface between multimodal understanding and physical execution. The design of these spaces significantly impacts the capabilities and performance of robotic systems. Effective action spaces must balance expressiveness with controllability, allowing robots to execute complex tasks while maintaining precision in their movements.

The choice of action space - whether discrete, continuous, or hybrid - depends on the specific requirements of the robotic application. For humanoid robots, specialized action spaces that account for complex kinematics and dynamics are essential for achieving natural and effective behavior.

## Key Takeaways

- Action spaces define the interface between VLA understanding and robot execution
- Discrete, continuous, and hybrid action spaces each have specific use cases
- Vision-grounded action selection improves task execution accuracy
- Hierarchical action spaces separate high-level planning from low-level control
- Humanoid robots require specialized action spaces accounting for complex kinematics
- Action space evaluation ensures effective robot performance
- Adaptation mechanisms allow action spaces to work across different environments
- Quality metrics help optimize action space design for specific tasks