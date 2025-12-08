---
sidebar_position: 10
title: "Submodule 3: rclpy and Python Agents"
---

# Submodule 3: rclpy and Python Agents

## Introduction to rclpy

rclpy is the Python client library for ROS 2, providing a Pythonic interface to the ROS 2 middleware. It allows Python developers to create ROS 2 nodes, publish and subscribe to topics, provide and call services, and interact with the ROS 2 ecosystem using familiar Python idioms.

For humanoid robotics development, rclpy is particularly valuable because Python's ease of use and rich ecosystem of scientific computing libraries make it ideal for rapid prototyping, AI integration, and high-level control systems.

## Understanding rclpy Architecture

### The rclpy Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        Application Layer                    │
│                    (User Python Code)                       │
├─────────────────────────────────────────────────────────────┤
│                        rclpy Layer                          │
│                 (Python ROS 2 Bindings)                     │
├─────────────────────────────────────────────────────────────┤
│                        rcl Layer                            │
│              (ROS Client Library - C)                       │
├─────────────────────────────────────────────────────────────┤
│                        DDS Layer                            │
│              (Data Distribution Service)                    │
└─────────────────────────────────────────────────────────────┘
```

### Key Components of rclpy

**Node**: The fundamental unit of computation in ROS 2
- Encapsulates publishers, subscribers, services, and timers
- Provides logging, parameter management, and lifecycle management
- Serves as the entry point for ROS 2 functionality

**Entity Classes**: Communication primitives
- Publisher: For publishing messages to topics
- Subscriber: For subscribing to messages from topics
- Client: For calling services
- Server: For providing services
- ActionClient: For calling actions
- ActionServer: For providing actions

## Setting Up rclpy

### Installation and Environment

rclpy is typically installed as part of a ROS 2 distribution. To use it in your Python projects:

```python
import rclpy
from rclpy.node import Node
```

### Basic Initialization Pattern

```python
import rclpy
from rclpy.node import Node

def main(args=None):
    # Initialize the ROS 2 client library
    rclpy.init(args=args)

    try:
        # Create your node
        my_node = MyNodeClass()

        # Keep the node spinning (processing callbacks)
        rclpy.spin(my_node)

    except KeyboardInterrupt:
        pass
    finally:
        # Clean up resources
        my_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Creating Nodes with rclpy

### Basic Node Structure

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class BasicNode(Node):
    def __init__(self):
        # Call parent constructor with node name
        super().__init__('basic_node')

        # Create a publisher
        self.publisher = self.create_publisher(String, 'topic_name', 10)

        # Create a timer
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)

        # Log a message
        self.get_logger().info('BasicNode has been initialized')

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World'
        self.publisher.publish(msg)
        self.get_logger().info(f'Published: {msg.data}')

def main(args=None):
    rclpy.init(args=args)

    node = BasicNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Advanced Node Features

**Parameter Management**
```python
class ParameterNode(Node):
    def __init__(self):
        super().__init__('parameter_node')

        # Declare parameters with default values
        self.declare_parameter('robot_name', 'default_robot')
        self.declare_parameter('max_velocity', 1.0)
        self.declare_parameter('debug_mode', False)

        # Get parameter values
        self.robot_name = self.get_parameter('robot_name').value
        self.max_velocity = self.get_parameter('max_velocity').value
        self.debug_mode = self.get_parameter('debug_mode').value

        # Add parameter callback for dynamic changes
        self.add_on_set_parameters_callback(self.parameters_callback)

    def parameters_callback(self, params):
        """Callback for parameter changes"""
        for param in params:
            if param.name == 'max_velocity' and param.type_ == Parameter.Type.DOUBLE:
                self.max_velocity = param.value
                self.get_logger().info(f'Max velocity updated to {param.value}')

        return SetParametersResult(successful=True)
```

**Timer Management**
```python
class TimedNode(Node):
    def __init__(self):
        super().__init__('timed_node')

        # Multiple timers with different frequencies
        self.high_freq_timer = self.create_timer(0.01, self.high_freq_callback)  # 100 Hz
        self.med_freq_timer = self.create_timer(0.1, self.med_freq_callback)     # 10 Hz
        self.low_freq_timer = self.create_timer(1.0, self.low_freq_callback)     # 1 Hz

    def high_freq_callback(self):
        # High-frequency control loop
        pass

    def med_freq_callback(self):
        # Medium-frequency monitoring
        pass

    def low_freq_callback(self):
        # Low-frequency housekeeping
        pass
```

