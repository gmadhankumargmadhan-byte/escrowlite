import React from 'react';
import { Clock, Send, CheckCircle2, DollarSign, RotateCcw } from 'lucide-react';

export default function MilestoneTimeline({ status }) {
  const normalized = status ? status.toUpperCase() : 'PENDING';

  const steps = [
    { key: 'PENDING', label: '1. Pending', icon: Clock },
    { key: 'DELIVERED', label: '2. Delivered', icon: Send },
    { key: 'APPROVED', label: '3. Approved', icon: CheckCircle2 },
    { key: 'RELEASED', label: '4. Released', icon: DollarSign },
  ];

  const getStepState = (stepKey, index) => {
    if (normalized === 'RELEASED') return 'completed';
    if (normalized === 'APPROVED') {
      if (index <= 2) return 'completed';
      return 'upcoming';
    }
    if (normalized === 'DELIVERED') {
      if (index <= 1) return 'completed';
      return 'upcoming';
    }
    if (normalized === 'REWORK' || normalized === 'REWORK_REQUESTED') {
      if (stepKey === 'DELIVERED') return 'rework';
      if (index === 0) return 'completed';
      return 'upcoming';
    }
    if (index === 0) return 'active';
    return 'upcoming';
  };

  return (
    <div className="timeline-container">
      <div className="timeline-steps">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const stateClass = getStepState(step.key, idx);

          return (
            <div key={step.key} className={`timeline-step ${stateClass}`}>
              <div className="timeline-icon">
                <StepIcon size={16} />
              </div>
              <span className="timeline-label">{step.label}</span>
              {idx < steps.length - 1 && <div className="timeline-connector" />}
            </div>
          );
        })}
      </div>
      {(normalized === 'REWORK' || normalized === 'REWORK_REQUESTED') && (
        <div className="timeline-rework-alert">
          <RotateCcw size={14} />
          <span>Rework Requested by Client. Milestone returned to Freelancer.</span>
        </div>
      )}
    </div>
  );
}
