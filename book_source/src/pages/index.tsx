import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Learning - Physical AI & Humanoid Robotics
          </Link>
        </div>
      </div>
    </header>
  );
}

function CourseOverview(): ReactNode {
  return (
    <section className={styles.courseOverview}>
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Heading as="h2" className="text--center padding-bottom--lg">
              Course Overview
            </Heading>
            <div className="text--center padding-horiz--md">
              <p className="padding-bottom--md">
                The future of AI extends beyond digital spaces into the physical world. This capstone quarter introduces Physical AI—AI systems that function in reality and comprehend physical laws. Students learn to design, simulate, and deploy humanoid robots capable of natural human interactions using ROS 2, Gazebo, and NVIDIA Isaac.
              </p>

              <div className="module-overview padding-vert--lg">
                <Heading as="h3">4 Learning Modules</Heading>
                <div className="module-card">
                  <Heading as="h4">Module 1: The Robotic Nervous System (ROS 2)</Heading>
                  <p>Middleware for robot control. ROS 2 Nodes, Topics, and Services. Bridging Python Agents to ROS controllers using rclpy. Understanding URDF (Unified Robot Description Format) for humanoids.</p>
                </div>
                <div className="module-card">
                  <Heading as="h4">Module 2: The Digital Twin (Gazebo & Unity)</Heading>
                  <p>Physics simulation and environment building. Simulating physics, gravity, and collisions in Gazebo. High-fidelity rendering and human-robot interaction in Unity. Simulating sensors: LiDAR, Depth Cameras, and IMUs.</p>
                </div>
                <div className="module-card">
                  <Heading as="h4">Module 3: The AI-Robot Brain (NVIDIA Isaac™)</Heading>
                  <p>Advanced perception and training. NVIDIA Isaac Sim: Photorealistic simulation and synthetic data generation. Isaac ROS: Hardware-accelerated VSLAM (Visual SLAM) and navigation. Nav2: Path planning for bipedal humanoid movement.</p>
                </div>
                <div className="module-card">
                  <Heading as="h4">Module 4: Vision-Language-Action (VLA)</Heading>
                  <p>The convergence of LLMs and Robotics. Voice-to-Action: Using OpenAI Whisper for voice commands. Cognitive Planning: Using LLMs to translate natural language ("Clean the room") into a sequence of ROS 2 actions.</p>
                </div>
              </div>

              <div className="learning-outcomes padding-vert--lg">
                <Heading as="h3">Learning Outcomes</Heading>
                <div className="outcome-card">
                  <p>Understand Physical AI principles and embodied intelligence</p>
                </div>
                <div className="outcome-card">
                  <p>Master ROS 2 (Robot Operating System) for robotic control</p>
                </div>
                <div className="outcome-card">
                  <p>Simulate robots with Gazebo and Unity</p>
                </div>
                <div className="outcome-card">
                  <p>Develop with NVIDIA Isaac AI robot platform</p>
                </div>
                <div className="outcome-card">
                  <p>Design humanoid robots for natural interactions</p>
                </div>
                <div className="outcome-card">
                  <p>Integrate GPT models for conversational robotics</p>
                </div>
              </div>

              <div className="weekly-breakdown padding-vert--lg">
                <Heading as="h3">Weekly Breakdown</Heading>
                <p><strong>Weeks 1-2:</strong> Introduction to Physical AI - Foundations of Physical AI and embodied intelligence</p>
                <p><strong>Weeks 3-5:</strong> ROS 2 Fundamentals - ROS 2 architecture, Nodes, Topics, Services, and rclpy</p>
                <p><strong>Weeks 6-7:</strong> Robot Simulation with Gazebo - Physics simulation and sensor simulation</p>
                <p><strong>Weeks 8-10:</strong> NVIDIA Isaac Platform - AI-powered perception and manipulation</p>
                <p><strong>Weeks 11-12:</strong> Humanoid Robot Development - Bipedal locomotion and balance control</p>
                <p><strong>Week 13:</strong> Conversational Robotics - Integrating GPT models for conversational AI in robots</p>
              </div>

              <div className="hardware-requirements padding-vert--lg">
                <Heading as="h3">Hardware Requirements</Heading>
                <p>
                  This course is technically demanding. It sits at the intersection of three heavy computational loads: Physics Simulation (Isaac Sim/Gazebo), Visual Perception (SLAM/Computer Vision), and Generative AI (LLMs/VLA).
                </p>

                <div className="requirements-grid padding-vert--md">
                  <div className="requirement-card">
                    <Heading as="h4">Minimum Requirements</Heading>
                    <p><strong>Workstation:</strong> NVIDIA RTX 4070 (12GB VRAM), Intel Core i7 (12th Gen) or AMD Ryzen 7, 32 GB RAM</p>
                    <p><strong>Performance:</strong> Adequate for basic simulations and development</p>
                  </div>

                  <div className="requirement-card">
                    <Heading as="h4">Recommended Requirements</Heading>
                    <p><strong>Workstation:</strong> NVIDIA RTX 4080 (16GB VRAM) or RTX 6000 Ada, Intel Core i9 (13th Gen) or AMD Ryzen 9, 64 GB DDR5 RAM</p>
                    <p><strong>Performance:</strong> Smooth operation for complex simulations and real-time rendering</p>
                  </div>

                  <div className="requirement-card">
                    <Heading as="h4">High-End Requirements</Heading>
                    <p><strong>Workstation:</strong> NVIDIA RTX 6000 Ada (48GB VRAM) or RTX 5090, Intel Core i9 K-series or AMD Threadripper, 128 GB DDR5 RAM</p>
                    <p><strong>Performance:</strong> Optimal for advanced research, large-scale simulations, and multi-environment testing</p>
                  </div>
                </div>

                <div className="edge-kit padding-vert--md">
                  <Heading as="h4">Edge Computing Kit</Heading>
                  <p><strong>Standard Option:</strong> NVIDIA Jetson Orin Nano (4GB), Intel RealSense D435i, ReSpeaker USB Microphone</p>
                  <p><strong>Enhanced Option:</strong> NVIDIA Jetson Orin NX (8GB), Intel RealSense L515, Respeaker 6-Mic Array, HD Camera</p>
                  <p><strong>Research Option:</strong> NVIDIA Jetson AGX Orin (64GB), FLIR Blackfly S, Custom microphone array</p>
                </div>

                <div className="cloud-option padding-vert--md">
                  <Heading as="h4">Cloud Computing Alternative</Heading>
                  <p>For students without high-end hardware, we recommend cloud computing options:</p>
                  <ul>
                    <li>NVIDIA LaunchPad (free access for educational purposes)</li>
                    <li>AWS EC2 G5/G6 instances with RTX-class GPUs</li>
                    <li>Google Cloud Platform with A2 virtual machines</li>
                    <li>University HPC cluster access</li>
                  </ul>
                </div>

                <div className="budget-options padding-vert--md">
                  <Heading as="h4">Budget Considerations</Heading>
                  <p><strong>Option 1 (Student Budget):</strong> Used workstation with RTX 3070/3080 (8-12GB VRAM), i7-10700K, 32GB RAM - approximately $1,500-2,000</p>
                  <p><strong>Option 2 (Recommended):</strong> New mid-range workstation with RTX 4070 Ti/4080, i9-13900K, 64GB RAM - approximately $3,000-4,000</p>
                  <p><strong>Option 3 (Professional):</strong> High-end workstation with RTX 6000 Ada, Threadripper, 128GB RAM - approximately $6,000-8,000</p>
                </div>

                <div className="difficulty-prerequisites padding-vert--lg">
                  <Heading as="h3">Course Difficulty & Prerequisites</Heading>

                  <div className="difficulty-level padding-vert--md">
                    <Heading as="h4">Difficulty Level: Advanced</Heading>
                    <p>This is an advanced capstone course that combines multiple complex technologies. Students should have:</p>
                    <ul>
                      <li>Intermediate to advanced programming skills in Python</li>
                      <li>Basic understanding of machine learning and AI concepts</li>
                      <li>Familiarity with Linux command line and development environments</li>
                      <li>Understanding of basic linear algebra and calculus concepts</li>
                    </ul>

                    <div className="difficulty-meter">
                      <p><strong>Programming Intensity:</strong> <span className="intensity-level high">High</span></p>
                      <p><strong>Mathematical Requirements:</strong> <span className="intensity-level medium">Medium</span></p>
                      <p><strong>Hardware Demands:</strong> <span className="intensity-level high">High</span></p>
                      <p><strong>Theoretical Concepts:</strong> <span className="intensity-level medium">Medium</span></p>
                      <p><strong>Practical Implementation:</strong> <span className="intensity-level very-high">Very High</span></p>
                    </div>
                  </div>

                  <div className="prerequisites padding-vert--md">
                    <Heading as="h4">Prerequisites</Heading>

                    <div className="prereq-category">
                      <Heading as="h5">Required Knowledge</Heading>
                      <ul>
                        <li>Proficient in Python programming (2+ years experience preferred)</li>
                        <li>Understanding of object-oriented programming concepts</li>
                        <li>Basic knowledge of Linux/Unix operating systems</li>
                        <li>Familiarity with Git version control system</li>
                        <li>Basic understanding of linear algebra (vectors, matrices)</li>
                      </ul>
                    </div>

                    <div className="prereq-category">
                      <Heading as="h5">Recommended Preparation</Heading>
                      <ul>
                        <li>Introductory robotics course or equivalent experience</li>
                        <li>Basic understanding of computer vision concepts</li>
                        <li>Familiarity with simulation environments</li>
                        <li>Experience with C++ (helpful but not required)</li>
                        <li>Introductory machine learning course</li>
                      </ul>
                    </div>

                    <div className="prereq-category">
                      <Heading as="h5">Time Commitment</Heading>
                      <p>This is a 4-unit capstone course with an expected time commitment of 12-15 hours per week, including:</p>
                      <ul>
                        <li>4 hours of lecture/laboratory per week</li>
                        <li>6-8 hours of simulation and development work</li>
                        <li>3-4 hours of reading and research</li>
                      </ul>
                    </div>
                  </div>

                  <div className="preparation-tips padding-vert--md">
                    <Heading as="h4">Preparation Tips for Success</Heading>
                    <div className="tips-grid">
                      <div className="tip-card">
                        <p><strong>Brush up on Python:</strong> Review advanced Python concepts, especially asynchronous programming and working with APIs.</p>
                      </div>
                      <div className="tip-card">
                        <p><strong>Learn Linux:</strong> Practice Linux command line skills, as most tools in this course run on Linux or require Linux-like environments.</p>
                      </div>
                      <div className="tip-card">
                        <p><strong>Math Review:</strong> Refresh your knowledge of linear algebra and calculus, especially as they apply to robotics.</p>
                      </div>
                      <div className="tip-card">
                        <p><strong>Start Early:</strong> Set up your development environment before the course begins to avoid delays.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyPhysicalAI(): ReactNode {
  return (
    <section className={styles.whyPhysicalAI}>
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Heading as="h2" className="text--center padding-bottom--lg">
              Why Physical AI Matters
            </Heading>
            <div className="text--center padding-horiz--md">
              <p className="padding-bottom--md">
                Humanoid robots are poised to excel in our human-centered world because they share our physical form and can be trained with abundant data from interacting in human environments. This represents a significant transition from AI models confined to digital environments to embodied intelligence that operates in physical space.
              </p>

              <div className="value-proposition padding-vert--lg">
                <div className="value-card">
                  <Heading as="h3">The Next Frontier of AI</Heading>
                  <p>Physical AI represents the convergence of artificial intelligence, robotics, and human-centered design. Unlike traditional AI that operates in digital spaces, Physical AI must understand and interact with the physical world, requiring a fundamentally different approach to intelligence.</p>
                </div>

                <div className="value-card">
                  <Heading as="h3">Real-World Impact</Heading>
                  <p>From healthcare assistants to disaster response, humanoid robots will transform industries by performing tasks in human environments. The skills you learn in this course directly translate to cutting-edge applications in robotics and AI.</p>
                </div>

                <div className="value-card">
                  <Heading as="h3">Career Opportunities</Heading>
                  <p>The robotics industry is projected to reach $260 billion by 2030. Companies like Boston Dynamics, Tesla, and countless startups are actively seeking engineers with expertise in humanoid robotics and Physical AI.</p>
                </div>
              </div>

              <div className="industry-trends padding-vert--lg">
                <Heading as="h3">Industry Momentum</Heading>
                <p>Major technology companies are investing billions in humanoid robotics:</p>
                <ul className="trends-list">
                  <li>Tesla's Optimus humanoid robot development</li>
                  <li>Amazon's integration of robotics in logistics</li>
                  <li>Google's and Meta's research in embodied AI</li>
                  <li>Toyota's Human Support Robot initiatives</li>
                  <li>SoftBank's humanoid robot platforms</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Physical AI & Humanoid Robotics`}
      description="A comprehensive course on Physical AI, ROS 2, Gazebo, Unity, NVIDIA Isaac, and Vision-Language-Action Robotics">
      <HomepageHeader />
      <main>
        <CourseOverview />
        <HomepageFeatures />
        <WhyPhysicalAI />
      </main>
    </Layout>
  );
}