## Topic Communication with rclpy

### Publishers

Creating publishers with various message types:

```python
from std_msgs.msg import String, Int32, Float64
from sensor_msgs.msg import JointState, Imu
from geometry_msgs.msg import Twist, Pose
from builtin_interfaces.msg import Time

class PublisherNode(Node):
    def __init__(self):
        super().__init__('publisher_node')

        # Different publishers for different message types
        self.string_pub = self.create_publisher(String, 'status', 10)
        self.joint_state_pub = self.create_publisher(JointState, 'joint_states', 10)
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)

        # Timer to publish messages
        self.timer = self.create_timer(0.1, self.publish_messages)

        # Initialize joint names for humanoid robot
        self.joint_names = [
            'left_hip_joint', 'left_knee_joint', 'left_ankle_joint',
            'right_hip_joint', 'right_knee_joint', 'right_ankle_joint',
            'left_shoulder_joint', 'left_elbow_joint', 'right_shoulder_joint', 'right_elbow_joint'
        ]

    def publish_messages(self):
        # Publish joint states
        joint_msg = JointState()
        joint_msg.name = self.joint_names
        joint_msg.position = [0.0] * len(self.joint_names)  # Initialize with zeros
        joint_msg.header.stamp = self.get_clock().now().to_msg()
        joint_msg.header.frame_id = 'base_link'

        self.joint_state_pub.publish(joint_msg)

        # Publish velocity command
        cmd_msg = Twist()
        cmd_msg.linear.x = 0.5  # Move forward
        cmd_msg.angular.z = 0.1  # Turn slightly
        self.cmd_vel_pub.publish(cmd_msg)
```

### Subscribers

Creating subscribers with different callback patterns:

```python
class SubscriberNode(Node):
    def __init__(self):
        super().__init__('subscriber_node')

        # Subscribe to various topics
        self.cmd_vel_sub = self.create_subscription(
            Twist, 'cmd_vel', self.cmd_vel_callback, 10
        )
        self.joint_state_sub = self.create_subscription(
            JointState, 'joint_states', self.joint_state_callback, 10
        )
        self.imu_sub = self.create_subscription(
            Imu, 'imu/data', self.imu_callback, 10
        )

        # Store received data
        self.current_cmd_vel = Twist()
        self.current_joint_states = JointState()
        self.current_imu_data = Imu()

    def cmd_vel_callback(self, msg):
        self.current_cmd_vel = msg
        self.get_logger().info(
            f'Received velocity command: {msg.linear.x}, {msg.angular.z}'
        )

    def joint_state_callback(self, msg):
        self.current_joint_states = msg
        if msg.name:
            self.get_logger().debug(f'Received {len(msg.name)} joint states')

    def imu_callback(self, msg):
        self.current_imu_data = msg
        self.get_logger().debug(f'IMU orientation: {msg.orientation}')
```

### Advanced Topic Features

**Message Filtering and Synchronization**
```python
from message_filters import ApproximateTimeSynchronizer, Subscriber
import rclpy.time

class SynchronizedNode(Node):
    def __init__(self):
        super().__init__('synchronized_node')

        # Create subscribers
        self.imu_sub = Subscriber(self, Imu, '/imu/data')
        self.odom_sub = Subscriber(self, Odometry, '/odom')
        self.scan_sub = Subscriber(self, LaserScan, '/scan')

        # Synchronize messages based on timestamps
        self.ats = ApproximateTimeSynchronizer(
            [self.imu_sub, self.odom_sub, self.scan_sub],
            queue_size=10,
            slop=0.1  # Allow 100ms difference in timestamps
        )
        self.ats.registerCallback(self.synchronized_callback)

    def synchronized_callback(self, imu_msg, odom_msg, scan_msg):
        # Process synchronized sensor data
        self.get_logger().info('Received synchronized sensor data')
        # Implement sensor fusion logic here
```

## Service Communication with rclpy

### Service Servers

Creating service servers for humanoid robot control:

```python
from example_interfaces.srv import SetBool, Trigger
from control_msgs.srv import QueryTrajectoryState

class RobotServiceServer(Node):
    def __init__(self):
        super().__init__('robot_service_server')

        # Create various services
        self.enable_service = self.create_service(
            SetBool, 'enable_robot', self.enable_callback
        )
        self.reset_service = self.create_service(
            Trigger, 'reset_robot', self.reset_callback
        )
        self.query_joint_service = self.create_service(
            QueryTrajectoryState, 'query_joint_state', self.query_joint_callback
        )

        self.robot_enabled = False

    def enable_callback(self, request, response):
        self.robot_enabled = request.data
        response.success = True
        response.message = f'Robot {"enabled" if self.robot_enabled else "disabled"}'
        self.get_logger().info(response.message)
        return response

    def reset_callback(self, request, response):
        # Implement robot reset logic
        response.success = True
        response.message = 'Robot reset completed'
        self.get_logger().info(response.message)
        return response

    def query_joint_callback(self, request, response):
        # Query specific joint state
        joint_name = request.name
        # In a real implementation, this would query actual joint data
        response.position = 0.0
        response.velocity = 0.0
        response.effort = 0.0
        response.success = True
        return response
```

### Service Clients

Creating service clients for remote procedure calls:

```python
class RobotServiceClient(Node):
    def __init__(self):
        super().__init__('robot_service_client')

        # Create clients for various services
        self.enable_client = self.create_client(SetBool, 'enable_robot')
        self.reset_client = self.create_client(Trigger, 'reset_robot')

        # Wait for services to be available
        self.wait_for_services()

        # Timer to periodically call services
        self.timer = self.create_timer(5.0, self.call_services)

    def wait_for_services(self):
        while not self.enable_client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Enable service not available, waiting...')

        while not self.reset_client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Reset service not available, waiting...')

    def call_services(self):
        # Call enable service
        enable_request = SetBool.Request()
        enable_request.data = True

        future = self.enable_client.call_async(enable_request)
        future.add_done_callback(self.enable_response_callback)

    def enable_response_callback(self, future):
        try:
            response = future.result()
            self.get_logger().info(f'Enable service response: {response.message}')
        except Exception as e:
            self.get_logger().error(f'Service call failed: {e}')
```

## Action Communication with rclpy

### Action Servers

Actions are used for long-running operations with feedback:

```python
from rclpy.action import ActionServer, GoalResponse, CancelResponse
from rclpy.callback_groups import ReentrantCallbackGroup
from control_msgs.action import FollowJointTrajectory
from trajectory_msgs.msg import JointTrajectoryPoint

class JointTrajectoryActionServer(Node):
    def __init__(self):
        super().__init__('joint_trajectory_action_server')

        # Use reentrant callback group to handle multiple requests
        callback_group = ReentrantCallbackGroup()

        self._action_server = ActionServer(
            self,
            FollowJointTrajectory,
            'joint_trajectory_action',
            execute_callback=self.execute_trajectory,
            goal_callback=self.goal_callback,
            cancel_callback=self.cancel_callback,
            callback_group=callback_group
        )

    def goal_callback(self, goal_request):
        """Accept or reject a client request to begin an action."""
        # Validate the goal
        if len(goal_request.trajectory.points) == 0:
            return GoalResponse.REJECT
        return GoalResponse.ACCEPT

    def cancel_callback(self, goal_handle):
        """Accept or reject a client request to cancel an action."""
        self.get_logger().info('Received cancel request')
        return CancelResponse.ACCEPT

    def execute_trajectory(self, goal_handle):
        """Execute the joint trajectory."""
        self.get_logger().info('Executing joint trajectory...')

        feedback_msg = FollowJointTrajectory.Feedback()
        result = FollowJointTrajectory.Result()

        trajectory = goal_handle.request.trajectory
        n_points = len(trajectory.points)

        for i, point in enumerate(trajectory.points):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                result.error_code = -1
                result.error_string = 'Goal canceled'
                return result

            # In a real implementation, this would command the joints
            # For simulation, we'll just sleep
            time.sleep(0.1)

            # Publish feedback
            feedback_msg.actual.positions = point.positions
            feedback_msg.desired = point
            feedback_msg.error.positions = [0.0] * len(point.positions)

            goal_handle.publish_feedback(feedback_msg)

            # Log progress
            percentage = (i + 1) / n_points * 100
            self.get_logger().debug(f'Trajectory progress: {percentage:.1f}%')

        goal_handle.succeed()
        result.error_code = 0
        result.error_string = 'Trajectory completed successfully'
        return result
```

### Action Clients

