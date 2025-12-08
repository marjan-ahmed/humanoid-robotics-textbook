import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './weekly-schedule.module.css';

function WeeklySchedule(): ReactNode {
  return (
    <section className={styles.weeklySchedule}>
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <Heading as="h1" className="text--center padding-bottom--lg">
              Weekly Schedule: Physical AI & Humanoid Robotics
            </Heading>

            <div className="text--center padding-bottom--lg">
              <p className="padding-horiz--md">
                Detailed weekly breakdown of the Physical AI & Humanoid Robotics course curriculum.
                This schedule provides a comprehensive overview of topics, activities, and outcomes for each week.
              </p>
            </div>

            <div className="schedule-details padding-vert--lg">
              <div className="week-item">
                <div className="week-header">
                  <Heading as="h2">Weeks 1-2: Introduction to Physical AI</Heading>
                  <p className="week-duration">Duration: 2 weeks</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>Foundations of Physical AI</li>
                      <li>Embodied intelligence concepts</li>
                      <li>Course overview and objectives</li>
                      <li>Introduction to humanoid robotics</li>
                      <li>Physical AI vs. traditional AI systems</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Course introduction and expectations</li>
                      <li>Hardware setup and configuration</li>
                      <li>Development environment installation</li>
                      <li>Introduction to simulation tools</li>
                      <li>Overview of the technology stack</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Understand Physical AI principles</li>
                      <li>Set up development environment</li>
                      <li>Configure simulation tools</li>
                      <li>Prepare for subsequent modules</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Resources</Heading>
                    <ul>
                      <li>Course syllabus and schedule</li>
                      <li>Hardware requirements document</li>
                      <li>Software installation guides</li>
                      <li>Introduction to ROS 2 concepts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 3: ROS 2 Architecture</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>ROS 2 architecture and middleware concepts</li>
                      <li>Nodes, Topics, and Services in ROS 2</li>
                      <li>Communication patterns and messaging</li>
                      <li>ROS 2 launch files and parameter management</li>
                      <li>Package structure and workspace setup</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Install and configure ROS 2 Humble Hawksbill</li>
                      <li>Create first ROS 2 nodes and publishers/subscribers</li>
                      <li>Implement basic communication between nodes</li>
                      <li>Work with ROS 2 tools (ros2 topic, ros2 service, etc.)</li>
                      <li>Set up development workspace</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Understand ROS 2 architecture</li>
                      <li>Create and run ROS 2 nodes</li>
                      <li>Implement publisher-subscriber communication</li>
                      <li>Use ROS 2 command-line tools</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 4: ROS 2 Python Agents</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>rclpy: Python ROS client library</li>
                      <li>Creating Python agents for robot control</li>
                      <li>ROS controllers and action servers</li>
                      <li>Parameter management and configuration</li>
                      <li>Error handling and debugging in ROS 2</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Implement Python nodes using rclpy</li>
                      <li>Create action servers for robot control</li>
                      <li>Connect Python agents to robot controllers</li>
                      <li>Debug common ROS 2 issues</li>
                      <li>Implement parameter management</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Develop Python agents for ROS 2</li>
                      <li>Connect agents to robot controllers</li>
                      <li>Implement action-based communication</li>
                      <li>Debug ROS 2 systems effectively</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 5: URDF for Humanoids</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>Unified Robot Description Format (URDF)</li>
                      <li>Modeling humanoid robot kinematics</li>
                      <li>Links, joints, and robot kinematic chains</li>
                      <li>Visual and collision properties</li>
                      <li>Transmission and sensor definitions</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Create URDF files for humanoid robots</li>
                      <li>Define robot kinematic chains</li>
                      <li>Configure visual and collision properties</li>
                      <li>Test robot models in RViz</li>
                      <li>Implement Module 1 project</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Create URDF models for humanoid robots</li>
                      <li>Define robot kinematics and dynamics</li>
                      <li>Visualize robot models in simulation</li>
                      <li>Complete Module 1 deliverables</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 6: Physics Simulation in Gazebo</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>Physics simulation principles</li>
                      <li>Gazebo simulation environment</li>
                      <li>Environment modeling and scene setup</li>
                      <li>Physics properties: gravity, friction, collisions</li>
                      <li>Integration with ROS 2</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Set up Gazebo simulation environment</li>
                      <li>Create custom environments and scenes</li>
                      <li>Configure physics properties for humanoid robots</li>
                      <li>Test robot models in simulated environments</li>
                      <li>Implement basic robot control in simulation</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Configure Gazebo simulation environments</li>
                      <li>Set up physics properties for humanoid robots</li>
                      <li>Integrate Gazebo with ROS 2</li>
                      <li>Control robots in simulated environments</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 7: Unity for Robot Visualization</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>Unity for high-fidelity robot visualization</li>
                      <li>Human-robot interaction in Unity</li>
                      <li>Unity-ROS bridge for real-time simulation</li>
                      <li>Custom visualization tools</li>
                      <li>Module 2 project implementation</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Set up Unity for robot visualization</li>
                      <li>Create Unity scenes for robot environments</li>
                      <li>Implement Unity-ROS bridge communication</li>
                      <li>Design human-robot interaction interfaces</li>
                      <li>Complete Module 2 project</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Use Unity for robot visualization</li>
                      <li>Implement Unity-ROS communication</li>
                      <li>Create interactive robot interfaces</li>
                      <li>Complete Module 2 deliverables</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 8: NVIDIA Isaac Sim</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>NVIDIA Isaac Sim for photorealistic simulation</li>
                      <li>Synthetic data generation techniques</li>
                      <li>Perception system simulation</li>
                      <li>Hardware-accelerated simulation</li>
                      <li>Integration with AI training pipelines</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Install and configure NVIDIA Isaac Sim</li>
                      <li>Create photorealistic simulation environments</li>
                      <li>Generate synthetic training data</li>
                      <li>Test perception systems in simulation</li>
                      <li>Integrate with AI training frameworks</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Configure Isaac Sim environments</li>
                      <li>Generate synthetic data for AI training</li>
                      <li>Simulate perception systems</li>
                      <li>Integrate simulation with AI workflows</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 9: Isaac ROS and VSLAM</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>NVIDIA Isaac ROS packages</li>
                      <li>Hardware-accelerated Visual SLAM (VSLAM)</li>
                      <li>Sensor processing and perception</li>
                      <li>Integration with navigation systems</li>
                      <li>Performance optimization</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Install and configure Isaac ROS packages</li>
                      <li>Implement VSLAM systems</li>
                      <li>Process sensor data with accelerated packages</li>
                      <li>Test perception systems with real sensors</li>
                      <li>Optimize performance for humanoid robots</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Use Isaac ROS packages effectively</li>
                      <li>Implement hardware-accelerated VSLAM</li>
                      <li>Process sensor data efficiently</li>
                      <li>Optimize perception systems for robots</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 10: Nav2 for Bipedal Movement</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>Navigation 2 (Nav2) for humanoid robots</li>
                      <li>Path planning for bipedal locomotion</li>
                      <li>Navigation in complex environments</li>
                      <li>Adapting Nav2 for humanoid kinematics</li>
                      <li>Module 3 project implementation</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Configure Nav2 for humanoid robots</li>
                      <li>Implement path planning for bipedal movement</li>
                      <li>Test navigation in various environments</li>
                      <li>Adapt navigation algorithms for humanoids</li>
                      <li>Complete Module 3 project</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Configure Nav2 for humanoid robots</li>
                      <li>Implement bipedal navigation systems</li>
                      <li>Adapt navigation for special kinematics</li>
                      <li>Complete Module 3 deliverables</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 11: Bipedal Locomotion and Balance</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>Principles of bipedal locomotion</li>
                      <li>Balance control algorithms</li>
                      <li>Walking pattern generation</li>
                      <li>Stability and control systems</li>
                      <li>Integration with perception systems</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Implement balance control algorithms</li>
                      <li>Generate walking patterns for humanoid robots</li>
                      <li>Test stability in simulation and reality</li>
                      <li>Integrate with perception for adaptive walking</li>
                      <li>Optimize walking parameters</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Implement bipedal locomotion systems</li>
                      <li>Control balance in humanoid robots</li>
                      <li>Generate stable walking patterns</li>
                      <li>Integrate locomotion with perception</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 12: Advanced Humanoid Control</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>Advanced humanoid control systems</li>
                      <li>Multi-modal interaction systems</li>
                      <li>Manipulation and grasping for humanoids</li>
                      <li>Whole-body control strategies</li>
                      <li>Humanoid-specific control challenges</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Implement advanced control algorithms</li>
                      <li>Develop manipulation capabilities</li>
                      <li>Test whole-body control strategies</li>
                      <li>Address humanoid-specific challenges</li>
                      <li>Prepare for Module 4</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Implement advanced humanoid controls</li>
                      <li>Develop manipulation capabilities</li>
                      <li>Use whole-body control strategies</li>
                      <li>Address humanoid-specific challenges</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="week-item padding-vert--md">
                <div className="week-header">
                  <Heading as="h2">Week 13: Conversational Robotics</Heading>
                  <p className="week-duration">Duration: 1 week</p>
                </div>
                <div className="week-content">
                  <div className="week-section">
                    <Heading as="h3">Topics</Heading>
                    <ul>
                      <li>Integrating GPT models for conversational AI</li>
                      <li>Voice-to-action systems using OpenAI Whisper</li>
                      <li>Cognitive planning with LLMs</li>
                      <li>Natural language to ROS 2 action translation</li>
                      <li>Final project presentations</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Activities</Heading>
                    <ul>
                      <li>Integrate GPT models with robot systems</li>
                      <li>Implement voice command recognition</li>
                      <li>Develop cognitive planning capabilities</li>
                      <li>Translate natural language to robot actions</li>
                      <li>Final project presentations and demos</li>
                    </ul>
                  </div>

                  <div className="week-section">
                    <Heading as="h3">Learning Outcomes</Heading>
                    <ul>
                      <li>Integrate conversational AI with robots</li>
                      <li>Implement voice-controlled robot actions</li>
                      <li>Develop cognitive planning systems</li>
                      <li>Complete capstone project</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="text--center padding-vert--lg">
              <Link
                className="button button--primary button--lg margin-right--md"
                to="/course-overview">
                Course Overview
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/instructor-guide">
                Instructor Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WeeklySchedulePage(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Weekly Schedule - ${siteConfig.title}`}
      description="Detailed weekly breakdown of the Physical AI & Humanoid Robotics course curriculum">
      <main>
        <WeeklySchedule />
      </main>
    </Layout>
  );
}