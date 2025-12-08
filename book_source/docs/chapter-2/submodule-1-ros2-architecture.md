---
sidebar_position: 8
title: "Submodule 1: ROS 2 Architecture"
---

# Submodule 1: ROS 2 Architecture

## Introduction to ROS 2 Architecture

The architecture of ROS 2 is fundamentally different from ROS 1, primarily due to its underlying middleware. ROS 2 uses DDS (Data Distribution Service) as its communication layer, which provides a more robust, secure, and scalable foundation for robotic applications.

Understanding the ROS 2 architecture is crucial for developing effective robotic systems, especially humanoid robots that require complex coordination between multiple subsystems.

## DDS: The Foundation of ROS 2

### What is DDS?

DDS (Data Distribution Service) is a middleware standard for real-time systems. It provides a standardized interface for publish-subscribe communication with quality of service (QoS) controls, making it ideal for robotics applications.

### Why DDS for ROS 2?

- **Real-time Capabilities**: DDS provides deterministic behavior essential for robotics
- **Quality of Service**: Configurable policies for reliability, durability, and performance
- **Security**: Built-in security features for safe robot operation
- **Scalability**: Supports distributed systems with hundreds of nodes
- **Portability**: Works across different platforms and vendors

### DDS Architecture Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   Application   │    │   Application   │
│      Layer      │    │      Layer      │    │      Layer      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
┌─────────▼──────────────────────▼──────────────────────▼─────────┐
│                        DDS Middleware                        │
├──────────────────────────────────────────────────────────────┤
│  Domain Participants  │  Topics  │  Publishers/Subscribers  │
├───────────────────────┼──────────┼──────────────────────────┤
│     Discovery &       │   Data   │      Communication       │
│     Management        │ Exchange │         Layer            │
└───────────────────────┴──────────┴──────────────────────────┘
```

## ROS 2 Core Concepts

### Domain Participants

Domain participants are the top-level entities in DDS that represent applications:

- Each ROS 2 process creates a domain participant
- Domain participants discover each other automatically
- They manage the communication resources for the application
- Multiple nodes can share a single domain participant

### Nodes

Nodes are the fundamental computational units in ROS 2:

```python
import rclpy
from rclpy.node import Node

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World'
        self.publisher.publish(msg)
```

**Node Responsibilities:**
- Create publishers, subscribers, services, and actions
- Manage timers and callbacks
- Handle parameter management
- Provide logging and introspection

### Topics and Messages

Topics enable asynchronous, many-to-many communication:

**Message Types:**
- Standard types: String, Int32, Float64, etc.
- Complex types: Point, Twist, JointState, etc.
- Custom message types defined by users
- Generated from .msg files using rosidl

**Topic Communication:**
- Publishers send data to topics
- Subscribers receive data from topics
- Multiple publishers and subscribers can use the same topic
- Data flows from publishers to subscribers automatically

### Services and Actions

**Services:**
- Synchronous request-response communication
- Used for operations that return immediately
- Consist of request and response message types
- Blocking calls until response is received

**Actions:**
- Asynchronous, long-running operations
- Provide feedback during execution
- Return results when complete
- Cancelable operations

## Quality of Service (QoS) Profiles

QoS profiles allow fine-tuning communication behavior:

### Reliability Policy
- **RELIABLE**: All messages are delivered (with retries)
- **BEST_EFFORT**: Messages may be dropped, no retries

### Durability Policy
- **TRANSIENT_LOCAL**: Historical data preserved for late-joining subscribers
- **VOLATILE**: No historical data preserved

### History Policy
- **KEEP_LAST**: Maintain last N messages
- **KEEP_ALL**: Maintain all messages

### Example QoS Configuration
```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy

# For sensor data (may drop messages, keep last 10)
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    history=HistoryPolicy.KEEP_LAST,
    depth=10
)

# For critical commands (must deliver, keep all)
command_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    history=HistoryPolicy.KEEP_ALL
)
```

## ROS 2 Client Libraries

### rclcpp (C++)
The C++ client library provides:
- High-performance node implementation
- Direct access to low-level features
- Integration with existing C++ codebases
- Real-time system capabilities

### rclpy (Python)
The Python client library offers:
- Easy prototyping and development
- Integration with scientific computing libraries
- Cross-platform compatibility
- Rapid application development

### Other Languages
- **rclrs**: Rust client library
- **rclc**: C client library
- **rclnodejs**: Node.js client library
- **rcljava**: Java client library

## Namespaces and Naming

### Node Names
- Must be unique within a ROS domain
- Used for identification and debugging
- Follow ROS naming conventions (lowercase, underscores)

### Topic and Service Names
- Hierarchical naming with forward slashes
- Namespaces for organization
- Remapping for flexibility

### Examples:
```
/robot1/joint_states     # Topic in robot1 namespace
/controller/cmd_vel      # Topic in controller namespace
/tf                     # Global topic
```

## ROS 2 Launch System

The launch system manages the startup and coordination of multiple nodes:

### Launch Files
- XML or Python-based configuration
- Define nodes to launch with parameters
- Handle dependencies and conditions
- Enable easy system deployment

### Example Launch File (Python)
```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='turtlesim',
            executable='turtlesim_node',
            name='sim'
        ),
        Node(
            package='turtlesim',
            executable='turtle_teleop_key',
            name='teleop'
        )
    ])
