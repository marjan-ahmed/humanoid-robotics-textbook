---
sidebar_position: 9
title: "Submodule 2: Nodes, Topics, and Services"
---

# Submodule 2: Nodes, Topics, and Services

## Understanding ROS 2 Communication Primitives

ROS 2 provides three primary communication mechanisms that enable different components of a robot to work together: nodes, topics, and services. These primitives form the foundation of all robotic communication in ROS 2 and are essential for creating complex robotic systems like humanoid robots.

Understanding how to effectively use these communication primitives is crucial for developing robust and maintainable robotic applications.

## Nodes: The Computational Building Blocks

### What is a Node?

A node is the fundamental unit of computation in ROS 2. It's a process that performs computation and communicates with other nodes through topics, services, and actions. Each node typically represents a specific function within the robotic system.

### Node Creation and Lifecycle

```python
import rclpy
from rclpy.node import Node

class MyRobotNode(Node):
    def __init__(self):
        # Initialize the node with a name
        super().__init__('my_robot_node')

        # Node initialization code goes here
        self.get_logger().info('MyRobotNode has been initialized')

def main(args=None):
    rclpy.init(args=args)

    node = MyRobotNode()

    try:
        rclpy.spin(node)  # Keep node running
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Node Best Practices

**Single Responsibility**
- Each node should have one clear, well-defined purpose
- Focus on a specific task or subsystem
- Avoid creating monolithic nodes with multiple responsibilities

**Resource Management**
- Properly clean up resources when the node is destroyed
- Use context managers where appropriate
- Handle shutdown gracefully

**Logging and Diagnostics**
- Use the built-in logger for informative messages
- Provide appropriate log levels (info, warn, error, debug)
- Include relevant diagnostic information

### Node Parameters

Nodes can accept parameters for configuration:

```python
class ParameterizedNode(Node):
    def __init__(self):
        super().__init__('parameterized_node')

        # Declare parameters with default values
        self.declare_parameter('wheel_diameter', 0.1)
        self.declare_parameter('max_speed', 1.0)
        self.declare_parameter('robot_name', 'default_robot')

        # Access parameter values
        self.wheel_diameter = self.get_parameter('wheel_diameter').value
        self.max_speed = self.get_parameter('max_speed').value
        self.robot_name = self.get_parameter('robot_name').value

        # Set up parameter callback for dynamic changes
        self.add_on_set_parameters_callback(self.parameter_callback)

    def parameter_callback(self, params):
        for param in params:
            if param.name == 'max_speed' and param.type_ == Parameter.Type.DOUBLE:
                self.max_speed = param.value
                self.get_logger().info(f'Max speed updated to {param.value}')
        return SetParametersResult(successful=True)
```

## Topics: Publish-Subscribe Communication

### Topic Communication Model

Topics implement a publish-subscribe communication pattern where:

- **Publishers** send messages to a topic
- **Subscribers** receive messages from a topic
- Multiple publishers and subscribers can use the same topic
- Communication is asynchronous and non-blocking

### Creating Publishers

```python
from std_msgs.msg import String
from sensor_msgs.msg import JointState
import math

class JointStatePublisher(Node):
    def __init__(self):
        super().__init__('joint_state_publisher')

        # Create publisher for joint states
        self.publisher = self.create_publisher(JointState, '/joint_states', 10)

        # Create timer to publish at regular intervals
        timer_period = 0.05  # 20 Hz
        self.timer = self.create_timer(timer_period, self.publish_joint_states)

        # Initialize joint names and positions
        self.joint_names = ['hip_joint', 'knee_joint', 'ankle_joint']
        self.joint_positions = [0.0, 0.0, 0.0]

    def publish_joint_states(self):
        msg = JointState()
        msg.name = self.joint_names
        msg.position = self.joint_positions
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.header.frame_id = 'base_link'

        self.publisher.publish(msg)
        self.get_logger().debug(f'Published joint states: {self.joint_positions}')
```

### Creating Subscribers

```python
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan

class VelocitySubscriber(Node):
    def __init__(self):
        super().__init__('velocity_subscriber')

        # Subscribe to velocity commands
        self.subscription = self.create_subscription(
            Twist,
            '/cmd_vel',
            self.velocity_callback,
            10  # QoS depth
        )
        self.subscription  # Prevent unused variable warning

        # Store current velocity
        self.current_velocity = Twist()

    def velocity_callback(self, msg):
        self.current_velocity = msg
        self.get_logger().info(
            f'Received velocity: linear={msg.linear.x}, angular={msg.angular.z}'
        )
```

### Advanced Topic Features

**Message Filters**
```python
from message_filters import ApproximateTimeSynchronizer, Subscriber

class SensorFusionNode(Node):
    def __init__(self):
        super().__init__('sensor_fusion_node')

        # Create subscribers for multiple sensor streams
        self.imu_sub = Subscriber(self, Imu, '/imu/data')
        self.odom_sub = Subscriber(self, Odometry, '/odom')

        # Synchronize messages based on timestamps
        ats = ApproximateTimeSynchronizer(
            [self.imu_sub, self.odom_sub],
            queue_size=10,
            slop=0.1
        )
        ats.registerCallback(self.sensors_callback)

    def sensors_callback(self, imu_msg, odom_msg):
        # Process synchronized sensor data
        self.get_logger().info('Received synchronized sensor data')
```

**Latching Topics**
```python
# For topics where late-joining subscribers should receive the last message
latched_qos = QoSProfile(
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    history=HistoryPolicy.KEEP_LAST,
    depth=1
)

latched_publisher = self.create_publisher(String, 'important_status', latched_qos)
```

## Services: Request-Response Communication

### Service Communication Model

Services implement a synchronous request-response pattern where:

- A **service client** sends a request to a **service server**
- The server processes the request and sends back a response
- The client waits for the response (blocking call)
- Useful for operations that have a clear request-response pattern

### Creating Service Servers

```python
from example_interfaces.srv import AddTwoInts

class AddService(Node):
    def __init__(self):
        super().__init__('add_service')

        # Create service server
        self.srv = self.create_service(
            AddTwoInts,
            'add_two_ints',
            self.add_callback
        )

    def add_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'{request.a} + {request.b} = {response.sum}')
        return response

def main(args=None):
    rclpy.init(args=args)
    node = AddService()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()
```

### Creating Service Clients

```python
class AddClient(Node):
    def __init__(self):
        super().__init__('add_client')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')

        # Wait for service to be available
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting again...')

        self.request = AddTwoInts.Request()

    def send_request(self, a, b):
        self.request.a = a
        self.request.b = b
        self.future = self.cli.call_async(self.request)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()
```

### Asynchronous Service Calls

```python
class AsyncAddClient(Node):
    def __init__(self):
        super().__init__('async_add_client')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')

        # Timer to send requests periodically
        self.timer = self.create_timer(1.0, self.send_async_request)
        self.count = 0

    def send_async_request(self):
        if not self.cli.service_is_ready():
            return

        request = AddTwoInts.Request()
        request.a = self.count
        request.b = self.count + 1

        future = self.cli.call_async(request)
        future.add_done_callback(self.service_response_callback)
        self.count += 1

    def service_response_callback(self, future):
        try:
            response = future.result()
            self.get_logger().info(f'Result: {response.sum}')
        except Exception as e:
            self.get_logger().error(f'Service call failed: {e}')
```

## Quality of Service (QoS) for Communication

### QoS Policies

Different types of communication require different QoS policies:

**For Sensor Data**
```python
# Sensor data where some messages can be dropped
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    durability=DurabilityPolicy.VOLATILE,
    history=HistoryPolicy.KEEP_LAST,
    depth=5
)
```

**For Critical Commands**
```python
# Critical commands that must be delivered
command_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.VOLATILE,
    history=HistoryPolicy.KEEP_LAST,
    depth=1
)
```

**For Configuration Data**
```python
# Configuration data that should be available to late joiners
config_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    history=HistoryPolicy.KEEP_LAST,
    depth=1
)
```

## Practical Examples in Humanoid Robotics

### Joint Control System

```python
from sensor_msgs.msg import JointState
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint
from control_msgs.srv import QueryTrajectoryState

