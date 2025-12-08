---
sidebar_position: 11
title: "Submodule 4: URDF for Humanoids"
---

# Submodule 4: URDF for Humanoids

## Introduction to URDF

URDF (Unified Robot Description Format) is an XML-based format used in ROS to describe robot models. For humanoid robots, URDF is crucial as it defines the robot's physical structure, kinematic relationships, visual appearance, and dynamic properties. Understanding URDF is essential for simulating, controlling, and visualizing humanoid robots in ROS 2.

URDF provides a standardized way to represent robots in simulation environments like Gazebo and visualization tools like RViz, making it possible to test and develop humanoid robot applications without physical hardware.

## URDF Fundamentals

### URDF Structure

A URDF file describes a robot as a collection of **links** connected by **joints**:

- **Links**: Rigid bodies that make up the robot
- **Joints**: Connections between links that define how they can move relative to each other
- **Materials**: Visual properties like colors
- **Gazebo Plugins**: Simulation-specific extensions

### Basic URDF Example

```xml
<?xml version="1.0"?>
<robot name="simple_humanoid">
  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.5 0.3 0.2"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.5 0.3 0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Torso link -->
  <link name="torso">
    <visual>
      <geometry>
        <cylinder radius="0.1" length="0.6"/>
      </geometry>
      <material name="red">
        <color rgba="0.8 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.1" length="0.6"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2.0"/>
      <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Joint connecting base to torso -->
  <joint name="base_to_torso" type="fixed">
    <parent link="base_link"/>
    <child link="torso"/>
    <origin xyz="0 0 0.3" rpy="0 0 0"/>
  </joint>
</robot>
```

## Link Elements in Detail

### Visual Properties

The `<visual>` element defines how the link appears in visualization:

```xml
<link name="link_name">
  <visual>
    <!-- Position and orientation offset from link origin -->
    <origin xyz="0 0 0.1" rpy="0 0 0"/>

    <!-- Geometry definition -->
    <geometry>
      <!-- Box geometry -->
      <box size="0.1 0.2 0.3"/>
      <!-- Cylinder geometry -->
      <!-- <cylinder radius="0.1" length="0.5"/> -->
      <!-- Sphere geometry -->
      <!-- <sphere radius="0.1"/> -->
      <!-- Mesh geometry -->
      <!-- <mesh filename="package://my_robot/meshes/link.stl"/> -->
    </geometry>

    <!-- Material definition -->
    <material name="red">
      <color rgba="1 0 0 1"/>
    </material>
  </visual>
</link>
```

### Collision Properties

The `<collision>` element defines how the link interacts with other objects in simulation:

```xml
<link name="link_name">
  <collision>
    <!-- Similar to visual but often simplified for performance -->
    <origin xyz="0 0 0.1" rpy="0 0 0"/>
    <geometry>
      <box size="0.1 0.2 0.3"/>
    </geometry>
  </collision>
</link>
```

### Inertial Properties

The `<inertial>` element defines the physical properties for dynamics simulation:

```xml
<link name="link_name">
  <inertial>
    <!-- Mass in kilograms -->
    <mass value="1.0"/>

    <!-- Inertia matrix (in the link's frame) -->
    <inertia
      ixx="0.01" ixy="0" ixz="0"
      iyy="0.01" iyz="0"
      izz="0.01"/>
  </inertial>
</link>
```

## Joint Elements in Detail

### Joint Types

URDF supports several joint types for different movement patterns:

**Fixed Joint**
```xml
<joint name="fixed_joint" type="fixed">
  <parent link="parent_link"/>
  <child link="child_link"/>
  <origin xyz="0 0 0.1" rpy="0 0 0"/>
</joint>
```

**Revolute Joint** (rotational with limits)
```xml
<joint name="revolute_joint" type="revolute">
  <parent link="parent_link"/>
  <child link="child_link"/>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <axis xyz="0 0 1"/>  <!-- Rotation axis -->
  <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
</joint>
```

