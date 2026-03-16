import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Plus, X, Award, Target } from 'lucide-react';
import { StudentProfile, Achievement } from '../types';
import { subjects, directions } from '../data/mockData';

export function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile>({
    grade: 11,
    grades: {},
    achievements: [],
    interests: [],
    careerGoals: [],
    budget: 'any',
  });

  const [newAchievement, setNewAchievement] = useState({
    title: '',
    type: 'olympiad' as Achievement['type'],
    level: 'school' as Achievement['level'],
    year: 2026,
  });

  const handleGradeChange = (subject: string, value: string) => {
    setProfile({
      ...profile,
      grades: { ...profile.grades, [subject]: parseFloat(value) || 0 },
    });
  };

  const handleInterestToggle = (interest: string) => {
    const interests = profile.interests.includes(interest)
      ? profile.interests.filter((i) => i !== interest)
      : [...profile.interests, interest];
    setProfile({ ...profile, interests });
  };

  const addAchievement = () => {
    if (newAchievement.title) {
      setProfile({
        ...profile,
        achievements: [...profile.achievements, { ...newAchievement }],
      });
      setNewAchievement({
        title: '',
        type: 'olympiad',
        level: 'school',
        year: 2026,
      });
    }
  };

  const removeAchievement = (index: number) => {
    setProfile({
      ...profile,
      achievements: profile.achievements.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Сохраняем профиль в localStorage
    localStorage.setItem('studentProfile', JSON.stringify(profile));
    navigate('/results');
    toast.success('Профиль успешно сохранен!');
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Создание академического профиля</h1>
          <p className="text-gray-600 text-lg">
            Заполните информацию о себе для получения персонализированных рекомендаций
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Основная информация */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>Класс обучения и предпочтения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="grade">Класс обучения</Label>
                  <Select
                    value={profile.grade.toString()}
                    onValueChange={(value) =>
                      setProfile({ ...profile, grade: parseInt(value) })
                    }
                  >
                    <SelectTrigger id="grade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">9 класс</SelectItem>
                      <SelectItem value="10">10 класс</SelectItem>
                      <SelectItem value="11">11 класс</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Форма обучения</Label>
                  <Select
                    value={profile.budget}
                    onValueChange={(value: 'free' | 'paid' | 'any') =>
                      setProfile({ ...profile, budget: value })
                    }
                  >
                    <SelectTrigger id="budget">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Только бюджет</SelectItem>
                      <SelectItem value="paid">Только платное</SelectItem>
                      <SelectItem value="any">Любая форма</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">Предпочитаемый город (необязательно)</Label>
                  <Input
                    id="city"
                    placeholder="Москва, Санкт-Петербург..."
                    value={profile.targetCity || ''}
                    onChange={(e) => setProfile({ ...profile, targetCity: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Успеваемость */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Успеваемость</CardTitle>
              <CardDescription>
                Укажите средний балл по каждому предмету (от 2 до 5)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <div key={subject}>
                    <Label htmlFor={subject}>{subject}</Label>
                    <Input
                      id={subject}
                      type="number"
                      min="2"
                      max="5"
                      step="0.1"
                      placeholder="4.5"
                      value={profile.grades[subject] || ''}
                      onChange={(e) => handleGradeChange(subject, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Интересы */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                <Target className="inline size-5 mr-2" />
                Интересы и направления
              </CardTitle>
              <CardDescription>Выберите интересующие вас области</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {directions.map((direction) => (
                  <div key={direction} className="flex items-center gap-2">
                    <Checkbox
                      id={direction}
                      checked={profile.interests.includes(direction)}
                      onCheckedChange={() => handleInterestToggle(direction)}
                    />
                    <Label htmlFor={direction} className="cursor-pointer">
                      {direction}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Достижения */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                <Award className="inline size-5 mr-2" />
                Достижения
              </CardTitle>
              <CardDescription>
                Добавьте свои достижения: олимпиады, конкурсы, проекты
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Список существующих достижений */}
              {profile.achievements.length > 0 && (
                <div className="space-y-2 mb-4">
                  {profile.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-gray-600">
                          <Badge variant="outline" className="mr-2">
                            {achievement.type === 'olympiad' && 'Олимпиада'}
                            {achievement.type === 'competition' && 'Конкурс'}
                            {achievement.type === 'research' && 'Исследование'}
                            {achievement.type === 'volunteering' && 'Волонтерство'}
                            {achievement.type === 'other' && 'Другое'}
                          </Badge>
                          <Badge variant="secondary">{achievement.level}</Badge>
                          <span className="ml-2">{achievement.year}</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Форма добавления нового достижения */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <Label htmlFor="achievement-title">Название</Label>
                  <Input
                    id="achievement-title"
                    placeholder="Всероссийская олимпиада по информатике"
                    value={newAchievement.title}
                    onChange={(e) =>
                      setNewAchievement({ ...newAchievement, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="achievement-type">Тип</Label>
                  <Select
                    value={newAchievement.type}
                    onValueChange={(value: Achievement['type']) =>
                      setNewAchievement({ ...newAchievement, type: value })
                    }
                  >
                    <SelectTrigger id="achievement-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="olympiad">Олимпиада</SelectItem>
                      <SelectItem value="competition">Конкурс</SelectItem>
                      <SelectItem value="research">Исследование</SelectItem>
                      <SelectItem value="volunteering">Волонтерство</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="achievement-level">Уровень</Label>
                  <Select
                    value={newAchievement.level}
                    onValueChange={(value: Achievement['level']) =>
                      setNewAchievement({ ...newAchievement, level: value })
                    }
                  >
                    <SelectTrigger id="achievement-level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">Школьный</SelectItem>
                      <SelectItem value="municipal">Муниципальный</SelectItem>
                      <SelectItem value="regional">Региональный</SelectItem>
                      <SelectItem value="national">Всероссийский</SelectItem>
                      <SelectItem value="international">Международный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="button" variant="outline" onClick={addAchievement} className="w-full">
                <Plus className="size-4 mr-2" />
                Добавить достижение
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Отмена
            </Button>
            <Button type="submit" size="lg">
              Получить рекомендации
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}