```python
from rclpy.action import ActionClient
from control_msgs.action import FollowJointTrajectory

class JointTrajectoryActionClient(Node):
    def __init__(self):
        super().__init__('joint_trajectory_action_client')

        self._action_client = ActionClient(
            self,
            FollowJointTrajectory,
            'joint_trajectory_action'
        )

    def send_goal(self, joint_names, positions_list, time_from_start_list):
        """Send a joint trajectory goal."""
        goal_msg = FollowJointTrajectory.Goal()

        # Build trajectory message
        goal_msg.trajectory.joint_names = joint_names

        for positions, time_from_start in zip(positions_list, time_from_start_list):
            point = JointTrajectoryPoint()
            point.positions = positions
            point.time_from_start.sec = int(time_from_start)
            point.time_from_start.nanosec = int((time_from_start % 1) * 1e9)
            goal_msg.trajectory.points.append(point)

        self._action_client.wait_for_server()

        # Send goal and return future
        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )

        self._send_goal_future.add_done_callback(self.goal_response_callback)

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().info('Goal rejected')
            return

        self.get_logger().info('Goal accepted')
        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.get_result_callback)

    def feedback_callback(self, feedback_msg):
        self.get_logger().debug('Received feedback')
        # Process feedback as needed

    def get_result_callback(self, future):
        result = future.result().result
        self.get_logger().info(f'Result: {result.error_string}')
```

## Python Agents for Humanoid Control

### High-Level Behavior Agents

Python agents can implement complex behaviors for humanoid robots:

```python
import numpy as np
from geometry_msgs.msg import Pose, Point, Quaternion
from std_msgs.msg import Bool

class WalkingAgent(Node):
    def __init__(self):
        super().__init__('walking_agent')

        # Publishers for walking commands
        self.step_pub = self.create_publisher(Pose, 'step_command', 10)
        self.balance_pub = self.create_publisher(Bool, 'balance_enable', 10)

        # Subscribers for sensor feedback
        self.imu_sub = self.create_subscription(Imu, 'imu/data', self.imu_callback, 10)

        # Timer for walking control
        self.walk_timer = self.create_timer(0.02, self.walk_control)  # 50 Hz

        # Walking state
        self.is_walking = False
        self.step_count = 0
        self.balance_enabled = True

        # Walking parameters
        self.step_length = 0.3  # meters
        self.step_height = 0.05  # meters
        self.step_duration = 1.0  # seconds

    def start_walking(self):
        """Start the walking behavior."""
        self.is_walking = True
        self.get_logger().info('Walking started')

    def stop_walking(self):
        """Stop the walking behavior."""
        self.is_walking = False
        self.get_logger().info('Walking stopped')

    def walk_control(self):
        """Main walking control loop."""
        if not self.is_walking:
            return

        # Generate walking pattern
        step_pose = self.generate_step_pose()
        self.step_pub.publish(step_pose)

    def generate_step_pose(self):
        """Generate the next step pose based on walking pattern."""
        msg = Pose()

        # Calculate step position based on step count
        x_offset = self.step_count * self.step_length
        y_offset = (self.step_count % 2) * 0.2  # Alternate feet

        msg.position = Point(x=x_offset, y=y_offset, z=self.step_height)
        msg.orientation = Quaternion(w=1.0, x=0.0, y=0.0, z=0.0)

        self.step_count += 1
        return msg

    def imu_callback(self, msg):
        """Handle IMU data for balance control."""
        # Extract orientation from IMU
        orientation = msg.orientation
        # Implement balance correction based on IMU data
        self.correct_balance(orientation)

    def correct_balance(self, orientation):
        """Adjust walking to maintain balance based on IMU data."""
        # Calculate orientation error
        # Implement balance correction algorithm
        pass
```

### AI Integration Agents

Integrating AI models with humanoid control:

