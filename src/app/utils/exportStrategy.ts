import { StudentProfile, MatchResult } from '../types';

export function exportStrategyAsText(
  profile: StudentProfile,
  topMatches: MatchResult[],
  strategy: {
    timeline: Array<{ period: string; tasks: string[]; goals: string[] }>;
    olympiadRecommendations: string[];
    additionalPreparation: string[];
  }
): string {
  let text = '='.repeat(70) + '\n';
  text += 'ПЕРСОНАЛЬНАЯ СТРАТЕГИЯ ПОДГОТОВКИ К ПОСТУПЛЕНИЮ\n';
  text += '='.repeat(70) + '\n\n';

  // Профиль
  text += 'ВАШ ПРОФИЛЬ\n';
  text += '-'.repeat(70) + '\n';
  text += `Класс: ${profile.grade}\n`;
  text += `Интересы: ${profile.interests.join(', ')}\n`;
  text += `Форма обучения: ${profile.budget === 'free' ? 'Бюджет' : profile.budget === 'paid' ? 'Платное' : 'Любая'}\n`;
  if (profile.targetCity) {
    text += `Предпочитаемый город: ${profile.targetCity}\n`;
  }
  text += `Количество достижений: ${profile.achievements.length}\n\n`;

  // Топ-3 рекомендации
  text += 'ТОП-3 РЕКОМЕНДУЕМЫХ ПРОГРАММ\n';
  text += '-'.repeat(70) + '\n';
  topMatches.slice(0, 3).forEach((match, index) => {
    text += `\n${index + 1}. ${match.program.name}\n`;
    text += `   Вуз: ${match.university.name}, ${match.university.city}\n`;
    text += `   Соответствие: ${match.matchScore}%\n`;
    text += `   Проходной балл: ${match.program.passingScore}\n`;
    text += `   Бюджетных мест: ${match.program.budgetPlaces}\n`;
    text += `   Требуемые предметы ЕГЭ: ${match.recommendedEGE.map(getSubjectName).join(', ')}\n`;
  });
  text += '\n\n';

  // Временная шкала
  text += 'ПЛАН ПОДГОТОВКИ\n';
  text += '-'.repeat(70) + '\n';
  strategy.timeline.forEach((stage) => {
    text += `\n${stage.period}\n`;
    text += '  Задачи:\n';
    stage.tasks.forEach((task) => {
      text += `    • ${task}\n`;
    });
    text += '  Цели:\n';
    stage.goals.forEach((goal) => {
      text += `    → ${goal}\n`;
    });
  });
  text += '\n\n';

  // Олимпиады
  if (strategy.olympiadRecommendations.length > 0) {
    text += 'РЕКОМЕНДУЕМЫЕ ОЛИМПИАДЫ\n';
    text += '-'.repeat(70) + '\n';
    strategy.olympiadRecommendations.forEach((olymp, index) => {
      text += `${index + 1}. ${olymp}\n`;
    });
    text += '\n\n';
  }

  // Дополнительная подготовка
  text += 'ДОПОЛНИТЕЛЬНАЯ ПОДГОТОВКА\n';
  text += '-'.repeat(70) + '\n';
  strategy.additionalPreparation.forEach((item, index) => {
    text += `${index + 1}. ${item}\n`;
  });
  text += '\n';

  text += '='.repeat(70) + '\n';
  text += 'Создано платформой "Мой выбор" • ' + new Date().toLocaleDateString('ru-RU') + '\n';
  text += '='.repeat(70) + '\n';

  return text;
}

export function downloadStrategy(content: string, filename: string = 'strategy.txt') {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getSubjectName(subjectId: string): string {
  const mapping: Record<string, string> = {
    russian: 'Русский язык',
    math: 'Математика',
    physics: 'Физика',
    chemistry: 'Химия',
    biology: 'Биология',
    history: 'История',
    social: 'Обществознание',
    english: 'Английский язык',
    literature: 'Литература',
    informatics: 'Информатика',
    geography: 'География',
  };
  return mapping[subjectId] || subjectId;
}
