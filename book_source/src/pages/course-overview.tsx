import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './course-overview.module.css';

function ModuleDetails(): ReactNode {
  return (
    <section className={styles.moduleDetails}>
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <Heading as="h1" className="text--center padding-bottom--lg">
              Physical AI & Humanoid Robotics: Course Overview
            </Heading>

            <div className="text--center padding-bottom--lg">
              <p className="padding-horiz--md">
                This comprehensive course introduces students to Physical AI—AI systems that function in reality and comprehend physical laws.
                Students learn to design, simulate, and deploy humanoid robots capable of natural human interactions using ROS 2, Gazebo, and NVIDIA Isaac.
              </p>
            </div>

            <div className="module-section padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Course Modules</Heading>

              <div className="module-detail-card">
                <Heading as="h3">Module 1: The Robotic Nervous System (ROS 2)</Heading>
                <p><strong>Duration:</strong> Weeks 3-5 (3 weeks)</p>
                <p><strong>Learning Objectives:</strong></p>
                <ul>
                  <li>Understand ROS 2 architecture and middleware concepts</li>
                  <li>Implement ROS 2 Nodes, Topics, and Services</li>
                  <li>Bridge Python Agents to ROS controllers using rclpy</li>
                  <li>Create robot descriptions using URDF (Unified Robot Description Format)</li>
                  <li>Control humanoid robots through ROS 2 messaging</li>
                </ul>
                <p><strong>Key Topics:</strong> ROS 2 Nodes, Topics, Services, rclpy, URDF, robot control, middleware architecture</p>
                <p><strong>Assessment:</strong> Students implement a basic ROS 2 system to control a simulated humanoid robot</p>
              </div>

              <div className="module-detail-card">
                <Heading as="h3">Module 2: The Digital Twin (Gazebo & Unity)</Heading>
                <p><strong>Duration:</strong> Weeks 6-7 (2 weeks)</p>
                <p><strong>Learning Objectives:</strong></p>
                <ul>
                  <li>Build physics simulations using Gazebo</li>
                  <li>Create high-fidelity visualizations in Unity</li>
                  <li>Simulate various sensors: LiDAR, Depth Cameras, and IMUs</li>
                  <li>Implement collision detection and physics properties</li>
                  <li>Develop digital twins for robot testing</li>
                </ul>
                <p><strong>Key Topics:</strong> Physics simulation, Gazebo, Unity, sensor simulation, digital twins, environment modeling</p>
                <p><strong>Assessment:</strong> Students create a complete simulation environment with multiple sensors and realistic physics</p>
              </div>

              <div className="module-detail-card">
                <Heading as="h3">Module 3: The AI-Robot Brain (NVIDIA Isaac™)</Heading>
                <p><strong>Duration:</strong> Weeks 8-10 (3 weeks)</p>
                <p><strong>Learning Objectives:</strong></p>
                <ul>
                  <li>Generate synthetic data using NVIDIA Isaac Sim</li>
                  <li>Implement hardware-accelerated VSLAM (Visual SLAM)</li>
                  <li>Configure Nav2 for path planning in humanoid robots</li>
                  <li>Train perception models using NVIDIA Isaac tools</li>
                  <li>Integrate perception and navigation systems</li>
                </ul>
                <p><strong>Key Topics:</strong> Isaac Sim, synthetic data, VSLAM, Nav2, path planning, perception systems</p>
                <p><strong>Assessment:</strong> Students develop an autonomous navigation system for a humanoid robot using Isaac tools</p>
              </div>

              <div className="module-detail-card">
                <Heading as="h3">Module 4: Vision-Language-Action (VLA)</Heading>
                <p><strong>Duration:</strong> Weeks 11-13 (3 weeks)</p>
                <p><strong>Learning Objectives:</strong></p>
                <ul>
                  <li>Integrate LLMs with robotic systems for cognitive planning</li>
                  <li>Implement voice-to-action systems using OpenAI Whisper</li>
                  <li>Design natural language processing for robot commands</li>
                  <li>Execute complex actions based on verbal instructions</li>
                  <li>Build conversational interfaces for humanoid robots</li>
                </ul>
                <p><strong>Key Topics:</strong> Vision-Language-Action models, LLM integration, voice commands, cognitive planning, conversational robotics</p>
                <p><strong>Assessment:</strong> Students create a humanoid robot that responds to voice commands and performs complex tasks</p>
              </div>
            </div>

            <div className="prerequisites-section padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Course Prerequisites</Heading>
              <div className="prerequisites-card">
                <p><strong>Required Knowledge:</strong></p>
                <ul>
                  <li>Intermediate Python programming skills</li>
                  <li>Basic understanding of AI/ML concepts</li>
                  <li>Familiarity with Linux command line</li>
                  <li>Basic knowledge of linear algebra and calculus</li>
                </ul>

                <p><strong>Recommended Preparation:</strong></p>
                <ul>
                  <li>Completion of introductory robotics course</li>
                  <li>Familiarity with computer vision concepts</li>
                  <li>Basic experience with simulation environments</li>
                </ul>
              </div>
            </div>

            <div className="hardware-section padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Hardware Requirements</Heading>
              <div className="hardware-card">
                <p>This course is technically demanding. It sits at the intersection of three heavy computational loads: Physics Simulation (Isaac Sim/Gazebo), Visual Perception (SLAM/Computer Vision), and Generative AI (LLMs/VLA).</p>

                <p><strong>Workstation:</strong> NVIDIA RTX 4070 Ti (12GB VRAM) or higher, Intel Core i7 (13th Gen+) or AMD Ryzen 9, 64 GB DDR5 RAM</p>
                <p><strong>Edge Kit:</strong> NVIDIA Jetson Orin Nano, Intel RealSense D435i, ReSpeaker USB Microphone</p>

                <p><strong>Alternative Options:</strong></p>
                <ul>
                  <li>Cloud-based GPU instances with equivalent specifications</li>
                  <li>University lab access to high-performance computing resources</li>
                  <li>Partner arrangements for shared hardware resources</li>
                </ul>
              </div>
            </div>

            <div className="assessment-section padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Assessment Structure</Heading>
              <div className="assessment-card">
                <ul>
                  <li><strong>Module Projects (60%):</strong> Each module includes a hands-on project demonstrating practical skills</li>
                  <li><strong>Midterm Exam (15%):</strong> Theory and concepts from first two modules</li>
                  <li><strong>Final Project (20%):</strong> Capstone project integrating all modules</li>
                  <li><strong>Participation (5%):</strong> Lab attendance and peer collaboration</li>
                </ul>
              </div>
            </div>

            <div className="resources-section padding-vert--lg">
              <Heading as="h2" className="text--center padding-bottom--md">Additional Resources</Heading>
              <div className="resources-card">
                <ul>
                  <li>Access to NVIDIA Isaac Sim cloud instances</li>
                  <li>University robotics lab with humanoid robots</li>
                  <li>Comprehensive documentation and tutorials</li>
                  <li>Weekly office hours with teaching assistants</li>
                  <li>Peer collaboration tools and shared repositories</li>
                </ul>
              </div>
            </div>

            <div className="text--center padding-vert--lg">
              <Link
                className="button button--primary button--lg margin-right--md"
                to="/docs/intro">
                Student Materials
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/instructor-guide">
                Instructor Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CourseOverview(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Course Overview - ${siteConfig.title}`}
      description="Detailed course overview for instructors of the Physical AI & Humanoid Robotics course">
      <main>
        <ModuleDetails />
      </main>
    </Layout>
  );
}