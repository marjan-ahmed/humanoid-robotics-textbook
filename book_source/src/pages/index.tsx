import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HeroSection(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <Heading as="h1" className={styles.mainHeading}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroSubtitle}>
              {siteConfig.tagline}
            </p>
            <p className={styles.heroDescription}>
              A comprehensive course bridging artificial intelligence and physical embodiment.
              Learn to design, simulate, and deploy humanoid robots using cutting-edge technologies
              including ROS 2, Gazebo, NVIDIA Isaac, and Vision-Language-Action systems.
            </p>
            <Link className={styles.startButton} to="/docs/intro">
              Start Learning
            </Link>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.splineContainer}>
              <iframe
                src="https://my.spline.design/nexbotrobotcharacterconcept-MG83VbrZP2WwRpoa3FnoXgxj/"
                frameBorder="0"
                width="100%"
                height="100%"
                title="3D Robot Character"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChapterCards(): ReactNode {
  const chapters = [
    {
      title: "ROS 2 Fundamentals",
      description: "Master the Robot Operating System for humanoid control and communication.",
      duration: "3 weeks"
    },
    {
      title: "Digital Twin Simulation",
      description: "Build physics simulations using Gazebo and Unity for robot testing.",
      duration: "2 weeks"
    },
    {
      title: "AI Robot Brain",
      description: "Implement NVIDIA Isaac tools for perception and navigation systems.",
      duration: "3 weeks"
    },
    {
      title: "Vision-Language-Action",
      description: "Create conversational robots that respond to voice commands and perform tasks.",
      duration: "3 weeks"
    }
  ];

  return (
    <section className={styles.chapterSection}>
      <div className="container">
        <div className={styles.chapterGrid}>
          {chapters.map((chapter, index) => (
            <div key={index} className={styles.chapterCard}>
              <div className={styles.chapterContent}>
                <Heading as="h3" className={styles.chapterTitle}>{chapter.title}</Heading>
                <p className={styles.chapterDescription}>{chapter.description}</p>
                <div className={styles.chapterDuration}>{chapter.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseOverview(): ReactNode {
  return (
    <section className={styles.courseOverviewSection}>
      <div className="container">
        <div className={styles.sectionContent}>
          <Heading as="h2" className={styles.sectionTitle}>About This Course</Heading>
          <div className={styles.courseGrid}>
            <div className={styles.courseFeature}>
              <Heading as="h3" className={styles.featureTitle}>Physical AI Foundation</Heading>
              <p>Explore the principles of Physical AI—AI systems that function in reality and comprehend physical laws. Students learn to design, simulate, and deploy humanoid robots capable of natural human interactions.</p>
            </div>
            <div className={styles.courseFeature}>
              <Heading as="h3" className={styles.featureTitle}>Industry-Standard Tools</Heading>
              <p>Master cutting-edge technologies including ROS 2, Gazebo, Unity, NVIDIA Isaac, and Vision-Language-Action systems. These tools are used by leading robotics companies worldwide.</p>
            </div>
            <div className={styles.courseFeature}>
              <Heading as="h3" className={styles.featureTitle}>Hands-On Learning</Heading>
              <p>Gain practical experience through simulation and real-world projects. Build complete robotic systems from the ground up, implementing perception, navigation, and interaction capabilities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LearningOutcomes(): ReactNode {
  const outcomes = [
    "Understand Physical AI principles and embodied intelligence",
    "Master ROS 2 (Robot Operating System) for robotic control",
    "Simulate robots with Gazebo and Unity",
    "Develop with NVIDIA Isaac AI robot platform",
    "Design humanoid robots for natural interactions",
    "Integrate GPT models for conversational robotics"
  ];

  return (
    <section className={styles.outcomesSection}>
      <div className="container">
        <div className={styles.sectionContent}>
          <Heading as="h2" className={styles.sectionTitle}>What You'll Learn</Heading>
          <div className={styles.outcomesGrid}>
            {outcomes.map((outcome, index) => (
              <div key={index} className={styles.outcomeItem}>
                <div className={styles.outcomeIcon}>✓</div>
                <p className={styles.outcomeText}>{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustryRelevance(): ReactNode {
  return (
    <section className={styles.industrySection}>
      <div className="container">
        <div className={styles.sectionContent}>
          <Heading as="h2" className={styles.sectionTitle}>Industry Impact</Heading>
          <div className={styles.industryGrid}>
            <div className={styles.industryFeature}>
              <Heading as="h3" className={styles.featureTitle}>Market Opportunity</Heading>
              <p>The robotics industry is projected to reach $260 billion by 2030. Companies like Boston Dynamics, Tesla, and countless startups are actively seeking engineers with expertise in humanoid robotics and Physical AI.</p>
            </div>
            <div className={styles.industryFeature}>
              <Heading as="h3" className={styles.featureTitle}>Real-World Applications</Heading>
              <p>From healthcare assistants to disaster response, humanoid robots will transform industries by performing tasks in human environments. The skills you learn directly translate to cutting-edge applications in robotics and AI.</p>
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
      description="A comprehensive course on Physical AI, ROS 2, Gazebo, NVIDIA Isaac, and Vision-Language-Action Robotics">
      <main>
        <HeroSection />
        <CourseOverview />
        <LearningOutcomes />
        <IndustryRelevance />
        <ChapterCards />
      </main>
    </Layout>
  );
}