class JointController(Node):
    def __init__(self):
        super().__init__('joint_controller')

        # Subscribe to joint commands
        self.joint_cmd_sub = self.create_subscription(
            JointTrajectory,
            '/joint_trajectory',
            self.joint_trajectory_callback,
            10
        )

        # Publish joint states
        self.joint_state_pub = self.create_publisher(
            JointState,
            '/joint_states',
            10
        )

        # Service for querying joint state
        self.query_service = self.create_service(
            QueryTrajectoryState,
            '/query_joint_state',
            self.query_joint_state_callback
        )

        # Timer for publishing joint states
        self.timer = self.create_timer(0.01, self.publish_joint_states)  # 100 Hz

        # Joint state storage
        self.current_joint_positions = {}

    def joint_trajectory_callback(self, msg):
        # Process joint trajectory commands
        for point in msg.points:
            # Send commands to hardware
            self.send_joint_commands(point.positions)

    def publish_joint_states(self):
        msg = JointState()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.name = list(self.current_joint_positions.keys())
        msg.position = list(self.current_joint_positions.values())

        self.joint_state_pub.publish(msg)

    def query_joint_state_callback(self, request, response):
        # Return current joint state for specific joint
        joint_name = request.name
        if joint_name in self.current_joint_positions:
            response.position = self.current_joint_positions[joint_name]
            response.velocity = 0.0  # Simplified
            response.effort = 0.0    # Simplified
            response.success = True
        else:
            response.success = False
        return response
```

### Sensor Fusion System

```python
from sensor_msgs.msg import Imu, LaserScan, PointCloud2
from geometry_msgs.msg import PoseWithCovarianceStamped
from tf2_msgs.msg import TFMessage

class SensorFusionNode(Node):
    def __init__(self):
        super().__init__('sensor_fusion')

        # Subscribe to multiple sensor streams
        self.imu_sub = self.create_subscription(
            Imu, '/imu/data', self.imu_callback, 10
        )
        self.scan_sub = self.create_subscription(
            LaserScan, '/scan', self.scan_callback, 10
        )
        self.odom_sub = self.create_subscription(
            Odometry, '/odom', self.odom_callback, 10
        )

        # Publish fused sensor data
        self.pose_pub = self.create_publisher(
            PoseWithCovarianceStamped, '/fused_pose', 10
        )

        # Store sensor data
        self.imu_data = None
        self.scan_data = None
        self.odom_data = None

    def imu_callback(self, msg):
        self.imu_data = msg
        self.fuse_sensor_data()

    def scan_callback(self, msg):
        self.scan_data = msg
        self.fuse_sensor_data()

    def odom_callback(self, msg):
        self.odom_data = msg
        self.fuse_sensor_data()

    def fuse_sensor_data(self):
        # Implement sensor fusion algorithm
        if self.imu_data and self.odom_data:
            # Create fused pose estimate
            fused_pose = self.create_fused_pose()
            self.pose_pub.publish(fused_pose)
```

## Communication Patterns and Design Patterns

### Publisher-Subscriber Pattern

The most common pattern in ROS 2:

```python
# Publisher
class DataProducer(Node):
    def __init__(self):
        super().__init__('data_producer')
        self.pub = self.create_publisher(String, 'data_topic', 10)
        self.timer = self.create_timer(0.1, self.publish_data)

    def publish_data(self):
        msg = String()
        msg.data = f'Data at {self.get_clock().now().nanoseconds}'
        self.pub.publish(msg)

# Subscriber
class DataConsumer(Node):
    def __init__(self):
        super().__init__('data_consumer')
        self.sub = self.create_subscription(
            String, 'data_topic', self.data_callback, 10
        )

    def data_callback(self, msg):
        self.get_logger().info(f'Received: {msg.data}')
