import React from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: Date;
  progress?: number;
  status?: 'conquistado' | 'em progresso';
}

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const getAchievementIcon = (id: string) => {
  // Mapeamento de IDs de conquistas para ícones
  const iconMap: {[key: string]: string} = {
    'first-quiz': '🎯',
    'perfect-score': '🏆',
    'five-quizzes': '📚',
    'ten-quizzes': '🔥',
    'twenty-five-quizzes': '🌟',
    'one-hour-study': '⏱️',
    'five-hours-study': '⏳',
    'ten-hours-study': '🕰️',
    'three-categories-master': '🥉',
    'five-categories-master': '🥈',
    'all-categories-master': '🥇',
    'score-1000': '💯',
    'score-2500': '🌠',
    'pronunciation-master': '🗣️',
    'vocabulary-master': '📝',
    'situations-master': '🗼'
  };
  
  // Retorna o ícone correspondente ou um ícone padrão
  return iconMap[id] || '🎓';
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index }) => {
  const isUnlocked = achievement.status === 'conquistado' || achievement.unlockedAt;
  const icon = getAchievementIcon(achievement.id);
  
  return (
    <div 
      className={`flex items-center p-4 rounded-xl ${isUnlocked ? 'bg-white' : 'bg-gray-50'} shadow-sm border ${isUnlocked ? 'border-french-blue/20' : 'border-gray-100'} transition-all hover:shadow-md`}
    >
      <div className={`w-12 h-12 ${isUnlocked ? 'bg-french-blue/10' : 'bg-gray-200'} rounded-full flex items-center justify-center text-2xl mr-4`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className={`font-medium ${isUnlocked ? 'text-french-dark' : 'text-gray-500'}`}>{achievement.title}</h4>
        <p className="text-sm text-french-gray">{achievement.description}</p>
        {achievement.unlockedAt && (
          <p className="text-xs text-french-blue mt-1">
            Conquistado em: {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
      <div className="text-right">
        {isUnlocked ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Conquistado
          </span>
        ) : (
          <>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Em progresso
            </span>
            <div className="mt-1 h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-french-blue rounded-full transition-all"
                style={{ width: `${achievement.progress || 0}%` }}  
              ></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;