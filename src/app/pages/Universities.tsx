import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Building2, MapPin, Users, DollarSign, Trophy, Search } from 'lucide-react';
import { universities, directions } from '../data/mockData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export function Universities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedDirection, setSelectedDirection] = useState<string>('all');

  const cities = Array.from(new Set(universities.map((u) => u.city)));

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch =
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.programs.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCity = selectedCity === 'all' || uni.city === selectedCity;
    const matchesDirection =
      selectedDirection === 'all' ||
      uni.programs.some((p) => p.direction === selectedDirection);

    return matchesSearch && matchesCity && matchesDirection;
  });

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">База вузов</h1>
          <p className="text-gray-600 text-lg">
            Изучите более 100 ведущих вузов России и их образовательные программы
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Поиск по названию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Город" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все города</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                <SelectTrigger>
                  <SelectValue placeholder="Направление" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все направления</SelectItem>
                  {directions.map((dir) => (
                    <SelectItem key={dir} value={dir}>
                      {dir}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {filteredUniversities.map((university) => (
            <Card key={university.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      <Building2 className="inline size-6 mr-2 text-blue-600" />
                      {university.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center">
                        <MapPin className="size-4 mr-1" />
                        {university.city}
                      </span>
                      <Badge variant="secondary">Рейтинг: {university.rating}</Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {university.programs
                    .filter(
                      (program) =>
                        selectedDirection === 'all' || program.direction === selectedDirection
                    )
                    .map((program) => (
                      <AccordionItem key={program.id} value={program.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <span className="font-medium">{program.name}</span>
                            <Badge>{program.direction}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-4">
                            {/* ЕГЭ Requirements */}
                            <div>
                              <h4 className="font-medium mb-2">Требуемые предметы ЕГЭ:</h4>
                              <div className="flex flex-wrap gap-2">
                                {program.requiredEGE.map((subject) => (
                                  <Badge key={subject} variant="outline">
                                    {getSubjectName(subject)}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">Минимальный балл</div>
                                <div className="text-2xl font-bold text-blue-600">
                                  {program.minScore}
                                </div>
                              </div>

                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">Проходной балл 2025</div>
                                <div className="text-2xl font-bold text-purple-600">
                                  {program.passingScore}
                                </div>
                              </div>

                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">
                                  <Users className="inline size-4 mr-1" />
                                  Бюджет
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                  {program.budgetPlaces}
                                </div>
                              </div>

                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">
                                  <DollarSign className="inline size-4 mr-1" />
                                  Платно
                                </div>
                                <div className="text-2xl font-bold text-orange-600">
                                  {program.paidPlaces}
                                </div>
                              </div>
                            </div>

                            {/* Cost */}
                            {program.cost && (
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-sm text-blue-800 mb-1">
                                  Стоимость обучения в год
                                </div>
                                <div className="text-xl font-bold text-blue-900">
                                  {program.cost.toLocaleString('ru-RU')} ₽
                                </div>
                              </div>
                            )}

                            {/* Olympiads */}
                            {program.olympiads && program.olympiads.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2 flex items-center">
                                  <Trophy className="size-4 mr-2 text-yellow-600" />
                                  Олимпиады, дающие преимущества:
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                  {program.olympiads.map((olymp, idx) => (
                                    <li key={idx}>{olymp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Building2 className="size-12 mx-auto mb-4 opacity-50" />
              <p>Вузы не найдены. Попробуйте изменить критерии поиска.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
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