```python
import tensorflow as tf
import numpy as np
from sensor_msgs.msg import JointState
from geometry_msgs.msg import Twist

class AIControlAgent(Node):
    def __init__(self):
        super().__init__('ai_control_agent')

        # Subscribe to sensor data
        self.joint_sub = self.create_subscription(
            JointState, 'joint_states', self.joint_callback, 10
        )
        self.imu_sub = self.create_subscription(
            Imu, 'imu/data', self.imu_callback, 10
        )

        # Publish control commands
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)

        # Load AI model
        self.load_ai_model()

        # Timer for AI control
        self.ai_timer = self.create_timer(0.1, self.ai_control_loop)

        # Sensor data storage
        self.current_joint_state = JointState()
        self.current_imu_data = Imu()
        self.ai_model = None

    def load_ai_model(self):
        """Load the pre-trained AI model."""
        try:
            # Load a pre-trained model
            # In practice, this would load your specific model
            self.ai_model = tf.keras.models.load_model('walking_policy.h5')
            self.get_logger().info('AI model loaded successfully')
        except Exception as e:
            self.get_logger().error(f'Failed to load AI model: {e}')
            # Fallback to manual control
            self.ai_model = None

    def ai_control_loop(self):
        """Main AI control loop."""
        if self.ai_model is None:
            return

        # Prepare input data from sensors
        input_data = self.prepare_sensor_input()

        # Get AI control output
        control_output = self.ai_model.predict(input_data)

        # Convert to ROS message and publish
        cmd_vel = self.convert_to_cmd_vel(control_output)
        self.cmd_vel_pub.publish(cmd_vel)

    def prepare_sensor_input(self):
        """Prepare sensor data for AI model input."""
        # Extract relevant sensor data
        joint_positions = np.array(self.current_joint_state.position)
        imu_orientation = [
            self.current_imu_data.orientation.x,
            self.current_imu_data.orientation.y,
            self.current_imu_data.orientation.z,
            self.current_imu_data.orientation.w
        ]

        # Combine sensor data into model input format
        input_vector = np.concatenate([joint_positions, imu_orientation])

        # Reshape for model input
        return input_vector.reshape(1, -1)

    def convert_to_cmd_vel(self, control_output):
        """Convert AI model output to Twist message."""
        cmd_vel = Twist()
        cmd_vel.linear.x = float(control_output[0][0])  # Forward velocity
        cmd_vel.angular.z = float(control_output[0][1])  # Turn rate
        return cmd_vel

    def joint_callback(self, msg):
        """Store joint state data."""
        self.current_joint_state = msg

    def imu_callback(self, msg):
        """Store IMU data."""
        self.current_imu_data = msg
```

## Advanced rclpy Features

### Custom Message Types

Creating and using custom message types:

```python
# Assuming we have a custom message HumanoidStatus.msg
# int32 battery_level
# float32 balance_score
# string current_behavior
# geometry_msgs/Point center_of_mass

from my_robot_msgs.msg import HumanoidStatus

class StatusPublisher(Node):
    def __init__(self):
        super().__init__('status_publisher')
        self.status_pub = self.create_publisher(HumanoidStatus, 'humanoid_status', 10)
        self.timer = self.create_timer(0.5, self.publish_status)

    def publish_status(self):
        msg = HumanoidStatus()
        msg.battery_level = 85
        msg.balance_score = 0.95  # Good balance
        msg.current_behavior = 'walking'
        msg.center_of_mass.x = 0.1
        msg.center_of_mass.y = 0.0
        msg.center_of_mass.z = 0.8
        self.status_pub.publish(msg)
```

### Lifecycle Nodes

For more robust node management:

```python
from rclpy.lifecycle import LifecycleNode, LifecycleState
from rclpy.lifecycle import TransitionCallbackReturn

class LifecycleHumanoidNode(LifecycleNode):
    def __init__(self):
        super().__init__('lifecycle_humanoid_node')

        # Initialize components that will be created in on_configure
        self.publisher = None
        self.subscriber = None
        self.timer = None

    def on_configure(self, state):
        """Called when node is configured."""
        self.get_logger().info('Configuring...')

        # Create publishers, subscribers, timers
        self.publisher = self.create_publisher(String, 'status', 10)
        self.subscriber = self.create_subscription(
            String, 'commands', self.command_callback, 10
        )
        self.timer = self.create_timer(1.0, self.timer_callback)

        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state):
        """Called when node is activated."""
        self.get_logger().info('Activating...')
        # Activate publishers and subscribers
        self.publisher.on_activate()
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state):
        """Called when node is deactivated."""
        self.get_logger().info('Deactivating...')
        # Deactivate publishers and subscribers
        self.publisher.on_deactivate()
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state):
        """Called when node is cleaned up."""
        self.get_logger().info('Cleaning up...')
        # Destroy components
        self.destroy_publisher(self.publisher)
        self.destroy_subscription(self.subscriber)
        self.destroy_timer(self.timer)
        return TransitionCallbackReturn.SUCCESS

    def command_callback(self, msg):
        self.get_logger().info(f'Received command: {msg.data}')

    def timer_callback(self):
        msg = String()
        msg.data = 'Active'
        self.publisher.publish(msg)
```

