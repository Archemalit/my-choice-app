import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Crown,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Infinity,
  ShieldCheck,
  RefreshCw,
  Download,
  BarChart2,
  Clock,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CreditCard,
  X,
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

interface Plan {
  id: 'free' | 'premium_once' | 'subscription';
  name: string;
  price: string;
  oldPrice?: string;
  period?: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  highlight: boolean;
  icon: React.ReactNode;
  features: { text: string; included: boolean }[];
  cta: string;
  ctaVariant?: 'default' | 'outline' | 'premium';
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Бесплатно',
    price: '0 ₽',
    description: 'Для первого знакомства с платформой',
    highlight: false,
    icon: <Star className="size-6 text-gray-500" />,
    features: [
      { text: 'Топ-3 совпадения с программами', included: true },
      { text: 'Базовый анализ профиля', included: true },
      { text: '2 этапа стратегии из полного плана', included: true },
      { text: 'Просмотр базы вузов', included: true },
      { text: 'Все совпадения (10+ программ)', included: false },
      { text: 'Полная стратегия подготовки', included: false },
      { text: 'Экспорт отчёта в PDF / TXT', included: false },
      { text: 'Неограниченные отчёты', included: false },
      { text: 'Приоритетная поддержка', included: false },
    ],
    cta: 'Текущий план',
    ctaVariant: 'outline',
  },
  {
    id: 'premium_once',
    name: 'Один отчёт',
    price: '1 190 ₽',
    oldPrice: '2 390 ₽',
    description: 'Полный анализ для текущего профиля',
    highlight: false,
    badge: '-50%',
    badgeColor: 'bg-red-100 text-red-700',
    icon: <Zap className="size-6 text-blue-600" />,
    features: [
      { text: 'Топ-3 совпадения с программами', included: true },
      { text: 'Базовый анализ профиля', included: true },
      { text: '2 этапа стратегии из полного плана', included: true },
      { text: 'Просмотр базы вузов', included: true },
      { text: 'Все совпадения (10+ программ)', included: true },
      { text: 'Полная стратегия подготовки', included: true },
      { text: 'Экспорт отчёта в PDF / TXT', included: true },
      { text: 'Неограниченные отчёты', included: false },
      { text: 'Приоритетная поддержка', included: false },
    ],
    cta: 'Купить отчёт',
    ctaVariant: 'default',
  },
  {
    id: 'subscription',
    name: 'Подписка',
    price: '2 490 ₽',
    oldPrice: '4 990 ₽',
    period: '/ месяц',
    description: 'Безлимитный доступ ко всем функциям',
    highlight: true,
    badge: 'Лучший выбор',
    badgeColor: 'bg-purple-600 text-white',
    icon: <Crown className="size-6 text-purple-600" />,
    features: [
      { text: 'Топ-3 совпадения с программами', included: true },
      { text: 'Базовый анализ профиля', included: true },
      { text: '2 этапа стратегии из полного плана', included: true },
      { text: 'Просмотр базы вузов', included: true },
      { text: 'Все совпадения (10+ программ)', included: true },
      { text: 'Полная стратегия подготовки', included: true },
      { text: 'Экспорт отчёта в PDF / TXT', included: true },
      { text: 'Неограниченные отчёты', included: true },
      { text: 'Приоритетная поддержка', included: true },
    ],
    cta: 'Оформить подписку',
    ctaVariant: 'premium',
  },
];

