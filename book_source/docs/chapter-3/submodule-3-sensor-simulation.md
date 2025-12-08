---
sidebar_position: 16
title: "Submodule 3: Sensor Simulation"
---

# Submodule 3: Sensor Simulation

## Introduction to Sensor Simulation

Sensor simulation is a critical component of robotics development, enabling the testing and validation of perception algorithms, control systems, and AI models without the need for physical hardware. For humanoid robots operating in human environments, realistic sensor simulation is essential for developing robust perception systems that can handle the complexity and variability of real-world scenarios.

This module explores the principles, techniques, and best practices for simulating various types of sensors in robotics simulation environments like Gazebo and Unity, with a focus on humanoid robot applications.

## The Importance of Realistic Sensor Simulation

### Why Simulate Sensors?

**Development and Testing**
- Test perception algorithms without physical hardware
- Validate control systems in controlled environments
- Debug sensor processing pipelines safely
- Iterate quickly on sensor fusion approaches

**Training AI Systems**
- Generate large datasets for machine learning
- Create diverse scenarios for robust training
- Simulate edge cases difficult to encounter in reality
- Domain randomization for improved generalization

**Cost and Safety Considerations**
- Reduce hardware wear and tear
- Avoid potential damage to expensive sensors
- Test dangerous scenarios safely
- Enable parallel development of hardware and software

### Challenges in Sensor Simulation

**Physical Accuracy**
- Modeling real sensor physics and limitations
- Reproducing noise characteristics and artifacts
- Simulating environmental effects (lighting, weather)
- Capturing sensor-to-sensor variations

**Computational Efficiency**
- Balancing realism with performance
- Optimizing simulation for real-time applications
- Managing computational resources for multiple sensors
- Scaling to complex multi-robot scenarios

## Types of Sensors in Robotics

### Vision Sensors

**Cameras**
- RGB cameras for color vision
- Depth cameras for 3D perception
- Stereo cameras for depth estimation
- Thermal cameras for heat detection

**LIDAR (Light Detection and Ranging)**
- 2D LiDAR for navigation and mapping
- 3D LiDAR for environment reconstruction
- Multi-beam systems for comprehensive coverage
- Solid-state LiDAR for compact integration

### Inertial Sensors

**IMU (Inertial Measurement Unit)**
- Accelerometers for linear acceleration
- Gyroscopes for angular velocity
- Magnetometers for orientation reference
- Combined units for comprehensive motion sensing

### Proprioceptive Sensors

**Joint Sensors**
- Position encoders for joint angle measurement
- Torque sensors for force feedback
- Temperature sensors for motor monitoring
- Current sensors for power consumption

### Tactile Sensors

**Contact Detection**
- Bump sensors for collision detection
- Force/torque sensors for manipulation
- Tactile arrays for surface texture
- Pressure sensors for grip monitoring

## Camera Simulation

### Basic Camera Setup in Gazebo

```xml
<gazebo reference="camera_link">
  <sensor name="camera" type="camera">
    <update_rate>30</update_rate>
    <camera name="head_camera">
      <horizontal_fov>1.047</horizontal_fov> <!-- 60 degrees -->
      <image>
        <width>640</width>
        <height>480</height>
        <format>R8G8B8</format>
      </image>
      <clip>
        <near>0.1</near>
        <far>10.0</far>
      </clip>
      <noise>
        <type>gaussian</type>
        <mean>0.0</mean>
        <stddev>0.007</stddev>
      </noise>
    </camera>
    <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
      <frame_name>camera_optical_frame</frame_name>
      <topic_name>image_raw</topic_name>
      <hack_baseline>0.07</hack_baseline>
    </plugin>
  </sensor>
</gazebo>
```

### Advanced Camera Properties

```xml
<sensor name="advanced_camera" type="camera">
  <camera>
    <!-- Field of view and resolution -->
    <horizontal_fov>1.3962634</horizontal_fov> <!-- 80 degrees -->
    <image>
      <width>1280</width>
      <height>720</height>
      <format>R8G8B8</format>
    </image>

    <!-- Distortion parameters -->
    <distortion>
      <k1>-0.177341</k1>
      <k2>0.221929</k2>
      <k3>-0.092439</k3>
      <p1>0.000158</p1>
      <p2>-0.000191</p2>
      <center>0.5 0.5</center>
    </distortion>

    <!-- Clipping distances -->
    <clip>
      <near>0.02</near>
      <far>300</far>
    </clip>

    <!-- Noise modeling -->
    <noise>
      <type>gaussian</type>
      <mean>0.0</mean>
      <stddev>0.007</stddev>
    </noise>
  </camera>
</sensor>
```

### Depth Camera Simulation