**Continuous Joint** (unlimited rotation)
```xml
<joint name="continuous_joint" type="continuous">
  <parent link="parent_link"/>
  <child link="child_link"/>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <axis xyz="0 0 1"/>
</joint>
```

**Prismatic Joint** (linear motion)
```xml
<joint name="prismatic_joint" type="prismatic">
  <parent link="parent_link"/>
  <child link="child_link"/>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <axis xyz="1 0 0"/>  <!-- Linear motion axis -->
  <limit lower="0" upper="0.1" effort="100" velocity="1"/>
</joint>
```

## Complete Humanoid Robot URDF

Here's a more complete example of a simplified humanoid robot:

```xml
<?xml version="1.0"?>
<robot name="humanoid_robot" xmlns:xacro="http://www.ros.org/wiki/xacro">
  <!-- Materials -->
  <material name="black">
    <color rgba="0.0 0.0 0.0 1.0"/>
  </material>
  <material name="blue">
    <color rgba="0.0 0.0 0.8 1.0"/>
  </material>
  <material name="green">
    <color rgba="0.0 0.8 0.0 1.0"/>
  </material>
  <material name="grey">
    <color rgba="0.5 0.5 0.5 1.0"/>
  </material>
  <material name="orange">
    <color rgba="1.0 0.423529411765 0.0392156862745 1.0"/>
  </material>
  <material name="brown">
    <color rgba="0.870588235294 0.811764705882 0.764705882353 1.0"/>
  </material>
  <material name="red">
    <color rgba="0.8 0.0 0.0 1.0"/>
  </material>
  <material name="white">
    <color rgba="1.0 1.0 1.0 1.0"/>
  </material>

  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.05 0.05 0.05"/>
      </geometry>
      <material name="white"/>
    </visual>
    <collision>
      <geometry>
        <box size="0.05 0.05 0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <!-- Torso -->
  <link name="torso">
    <visual>
      <geometry>
        <box size="0.3 0.1 0.5"/>
      </geometry>
      <material name="blue"/>
    </visual>
    <collision>
      <geometry>
        <box size="0.3 0.1 0.5"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <joint name="base_to_torso" type="fixed">
    <parent link="base_link"/>
    <child link="torso"/>
    <origin xyz="0 0 0.3" rpy="0 0 0"/>
  </joint>

  <!-- Head -->
  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
      <material name="white"/>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.004" ixy="0.0" ixz="0.0" iyy="0.004" iyz="0.0" izz="0.004"/>
    </inertial>
  </link>

  <joint name="torso_to_head" type="revolute">
    <parent link="torso"/>
    <child link="head"/>
    <origin xyz="0 0 0.3" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" effort="100" velocity="1"/>
  </joint>

  <!-- Left Arm -->
  <link name="left_shoulder">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.2"/>
      </geometry>
      <material name="red"/>
      <origin xyz="0 0 0" rpy="0 1.57 0"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.2"/>
      </geometry>
      <origin xyz="0 0 0" rpy="0 1.57 0"/>
    </collision>
    <inertial>
      <mass value="0.5"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <joint name="torso_to_left_shoulder" type="revolute">
    <parent link="torso"/>
    <child link="left_shoulder"/>
    <origin xyz="0.2 0 0.1" rpy="0 0 0"/>
    <axis xyz="1 0 0"/>
    <limit lower="-1.57" upper="1.57" effort="50" velocity="1"/>
  </joint>

  <!-- Right Arm -->
  <link name="right_shoulder">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.2"/>
      </geometry>
      <material name="red"/>
      <origin xyz="0 0 0" rpy="0 1.57 0"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.2"/>
      </geometry>
      <origin xyz="0 0 0" rpy="0 1.57 0"/>
    </collision>
    <inertial>
      <mass value="0.5"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <joint name="torso_to_right_shoulder" type="revolute">
    <parent link="torso"/>
    <child link="right_shoulder"/>
    <origin xyz="-0.2 0 0.1" rpy="0 0 0"/>
    <axis xyz="1 0 0"/>
    <limit lower="-1.57" upper="1.57" effort="50" velocity="1"/>
  </joint>

  <!-- Left Leg -->
  <link name="left_hip">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.3"/>
      </geometry>
      <material name="green"/>
      <origin xyz="0 0 0" rpy="0 1.57 0"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.3"/>
      </geometry>
      <origin xyz="0 0 0" rpy="0 1.57 0"/>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.005" ixy="0.0" ixz="0.0" iyy="0.005" iyz="0.0" izz="0.005"/>
    </inertial>
  </link>

  <joint name="torso_to_left_hip" type="revolute">
    <parent link="torso"/>
    <child link="left_hip"/>
    <origin xyz="0.1 0 -0.25" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-0.5" upper="0.5" effort="100" velocity="1"/>
  </joint>

  <!-- Right Leg -->
  <link name="right_hip">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.3"/>
      </geometry>
      <material name="green"/>
      <origin xyz="0 0 0" rpy="0 1.57 0"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.3"/>
      </geometry>
      <origin xyz="0 0 0" rpy="0 1.57 0"/>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.005" ixy="0.0" ixz="0.0" iyy="0.005" iyz="0.0" izz="0.005"/>
    </inertial>
  </link>

  <joint name="torso_to_right_hip" type="revolute">
    <parent link="torso"/>
    <child link="right_hip"/>
    <origin xyz="-0.1 0 -0.25" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-0.5" upper="0.5" effort="100" velocity="1"/>
  </joint>

  <!-- Transmissions for ros2_control -->
  <transmission name="left_shoulder_trans">
    <type>transmission_interface/SimpleTransmission</type>
    <joint name="torso_to_left_shoulder">
      <hardwareInterface>position_controllers/JointPosition</hardwareInterface>
    </joint>
    <actuator name="left_shoulder_motor">
      <mechanicalReduction>1</mechanicalReduction>
    </actuator>
  </transmission>

  <transmission name="right_shoulder_trans">
    <type>transmission_interface/SimpleTransmission</type>
    <joint name="torso_to_right_shoulder">
      <hardwareInterface>position_controllers/JointPosition</hardwareInterface>
    </joint>
    <actuator name="right_shoulder_motor">
      <mechanicalReduction>1</mechanicalReduction>
    </actuator>
  </transmission>

  <transmission name="left_hip_trans">
    <type>transmission_interface/SimpleTransmission</type>
    <joint name="torso_to_left_hip">
      <hardwareInterface>position_controllers/JointPosition</hardwareInterface>
    </joint>
    <actuator name="left_hip_motor">
      <mechanicalReduction>1</mechanicalReduction>
    </actuator>
  </transmission>

  <transmission name="right_hip_trans">
    <type>transmission_interface/SimpleTransmission</type>
    <joint name="torso_to_right_hip">
      <hardwareInterface>position_controllers/JointPosition</hardwareInterface>
    </joint>
    <actuator name="right_hip_motor">
      <mechanicalReduction>1</mechanicalReduction>
    </actuator>
  </transmission>
</robot>
```

## Xacro for Complex Humanoid URDFs

Xacro (XML Macros) is a macro language that simplifies complex URDF definitions:

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="humanoid_with_xacro">
  <!-- Properties -->
  <xacro:property name="M_PI" value="3.1415926535897931" />
  <xacro:property name="torso_length" value="0.5" />
  <xacro:property name="torso_radius" value="0.15" />
  <xacro:property name="arm_length" value="0.4" />
  <xacro:property name="leg_length" value="0.6" />

  <!-- Materials -->
  <xacro:macro name="default_inertial" params="mass">
    <inertial>
      <mass value="${mass}" />
      <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0" />
    </inertial>
  </xacro:macro>

  <!-- Link Macro -->
  <xacro:macro name="simple_link" params="name mass xyz_length">
    <link name="${name}">
      <visual>
        <geometry>
          <box size="${xyz_length}"/>
        </geometry>
        <material name="blue"/>
      </visual>
      <collision>
        <geometry>
          <box size="${xyz_length}"/>
        </geometry>
      </collision>
      <xacro:default_inertial mass="${mass}"/>
    </link>
  </xacro:macro>

  <!-- Base link -->
  <xacro:simple_link name="base_link" mass="0.5" xyz_length="0.1 0.1 0.1"/>

  <!-- Torso -->
  <xacro:simple_link name="torso" mass="5.0" xyz_length="0.3 0.2 ${torso_length}"/>

  <joint name="base_to_torso" type="fixed">
    <parent link="base_link"/>
    <child link="torso"/>
    <origin xyz="0 0 ${torso_length/2}" rpy="0 0 0"/>
  </joint>

  <!-- Macro for creating arms -->
  <xacro:macro name="arm" params="side parent_link position_offset">
    <link name="${side}_upper_arm">
      <visual>
        <geometry>
          <cylinder radius="0.05" length="0.3"/>
        </geometry>
        <material name="red"/>
        <origin xyz="0 0 0.15" rpy="0 1.57 0"/>
      </visual>
      <collision>
        <geometry>
          <cylinder radius="0.05" length="0.3"/>
        </geometry>
        <origin xyz="0 0 0.15" rpy="0 1.57 0"/>
      </collision>
      <inertial>
        <mass value="0.8"/>
        <inertia ixx="0.01" ixy="0" ixz="0" iyy="0.01" iyz="0" izz="0.01"/>
      </inertial>
    </link>

    <joint name="${parent_link}_to_${side}_upper_arm" type="revolute">
      <parent link="${parent_link}"/>
      <child link="${side}_upper_arm"/>
      <origin xyz="${position_offset}" rpy="0 0 0"/>
      <axis xyz="1 0 0"/>
      <limit lower="-2.0" upper="2.0" effort="100" velocity="2"/>
    </joint>

    <link name="${side}_lower_arm">
      <visual>
        <geometry>
          <cylinder radius="0.04" length="0.25"/>
        </geometry>
        <material name="red"/>
        <origin xyz="0 0 0.125" rpy="0 1.57 0"/>
      </visual>
      <collision>
        <geometry>
          <cylinder radius="0.04" length="0.25"/>
        </geometry>
        <origin xyz="0 0 0.125" rpy="0 1.57 0"/>
      </collision>
      <inertial>
        <mass value="0.5"/>
        <inertia ixx="0.005" ixy="0" ixz="0" iyy="0.005" iyz="0" izz="0.005"/>
      </inertial>
    </link>

    <joint name="${side}_elbow_joint" type="revolute">
      <parent link="${side}_upper_arm"/>
      <child link="${side}_lower_arm"/>
      <origin xyz="0 0 0.3" rpy="0 0 0"/>
      <axis xyz="0 1 0"/>
      <limit lower="-2.0" upper="0.5" effort="50" velocity="2"/>
    </joint>
  </xacro:macro>

  <!-- Create arms using macro -->
  <xacro:arm side="left" parent_link="torso" position_offset="0.2 0 0.1"/>
  <xacro:arm side="right" parent_link="torso" position_offset="-0.2 0 0.1"/>