## Best Practices for rclpy Development

### Error Handling and Robustness

```python
class RobustNode(Node):
    def __init__(self):
        super().__init__('robust_node')

        # Use try-catch for potentially failing operations
        try:
            self.setup_components()
        except Exception as e:
            self.get_logger().error(f'Failed to setup components: {e}')
            # Implement fallback or graceful degradation

    def setup_components(self):
        """Setup node components with error handling."""
        # Setup publishers
        try:
            self.pub = self.create_publisher(String, 'topic', 10)
        except Exception as e:
            self.get_logger().error(f'Failed to create publisher: {e}')
            raise

        # Setup subscribers
        try:
            self.sub = self.create_subscription(
                String, 'topic', self.callback, 10
            )
        except Exception as e:
            self.get_logger().error(f'Failed to create subscriber: {e}')
            raise

    def callback(self, msg):
        """Robust callback with error handling."""
        try:
            # Process message
            self.process_message(msg)
        except Exception as e:
            self.get_logger().error(f'Error processing message: {e}')
            # Continue operation, don't crash the node
```

### Memory Management

```python
class MemoryEfficientNode(Node):
    def __init__(self):
        super().__init__('memory_efficient_node')

        # Pre-allocate messages to reduce allocation overhead
        self.msg_cache = String()
        self.joint_msg_cache = JointState()

        self.timer = self.create_timer(0.1, self.efficient_publish)

    def efficient_publish(self):
        """Use cached message objects to reduce allocations."""
        # Reuse existing message object
        self.msg_cache.data = f'Message at {self.get_clock().now().nanoseconds}'
        self.publisher.publish(self.msg_cache)
```

## Integration with Humanoid Robot Systems

### Bridge Between Python Agents and ROS Controllers

```python
class PythonROSBridge(Node):
    def __init__(self):
        super().__init__('python_ros_bridge')

        # Subscribe to high-level commands from Python agents
        self.high_level_cmd_sub = self.create_subscription(
            String, 'high_level_commands', self.high_level_callback, 10
        )

        # Publish to low-level ROS controllers
        self.low_level_cmd_pub = self.create_publisher(
            JointTrajectory, 'joint_trajectory_controller/command', 10
        )

        # Service client for robot status
        self.status_client = self.create_client(
            Trigger, 'robot_status'
        )

    def high_level_callback(self, msg):
        """Convert high-level commands to low-level ROS messages."""
        command = msg.data

        if command == 'walk_forward':
            trajectory = self.create_walk_trajectory()
            self.low_level_cmd_pub.publish(trajectory)
        elif command == 'turn_left':
            trajectory = self.create_turn_trajectory(-0.5)
            self.low_level_cmd_pub.publish(trajectory)
        elif command == 'stop':
            trajectory = self.create_stop_trajectory()
            self.low_level_cmd_pub.publish(trajectory)

    def create_walk_trajectory(self):
        """Create a walking trajectory."""
        trajectory = JointTrajectory()
        # Implementation for walking trajectory
        return trajectory

    def create_turn_trajectory(self, angle):
        """Create a turning trajectory."""
        trajectory = JointTrajectory()
        # Implementation for turning trajectory
        return trajectory

    def create_stop_trajectory(self):
        """Create a stopping trajectory."""
        trajectory = JointTrajectory()
        # Implementation for stopping trajectory
        return trajectory
```

## Summary

rclpy provides the Python interface to ROS 2, enabling Python developers to create sophisticated robotic applications. Its integration with Python's rich ecosystem makes it ideal for AI integration, rapid prototyping, and high-level control systems in humanoid robotics.

Understanding rclpy's features—from basic nodes and topics to advanced services and actions—enables the development of robust, maintainable robotic systems. The combination of Python's ease of use with ROS 2's powerful communication infrastructure provides a solid foundation for humanoid robot control systems.

## Key Takeaways

- rclpy is the Python client library for ROS 2 with a Pythonic interface
- Nodes, topics, services, and actions form the communication backbone
- Parameter management enables runtime configuration
- Quality of service settings control communication behavior
- Python's ecosystem enables AI integration in robotic systems
- Best practices include error handling, memory management, and lifecycle management
- rclpy is essential for bridging Python agents to ROS controllers in humanoid robots