```xml
<sensor name="depth_camera" type="depth">
  <update_rate>30</update_rate>
  <camera name="depth_cam">
    <horizontal_fov>1.047</horizontal_fov>
    <image>
      <width>640</width>
      <height>480</height>
    </image>
    <clip>
      <near>0.1</near>
      <far>10.0</far>
    </clip>
  </camera>
  <plugin name="depth_camera_controller" filename="libgazebo_ros_openni_kinect.so">
    <baseline>0.2</baseline>
    <alwaysOn>true</alwaysOn>
    <updateRate>30.0</updateRate>
    <cameraName>camera</cameraName>
    <imageTopicName>rgb/image_raw</imageTopicName>
    <depthImageTopicName>depth/image_raw</depthImageTopicName>
    <pointCloudTopicName>depth/points</pointCloudTopicName>
    <cameraInfoTopicName>rgb/camera_info</cameraInfoTopicName>
    <depthImageCameraInfoTopicName>depth/camera_info</depthImageCameraInfoTopicName>
    <frameName>camera_depth_optical_frame</frameName>
    <pointCloudCutoff>0.1</pointCloudCutoff>
    <pointCloudCutoffMax>3.0</pointCloudCutoffMax>
    <distortion_k1>0.0</distortion_k1>
    <distortion_k2>0.0</distortion_k2>
    <distortion_k3>0.0</distortion_k3>
    <distortion_t1>0.0</distortion_t1>
    <distortion_t2>0.0</distortion_t2>
    <CxPrime>0.0</CxPrime>
    <Cx>0.0</Cx>
    <Cy>0.0</Cy>
    <focalLength>0.0</focalLength>
    <hackBaseline>0.0</hackBaseline>
  </plugin>
</sensor>
```

## LiDAR Simulation

### 2D LiDAR Setup

```xml
<sensor name="laser_2d" type="ray">
  <ray>
    <scan>
      <horizontal>
        <samples>720</samples>
        <resolution>1</resolution>
        <min_angle>-1.570796</min_angle> <!-- -90 degrees -->
        <max_angle>1.570796</max_angle>   <!-- 90 degrees -->
      </horizontal>
    </scan>
    <range>
      <min>0.1</min>
      <max>30.0</max>
      <resolution>0.01</resolution>
    </range>
  </ray>
  <plugin name="laser_controller" filename="libgazebo_ros_laser.so">
    <topic_name>scan</topic_name>
    <frame_name>laser_frame</frame_name>
    <min_range>0.1</min_range>
    <max_range>30.0</max_range>
    <update_rate>40</update_rate>
  </plugin>
</sensor>
```

### 3D LiDAR Configuration

```xml
<sensor name="velodyne_vlp16" type="ray">
  <ray>
    <scan>
      <horizontal>
        <samples>1800</samples>
        <resolution>1</resolution>
        <min_angle>-3.141593</min_angle> <!-- -180 degrees -->
        <max_angle>3.141593</max_angle>   <!-- 180 degrees -->
      </horizontal>
      <vertical>
        <samples>16</samples>
        <resolution>1</resolution>
        <min_angle>-0.261799</min_angle> <!-- -15 degrees -->
        <max_angle>0.261799</max_angle>  <!-- 15 degrees -->
      </vertical>
    </scan>
    <range>
      <min>0.2</min>
      <max>100.0</max>
      <resolution>0.01</resolution>
    </range>
  </ray>
  <plugin name="velodyne_controller" filename="libgazebo_ros_velodyne_laser.so">
    <topic_name>points</topic_name>
    <frame_name>velodyne</frame_name>
    <min_range>0.9</min_range>
    <max_range>130.0</max_range>
    <gaussian_noise>0.008</gaussian_noise>
    <update_rate>10</update_rate>
  </plugin>
</sensor>
```

## IMU Simulation

### IMU Sensor Configuration

```xml
<gazebo reference="imu_link">
  <sensor name="imu_sensor" type="imu">
    <always_on>true</always_on>
    <update_rate>100</update_rate>
    <imu>
      <!-- Gyroscope properties -->
      <angular_velocity>
        <x>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
            <bias_mean>0.0000075</bias_mean>
            <bias_stddev>0.0000008</bias_stddev>
          </noise>
        </x>
        <y>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
            <bias_mean>0.0000075</bias_mean>
            <bias_stddev>0.0000008</bias_stddev>
          </noise>
        </y>
        <z>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
            <bias_mean>0.0000075</bias_mean>
            <bias_stddev>0.0000008</bias_stddev>
          </noise>
        </z>
      </angular_velocity>

      <!-- Accelerometer properties -->
      <linear_acceleration>
        <x>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
            <bias_mean>0.1</bias_mean>
            <bias_stddev>0.001</bias_stddev>
          </noise>
        </x>
        <y>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
            <bias_mean>0.1</bias_mean>
            <bias_stddev>0.001</bias_stddev>
          </noise>
        </y>
        <z>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
            <bias_mean>0.1</bias_mean>
            <bias_stddev>0.001</bias_stddev>
          </noise>
        </z>
      </linear_acceleration>
    </imu>
    <plugin name="imu_controller" filename="libgazebo_ros_imu.so">
      <topicName>imu</topicName>
      <bodyName>imu_link</bodyName>
      <updateRateHZ>100.0</updateRateHZ>
      <gaussianNoise>0.0</gaussianNoise>
      <xyzOffset>0 0 0</xyzOffset>
      <rpyOffset>0 0 0</rpyOffset>
      <frameName>imu_link</frameName>
    </plugin>
  </sensor>
</gazebo>
```

## Joint Sensor Simulation

### Position and Effort Sensors