</robot>
```

## URDF for Humanoid Kinematics

### Denavit-Hartenberg Parameters

For humanoid robots, understanding the kinematic chain is crucial. URDF implicitly defines the kinematic structure through the joint connections:

```xml
<!-- Example of kinematic chain for a humanoid leg -->
<link name="hip"/>
<link name="thigh"/>
<link name="shin"/>
<link name="foot"/>

<joint name="hip_joint" type="revolute">
  <parent link="torso"/>
  <child link="hip"/>
  <!-- Hip joint allows multiple degrees of freedom in real robots -->
</joint>

<joint name="knee_joint" type="revolute">
  <parent link="hip"/>
  <child link="thigh"/>
  <!-- Knee joint for flexion/extension -->
</joint>

<joint name="ankle_joint" type="revolute">
  <parent link="thigh"/>
  <child link="shin"/>
  <!-- Ankle joint for foot orientation -->
</joint>
```

### Kinematic Solvers

URDF works with kinematic solvers like KDL or MoveIt!:

```python
# Example Python code using moveit_commander
import moveit_commander
import rospy

class HumanoidMoveGroup:
    def __init__(self):
        moveit_commander.roscpp_initialize(sys.argv)
        self.robot = moveit_commander.RobotCommander()
        self.scene = moveit_commander.PlanningSceneInterface()

        # Define move groups for different parts of the humanoid
        self.left_arm_group = moveit_commander.MoveGroupCommander("left_arm")
        self.right_arm_group = moveit_commander.MoveGroupCommander("right_arm")
        self.torso_group = moveit_commander.MoveGroupCommander("torso")
