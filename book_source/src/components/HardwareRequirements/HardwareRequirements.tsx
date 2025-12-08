import React from 'react';
import clsx from 'clsx';
import './HardwareRequirements.css';

interface HardwareItem {
  name: string;
  description: string;
  specs: string[];
  cost?: string;
  difficulty?: string;
}

interface HardwareRequirementsProps {
  className?: string;
}

const HardwareRequirements: React.FC<HardwareRequirementsProps> = ({ className }) => {
  const edgeKitItems: HardwareItem[] = [
    {
      name: "NVIDIA Jetson Orin Nano",
      description: "AI supercomputer for autonomous machines",
      specs: ["1024 CUDA Cores", "40 TOPS AI Performance", "2.2 GHz 6-core ARM v8.2 CPU"],
      cost: "$300-400",
      difficulty: "Beginner"
    },
    {
      name: "ROS-compatible Robot Platform",
      description: "Mobile base with sensors and actuators",
      specs: ["LIDAR sensor", "Camera", "IMU", "Motor controllers"],
      cost: "$500-1500",
      difficulty: "Intermediate"
    },
    {
      name: "Robotic Arm (Optional)",
      description: "6-DOF manipulator for interaction",
      specs: ["6 joints", "Gripper end-effector", "Servo motors"],
      cost: "$200-800",
      difficulty: "Advanced"
    }
  ];

  const cloudOptions: HardwareItem[] = [
    {
      name: "AWS RoboMaker",
      description: "Cloud robotics service",
      specs: ["ROS support", "Simulation", "Data processing"],
      cost: "$0.49/hour",
      difficulty: "Intermediate"
    },
    {
      name: "Azure IoT Robotics",
      description: "Cloud-connected robotics platform",
      specs: ["Edge integration", "AI services", "Analytics"],
      cost: "Pay-as-you-go",
      difficulty: "Advanced"
    }
  ];

  const budgetOptions: HardwareItem[] = [
    {
      name: "DIY Robot Platform",
      description: "Custom-built solution",
      specs: ["Raspberry Pi 4", "Motor drivers", "Sensors"],
      cost: "$100-300",
      difficulty: "Advanced"
    },
    {
      name: "Educational Kit",
      description: "Pre-built educational platform",
      specs: ["Pre-configured", "Tutorials", "Support"],
      cost: "$300-600",
      difficulty: "Beginner"
    }
  ];

  const renderHardwareCard = (item: HardwareItem, index: number) => (
    <div key={index} className="hardware-card">
      <h3 className="hardware-card__title">{item.name}</h3>
      <p className="hardware-card__description">{item.description}</p>
      <ul className="hardware-card__specs">
        {item.specs.map((spec, specIndex) => (
          <li key={specIndex} className="hardware-card__spec">{spec}</li>
        ))}
      </ul>
      <div className="hardware-card__meta">
        {item.cost && (
          <span className="hardware-card__cost">
            <strong>Cost:</strong> {item.cost}
          </span>
        )}
        {item.difficulty && (
          <span className="hardware-card__difficulty">
            <strong>Difficulty:</strong> {item.difficulty}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className={clsx('hardware-requirements-container', className)}>
      <div className="hardware-section">
        <h2 className="hardware-section__title">Edge Computing Kit</h2>
        <div className="hardware-grid">
          {edgeKitItems.map((item, index) => renderHardwareCard(item, index))}
        </div>
      </div>

      <div className="hardware-section">
        <h2 className="hardware-section__title">Cloud-Based Options</h2>
        <div className="hardware-grid">
          {cloudOptions.map((item, index) => renderHardwareCard(item, index))}
        </div>
      </div>

      <div className="hardware-section">
        <h2 className="hardware-section__title">Budget Options</h2>
        <div className="hardware-grid">
          {budgetOptions.map((item, index) => renderHardwareCard(item, index))}
        </div>
      </div>
    </div>
  );
};

export default HardwareRequirements;