```xml
<gazebo>
  <plugin name="joint_state_publisher" filename="libgazebo_ros_joint_state_publisher.so">
    <joint_name>left_hip_joint</joint_name>
    <joint_name>left_knee_joint</joint_name>
    <joint_name>left_ankle_joint</joint_name>
    <joint_name>right_hip_joint</joint_name>
    <joint_name>right_knee_joint</joint_name>
    <joint_name>right_ankle_joint</joint_name>
    <update_rate>30</update_rate>
    <always_on>true</always_on>
  </plugin>
</gazebo>

<!-- Individual joint sensors with noise -->
<transmission name="left_hip_trans">
  <type>transmission_interface/SimpleTransmission</type>
  <joint name="left_hip_joint">
    <hardwareInterface>hardware_interface/PositionJointInterface</hardwareInterface>
  </joint>
  <actuator name="left_hip_motor">
    <mechanicalReduction>1</mechanicalReduction>
  </actuator>
</transmission>
```

## Unity Sensor Simulation

### Camera Simulation in Unity

```csharp
using UnityEngine;
using System.Collections;

public class UnityCameraSensor : MonoBehaviour
{
    [Header("Camera Properties")]
    public int width = 640;
    public int height = 480;
    public float fieldOfView = 60f;
    public float nearClip = 0.1f;
    public float farClip = 100f;

    [Header("Noise Parameters")]
    public bool enableNoise = true;
    public float noiseIntensity = 0.01f;
    public float saltPepperRatio = 0.1f;

    [Header("Distortion")]
    public bool enableDistortion = false;
    public float distortionK1 = 0f;
    public float distortionK2 = 0f;

    private Camera cameraComponent;
    private RenderTexture renderTexture;
    private Texture2D outputTexture;

    void Start()
    {
        SetupCamera();
    }

    void SetupCamera()
    {
        cameraComponent = GetComponent<Camera>();
        if (cameraComponent == null)
        {
            cameraComponent = gameObject.AddComponent<Camera>();
        }

        // Configure camera parameters
        cameraComponent.fieldOfView = fieldOfView;
        cameraComponent.nearClipPlane = nearClip;
        cameraComponent.farClipPlane = farClip;

        // Create render texture
        renderTexture = new RenderTexture(width, height, 24);
        cameraComponent.targetTexture = renderTexture;

        // Create output texture
        outputTexture = new Texture2D(width, height, TextureFormat.RGB24, false);
    }

    public Texture2D GetImage()
    {
        // Set render texture and render
        RenderTexture.active = renderTexture;
        cameraComponent.Render();

        // Read pixels from render texture
        outputTexture.ReadPixels(new Rect(0, 0, width, height), 0, 0);
        outputTexture.Apply();

        // Apply noise if enabled
        if (enableNoise)
        {
            ApplyNoise(outputTexture);
        }

        // Apply distortion if enabled
        if (enableDistortion)
        {
            ApplyDistortion(outputTexture);
        }

        return outputTexture;
    }

    void ApplyNoise(Texture2D texture)
    {
        Color[] pixels = texture.GetPixels();

        for (int i = 0; i < pixels.Length; i++)
        {
            if (enableNoise && Random.value < noiseIntensity)
            {
                // Add Gaussian noise
                float noise = Random.Range(-0.1f, 0.1f);
                pixels[i] = new Color(
                    Mathf.Clamp01(pixels[i].r + noise),
                    Mathf.Clamp01(pixels[i].g + noise),
                    Mathf.Clamp01(pixels[i].b + noise)
                );
            }

            if (Random.value < saltPepperRatio * noiseIntensity)
            {
                // Add salt and pepper noise
                pixels[i] = Random.value > 0.5f ? Color.white : Color.black;
            }
        }

        texture.SetPixels(pixels);
        texture.Apply();
    }

    void ApplyDistortion(Texture2D texture)
    {
        // Apply radial distortion (simplified model)
        Color[] originalPixels = texture.GetPixels();
        Color[] distortedPixels = new Color[originalPixels.Length];

        int centerX = width / 2;
        int centerY = height / 2;

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                int pixelIndex = y * width + x;

                // Normalize coordinates to -1 to 1
                float normX = (float)(x - centerX) / centerX;
                float normY = (float)(y - centerY) / centerY;

                // Calculate distance from center
                float r = Mathf.Sqrt(normX * normX + normY * normY);

                // Apply distortion coefficients
                float distortion = 1 + distortionK1 * r * r + distortionK2 * r * r * r * r;

                // Calculate source coordinates
                int srcX = (int)(centerX + normX * distortion * centerX);
                int srcY = (int)(centerY + normY * distortion * centerY);

                // Bounds checking
                if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height)
                {
                    int srcIndex = srcY * width + srcX;
                    distortedPixels[pixelIndex] = originalPixels[srcIndex];
                }
                else
                {
                    distortedPixels[pixelIndex] = Color.black; // Outside image
                }
            }
        }

        texture.SetPixels(distortedPixels);
        texture.Apply();
    }
}
```

### LiDAR Simulation in Unity

