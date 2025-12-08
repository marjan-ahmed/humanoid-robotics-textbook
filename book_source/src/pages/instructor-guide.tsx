import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './instructor-guide.module.css';

function InstructorGuide(): ReactNode {
  return (
    <section className={styles.instructorGuide}>
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <Heading as="h1" className="text--center padding-bottom--lg">
              Instructor Guide: Physical AI & Humanoid Robotics
            </Heading>

            <div className="text--center padding-bottom--lg">
              <p className="padding-horiz--md">
                Resources and guidance for instructors teaching the Physical AI & Humanoid Robotics course.
                This guide provides detailed information about course structure, assessment strategies, and teaching resources.
              </p>
            </div>

            <div className="course-structure padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Course Structure Overview</Heading>
              <div className="structure-card">
                <p><strong>Total Duration:</strong> 13 weeks (Quarter system)</p>
                <p><strong>Contact Hours:</strong> 4 hours per week (2 lecture, 2 lab)</p>
                <p><strong>Prerequisites:</strong> Intermediate Python programming, basic AI/ML concepts, familiarity with Linux command line</p>

                <div className="module-breakdown padding-vert--md">
                  <Heading as="h3">Module Breakdown</Heading>
                  <div className="module-item">
                    <p><strong>Module 1: The Robotic Nervous System (ROS 2)</strong> - Weeks 3-5</p>
                    <p>Focus: ROS 2 architecture, Nodes, Topics, Services, rclpy, URDF</p>
                    <p>Lab Focus: Basic ROS 2 system implementation with simulated humanoid control</p>
                  </div>

                  <div className="module-item">
                    <p><strong>Module 2: The Digital Twin (Gazebo & Unity)</strong> - Weeks 6-7</p>
                    <p>Focus: Physics simulation, environment building, sensor simulation</p>
                    <p>Lab Focus: Complete simulation environment with multiple sensors</p>
                  </div>

                  <div className="module-item">
                    <p><strong>Module 3: The AI-Robot Brain (NVIDIA Isaac™)</strong> - Weeks 8-10</p>
                    <p>Focus: Isaac Sim, VSLAM, Nav2, path planning</p>
                    <p>Lab Focus: Autonomous navigation system for humanoid robot</p>
                  </div>

                  <div className="module-item">
                    <p><strong>Module 4: Vision-Language-Action (VLA)</strong> - Weeks 11-13</p>
                    <p>Focus: LLM integration, voice commands, cognitive planning</p>
                    <p>Lab Focus: Voice-controlled humanoid robot performing complex tasks</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="assessment-strategies padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Assessment Strategies</Heading>
              <div className="assessment-card">
                <div className="assessment-type">
                  <Heading as="h3">Module Projects (60% of grade)</Heading>
                  <p>Each module concludes with a hands-on project that demonstrates practical skills:</p>
                  <ul>
                    <li><strong>Module 1:</strong> Basic ROS 2 system controlling a simulated humanoid robot</li>
                    <li><strong>Module 2:</strong> Complete simulation environment with realistic physics and sensors</li>
                    <li><strong>Module 3:</strong> Autonomous navigation system using Isaac tools</li>
                    <li><strong>Module 4:</strong> Voice-controlled robot performing complex tasks</li>
                  </ul>
                  <p><strong>Evaluation Criteria:</strong> Functionality (40%), Documentation (30%), Innovation (20%), Presentation (10%)</p>
                </div>

                <div className="assessment-type padding-vert--md">
                  <Heading as="h3">Midterm Exam (15% of grade)</Heading>
                  <p>Covers theoretical concepts from Modules 1 and 2:</p>
                  <ul>
                    <li>ROS 2 architecture and communication patterns</li>
                    <li>Simulation principles and physics modeling</li>
                    <li>Middleware concepts and robot control</li>
                  </ul>
                </div>

                <div className="assessment-type padding-vert--md">
                  <Heading as="h3">Final Project (20% of grade)</Heading>
                  <p>Capstone project integrating all modules:</p>
                  <p>Students create a complete humanoid robot system that demonstrates capabilities from all four modules, including voice control, autonomous navigation, and complex task execution.</p>
                  <p><strong>Requirements:</strong> Working system demonstration, comprehensive documentation, peer presentation</p>
                </div>

                <div className="assessment-type padding-vert--md">
                  <Heading as="h3">Participation (5% of grade)</Heading>
                  <p>Evaluation based on:</p>
                  <ul>
                    <li>Lab attendance and active participation</li>
                    <li>Peer collaboration and code reviews</li>
                    <li>Contribution to class discussions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="teaching-resources padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Teaching Resources</Heading>
              <div className="resources-card">
                <div className="resource-category">
                  <Heading as="h3">Technical Infrastructure</Heading>
                  <ul>
                    <li>NVIDIA Isaac Sim cloud instances for student access</li>
                    <li>University robotics lab with humanoid robots</li>
                    <li>High-performance computing cluster for simulation</li>
                    <li>Version control system (Git) with student repositories</li>
                  </ul>
                </div>

                <div className="resource-category padding-vert--md">
                  <Heading as="h3">Course Materials</Heading>
                  <ul>
                    <li>Comprehensive lecture slides and notes</li>
                    <li>Step-by-step tutorials for each technology stack</li>
                    <li>Sample code and project templates</li>
                    <li>Video demonstrations of key concepts</li>
                    <li>Assessment rubrics and grading guidelines</li>
                  </ul>
                </div>

                <div className="resource-category padding-vert--md">
                  <Heading as="h3">Support Materials</Heading>
                  <ul>
                    <li>TA training materials and guidelines</li>
                    <li>Common student questions and answers</li>
                    <li>Troubleshooting guides for technical issues</li>
                    <li>Backup plans for technical difficulties</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="weekly-schedule padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Detailed Weekly Schedule</Heading>
              <div className="schedule-card">
                <div className="week-item">
                  <Heading as="h3">Weeks 1-2: Introduction to Physical AI</Heading>
                  <p><strong>Topics:</strong> Foundations of Physical AI, embodied intelligence, course overview</p>
                  <p><strong>Activities:</strong> Course introduction, hardware setup, development environment configuration</p>
                  <p><strong>Outcomes:</strong> Students understand Physical AI principles and set up their development environment</p>
                </div>

                <div className="week-item padding-vert--md">
                  <Heading as="h3">Weeks 3-5: ROS 2 Fundamentals (Module 1)</Heading>
                  <p><strong>Week 3:</strong> ROS 2 architecture, Nodes, Topics, Services</p>
                  <p><strong>Week 4:</strong> rclpy, Python Agents, ROS controllers</p>
                  <p><strong>Week 5:</strong> URDF, robot description, Module 1 project</p>
                </div>

                <div className="week-item padding-vert--md">
                  <Heading as="h3">Weeks 6-7: Robot Simulation (Module 2)</Heading>
                  <p><strong>Week 6:</strong> Gazebo physics simulation, environment building</p>
                  <p><strong>Week 7:</strong> Unity visualization, sensor simulation, Module 2 project</p>
                </div>

                <div className="week-item padding-vert--md">
                  <Heading as="h3">Weeks 8-10: NVIDIA Isaac Platform (Module 3)</Heading>
                  <p><strong>Week 8:</strong> Isaac Sim, synthetic data generation</p>
                  <p><strong>Week 9:</strong> Isaac ROS, VSLAM, perception systems</p>
                  <p><strong>Week 10:</strong> Nav2, path planning, Module 3 project</p>
                </div>

                <div className="week-item padding-vert--md">
                  <Heading as="h3">Weeks 11-12: Humanoid Robot Development</Heading>
                  <p><strong>Week 11:</strong> Bipedal locomotion, balance control</p>
                  <p><strong>Week 12:</strong> Advanced humanoid control systems</p>
                </div>

                <div className="week-item padding-vert--md">
                  <Heading as="h3">Week 13: Conversational Robotics (Module 4)</Heading>
                  <p><strong>Topics:</strong> GPT integration, voice commands, cognitive planning</p>
                  <p><strong>Activities:</strong> Final project presentations, course wrap-up</p>
                </div>
              </div>
            </div>

            <div className="best-practices padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Teaching Best Practices</Heading>
              <div className="practices-card">
                <ul>
                  <li><strong>Hands-on Approach:</strong> Emphasize practical implementation over theoretical concepts</li>
                  <li><strong>Progressive Complexity:</strong> Start with simple examples and gradually increase complexity</li>
                  <li><strong>Real-World Applications:</strong> Connect concepts to current industry applications</li>
                  <li><strong>Collaborative Learning:</strong> Encourage peer-to-peer learning and group projects</li>
                  <li><strong>Continuous Feedback:</strong> Provide regular feedback on student progress</li>
                  <li><strong>Troubleshooting Skills:</strong> Teach students how to debug and solve technical issues independently</li>
                </ul>
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
                to="/docs/intro">
                Student Materials
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function InstructorGuidePage(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Instructor Guide - ${siteConfig.title}`}
      description="Resources and guidance for instructors teaching the Physical AI & Humanoid Robotics course">
      <main>
        <InstructorGuide />
      </main>
    </Layout>
  );
}