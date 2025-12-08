import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Explicitly define the sidebar structure for the Physical AI & Humanoid Robotics book
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Chapter 1: Physical AI Foundations',
      items: [
        'chapter-1/index',
        'chapter-1/submodule-1-introduction-to-physical-ai',
        'chapter-1/submodule-2-embodied-intelligence',
        'chapter-1/submodule-3-digital-brain-to-physical-body',
        'chapter-1/submodule-4-humanoid-robot-applications',
        'chapter-1/submodule-5-ai-systems-in-physical-world'
      ],
    },
    {
      type: 'category',
      label: 'Chapter 2: ROS 2 Fundamentals',
      items: [
        'chapter-2/index',
        'chapter-2/submodule-1-ros2-architecture',
        'chapter-2/submodule-2-nodes-topics-and-services',
        'chapter-2/submodule-3-rclpy-and-python-agents',
        'chapter-2/submodule-4-urdf-for-humanoids',
        'chapter-2/submodule-5-middleware-control'
      ],
    },
    {
      type: 'category',
      label: 'Chapter 3: Gazebo & Unity Simulation',
      items: [
        'chapter-3/index',
        'chapter-3/submodule-1-physics-simulation-in-gazebo',
        'chapter-3/submodule-2-unity-for-robot-visualization',
        'chapter-3/submodule-3-sensor-simulation',
        'chapter-3/submodule-4-collision-and-gravity',
        'chapter-3/submodule-5-digital-twins'
      ],
    },
    {
      type: 'category',
      label: 'Chapter 4: NVIDIA Isaac Systems',
      items: [
        'chapter-4/index',
        'chapter-4/submodule-1-isaac-sim',
        'chapter-4/submodule-2-isaac-ros',
        'chapter-4/submodule-3-isaac-navigation',
        'chapter-4/submodule-4-hardware-integration',
        'chapter-4/submodule-5-ai-training-with-isaac'
      ],
    },
    {
      type: 'category',
      label: 'Chapter 5: VLA: Vision-Language-Action Robotics',
      items: [
        'chapter-5/index',
        'chapter-5/submodule-1-foundation-models',
        'chapter-5/submodule-2-action-spaces',
        'chapter-5/submodule-3-training-pipelines',
        'chapter-5/submodule-4-embodied-ai',
        'chapter-5/submodule-5-applications'
      ],
    },
    {
      type: 'category',
      label: 'Chapter 6: Capstone: Autonomous Humanoid',
      items: [
        'chapter-6/index',
        'chapter-6/submodule-1-system-architecture',
        'chapter-6/submodule-2-multimodal-perception',
        'chapter-6/submodule-3-cognitive-architecture',
        'chapter-6/submodule-4-locomotion-control',
        'chapter-6/submodule-5-manipulation-systems'
      ],
    },
  ],
};

export default sidebars;