```csharp
using UnityEngine;
using System.Collections.Generic;

public class UnityLiDARSensor : MonoBehaviour
{
    [Header("LiDAR Configuration")]
    public float minRange = 0.1f;
    public float maxRange = 30.0f;
    public int horizontalResolution = 360;
    public int verticalResolution = 16;
    public float horizontalFOV = 360f;
    public float verticalFOV = 30f;

    [Header("Noise Parameters")]
    public float rangeNoise = 0.01f;
    public float angularNoise = 0.001f;

    [Header("Raycast Settings")]
    public int raycastLayerMask = -1; // All layers
    public bool visualizeRays = false;

    private List<float> ranges;
    private RaycastHit[] raycastHits;

    void Start()
    {
        InitializeLiDAR();
    }

    void InitializeLiDAR()
    {
        int totalRays = horizontalResolution * verticalResolution;
        ranges = new List<float>(totalRays);
        raycastHits = new RaycastHit[totalRays];

        for (int i = 0; i < totalRays; i++)
        {
            ranges.Add(maxRange); // Initialize with max range
        }
    }

    void Update()
    {
        if (visualizeRays)
        {
            UpdateVisualization();
        }
    }

    public float[] GetRanges()
    {
        // Calculate all ray directions and cast rays
        float[] outputRanges = new float[ranges.Count];

        for (int v = 0; v < verticalResolution; v++)
        {
            float verticalAngle = (v - verticalResolution / 2) * (verticalFOV / verticalResolution) * Mathf.Deg2Rad;

            for (int h = 0; h < horizontalResolution; h++)
            {
                float horizontalAngle = (h * (horizontalFOV / horizontalResolution) - horizontalFOV / 2) * Mathf.Deg2Rad;

                // Calculate ray direction
                Vector3 direction = CalculateRayDirection(horizontalAngle, verticalAngle);

                // Add angular noise
                if (angularNoise > 0)
                {
                    direction += Random.insideUnitSphere * angularNoise;
                    direction = direction.normalized;
                }

                // Perform raycast
                RaycastHit hit;
                int rayIndex = v * horizontalResolution + h;

                if (Physics.Raycast(transform.position, direction, out hit, maxRange, raycastLayerMask))
                {
                    float range = hit.distance;

                    // Add range noise
                    if (rangeNoise > 0)
                    {
                        range += Random.Range(-rangeNoise, rangeNoise);
                    }

                    // Clamp to valid range
                    range = Mathf.Clamp(range, minRange, maxRange);
                    outputRanges[rayIndex] = range;
                }
                else
                {
                    outputRanges[rayIndex] = maxRange; // No hit
                }
            }
        }

        return outputRanges;
    }

    Vector3 CalculateRayDirection(float horizontalAngle, float verticalAngle)
    {
        // Start with forward direction
        Vector3 direction = transform.forward;

        // Apply horizontal rotation
        direction = Quaternion.AngleAxis(horizontalAngle * Mathf.Rad2Deg, transform.up) * direction;

        // Apply vertical rotation
        Vector3 right = Vector3.Cross(direction, transform.up).normalized;
        direction = Quaternion.AngleAxis(verticalAngle * Mathf.Rad2Deg, right) * direction;

        return direction.normalized;
    }

    void UpdateVisualization()
    {
        // Visualize LiDAR rays (for debugging)
        for (int v = 0; v < verticalResolution; v += verticalResolution / 4) // Only visualize some rays
        {
            for (int h = 0; h < horizontalResolution; h += horizontalResolution / 10)
            {
                float verticalAngle = (v - verticalResolution / 2) * (verticalFOV / verticalResolution) * Mathf.Deg2Rad;
                float horizontalAngle = (h * (horizontalFOV / horizontalResolution) - horizontalFOV / 2) * Mathf.Deg2Rad;

                Vector3 direction = CalculateRayDirection(horizontalAngle, verticalAngle);
                Debug.DrawRay(transform.position, direction * maxRange, Color.red, 0.1f);
            }
        }
    }

    public PointCloud GetPointCloud()
    {
        float[] ranges = GetRanges();
        List<Vector3> points = new List<Vector3>();

        for (int v = 0; v < verticalResolution; v++)
        {
            float verticalAngle = (v - verticalResolution / 2) * (verticalFOV / verticalResolution) * Mathf.Deg2Rad;

            for (int h = 0; h < horizontalResolution; h++)
            {
                float horizontalAngle = (h * (horizontalFOV / horizontalResolution) - horizontalFOV / 2) * Mathf.Deg2Rad;

                float range = ranges[v * horizontalResolution + h];
                if (range < maxRange)
                {
                    Vector3 direction = CalculateRayDirection(horizontalAngle, verticalAngle);
                    Vector3 point = transform.position + direction * range;
                    points.Add(point);
                }
            }
        }

        return new PointCloud { points = points.ToArray() };
    }
}

[System.Serializable]
public class PointCloud
{
    public Vector3[] points;
}
```

## Sensor Fusion Simulation

### Multi-Sensor Integration

