import React from 'react';
import clsx from 'clsx';
import './LearningOutcomes.css';

interface OutcomeItem {
  title: string;
  description: string;
  icon?: string;
}

interface LearningOutcomesProps {
  outcomes: OutcomeItem[];
  className?: string;
}

const LearningOutcomes: React.FC<LearningOutcomesProps> = ({ outcomes, className }) => {
  return (
    <div className={clsx('learning-outcomes-container', className)}>
      <h2 className="learning-outcomes__title">Learning Outcomes</h2>
      <div className="learning-outcomes-grid">
        {outcomes.map((outcome, index) => (
          <div key={index} className="outcome-card">
            {outcome.icon && (
              <div className="outcome-card__icon">
                {outcome.icon}
              </div>
            )}
            <h3 className="outcome-card__title">{outcome.title}</h3>
            <p className="outcome-card__description">{outcome.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningOutcomes;