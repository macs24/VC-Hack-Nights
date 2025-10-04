import React from 'react';
import { TAMAGOTCHI_STAGES } from '../constants';

interface ExperienceBarProps {
  experience: number;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({ experience }) => {
  const currentStageIndex = TAMAGOTCHI_STAGES.findIndex((stage, i) => {
    const nextStage = TAMAGOTCHI_STAGES[i + 1];
    return experience >= stage.minExperience && (!nextStage || experience < nextStage.minExperience);
  });

  const currentStage = TAMAGOTCHI_STAGES[currentStageIndex] ?? TAMAGOTCHI_STAGES[0];
  const nextStage = TAMAGOTCHI_STAGES[currentStageIndex + 1];

  const barContent = () => {
    if (!nextStage) {
      return (
        <>
          <div
            className="bg-accent h-full rounded-full flex items-center justify-center"
            style={{ width: '100%' }}
          >
            Max Level!
          </div>
          <div className="absolute inset-0 text-center flex items-center justify-center text-sm font-bold text-white drop-shadow-md">
            {experience} EXP
          </div>
        </>
      );
    }

    const expInCurrentStage = experience - currentStage.minExperience;
    const expForNextStage = nextStage.minExperience - currentStage.minExperience;
    const progress = Math.min((expInCurrentStage / expForNextStage) * 100, 100);

    return (
      <>
        <div
          className="bg-accent h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 text-center flex items-center justify-center text-sm font-bold text-white drop-shadow-md">
          {experience} / {nextStage.minExperience} EXP (to {nextStage.name})
        </div>
      </>
    );
  };


  return (
    <div className="bg-surface/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-subtle">
      <h2 className="text-3xl font-bold text-text-main mb-4 font-heading">Experience Level</h2>
      <div className="w-full bg-subtle/50 rounded-full h-8 relative">
          {barContent()}
      </div>
       <p className="text-right text-base text-text-subtle mt-2">
        Progress to next evolution
      </p>
    </div>
  );
};

export default ExperienceBar;