```python
import numpy as np
from scipy.spatial.transform import Rotation as R
import rospy
from sensor_msgs.msg import Image, Imu, LaserScan, JointState
from geometry_msgs.msg import PointStamped, PoseStamped
from nav_msgs.msg import Odometry
import cv2
from cv_bridge import CvBridge

class SensorFusionSimulator:
    def __init__(self):
        # Initialize ROS node
        rospy.init_node('sensor_fusion_simulator')

        # Initialize sensor publishers
        self.image_pub = rospy.Publisher('/camera/image_raw', Image, queue_size=10)
        self.imu_pub = rospy.Publisher('/imu/data', Imu, queue_size=10)
        self.laser_pub = rospy.Publisher('/scan', LaserScan, queue_size=10)
        self.joint_pub = rospy.Publisher('/joint_states', JointState, queue_size=10)
        self.odom_pub = rospy.Publisher('/odom', Odometry, queue_size=10)

        # Initialize sensor data
        self.bridge = CvBridge()
        self.robot_pose = np.array([0.0, 0.0, 0.0])  # x, y, theta
        self.robot_velocity = np.array([0.0, 0.0, 0.0])  # vx, vy, omega

        # Sensor fusion state
        self.fused_pose = np.array([0.0, 0.0, 0.0])
        self.fused_velocity = np.array([0.0, 0.0, 0.0])

        # Noise parameters
        self.imu_noise = {'accel': 0.01, 'gyro': 0.001}
        self.camera_noise = {'pixel': 0.5, 'distortion': 0.01}
        self.laser_noise = {'range': 0.02, 'angular': 0.001}

        # Timer for sensor updates
        self.rate = rospy.Rate(30)  # 30 Hz

    def simulate_camera(self):
        """Simulate camera sensor data."""
        # Create a synthetic image (in a real simulation, this would come from Gazebo/Unity)
        image = np.zeros((480, 640, 3), dtype=np.uint8)

        # Add some synthetic features
        cv2.circle(image, (320, 240), 50, (255, 0, 0), -1)  # Blue circle in center
        cv2.rectangle(image, (100, 100), (200, 200), (0, 255, 0), 2)  # Green rectangle

        # Add noise
        noise = np.random.normal(0, self.camera_noise['pixel'], image.shape)
        image = np.clip(image + noise, 0, 255).astype(np.uint8)

        # Publish image
        img_msg = self.bridge.cv2_to_imgmsg(image, "bgr8")
        img_msg.header.stamp = rospy.Time.now()
        img_msg.header.frame_id = "camera_optical_frame"
        self.image_pub.publish(img_msg)

    def simulate_imu(self):
        """Simulate IMU sensor data."""
        imu_msg = Imu()
        imu_msg.header.stamp = rospy.Time.now()
        imu_msg.header.frame_id = "imu_link"

        # Simulate true values (in a real sim, these would come from physics engine)
        true_accel = np.array([0.0, 0.0, 9.81])  # Gravity vector
        true_gyro = np.array([0.0, 0.0, 0.0])    # No rotation

        # Add noise
        noisy_accel = true_accel + np.random.normal(0, self.imu_noise['accel'], 3)
        noisy_gyro = true_gyro + np.random.normal(0, self.imu_noise['gyro'], 3)

        # Set message values
        imu_msg.linear_acceleration.x = noisy_accel[0]
        imu_msg.linear_acceleration.y = noisy_accel[1]
        imu_msg.linear_acceleration.z = noisy_accel[2]

        imu_msg.angular_velocity.x = noisy_gyro[0]
        imu_msg.angular_velocity.y = noisy_gyro[1]
        imu_msg.angular_velocity.z = noisy_gyro[2]

        # Set orientation (in real application, integrate gyro)
        imu_msg.orientation.w = 1.0  # Identity quaternion
        imu_msg.orientation.x = 0.0
        imu_msg.orientation.y = 0.0
        imu_msg.orientation.z = 0.0

        self.imu_pub.publish(imu_msg)

    def simulate_laser(self):
        """Simulate LiDAR sensor data."""
        scan_msg = LaserScan()
        scan_msg.header.stamp = rospy.Time.now()
        scan_msg.header.frame_id = "laser_frame"

        # Parameters
        scan_msg.angle_min = -np.pi / 2  # -90 degrees
        scan_msg.angle_max = np.pi / 2   # 90 degrees
        scan_msg.angle_increment = np.pi / 180  # 1 degree
        scan_msg.time_increment = 0.0
        scan_msg.scan_time = 1.0 / 10  # 10 Hz
        scan_msg.range_min = 0.1
        scan_msg.range_max = 30.0

        # Simulate ranges (in a real sim, cast rays in environment)
        num_ranges = int((scan_msg.angle_max - scan_msg.angle_min) / scan_msg.angle_increment) + 1
        ranges = []

        for i in range(num_ranges):
            angle = scan_msg.angle_min + i * scan_msg.angle_increment

            # Simulate some obstacles
            if abs(angle) < 0.2:  # Forward direction has an obstacle
                range_val = 2.0 + np.random.normal(0, self.laser_noise['range'])
            else:
                range_val = 30.0  # Max range (no obstacle)

            ranges.append(max(scan_msg.range_min, min(range_val, scan_msg.range_max)))

        scan_msg.ranges = ranges
        scan_msg.intensities = [100.0] * len(ranges)  # Simulated intensities

        self.laser_pub.publish(scan_msg)

    def simulate_joint_states(self):
        """Simulate joint position sensors."""
        joint_msg = JointState()
        joint_msg.header.stamp = rospy.Time.now()
        joint_msg.header.frame_id = ""

        # Joint names for a simple humanoid
        joint_names = [
            'left_hip_joint', 'left_knee_joint', 'left_ankle_joint',
            'right_hip_joint', 'right_knee_joint', 'right_ankle_joint'
        ]

        # Simulate joint positions (in a real sim, these would come from physics)
        joint_positions = []
        for i, name in enumerate(joint_names):
            # Simulate some movement pattern
            pos = np.sin(rospy.Time.now().to_sec() + i) * 0.2
            joint_positions.append(pos)

        joint_msg.name = joint_names
        joint_msg.position = joint_positions
        joint_msg.velocity = [0.0] * len(joint_names)
        joint_msg.effort = [0.0] * len(joint_names)

        self.joint_pub.publish(joint_msg)

    def simulate_odometry(self):
        """Simulate odometry data."""
        odom_msg = Odometry()
        odom_msg.header.stamp = rospy.Time.now()
        odom_msg.header.frame_id = "odom"
        odom_msg.child_frame_id = "base_link"

        # Update robot pose based on velocity
        dt = 1.0 / 30.0  # Assuming 30 Hz
        self.robot_pose[0] += self.robot_velocity[0] * dt * np.cos(self.robot_pose[2]) - self.robot_velocity[1] * dt * np.sin(self.robot_pose[2])
        self.robot_pose[1] += self.robot_velocity[0] * dt * np.sin(self.robot_pose[2]) + self.robot_velocity[1] * dt * np.cos(self.robot_pose[2])
        self.robot_pose[2] += self.robot_velocity[2] * dt

        # Set position
        odom_msg.pose.pose.position.x = self.robot_pose[0]
        odom_msg.pose.pose.position.y = self.robot_pose[1]
        odom_msg.pose.pose.position.z = 0.0

        # Convert angle to quaternion
        q = R.from_euler('z', self.robot_pose[2]).as_quat()
        odom_msg.pose.pose.orientation.x = q[0]
        odom_msg.pose.pose.orientation.y = q[1]
        odom_msg.pose.pose.orientation.z = q[2]
        odom_msg.pose.pose.orientation.w = q[3]

        # Set velocity
        odom_msg.twist.twist.linear.x = self.robot_velocity[0]
        odom_msg.twist.twist.linear.y = self.robot_velocity[1]
        odom_msg.twist.twist.angular.z = self.robot_velocity[2]

        self.odom_pub.publish(odom_msg)

    def run(self):
        """Main simulation loop."""
        while not rospy.is_shutdown():
            # Simulate all sensors
            self.simulate_camera()
            self.simulate_imu()
            self.simulate_laser()
            self.simulate_joint_states()
            self.simulate_odometry()

            # Perform sensor fusion (simplified example)
            self.perform_sensor_fusion()

            self.rate.sleep()

    def perform_sensor_fusion(self):
        """Perform basic sensor fusion."""
        # This is a simplified example - real fusion would use more sophisticated algorithms
        # like Kalman filters, particle filters, or optimization-based methods

        # For now, just average the pose estimates from different sensors
        # In practice, each sensor would contribute based on its reliability
        self.fused_pose = self.robot_pose  # In simulation, we have ground truth
        self.fused_velocity = self.robot_velocity

if __name__ == '__main__':
    simulator = SensorFusionSimulator()
    simulator.run()
```