```

## Simulation-Specific Extensions

### Gazebo Integration

Gazebo-specific extensions can be added to URDF:

```xml
<!-- Gazebo-specific properties -->
<gazebo reference="base_link">
  <material>Gazebo/Blue</material>
  <mu1>0.2</mu1>
  <mu2>0.2</mu2>
  <kp>1000000.0</kp>
  <kd>100.0</kd>
</gazebo>

<!-- Gazebo plugins for control -->
<gazebo>
  <plugin name="joint_state_publisher" filename="libgazebo_ros_joint_state_publisher.so">
    <joint_name>torso_to_head</joint_name>
  </plugin>
</gazebo>

<!-- ROS2 Control plugin -->
<gazebo>
  <plugin filename="libgazebo_ros2_control.so" name="gazebo_ros2_control">
    <parameters>$(find my_humanoid_description)/config/humanoid_controllers.yaml</parameters>
  </plugin>
</gazebo>
```

### Controller Configuration

Controller configuration file (YAML) for ros2_control:

```yaml
controller_manager:
  ros__parameters:
    update_rate: 100  # Hz

    joint_state_broadcaster:
      type: joint_state_broadcaster/JointStateBroadcaster

    left_arm_controller:
      type: position_controllers/JointGroupPositionController

    right_arm_controller:
      type: position_controllers/JointGroupPositionController

left_arm_controller:
  ros__parameters:
    joints:
      - torso_to_left_shoulder
      - left_elbow_joint
      - left_wrist_joint

right_arm_controller:
  ros__parameters:
    joints:
      - torso_to_right_shoulder
      - right_elbow_joint
      - right_wrist_joint
```

## URDF Validation and Tools

### Validating URDF

Several tools help validate and visualize URDF:

```bash
# Check URDF syntax
check_urdf /path/to/robot.urdf

# Show robot model information
urdf_to_graphiz /path/to/robot.urdf

# Visualize in RViz
ros2 run rviz2 rviz2
```

### Common URDF Issues

**Floating Point Precision**
```xml
<!-- Good: Use reasonable precision -->
<origin xyz="0.1 0.0 0.2" rpy="0 0 0"/>

<!-- Avoid: Excessive precision that may cause issues -->
<origin xyz="0.10000000000000000555 0.0 0.2000000000000000111" rpy="0 0 0"/>
```

**Inertial Properties**
```xml
<!-- Always define inertial properties, even for fixed links -->
<link name="visual_link">
  <visual>
    <geometry>
      <mesh filename="package://my_robot/meshes/visual_only.stl"/>
    </geometry>
  </visual>
  <!-- Even visual-only links need minimal inertial properties -->
  <inertial>
    <mass value="0.001"/>  <!-- Small mass -->
    <inertia ixx="0.0001" ixy="0" ixz="0" iyy="0.0001" iyz="0" izz="0.0001"/>
  </inertial>
</link>
```

## Advanced Humanoid URDF Concepts

### Mimic Joints

For creating coupled joints (like robot hands):

```xml
<link name="finger_base"/>
<link name="finger_tip"/>

