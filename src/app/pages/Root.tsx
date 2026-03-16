import { Outlet, Link, useLocation } from 'react-router';
import { GraduationCap, User, Trophy, Building2, MapPin, Menu, Crown, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import { Toaster } from '../components/ui/sonner';
import { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

export function Root() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPremium, isSubscription, daysLeft } = useSubscription();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLinks = () => (
    <>
      <Link to="/" onClick={() => setMobileMenuOpen(false)}>
        <Button variant={isActive('/') ? 'default' : 'ghost'} className="w-full md:w-auto">
          Главная
        </Button>
      </Link>
      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
        <Button variant={isActive('/profile') ? 'default' : 'ghost'} className="w-full md:w-auto">
          <User className="size-4 mr-2" />
          Анкета
        </Button>
      </Link>
      <Link to="/universities" onClick={() => setMobileMenuOpen(false)}>
        <Button variant={isActive('/universities') ? 'default' : 'ghost'} className="w-full md:w-auto">
          <Building2 className="size-4 mr-2" />
          Вузы
        </Button>
      </Link>
      <Link to="/results" onClick={() => setMobileMenuOpen(false)}>
        <Button variant={isActive('/results') ? 'default' : 'ghost'} className="w-full md:w-auto">
          <Trophy className="size-4 mr-2" />
          Результаты
        </Button>
      </Link>
      <Link to="/strategy" onClick={() => setMobileMenuOpen(false)}>
        <Button variant={isActive('/strategy') ? 'default' : 'ghost'} className="w-full md:w-auto">
          <MapPin className="size-4 mr-2" />
          Моя стратегия
        </Button>
      </Link>
      <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
        <Button
          variant={isActive('/pricing') ? 'default' : 'ghost'}
          className={`w-full md:w-auto ${
            !isPremium && !isActive('/pricing')
              ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
              : ''
          }`}
        >
          <Crown className="size-4 mr-2" />
          Тарифы
        </Button>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="size-8 text-blue-600" />
              <span className="font-bold text-xl">Мой выбор</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLinks />
            </nav>

            {/* Subscription Badge + Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Subscription status badge (desktop) */}
              {isPremium ? (
                <Link to="/pricing" className="hidden md:block">
                  <Badge className={`${
                    isSubscription
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0'
                      : 'bg-blue-100 text-blue-700 border-0'
                  } px-3 py-1.5 cursor-pointer hover:opacity-90 transition-opacity`}>
                    {isSubscription ? (
                      <><Crown className="size-3 mr-1" />Подписка · {daysLeft} дн.</>
                    ) : (
                      <><Zap className="size-3 mr-1" />Премиум</>
                    )}
                  </Badge>
                </Link>
              ) : (
                <Link to="/pricing" className="hidden md:block">
                  <Badge
                    variant="outline"
                    className="border-purple-300 text-purple-600 px-3 py-1.5 cursor-pointer hover:bg-purple-50 transition-colors"
                  >
                    <Crown className="size-3 mr-1" />
                    Получить премиум
                  </Badge>
                </Link>
              )}

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="size-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <GraduationCap className="size-6 text-blue-600" />
                        Мой выбор
                      </SheetTitle>
                    </SheetHeader>
                    {isPremium && (
                      <div className={`mt-4 mx-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        isSubscription
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isSubscription
                          ? <><Crown className="size-4" />Подписка активна · {daysLeft} дн.</>
                          : <><Zap className="size-4" />Премиум отчёт активирован</>}
                      </div>
                    )}
                    <nav className="flex flex-col gap-4 mt-8">
                      <NavLinks />
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <Toaster />

      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="size-6" />
                <span className="font-bold">Мой выбор</span>
              </div>
              <p className="text-gray-400">
                Интеллектуальная система персонализированного подбора образовательной стратегии для
                школьников 9-11 классов
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Разделы</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/profile" className="hover:text-white transition-colors">
                    Заполнить анкету
                  </Link>
                </li>
                <li>
                  <Link to="/universities" className="hover:text-white transition-colors">
                    База вузов
                  </Link>
                </li>
                <li>
                  <Link to="/results" className="hover:text-white transition-colors">
                    Мои результаты
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white transition-colors">
                    Тарифы
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">О проекте</h3>
              <p className="text-gray-400">
                Проект создан для помощи школьникам и их родителям в принятии обоснованных решений
                при выборе образовательной траектории
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2026 Мой выбор. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}