## Realistic Noise Modeling

### Noise Sources and Characteristics

```python
import numpy as np

class SensorNoiseModel:
    def __init__(self):
        # Camera noise parameters
        self.camera_params = {
            'readout_noise': 2.0,      # electrons
            'dark_current': 0.1,       # electrons/second
            'quantization_noise': 0.29, # ADU
            'photon_noise_factor': 1.0  # quantum efficiency factor
        }

        # IMU noise parameters (Allan variance coefficients)
        self.imu_params = {
            'gyro_white': 0.001,      # rad/s/sqrt(Hz)
            'gyro_bias_instability': 10.0,  # rad/s
            'gyro_rate_random_walk': 0.2,   # rad/s/sqrt(Hz)
            'accel_white': 100.0,     # micro-g/sqrt(Hz)
            'accel_bias_instability': 200.0, # micro-g
            'accel_velocity_random_walk': 0.2 # m/s/sqrt(Hz)
        }

    def camera_noise(self, image, exposure_time=0.033, temperature=25.0):
        """Add realistic camera noise."""
        # Convert to photon counts (simplified model)
        photon_counts = image.astype(np.float64) / self.camera_params['photon_noise_factor']

        # Shot noise (photon noise)
        shot_noise = np.random.poisson(photon_counts)

        # Dark current noise
        dark_noise = np.random.normal(
            0,
            np.sqrt(self.camera_params['dark_current'] * exposure_time + self.camera_params['readout_noise']**2),
            image.shape
        )

        # Combine noises
        noisy_image = shot_noise + dark_noise

        # Quantization noise
        noisy_image += np.random.uniform(-0.5, 0.5, image.shape) * self.camera_params['quantization_noise']

        # Convert back to appropriate range
        noisy_image = np.clip(noisy_image, 0, 255).astype(np.uint8)

        return noisy_image

    def imu_noise(self, dt, gyro_input, accel_input, bias_drift=True):
        """Add realistic IMU noise."""
        # Gyroscope noise
        gyro_white_noise = np.random.normal(0, self.imu_params['gyro_white'] / np.sqrt(dt), 3)
        gyro_bias = np.random.normal(0, self.imu_params['gyro_bias_instability'], 3)

        if bias_drift:
            # Simulate bias drift over time
            self.gyro_bias_drift = getattr(self, 'gyro_bias_drift', np.zeros(3))
            self.gyro_bias_drift += np.random.normal(0, self.imu_params['gyro_rate_random_walk'] * np.sqrt(dt), 3)
            gyro_bias += self.gyro_bias_drift

        noisy_gyro = gyro_input + gyro_white_noise + gyro_bias

        # Accelerometer noise
        accel_white_noise = np.random.normal(0, self.imu_params['accel_white'] / np.sqrt(dt), 3)
        accel_bias = np.random.normal(0, self.imu_params['accel_bias_instability'], 3)

        if bias_drift:
            self.accel_bias_drift = getattr(self, 'accel_bias_drift', np.zeros(3))
            self.accel_bias_drift += np.random.normal(0, self.imu_params['accel_velocity_random_walk'] * np.sqrt(dt), 3)
            accel_bias += self.accel_bias_drift

        noisy_accel = accel_input + accel_white_noise + accel_bias

        return noisy_gyro, noisy_accel

    def lidar_noise(self, ranges, angular_resolution=0.25):
        """Add realistic LiDAR noise."""
        # Range-dependent noise (typically increases with distance)
        range_noise = np.random.normal(
            0,
            0.01 + 0.005 * np.array(ranges),  # 1cm + 0.5% of range
            len(ranges)
        )

        # Angular quantization noise
        angular_noise = np.random.uniform(
            -angular_resolution / 2,
            angular_resolution / 2,
            len(ranges)
        )

        noisy_ranges = np.array(ranges) + range_noise
        # Ensure no negative ranges
        noisy_ranges = np.maximum(noisy_ranges, 0.0)

        return noisy_ranges.tolist()
```

