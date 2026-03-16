import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Trophy,
  BookOpen,
  ArrowRight,
  Target,
  Lock,
  Sparkles,
} from 'lucide-react';
import { StudentProfile, MatchResult } from '../types';
import { universities } from '../data/mockData';
import { calculateMatches } from '../utils/matchingAlgorithm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MatchScoreChart } from '../components/MatchScoreChart';
import { CourseAd } from '../components/CourseAd';
import { PremiumUpgrade } from '../components/PremiumUpgrade';
import { preparationCourses } from '../data/preparationCourses';
import { useSubscription } from '../context/SubscriptionContext';

export function Results() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
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
  }, [navigate]);

  if (!profile) {
    return null;
  }

  const freeMatchesLimit = 3;
  const topMatches = isPremium ? matches.slice(0, 10) : matches.slice(0, freeMatchesLimit);
  const hiddenMatchesCount = matches.length - freeMatchesLimit;
  const recommendedEGE = getRecommendedEGE(topMatches);

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Ваши персональные рекомендации</h1>
          <p className="text-gray-600 text-lg">
            На основе вашего профиля мы подобрали наиболее подходящие программы и вузы
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Рекомендуемые предметы ЕГЭ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recommendedEGE.map((subject) => (
                  <Badge key={subject} variant="default">
                    {getSubjectName(subject)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Найдено программ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">{matches.length}</div>
              <p className="text-sm text-gray-600 mt-2">соответствующих вашему профилю</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Средний балл соответствия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                {Math.round(
                  topMatches.reduce((sum, m) => sum + m.matchScore, 0) / topMatches.length
                )}
                %
              </div>
              <p className="text-sm text-gray-600 mt-2">топ-{topMatches.length} программ</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link to="/strategy">
            <Button size="lg">
              <Target className="size-4 mr-2" />
              Перейти к стратегии подготовки
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link to="/profile">
            <Button size="lg" variant="outline">
              Изменить профиль
            </Button>
          </Link>
        </div>

        {/* Match Score Chart */}
        {matches.length > 0 && (
          <div className="mb-8">
            <MatchScoreChart matches={matches} />
          </div>
        )}

        {/* Top Matches */}
        <Tabs defaultValue="top" className="mb-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="top">
              Лучшие совпадения {!isPremium && `(${freeMatchesLimit})`}
            </TabsTrigger>
            <TabsTrigger value="all" disabled={!isPremium}>
              Все результаты ({matches.length})
              {!isPremium && <Lock className="ml-2 size-4" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top" className="space-y-6 mt-6">
            {topMatches.map((match, index) => (
              <MatchCard key={match.program.id} match={match} rank={index + 1} />
            ))}

            {/* Course Ad after top 3 results */}
            {!isPremium && topMatches.length >= 3 && (
              <div className="my-8">
                <div className="text-center mb-4">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Sparkles className="size-3 mr-1" />
                    Рекомендуем для подготовки
                  </Badge>
                </div>
                <CourseAd course={preparationCourses[0]} />
              </div>
            )}

            {/* Premium Upgrade */}
            {!isPremium && hiddenMatchesCount > 0 && (
              <div className="mt-8">
                <PremiumUpgrade variant="results" hiddenCount={hiddenMatchesCount} />
              </div>
            )}

            {/* Additional course ads for premium users */}
            {isPremium && topMatches.length > 6 && (
              <div className="my-8">
                <div className="text-center mb-4">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Sparkles className="size-3 mr-1" />
                    Курсы для углубленной подготовки
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CourseAd course={preparationCourses[1]} variant="compact" />
                  <CourseAd course={preparationCourses[2]} variant="compact" />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6 mt-6">
            {isPremium ? (
              <>
                {matches.map((match, index) => (
                  <MatchCard key={match.program.id} match={match} rank={index + 1} />
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <Lock className="size-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600">
                  Получите премиум доступ для просмотра всех результатов
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface MatchCardProps {
  match: MatchResult;
  rank: number;
}

function MatchCard({ match, rank }: MatchCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={rank <= 3 ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                #{rank}
              </Badge>
              <CardTitle className="text-xl">{match.program.name}</CardTitle>
            </div>
            <CardDescription className="text-base">
              {match.university.name} • {match.university.city}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Соответствие</div>
            <div className="text-3xl font-bold text-blue-600">{match.matchScore}%</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Match Score Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Уровень соответствия профилю</span>
          </div>
          <Progress value={match.matchScore} className="h-3" />
        </div>

        {/* Required Subjects */}
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <BookOpen className="size-4 mr-2" />
            Требуемые предметы ЕГЭ:
          </h4>
          <div className="flex flex-wrap gap-2">
            {match.recommendedEGE.map((subject) => (
              <Badge key={subject} variant="outline">
                {getSubjectName(subject)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Target Scores */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Target className="size-4 mr-2" />
            Целевые баллы ЕГЭ:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(match.targetScores).map(([subject, score]) => (
              <div key={subject} className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">{getSubjectName(subject)}</div>
                <div className="text-2xl font-bold text-purple-600">{score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          {match.strengths.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center text-green-800">
                <CheckCircle2 className="size-4 mr-2" />
                Ваши преимущества
              </h4>
              <ul className="space-y-1 text-sm text-green-700">
                {match.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps */}
          {match.gaps.length > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center text-orange-800">
                <AlertCircle className="size-4 mr-2" />
                Необходимо улучшить
              </h4>
              <ul className="space-y-1 text-sm text-orange-700">
                {match.gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Program Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
          <div>
            <div className="text-sm text-gray-600">Проходной балл</div>
            <div className="font-bold">{match.program.passingScore}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Бюджетные места</div>
            <div className="font-bold">{match.program.budgetPlaces}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Платные места</div>
            <div className="font-bold">{match.program.paidPlaces}</div>
          </div>
          {match.program.cost && (
            <div>
              <div className="text-sm text-gray-600">Стоимость/год</div>
              <div className="font-bold">{(match.program.cost / 1000).toFixed(0)}k ₽</div>
            </div>
          )}
        </div>

        {/* Olympiads */}
        {match.program.olympiads && match.program.olympiads.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center text-yellow-800">
              <Trophy className="size-4 mr-2" />
              Олимпиады, дающие преимущества
            </h4>
            <div className="flex flex-wrap gap-2">
              {match.program.olympiads.map((olymp, idx) => (
                <Badge key={idx} variant="outline" className="text-yellow-800 border-yellow-300">
                  {olymp}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getRecommendedEGE(matches: MatchResult[]): string[] {
  const subjectCount = new Map<string, number>();

  matches.slice(0, 5).forEach((match) => {
    match.recommendedEGE.forEach((subject) => {
      subjectCount.set(subject, (subjectCount.get(subject) || 0) + 1);
    });
  });

  return Array.from(subjectCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([subject]) => subject);
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