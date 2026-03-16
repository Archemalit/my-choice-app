import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Target,
  BookOpen,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Твой путь к успешному поступлению
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Интеллектуальная система для школьников 9-11 классов, которая формирует
              персонализированную стратегию подготовки к ЕГЭ и поступлению в вуз
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/profile">
                <Button size="lg" className="text-lg px-8">
                  Начать сейчас
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Link to="/universities">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Изучить вузы
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Возможности платформы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Target className="size-10 text-blue-600 mb-4" />
                <CardTitle>Персонализированный анализ</CardTitle>
                <CardDescription>
                  Система анализирует ваши оценки, достижения, интересы и цели для формирования
                  индивидуальной стратегии
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="size-10 text-purple-600 mb-4" />
                <CardTitle>Подбор предметов ЕГЭ</CardTitle>
                <CardDescription>
                  Алгоритм рекомендует оптимальную комбинацию предметов ЕГЭ на основе ваших целей и
                  требований вузов
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="size-10 text-green-600 mb-4" />
                <CardTitle>Целевые баллы</CardTitle>
                <CardDescription>
                  Получите четкие ориентиры по баллам для каждого предмета с учетом конкурса в
                  выбранных вузах
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="size-10 text-orange-600 mb-4" />
                <CardTitle>База 100+ вузов</CardTitle>
                <CardDescription>
                  Структурированная информация о ведущих вузах РФ, программах обучения и требованиях
                  к поступлению
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="size-10 text-red-600 mb-4" />
                <CardTitle>Олимпиады</CardTitle>
                <CardDescription>
                  Рекомендации по участию в профильных олимпиадах, дающих преимущества при
                  поступлении
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle2 className="size-10 text-teal-600 mb-4" />
                <CardTitle>План подготовки</CardTitle>
                <CardDescription>
                  Пошаговая стратегия подготовки с конкретными задачами и сроками их выполнения
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold mb-2">Заполните анкету</h3>
              <p className="text-gray-600">
                Укажите класс, оценки по предметам, достижения и интересы
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-bold mb-2">Получите анализ</h3>
              <p className="text-gray-600">
                Алгоритм сопоставит ваш профиль с требованиями образовательных программ
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-bold mb-2">Изучите рекомендации</h3>
              <p className="text-gray-600">
                Просмотрите подобранные вузы, программы и целевые баллы ЕГЭ
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-bold mb-2">Следуйте стратегии</h3>
              <p className="text-gray-600">
                Используйте персональный план подготовки для достижения целей
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовы начать свой путь к успеху?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к тысячам школьников, которые уже сделали осознанный выбор своей
            образовательной траектории
          </p>
          <Link to="/profile">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Создать персональную стратегию
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-gray-600">Ведущих вузов России</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <p className="text-gray-600">Образовательных программ</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <p className="text-gray-600">Точность рекомендаций</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