<joint name="finger_actuated" type="revolute">
  <parent link="palm"/>
  <child link="finger_base"/>
  <axis xyz="0 0 1"/>
  <limit lower="0" upper="1.57" effort="10" velocity="1"/>
</joint>

<joint name="finger_coupled" type="revolute">
  <parent link="finger_base"/>
  <child link="finger_tip"/>
  <axis xyz="0 0 1"/>
  <limit lower="0" upper="1.57" effort="10" velocity="1"/>
  <!-- This joint mimics the actuated joint -->
  <mimic joint="finger_actuated" multiplier="1.0" offset="0.0"/>
</joint>
```

### Transmission Elements

For ros2_control integration:

```xml
<transmission name="joint1_trans">
  <type>transmission_interface/SimpleTransmission</type>
  <joint name="joint1">
    <hardwareInterface>position_controllers/JointPosition</hardwareInterface>
  </joint>
  <actuator name="joint1_motor">
    <mechanicalReduction>1</mechanicalReduction>
  </actuator>
</transmission>
```

## URDF Best Practices for Humanoid Robots

### Modular Design

Structure URDF files in a modular way:

```
humanoid_description/
├── urdf/
│   ├── humanoid.urdf.xacro
│   ├── torso.urdf.xacro
│   ├── arm.urdf.xacro
│   ├── leg.urdf.xacro
│   └── head.urdf.xacro
├── meshes/
│   ├── torso.stl
│   ├── upper_arm.stl
│   ├── lower_arm.stl
│   └── ...
└── config/
    └── controllers.yaml
```

### Realistic Inertial Properties

Calculate or estimate realistic inertial properties:

- Use CAD software to calculate mass and inertia
- Approximate with simple geometric shapes if CAD is unavailable
- Validate simulation behavior against real robot when possible

### Performance Considerations

- Use simplified collision geometry for better simulation performance
- Limit the number of extremely small links
- Balance visual detail with computational efficiency

## Working with URDF in ROS 2

### Launching Robot State Publisher

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
import os

def generate_launch_description():
    # Get URDF file path
    urdf_file = os.path.join(
        get_package_share_directory('my_humanoid_description'),
        'urdf',
        'humanoid.urdf'
    )

    # Robot state publisher node
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': open(urdf_file).read()}]
    )

    return LaunchDescription([
        robot_state_publisher
    ])
```

### Using TF for Robot Frames

URDF automatically generates TF frames that can be used in your code:

```python
import rclpy
from rclpy.node import Node
from tf2_ros import TransformException
from tf2_ros.buffer import Buffer
from tf2_ros.transform_listener import TransformListener

class HumanoidTFNode(Node):
    def __init__(self):
        super().__init__('humanoid_tf_node')

        # Create TF buffer and listener
        self.tf_buffer = Buffer()
        self.tf_listener = TransformListener(self.tf_buffer, self)

    def get_link_transform(self, target_frame, source_frame='base_link'):
        """Get transform between two frames."""
        try:
            transform = self.tf_buffer.lookup_transform(
                source_frame,
                target_frame,
                rclpy.time.Time()
            )
            return transform
        except TransformException as ex:
            self.get_logger().error(f'Could not transform {target_frame}: {ex}')
            return None
```

## Summary

URDF is fundamental to humanoid robotics in ROS 2, providing the robot description that enables simulation, visualization, and control. For humanoid robots specifically, URDF must accurately represent the complex kinematic structure with multiple limbs and degrees of freedom.

The use of Xacro macros, proper inertial properties, and simulation-specific extensions allows for the creation of realistic and functional humanoid robot models. Understanding URDF is essential for anyone working with humanoid robots in the ROS 2 ecosystem.

## Key Takeaways

- URDF describes robots as links connected by joints
- Xacro simplifies complex URDF definitions with macros
- Proper inertial properties are crucial for realistic simulation
- Gazebo extensions enable physics simulation
- URDF integrates with kinematic solvers and controllers
- Modular design improves maintainability
- Validation tools help identify issues early
- URDF is essential for humanoid robot simulation and control