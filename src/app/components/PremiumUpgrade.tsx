import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Crown,
  CheckCircle2,
  Sparkles,
  Lock,
  Zap,
  Infinity,
  RefreshCw,
  ShieldCheck,
  X,
  CreditCard,
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

interface PremiumUpgradeProps {
  variant?: 'results' | 'strategy';
  hiddenCount?: number;
}

// Inline payment modal (reused from Pricing page)
function QuickPayModal({
  type,
  onClose,
  onSuccess,
}: {
  type: 'once' | 'subscription';
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }, 1800);
  };

  const title = type === 'once' ? 'Один полный отчёт' : 'Подписка на месяц';
  const price = type === 'once' ? '1 190 ₽' : '2 490 ₽ / мес';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          disabled={step === 'processing'}
        >
          <X className="size-5 text-gray-500" />
        </button>

        {step === 'form' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                type === 'subscription' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                <CreditCard className={`size-8 ${type === 'subscription' ? 'text-purple-600' : 'text-blue-600'}`} />
              </div>
              <h2 className="text-2xl font-bold mb-1">Оформление</h2>
              <p className="text-gray-500">{title}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 flex items-center justify-between">
              <div className="font-medium">{title}</div>
              <div className={`text-2xl font-bold ${type === 'subscription' ? 'text-purple-600' : 'text-blue-600'}`}>
                {price}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-sm text-amber-800">
              <strong>Демо-режим:</strong> Платёжная система подключается. Нажмите для демонстрации.
            </div>

            <div className="space-y-3">
              <Button
                className={`w-full h-12 ${
                  type === 'subscription'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    : ''
                } text-white`}
                onClick={handlePay}
              >
                <ShieldCheck className="size-4 mr-2" />
                Активировать (демо)
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Отмена
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="size-8 text-purple-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold mb-2">Обрабатываем...</h2>
            <p className="text-gray-500">Пожалуйста, подождите</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-green-700">Готово!</h2>
            <p className="text-gray-500">Открываем доступ...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PremiumUpgrade({ variant = 'results', hiddenCount = 0 }: PremiumUpgradeProps) {
  const { activatePremiumOnce, activateSubscription } = useSubscription();
  const [modal, setModal] = useState<'once' | 'subscription' | null>(null);

  const handleSuccess = () => {
    if (modal === 'once') {
      activatePremiumOnce();
      toast.success('Полный отчёт активирован!');
    } else if (modal === 'subscription') {
      activateSubscription(1);
      toast.success('Подписка оформлена на 1 месяц!', {
        description: 'Теперь создавайте неограниченное количество отчётов.',
      });
    }
  };

  const resultFeatures = [
    'Все подобранные программы и вузы',
    'Детальные рекомендации по каждому вузу',
    'Расширенный анализ сильных и слабых сторон',
    'Персональные советы по подготовке',
    'Экспорт полного отчёта в PDF',
  ];

  const strategyFeatures = [
    'Развернутая стратегия на весь учебный год',
    'Недельный план по каждому предмету',
    'Персональный трек подготовки к олимпиадам',
    'Расписание важных дат и дедлайнов',
    'Экспорт стратегии в PDF с визуализациями',
  ];

  const features = variant === 'results' ? resultFeatures : strategyFeatures;

  return (
    <>
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20 -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10" />

        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="size-6 text-purple-600" />
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                  ПРЕМИУМ
                </Badge>
              </div>
              <CardTitle className="text-3xl mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Разблокируйте полный доступ
              </CardTitle>
              <CardDescription className="text-base">
                {variant === 'results'
                  ? `Откройте все ${hiddenCount} подобранных программ и детальную аналитику`
                  : 'Получите развернутую стратегию с еженедельным планом и трекером прогресса'}
              </CardDescription>
            </div>
            <Sparkles className="size-12 text-purple-400 animate-pulse" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Limited version warning */}
          <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 flex items-start gap-3">
            <Lock className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-purple-900 mb-1">Вы просматриваете ограниченную версию</p>
              <p className="text-sm text-purple-800">
                {variant === 'results'
                  ? 'В бесплатной версии доступно только 3 лучших совпадения.'
                  : 'В бесплатной версии доступна базовая стратегия.'}
              </p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-3 text-lg">Что входит:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="size-3 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Two pricing options side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* One-time report */}
            <div className="bg-white rounded-xl p-5 border-2 border-blue-200 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="size-4 text-blue-600" />
                </div>
                <span className="font-semibold">Один отчёт</span>
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-blue-600">1 190 ₽</span>
                <span className="text-gray-400 line-through ml-2 text-sm">2 390 ₽</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Разовая оплата · Доступ навсегда</p>
              <ul className="space-y-1 text-xs text-gray-600 mb-4 flex-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-blue-500" />
                  Полный отчёт для текущего профиля
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-blue-500" />
                  Без подписки, без списаний
                </li>
              </ul>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setModal('once')}
              >
                Купить отчёт
              </Button>
            </div>

            {/* Subscription */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-5 text-white flex flex-col relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/20 text-white border-0 text-xs">Лучший выбор</Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Crown className="size-4 text-white" />
                </div>
                <span className="font-semibold">Подписка</span>
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold">2 490 ₽</span>
                <span className="text-white/70 ml-1 text-sm">/ мес</span>
                <span className="text-white/60 line-through ml-2 text-sm">4 990 ₽</span>
              </div>
              <p className="text-xs text-white/70 mb-4">Отмена в любой момент</p>
              <ul className="space-y-1 text-xs text-white/90 mb-4 flex-1">
                <li className="flex items-center gap-1.5">
                  <Infinity className="size-3" />
                  Неограниченные отчёты
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3" />
                  Все функции платформы
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3" />
                  Экспорт PDF и TXT
                </li>
              </ul>
              <Button
                className="w-full bg-white text-purple-700 hover:bg-white/90"
                onClick={() => setModal('subscription')}
              >
                <Crown className="size-4 mr-2" />
                Оформить подписку
              </Button>
            </div>
          </div>

          {/* Trust + Link to full pricing */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="size-4 text-green-500" />
                <span>Гарантия возврата 7 дней</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>Мгновенный доступ</span>
              </div>
            </div>
            <Link to="/pricing" className="text-sm text-purple-600 hover:underline">
              Сравнить все тарифы →
            </Link>
          </div>
        </CardContent>
      </Card>

      {modal && (
        <QuickPayModal
          type={modal}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}