```

### Client-Server Pattern

For request-response communication:

```python
# Server
class CalculationServer(Node):
    def __init__(self):
        super().__init__('calculation_server')
        self.srv = self.create_service(
            CustomCalculation, 'calculate', self.calc_callback
        )

    def calc_callback(self, request, response):
        # Perform calculation
        response.result = request.input * 2  # Example calculation
        return response

# Client
class CalculationClient(Node):
    def __init__(self):
        super().__init__('calculation_client')
        self.cli = self.create_client(CustomCalculation, 'calculate')

    def make_request(self, input_value):
        request = CustomCalculation.Request()
        request.input = input_value
        future = self.cli.call_async(request)
        return future
```

### Event-Driven Architecture

Using topics for event notification:

```python
from std_msgs.msg import Bool

class EventDrivenSystem(Node):
    def __init__(self):
        super().__init__('event_system')

        # Publishers for different events
        self.error_pub = self.create_publisher(Bool, 'system_error', 10)
        self.warning_pub = self.create_publisher(Bool, 'system_warning', 10)
        self.status_pub = self.create_publisher(String, 'system_status', 10)

        # Subscribers for event responses
        self.emergency_sub = self.create_subscription(
            Bool, 'emergency_stop', self.emergency_callback, 10
        )

    def check_system_status(self):
        # Check for various conditions
        if self.detect_error():
            error_msg = Bool()
            error_msg.data = True
            self.error_pub.publish(error_msg)
```

## Performance Considerations

### Message Efficiency

- **Minimize message size**: Only include necessary data
- **Use appropriate data types**: Choose efficient representations
- **Batch data when possible**: Reduce communication overhead
- **Consider message frequency**: Balance between responsiveness and load

### Memory Management

- **Avoid unnecessary copies**: Use references where possible
- **Pre-allocate messages**: Reduce allocation overhead
- **Monitor memory usage**: Prevent memory leaks

### Network Considerations

- **Bandwidth usage**: Consider network constraints
- **Latency requirements**: Match communication patterns to needs
- **Reliability vs. performance**: Choose appropriate QoS settings

## Debugging and Monitoring

### ROS 2 Command Line Tools

**Inspecting topics:**
```bash
# List all topics
ros2 topic list

# Echo topic data
ros2 topic echo /joint_states

# Get topic info
ros2 topic info /cmd_vel
```

**Inspecting services:**
```bash
# List all services
ros2 service list

# Call a service
ros2 service call /add_two_ints example_interfaces/srv/AddTwoInts "{a: 1, b: 2}"
```

### Built-in Monitoring

```python
class MonitoredNode(Node):
    def __init__(self):
        super().__init__('monitored_node')

        # Create diagnostic publisher
        self.diag_pub = self.create_publisher(
            DiagnosticArray, '/diagnostics', 10
        )

        # Timer for diagnostics
        self.diag_timer = self.create_timer(1.0, self.publish_diagnostics)

    def publish_diagnostics(self):
        diag_array = DiagnosticArray()
        diag_array.header.stamp = self.get_clock().now().to_msg()

        # Create diagnostic status
        status = DiagnosticStatus()
        status.name = self.get_name()
        status.level = DiagnosticStatus.OK
        status.message = "Node operating normally"

        diag_array.status.append(status)
        self.diag_pub.publish(diag_array)
```

## Summary

Nodes, topics, and services form the fundamental communication infrastructure of ROS 2. Understanding how to effectively use these primitives is essential for developing robust robotic systems, particularly for complex applications like humanoid robotics where multiple subsystems must communicate seamlessly.

The publish-subscribe pattern of topics enables efficient data streaming, while the request-response pattern of services provides synchronous communication for operations that require responses. Proper use of Quality of Service settings ensures that communication meets the requirements of different subsystems.

## Key Takeaways

- Nodes are the fundamental computational units in ROS 2
- Topics enable asynchronous publish-subscribe communication
- Services provide synchronous request-response communication
- Quality of Service settings allow fine-tuning of communication behavior
- Proper design patterns lead to maintainable robotic systems
- Performance considerations are important for real-time systems
- Debugging tools help monitor and troubleshoot communication
- These primitives are essential for humanoid robot system integration