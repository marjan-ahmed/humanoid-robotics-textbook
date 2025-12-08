import React from 'react';
import clsx from 'clsx';
import './ModuleOverview.css';

interface ModuleItem {
  title: string;
  description: string;
  topics: string[];
  duration: string;
  prerequisites?: string[];
}

interface ModuleOverviewProps {
  modules: ModuleItem[];
  className?: string;
}

const ModuleOverview: React.FC<ModuleOverviewProps> = ({ modules, className }) => {
  return (
    <div className={clsx('module-overview-container', className)}>
      <h2 className="module-overview__title">Course Modules</h2>
      <div className="module-grid">
        {modules.map((module, index) => (
          <div key={index} className="module-card">
            <div className="module-card__header">
              <h3 className="module-card__title">{module.title}</h3>
              <span className="module-card__duration">{module.duration}</span>
            </div>
            <p className="module-card__description">{module.description}</p>
            <div className="module-card__section">
              <h4 className="module-card__section-title">Key Topics</h4>
              <ul className="module-card__topics">
                {module.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="module-card__topic">{topic}</li>
                ))}
              </ul>
            </div>
            {module.prerequisites && module.prerequisites.length > 0 && (
              <div className="module-card__section">
                <h4 className="module-card__section-title">Prerequisites</h4>
                <ul className="module-card__prerequisites">
                  {module.prerequisites.map((prereq, prereqIndex) => (
                    <li key={prereqIndex} className="module-card__prerequisite">{prereq}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleOverview;