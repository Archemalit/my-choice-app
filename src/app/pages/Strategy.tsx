import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Calendar,
  Target,
  Trophy,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Lock,
  Sparkles,
  Crown,
} from 'lucide-react';
import { StudentProfile, MatchResult } from '../types';
import { universities } from '../data/mockData';
import { calculateMatches, generateStrategy } from '../utils/matchingAlgorithm';
import { exportStrategyAsText, downloadStrategy } from '../utils/exportStrategy';
import { CourseAd } from '../components/CourseAd';
import { PremiumUpgrade } from '../components/PremiumUpgrade';
import { preparationCourses } from '../data/preparationCourses';
import { useSubscription } from '../context/SubscriptionContext';

export function Strategy() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [strategy, setStrategy] = useState<{
    timeline: Array<{ period: string; tasks: string[]; goals: string[] }>;
    olympiadRecommendations: string[];
    additionalPreparation: string[];
  } | null>(null);
  const { isPremium } = useSubscription();

  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile');
    if (!savedProfile) {
      navigate('/profile');
      return;
    }

    const parsedProfile: StudentProfile = JSON.parse(savedProfile);
    setProfile(parsedProfile);

    const calculatedMatches = calculateMatches(parsedProfile, universities);
    setMatches(calculatedMatches);

    const generatedStrategy = generateStrategy(parsedProfile, calculatedMatches.slice(0, 5));
    setStrategy(generatedStrategy);
  }, [navigate]);

  if (!profile || !strategy) {
    return null;
  }

  const topMatch = matches[0];
  // Limit timeline for free users
  const displayedTimeline = isPremium ? strategy.timeline : strategy.timeline.slice(0, 2);

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Ваша персональная стратегия подготовки</h1>
          <p className="text-gray-600 text-lg">
            Пошаговый план для достижения ваших образовательных целей
          </p>
          {!isPremium && (
            <div className="mt-4 inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
              <Lock className="size-4" />
              <span className="text-sm font-medium">
                Вы просматриваете базовую версию стратегии. Получите полный план!
              </span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Текущий класс</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.grade}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Этапов до поступления
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{strategy.timeline.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Рекомендуемых олимпиад
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {strategy.olympiadRecommendations.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Лучшее совпадение</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{topMatch.matchScore}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Match */}
        {topMatch && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-6 text-blue-600" />
                Рекомендуемая цель
              </CardTitle>
              <CardDescription>Программа с наивысшим уровнем соответствия вашему профилю</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold mb-1">{topMatch.program.name}</div>
                  <div className="text-gray-600">
                    {topMatch.university.name} • {topMatch.university.city}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Целевой балл ЕГЭ</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.max(...Object.values(topMatch.targetScores))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Проходной балл 2025</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {topMatch.program.passingScore}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Бюджетных мест</div>
                    <div className="text-2xl font-bold text-green-600">
                      {topMatch.program.budgetPlaces}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-6" />
              Временная шкала подготовки
              {!isPremium && (
                <Badge variant="secondary" className="ml-2">
                  Показано {displayedTimeline.length} из {strategy.timeline.length} этапов
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Ключевые этапы и задачи на пути к поступлению</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {displayedTimeline.map((stage, index) => (
                <div key={index} className="relative">
                  {index < displayedTimeline.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">{stage.period}</h3>

                        {/* Tasks */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 flex items-center text-gray-700">
                            <CheckCircle2 className="size-4 mr-2" />
                            Задачи:
                          </h4>
                          <ul className="space-y-2">
                            {stage.tasks.map((task, taskIdx) => (
                              <li key={taskIdx} className="flex items-start text-gray-700">
                                <span className="mr-2 mt-1">•</span>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Goals */}
                        <div>
                          <h4 className="font-medium mb-2 flex items-center text-gray-700">
                            <Target className="size-4 mr-2" />
                            Цели:
                          </h4>
                          <ul className="space-y-2">
                            {stage.goals.map((goal, goalIdx) => (
                              <li key={goalIdx} className="flex items-start text-gray-700">
                                <span className="mr-2 mt-1">→</span>
                                <span className="font-medium">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Locked stages for free users */}
              {!isPremium && strategy.timeline.length > displayedTimeline.length && (
                <div className="relative">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Lock className="size-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="size-5 text-purple-600" />
                          <h3 className="text-lg font-bold text-gray-700">
                            Ещё {strategy.timeline.length - displayedTimeline.length} этапов доступны в премиум версии
                          </h3>
                        </div>
                        <p className="text-gray-600">
                          Получите полную стратегию с детальным планом на весь учебный год
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Ads Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="text-base px-4 py-2">
              <Sparkles className="size-4 mr-2" />
              Партнёрские курсы для эффективной подготовки
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseAd course={preparationCourses[0]} variant="compact" />
            <CourseAd course={preparationCourses[1]} variant="compact" />
          </div>
        </div>

        {/* Premium Upgrade for Strategy */}
        {!isPremium && (
          <div className="mb-8">
            <PremiumUpgrade variant="strategy" />
          </div>
        )}

        {/* Olympiads */}
        {strategy.olympiadRecommendations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-6 text-yellow-600" />
                Рекомендуемые олимпиады
              </CardTitle>
              <CardDescription>
                Участие в этих олимпиадах даст преимущества при поступлении в выбранные вузы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategy.olympiadRecommendations.map((olympiad, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <Trophy className="size-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">{olympiad}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Даёт дополнительные баллы или льготы при поступлении
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Preparation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-6 text-blue-600" />
              Дополнительная подготовка
              {!isPremium && (
                <Badge variant="secondary" className="ml-2">
                  Базовая версия
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Рекомендации для повышения шансов на поступление
              {!isPremium && ' (полный список в премиум версии)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategy.additionalPreparation.slice(0, isPremium ? undefined : 3).map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="text-gray-700">{item}</div>
                </div>
              ))}
              {!isPremium && strategy.additionalPreparation.length > 3 && (
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <Lock className="size-5 text-purple-600 mt-0.5" />
                  <div className="text-purple-800">
                    <span className="font-medium">
                      Ещё {strategy.additionalPreparation.length - 3} рекомендаций
                    </span> доступны в премиум версии
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="size-6" />
              Важные напоминания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-orange-900">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Начинайте подготовку к ЕГЭ как можно раньше - систематические занятия эффективнее
                  интенсивной подготовки в последние месяцы
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Регулярно проходите пробные тестирования для отслеживания прогресса и адаптации к
                  формату экзамена
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Участие в олимпиадах может дать значительное преимущество, но требует дополнительной
                  подготовки
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Следите за изменениями в правилах приёма и обновлениями требований вузов на
                  официальных сайтах
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mt-8 flex-wrap">
          <Link to="/results">
            <Button size="lg" variant="outline">
              Вернуться к результатам
            </Button>
          </Link>
          <Link to="/universities">
            <Button size="lg" variant="outline">
              Изучить все вузы
            </Button>
          </Link>
          {isPremium ? (
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                const strategyText = exportStrategyAsText(profile, matches, strategy);
                downloadStrategy(strategyText);
                toast.success('Стратегия успешно скачана');
              }}
            >
              <Download className="size-4 mr-2" />
              Скачать стратегию (TXT)
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => {
                toast.info('Экспорт доступен только в премиум версии');
              }}
            >
              <Crown className="size-4 mr-2" />
              Получить премиум для экспорта
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}