const faqs = [
  {
    q: 'Что такое "один отчёт"?',
    a: 'Разовая покупка, которая открывает полный доступ к аналитике для вашего текущего профиля: все совпадения с программами, полная стратегия и экспорт. Если вы захотите обновить профиль — понадобится новый отчёт или подписка.',
  },
  {
    q: 'Чем подписка отличается от разового отчёта?',
    a: 'Подписка позволяет создавать неограниченное количество отчётов — меняйте профиль, пробуйте разные комбинации предметов, сравнивайте стратегии. Идеально для тех, кто активно готовится к поступлению.',
  },
  {
    q: 'Как отменить подписку?',
    a: 'Подписку можно отменить в любой момент в личном кабинете. После отмены доступ сохраняется до конца оплаченного периода.',
  },
  {
    q: 'Есть ли гарантия возврата средств?',
    a: 'Да, мы предоставляем 7-дневную гарантию возврата средств для подписки и 3-дневную для разового отчёта. Напишите на support@moy-vybor.ru.',
  },
  {
    q: 'Как происходит оплата?',
    a: 'Оплата производится через защищённую платёжную систему. Принимаем карты Visa, Mastercard, МИР, а также СБП.',
  },
];

// Mock payment modal
function PaymentModal({
  plan,
  onClose,
  onSuccess,
}: {
  plan: Plan;
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
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="size-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Оформление заказа</h2>
              <p className="text-gray-500">{plan.name}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <div className="font-medium">{plan.name}</div>
                {plan.period && <div className="text-sm text-gray-500">Ежемесячная оплата</div>}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{plan.price}</div>
                {plan.period && <div className="text-sm text-gray-500">{plan.period}</div>}
              </div>
            </div>

            {/* Demo mode notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-800">
              <strong>Демо-режим:</strong> Платёжная система в процессе подключения. Нажмите кнопку
              ниже для демонстрации работы подписки.
            </div>

            <div className="space-y-3">
              <Button
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                onClick={handlePay}
              >
                <ShieldCheck className="size-4 mr-2" />
                Активировать (демо)
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Отмена
              </Button>
            </div>

            <p className="text-xs text-center text-gray-400 mt-4">
              Защищённое соединение SSL · Данные карт не хранятся
            </p>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <RefreshCw className="size-8 text-purple-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold mb-2">Обрабатываем платёж...</h2>
            <p className="text-gray-500">Пожалуйста, не закрывайте окно</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-green-700">Оплата прошла!</h2>
            <p className="text-gray-500">Открываем доступ...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Pricing() {
  const { plan: currentPlan, isPremium, isSubscription, expiresAt, daysLeft,
    activatePremiumOnce, activateSubscription, cancelSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'free') return;
    if (plan.id === currentPlan) return;
    setSelectedPlan(plan);
  };

  const handlePaymentSuccess = () => {
    if (!selectedPlan) return;
    if (selectedPlan.id === 'premium_once') {
      activatePremiumOnce();
      toast.success('Полный отчёт активирован!', {
        description: 'Теперь вам доступны все функции платформы.',
      });
    } else if (selectedPlan.id === 'subscription') {
      activateSubscription(1);
      toast.success('Подписка оформлена на 1 месяц!', {
        description: 'Создавайте неограниченное количество отчётов.',
      });
    }
    setSelectedPlan(null);
  };

  const getPlanButtonLabel = (plan: Plan): string => {
    if (plan.id === currentPlan) {
      if (plan.id === 'free') return 'Текущий план';
      if (plan.id === 'subscription') return `Активна (${daysLeft} дн.)`;
      return 'Активирован';
    }
    return plan.cta;
  };

  const isPlanDisabled = (plan: Plan): boolean => {
    if (plan.id === 'free') return true;
    if (plan.id === currentPlan) return true;
    return false;
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge className="bg-purple-100 text-purple-700 border-0 mb-4 px-4 py-1.5 text-sm">
            <Sparkles className="size-3 mr-1" />
            Тарифные планы
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Выберите свой тариф
          </h1>
          <p className="text-gray-500 text-xl max-w-xl mx-auto">
            Бесплатный доступ для старта, премиум — для уверенного поступления
          </p>
        </div>

        {/* Current subscription status */}
        {isPremium && (
          <div className={`mb-10 mx-auto max-w-2xl rounded-2xl p-5 flex items-center justify-between gap-4 ${
            isSubscription
              ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isSubscription ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                {isSubscription ? <Crown className="size-5 text-purple-600" /> : <Zap className="size-5 text-blue-600" />}
              </div>
              <div>
                <div className="font-semibold">
                  {isSubscription ? 'Подписка активна' : 'Разовый отчёт активирован'}
                </div>
                <div className="text-sm text-gray-500">
                  {isSubscription && expiresAt
                    ? `Действует до ${expiresAt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} · Осталось ${daysLeft} дней`
                    : 'Постоянный доступ к полному отчёту'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/results">
                <Button size="sm" variant="outline">
                  Результаты
                  <ArrowRight className="size-3 ml-1" />
                </Button>
              </Link>
              {isSubscription && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Отменить подписку? Доступ сохранится до конца периода.')) {
                      cancelSubscription();
                      toast.info('Подписка отменена');
                    }
                  }}
                >
                  Отменить
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border-2 transition-all ${
                plan.highlight
                  ? 'border-purple-400 shadow-xl shadow-purple-100 bg-gradient-to-b from-purple-50 via-white to-blue-50 scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.highlight ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    {plan.icon}
                  </div>
                  <div className="font-semibold text-lg">{plan.name}</div>
                  {plan.id === currentPlan && plan.id !== 'free' && (
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs ml-auto">
                      Активен
                    </Badge>
                  )}
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${
                      plan.highlight ? 'text-purple-600' : 'text-gray-900'
                    }`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500">{plan.period}</span>
                    )}
                  </div>
                  {plan.oldPrice && (
                    <div className="text-gray-400 line-through text-sm mt-0.5">
                      {plan.oldPrice}{plan.period || ''}
                    </div>
                  )}
                </div>

                <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircle2 className={`size-5 flex-shrink-0 mt-0.5 ${
                          plan.highlight ? 'text-purple-600' : 'text-green-500'
                        }`} />
                      ) : (
                        <XCircle className="size-5 flex-shrink-0 mt-0.5 text-gray-300" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full h-12 ${
                    plan.ctaVariant === 'premium'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      : ''
                  }`}
                  variant={plan.ctaVariant === 'premium' ? 'default' : plan.ctaVariant === 'outline' ? 'outline' : 'default'}
                  disabled={isPlanDisabled(plan)}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.ctaVariant === 'premium' && !isPlanDisabled(plan) && (
                    <Crown className="size-4 mr-2" />
                  )}
                  {getPlanButtonLabel(plan)}
                </Button>

                {plan.id === 'subscription' && !isPlanDisabled(plan) && (
                  <p className="text-xs text-center text-gray-400 mt-2">
                    Отмена в любой момент · Без скрытых платежей
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-16 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-2">Подписка — для тех, кто готовится всерьёз</h2>
              <p className="text-purple-200">
                Меняйте профиль, пробуйте разные сценарии, отслеживайте прогресс — неограниченно
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3">
                <Infinity className="size-5" />
                <span>Безлимитные отчёты</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3">
                <Download className="size-5" />
                <span>Экспорт PDF/TXT</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3">
                <BarChart2 className="size-5" />
                <span>Полная аналитика</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: <ShieldCheck className="size-6 text-green-600" />, label: 'Безопасная оплата', sub: 'SSL шифрование' },
            { icon: <RefreshCw className="size-6 text-blue-600" />, label: 'Гарантия возврата', sub: '7 дней для подписки' },
            { icon: <Clock className="size-6 text-purple-600" />, label: 'Мгновенный доступ', sub: 'После оплаты' },
            { icon: <Star className="size-6 text-yellow-500" />, label: '4.9 / 5.0', sub: '2 800+ учеников' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="flex justify-center mb-2">{item.icon}</div>
              <div className="font-semibold text-sm">{item.label}</div>
              <div className="text-xs text-gray-500">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Часто задаваемые вопросы</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  {openFaq === idx
                    ? <ChevronUp className="size-5 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="size-5 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}