```

## ROS 2 Parameter System

Parameters provide configuration for nodes:

### Parameter Types
- **String**: Text values
- **Integer**: Whole numbers
- **Double**: Floating-point numbers
- **Boolean**: True/false values
- **Lists**: Arrays of values

### Parameter Management
- Declarable parameters with default values
- Dynamic parameter changes during runtime
- Parameter validation and callbacks
- YAML configuration files

### Example Parameter Usage
```python
class ParameterNode(Node):
    def __init__(self):
        super().__init__('parameter_node')

        # Declare parameters with default values
        self.declare_parameter('robot_name', 'default_robot')
        self.declare_parameter('max_velocity', 1.0)

        # Access parameter values
        robot_name = self.get_parameter('robot_name').value
        max_vel = self.get_parameter('max_velocity').value
```

## ROS 2 Security Architecture

Security is built into ROS 2 from the ground up:

### Security Features
- **Authentication**: Verify node identity
- **Access Control**: Control who can publish/subscribe
- **Encryption**: Encrypt data in transit
- **Audit Logging**: Track security events

### Security Implementation
- Security files define policies
- Certificates for authentication
- Keystore for encryption keys
- Pluggable security architecture

## ROS 2 Tools and Ecosystem

### Command Line Tools
- **ros2 run**: Execute nodes
- **ros2 topic**: Inspect topics
- **ros2 service**: Interact with services
- **ros2 action**: Interact with actions
- **ros2 param**: Manage parameters

### Visualization Tools
- **RViz2**: 3D visualization for robot data
- **rqt**: GUI-based tools for introspection
- **rosbag2**: Data recording and playback
- **ros2 doctor**: System diagnostics

## Architecture Best Practices

### Node Design
- **Single Responsibility**: Each node should have one clear purpose
- **Loose Coupling**: Minimize dependencies between nodes
- **High Cohesion**: Group related functionality together
- **Error Handling**: Robust error handling and recovery

### Communication Design
- **Appropriate QoS**: Choose QoS policies for your use case
- **Message Design**: Design efficient and clear message formats
- **Topic Naming**: Use consistent and descriptive names
- **Resource Management**: Properly clean up publishers/subscribers

### System Organization
- **Namespaces**: Use namespaces for organization
- **Launch Files**: Use launch files for system deployment
- **Parameter Files**: Use YAML files for configuration
- **Package Structure**: Organize code in logical packages

## ROS 2 in Humanoid Robotics Context

For humanoid robots, ROS 2 architecture provides:

### Multi-System Integration
- Sensor systems (cameras, IMUs, force sensors)
- Actuator control systems (servos, motors)
- Perception systems (object detection, pose estimation)
- Planning systems (motion planning, path planning)
- Control systems (balance, locomotion)

### Real-time Requirements
- Deterministic communication for control
- Low-latency sensor processing
- Predictable timing for safety-critical functions
- Synchronization between subsystems

### Distributed Architecture
- Onboard computation and cloud services
- Multiple computers within the robot
- Remote monitoring and control
- Modular system design

## Summary

The ROS 2 architecture provides a robust foundation for developing complex robotic systems. Its DDS-based communication layer, combined with quality of service controls, security features, and comprehensive tooling, makes it well-suited for humanoid robotics applications.

Understanding these architectural concepts is essential for designing effective robotic systems. The modular, distributed nature of ROS 2 allows for the development of sophisticated humanoid robots with multiple interacting subsystems while maintaining system reliability and safety.

## Key Takeaways

- ROS 2 uses DDS as its communication middleware for robust, real-time communication
- Quality of Service (QoS) profiles allow fine-tuning of communication behavior
- The architecture supports distributed systems with multiple nodes
- Security is built into the architecture from the ground up
- Tools and ecosystem support development and debugging
- Architecture best practices lead to maintainable and reliable systems
- ROS 2 is well-suited for the complex requirements of humanoid robotics