## Validation and Calibration

### Sensor Validation Techniques

```python
import matplotlib.pyplot as plt
from scipy import stats

class SensorValidator:
    def __init__(self):
        self.data_buffer = []
        self.validation_results = {}

    def validate_camera_calibration(self, image_points, world_points, camera_matrix, dist_coeffs):
        """Validate camera calibration."""
        # Reproject 3D points to 2D
        projected_points, _ = cv2.projectPoints(world_points, (0,0,0), (0,0,0), camera_matrix, dist_coeffs)

        # Calculate reprojection error
        reprojection_errors = []
        for i in range(len(image_points)):
            error = np.linalg.norm(image_points[i] - projected_points[i].flatten())
            reprojection_errors.append(error)

        mean_error = np.mean(reprojection_errors)
        std_error = np.std(reprojection_errors)

        print(f"Camera Calibration Validation:")
        print(f"Mean reprojection error: {mean_error:.3f} pixels")
        print(f"Standard deviation: {std_error:.3f} pixels")

        # Plot error distribution
        plt.figure(figsize=(10, 4))
        plt.subplot(1, 2, 1)
        plt.hist(reprojection_errors, bins=30)
        plt.title("Reprojection Error Distribution")
        plt.xlabel("Error (pixels)")
        plt.ylabel("Frequency")

        plt.subplot(1, 2, 2)
        plt.scatter(range(len(reprojection_errors)), reprojection_errors)
        plt.title("Reprojection Error vs Point Index")
        plt.xlabel("Point Index")
        plt.ylabel("Error (pixels)")
        plt.tight_layout()
        plt.show()

        return mean_error, std_error

    def validate_imu_bias(self, imu_data, stationary_duration=10.0):
        """Validate IMU bias during stationary periods."""
        # Extract stationary data (assuming provided data is from stationary period)
        accel_data = np.array([[d.linear_acceleration.x, d.linear_acceleration.y, d.linear_acceleration.z]
                              for d in imu_data])
        gyro_data = np.array([[d.angular_velocity.x, d.angular_velocity.y, d.angular_velocity.z]
                             for d in imu_data])

        # Calculate bias estimates
        accel_bias = np.mean(accel_data, axis=0)
        gyro_bias = np.mean(gyro_data, axis=0)

        # Expected values
        expected_accel = np.array([0, 0, 9.81])  # Gravity in z-direction
        expected_gyro = np.array([0, 0, 0])      # No rotation

        # Calculate errors
        accel_error = np.linalg.norm(accel_bias - expected_accel)
        gyro_error = np.linalg.norm(gyro_bias - expected_gyro)

        print(f"IMU Validation (Stationary):")
        print(f"Acceleration bias: {accel_bias}")
        print(f"Expected: [0, 0, 9.81], Error: {accel_error:.3f}")
        print(f"Gyro bias: {gyro_bias}")
        print(f"Expected: [0, 0, 0], Error: {gyro_error:.3f}")

        return accel_error, gyro_error, accel_bias, gyro_bias

    def validate_lidar_linearity(self, known_distances, measured_ranges):
        """Validate LiDAR range accuracy."""
        # Calculate errors
        errors = [meas - known for meas, known in zip(measured_ranges, known_distances)]

        # Linear regression to check for systematic errors
        slope, intercept, r_value, p_value, std_err = stats.linregress(known_distances, measured_ranges)

        print(f"LiDAR Validation:")
        print(f"Linearity R²: {r_value**2:.3f}")
        print(f"Slope: {slope:.3f} (should be ~1.0)")
        print(f"Intercept: {intercept:.3f} (should be ~0.0)")
        print(f"Mean absolute error: {np.mean(np.abs(errors)):.3f}m")
        print(f"Standard deviation: {np.std(errors):.3f}m")

        # Plot results
        plt.figure(figsize=(12, 4))

        plt.subplot(1, 3, 1)
        plt.scatter(known_distances, measured_ranges)
        plt.plot(known_distances, [slope*d + intercept for d in known_distances], 'r-', label='Fit')
        plt.plot([0, max(known_distances)], [0, max(known_distances)], 'k--', label='Ideal')
        plt.xlabel("Known Distance (m)")
        plt.ylabel("Measured Distance (m)")
        plt.legend()
        plt.title("LiDAR Range vs True Distance")

        plt.subplot(1, 3, 2)
        plt.scatter(known_distances, errors)
        plt.axhline(y=0, color='k', linestyle='--')
        plt.xlabel("Known Distance (m)")
        plt.ylabel("Error (m)")
        plt.title("Range Error vs Distance")

        plt.subplot(1, 3, 3)
        plt.hist(errors, bins=20)
        plt.xlabel("Error (m)")
        plt.ylabel("Frequency")
        plt.title("Error Distribution")

        plt.tight_layout()
        plt.show()

        return slope, intercept, r_value**2, np.mean(errors), np.std(errors)
```

