export interface PreparationCourse {
  id: string;
  name: string;
  provider: string;
  description: string;
  subjects: string[];
  features: string[];
  price: string;
  discount?: string;
  referralLink: string;
  logo?: string;
  rating: number;
  reviewsCount: number;
}

export const preparationCourses: PreparationCourse[] = [
  {
    id: 'webium-ege',
    name: 'Курсы подготовки к ЕГЭ',
    provider: 'Вебиум',
    description: 'Онлайн-курсы подготовки к ЕГЭ с гарантией результата. Живые вебинары, домашние задания и личный куратор.',
    subjects: ['Математика', 'Физика', 'Русский язык', 'Обществознание', 'Информатика', 'Химия', 'Биология'],
    features: [
      'Живые онлайн-вебинары с преподавателями',
      'Домашние задания с проверкой',
      'Личный куратор на весь курс',
      'Пробные ЕГЭ каждый месяц',
      'Гарантия результата или возврат денег',
    ],
    price: 'от 4 990 ₽/мес',
    discount: 'Скидка 20% по реферальной ссылке',
    referralLink: 'https://webium.ru/?ref=moy-vybor',
    rating: 4.8,
    reviewsCount: 15234,
  },
  {
    id: 'lomonosov-school',
    name: 'Подготовка к ЕГЭ и олимпиадам',
    provider: 'Lomonosov School',
    description: 'Премиальная подготовка к ЕГЭ и олимпиадам от преподавателей МГУ. Индивидуальный подход и углубленная программа.',
    subjects: ['Математика', 'Физика', 'Химия', 'Биология', 'Информатика', 'Английский язык'],
    features: [
      'Преподаватели из МГУ и ведущих вузов',
      'Подготовка к олимпиадам Всеросса',
      'Индивидуальные и групповые занятия',
      'Углубленная программа повышенного уровня',
      'Менторская поддержка 24/7',
    ],
    price: 'от 7 990 ₽/мес',
    discount: 'Первое занятие бесплатно',
    referralLink: 'https://lomonosov.school/?utm_source=moy-vybor',
    rating: 4.9,
    reviewsCount: 8456,
  },
  {
    id: 'webium-olymp',
    name: 'Курсы подготовки к олимпиадам',
    provider: 'Вебиум',
    description: 'Специализированная подготовка к Всероссийской олимпиаде школьников и перечневым олимпиадам.',
    subjects: ['Математика', 'Физика', 'Информатика', 'Химия'],
    features: [
      'Разбор олимпиадных задач прошлых лет',
      'Тренировочные туры',
      'Преподаватели - победители олимпиад',
      'Индивидуальный трек подготовки',
    ],
    price: 'от 5 990 ₽/мес',
    discount: 'Скидка 20% по реферальной ссылке',
    referralLink: 'https://webium.ru/olymp?ref=moy-vybor',
    rating: 4.7,
    reviewsCount: 6543,
  },
];
