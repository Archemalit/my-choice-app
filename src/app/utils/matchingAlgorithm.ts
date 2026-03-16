import { StudentProfile, University, Program, MatchResult } from '../types';

export function calculateMatches(
  profile: StudentProfile,
  universities: University[]
): MatchResult[] {
  const results: MatchResult[] = [];

  universities.forEach((university) => {
    university.programs.forEach((program) => {
      const matchScore = calculateMatchScore(profile, program);
      const { gaps, strengths } = analyzeProfile(profile, program);
      const recommendedEGE = program.requiredEGE;
      const targetScores = calculateTargetScores(program);

      results.push({
        university,
        program,
        matchScore,
        recommendedEGE,
        targetScores,
        gaps,
        strengths,
      });
    });
  });

  // Сортируем по убыванию match score
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

function calculateMatchScore(profile: StudentProfile, program: Program): number {
  let score = 0;

  // 1. Проверяем соответствие интересов (40 баллов)
  const interestMatch = profile.interests.some((interest) =>
    program.direction.toLowerCase().includes(interest.toLowerCase())
  );
  if (interestMatch) score += 40;

  // 2. Проверяем уровень оценок по профильным предметам (30 баллов)
  const relevantGrades = program.requiredEGE
    .map((subject) => {
      const subjectName = getSubjectName(subject);
      return profile.grades[subjectName] || 0;
    })
    .filter((grade) => grade > 0);

  if (relevantGrades.length > 0) {
    const avgGrade = relevantGrades.reduce((a, b) => a + b, 0) / relevantGrades.length;
    // Переводим оценки в баллы (5->30, 4->20, 3->10)
    score += Math.min(30, (avgGrade / 5) * 30);
  }

  // 3. Проверяем достижения (20 баллов)
  const hasRelevantOlympiad = profile.achievements.some(
    (ach) =>
      ach.type === 'olympiad' &&
      program.olympiads?.some((olymp) =>
        olymp.toLowerCase().includes(ach.title.toLowerCase().split(' ')[0])
      )
  );
  if (hasRelevantOlympiad) score += 20;
  else if (profile.achievements.some((ach) => ach.type === 'olympiad')) score += 10;

  // 4. Проверяем бюджетные места (10 баллов)
  if (profile.budget === 'free' && program.budgetPlaces > 50) score += 10;
  else if (profile.budget !== 'free') score += 5;

  return Math.min(100, Math.round(score));
}

function analyzeProfile(
  profile: StudentProfile,
  program: Program
): { gaps: string[]; strengths: string[] } {
  const gaps: string[] = [];
  const strengths: string[] = [];

  // Анализируем оценки
  program.requiredEGE.forEach((subject) => {
    const subjectName = getSubjectName(subject);
    const grade = profile.grades[subjectName];
    
    if (!grade || grade < 4) {
      gaps.push(`Необходимо повысить успеваемость по предмету: ${subjectName}`);
    } else if (grade >= 4.5) {
      strengths.push(`Отличные оценки по предмету: ${subjectName}`);
    }
  });

  // Анализируем достижения
  const hasOlympiads = profile.achievements.filter((a) => a.type === 'olympiad').length;
  if (hasOlympiads === 0) {
    gaps.push('Рекомендуется участие в олимпиадах по профильным предметам');
  } else if (hasOlympiads >= 2) {
    strengths.push(`Участие в ${hasOlympiads} олимпиадах`);
  }

  // Проверяем класс и время на подготовку
  if (profile.grade === 11) {
    gaps.push('Ограниченное время на подготовку - необходима интенсивная работа');
  } else if (profile.grade === 9) {
    strengths.push('Достаточно времени для качественной подготовки');
  }

  return { gaps, strengths };
}

function calculateTargetScores(program: Program): Record<string, number> {
  const scores: Record<string, number> = {};
  
  // Рекомендуем на 5-10 баллов выше проходного
  const targetBuffer = 8;
  const baseScore = Math.min(100, program.passingScore + targetBuffer);

  program.requiredEGE.forEach((subject) => {
    scores[subject] = baseScore;
  });

  return scores;
}

function getSubjectName(subjectId: string): string {
  const mapping: Record<string, string> = {
    russian: 'Русский язык',
    math: 'Математика',
    'math-basic': 'Математика',
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

export function generateStrategy(
  profile: StudentProfile,
  topMatches: MatchResult[]
): {
  timeline: Array<{ period: string; tasks: string[]; goals: string[] }>;
  olympiadRecommendations: string[];
  additionalPreparation: string[];
} {
  const timeline = generateTimeline(profile);
  const olympiadRecommendations = generateOlympiadRecommendations(topMatches);
  const additionalPreparation = generateAdditionalPreparation(profile, topMatches);

  return { timeline, olympiadRecommendations, additionalPreparation };
}

function generateTimeline(profile: StudentProfile) {
  const currentYear = 2026;
  const gradeYear = profile.grade === 11 ? currentYear : profile.grade === 10 ? currentYear + 1 : currentYear + 2;

  if (profile.grade === 11) {
    return [
      {
        period: 'Март - Май 2026',
        tasks: [
          'Интенсивная подготовка к ЕГЭ по выбранным предметам',
          'Решение пробных вариантов ЕГЭ',
          'Участие в пробных экзаменах',
        ],
        goals: ['Достижение целевых баллов по каждому предмету', 'Закрытие пробелов в знаниях'],
      },
      {
        period: 'Июнь - Июль 2026',
        tasks: [
          'Сдача ЕГЭ',
          'Подготовка документов для поступления',
          'Подача заявлений в вузы',
        ],
        goals: ['Успешная сдача экзаменов', 'Своевременная подача документов'],
      },
      {
        period: 'Июль - Август 2026',
        tasks: [
          'Отслеживание конкурсных списков',
          'Принятие решения о зачислении',
        ],
        goals: ['Поступление в выбранный вуз'],
      },
    ];
  } else if (profile.grade === 10) {
    return [
      {
        period: 'Март - Июнь 2026 (10 класс)',
        tasks: [
          'Углубленное изучение профильных предметов',
          'Регистрация и участие в школьных олимпиадах',
          'Начало систематической подготовки к ЕГЭ',
        ],
        goals: ['Укрепление базовых знаний', 'Участие минимум в 2 олимпиадах'],
      },
      {
        period: 'Сентябрь - Декабрь 2026 (11 класс)',
        tasks: [
          'Активная подготовка к ЕГЭ',
          'Участие в региональных олимпиадах',
          'Посещение дней открытых дверей вузов',
        ],
        goals: ['Определение окончательного списка вузов', 'Достижение уровня 70+ баллов на пробных ЕГЭ'],
      },
      {
        period: 'Январь - Май 2027',
        tasks: [
          'Финальная подготовка к ЕГЭ',
          'Решение вариантов прошлых лет',
          'Консультации с репетиторами по сложным темам',
        ],
        goals: ['Готовность к сдаче ЕГЭ на целевые баллы'],
      },
    ];
  } else {
    // 9 класс
    return [
      {
        period: 'Март - Июнь 2026 (9 класс)',
        tasks: [
          'Подготовка к ОГЭ',
          'Определение профильных предметов для 10-11 класса',
          'Начало знакомства с форматом ЕГЭ',
        ],
        goals: ['Успешная сдача ОГЭ', 'Выбор профиля обучения'],
      },
      {
        period: 'Сентябрь 2026 - Май 2027 (10 класс)',
        tasks: [
          'Углубленное изучение профильных предметов',
          'Участие в олимпиадах школьного и муниципального уровня',
          'Базовая подготовка к ЕГЭ',
        ],
        goals: ['Твердое владение базовой программой', 'Участие в 3+ олимпиадах'],
      },
      {
        period: 'Сентябрь 2027 - Май 2028 (11 класс)',
        tasks: [
          'Интенсивная подготовка к ЕГЭ',
          'Определение списка вузов',
          'Участие в профильных олимпиадах',
        ],
        goals: ['Поступление в топ-вуз на бюджет'],
      },
    ];
  }
}

function generateOlympiadRecommendations(topMatches: MatchResult[]): string[] {
  const olympiads = new Set<string>();
  
  topMatches.slice(0, 3).forEach((match) => {
    match.program.olympiads?.forEach((olymp) => olympiads.add(olymp));
  });

  return Array.from(olympiads);
}

function generateAdditionalPreparation(
  profile: StudentProfile,
  topMatches: MatchResult[]
): string[] {
  const recommendations: string[] = [];

  // Анализируем общие пробелы
  const allGaps = new Set<string>();
  topMatches.slice(0, 3).forEach((match) => {
    match.gaps.forEach((gap) => allGaps.add(gap));
  });

  if (allGaps.size > 0) {
    recommendations.push('Рекомендуется работа с репетитором по слабым предметам');
  }

  // Проверяем класс
  if (profile.grade === 11) {
    recommendations.push('Интенсивные курсы подготовки к ЕГЭ');
    recommendations.push('Еженедельные пробные тестирования');
  } else {
    recommendations.push('Посещение профильных кружков и секций');
    recommendations.push('Участие в научных конференциях');
  }

  recommendations.push('Решение задач повышенной сложности');
  recommendations.push('Изучение дополнительных материалов по профильным предметам');

  return recommendations;
}