## Performance Optimization

### Efficient Sensor Simulation

```python
import threading
import queue
import time

class EfficientSensorSimulator:
    def __init__(self):
        self.sensors = {}
        self.data_queues = {}
        self.running = False
        self.threads = []

    def add_sensor(self, name, sensor_func, update_rate):
        """Add a sensor with its update function and rate."""
        self.sensors[name] = {
            'func': sensor_func,
            'rate': update_rate,
            'period': 1.0 / update_rate,
            'last_update': 0.0
        }
        self.data_queues[name] = queue.Queue(maxsize=2)  # Limit queue size

    def sensor_worker(self, name):
        """Worker thread for a specific sensor."""
        sensor_info = self.sensors[name]

        while self.running:
            start_time = time.time()

            try:
                # Generate sensor data
                data = sensor_info['func']()

                # Put data in queue (non-blocking)
                try:
                    self.data_queues[name].put_nowait(data)
                except queue.Full:
                    # Queue full, skip this update
                    pass

            except Exception as e:
                print(f"Error in {name} sensor: {e}")

            # Sleep for remaining time to maintain update rate
            elapsed = time.time() - start_time
            sleep_time = max(0, sensor_info['period'] - elapsed)

            if sleep_time > 0:
                time.sleep(sleep_time)

    def start_simulation(self):
        """Start all sensor simulation threads."""
        self.running = True

        for name in self.sensors:
            thread = threading.Thread(target=self.sensor_worker, args=(name,))
            thread.daemon = True
            thread.start()
            self.threads.append(thread)

    def stop_simulation(self):
        """Stop all sensor simulation."""
        self.running = False

        for thread in self.threads:
            thread.join(timeout=1.0)  # Wait up to 1 second for each thread

    def get_sensor_data(self, name, timeout=None):
        """Get the latest sensor data."""
        try:
            return self.data_queues[name].get(timeout=timeout)
        except queue.Empty:
            return None

# Example usage:
def camera_simulator():
    # Simulate camera data generation
    time.sleep(0.01)  # Simulate processing time
    return f"Camera frame at {time.time()}"

def imu_simulator():
    # Simulate IMU data generation
    time.sleep(0.001)  # Simulate processing time
    return {"accel": [0, 0, 9.8], "gyro": [0, 0, 0], "timestamp": time.time()}

# Setup efficient simulation
sim = EfficientSensorSimulator()
sim.add_sensor("camera", camera_simulator, 30.0)  # 30 Hz
sim.add_sensor("imu", imu_simulator, 100.0)       # 100 Hz

sim.start_simulation()

# Use the simulated data
for i in range(100):
    camera_data = sim.get_sensor_data("camera", timeout=0.1)
    imu_data = sim.get_sensor_data("imu", timeout=0.02)

    if camera_data:
        print(f"Got camera data: {camera_data}")
    if imu_data:
        print(f"Got IMU data: {imu_data}")

    time.sleep(0.033)  # 30 Hz main loop

sim.stop_simulation()
```

## Summary

Sensor simulation is a critical component of robotics development, enabling the testing and validation of perception and control systems in a safe and controlled environment. Realistic sensor simulation requires careful modeling of noise characteristics, environmental effects, and sensor limitations to ensure that algorithms developed in simulation will perform well on real hardware.

For humanoid robots, which operate in complex human environments, sensor simulation must accurately represent the challenges of vision, navigation, and interaction in these spaces. This includes modeling lighting variations, dynamic obstacles, and the complex sensor requirements for human-robot interaction.

The integration of multiple sensors through sensor fusion techniques allows for more robust and reliable robot perception, and simulation provides the perfect environment to develop and test these fusion algorithms before deployment on physical systems.

## Key Takeaways

- Realistic sensor simulation is essential for safe and cost-effective robotics development
- Different sensor types require specific modeling approaches and noise characteristics
- Unity and Gazebo provide complementary capabilities for visual and physics simulation
- Sensor fusion combines multiple sensor inputs for improved perception
- Proper validation and calibration ensure simulation accuracy
- Performance optimization is crucial for real-time applications
- Domain randomization improves generalization to real-world conditions
- Synthetic data generation accelerates AI model training