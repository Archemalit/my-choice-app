import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ExternalLink, Star, Users, CheckCircle2 } from 'lucide-react';
import { PreparationCourse } from '../data/preparationCourses';

interface CourseAdProps {
  course: PreparationCourse;
  variant?: 'default' | 'compact';
}

export function CourseAd({ course, variant = 'default' }: CourseAdProps) {
  if (variant === 'compact') {
    return (
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className="bg-blue-600">
                  Партнёр
                </Badge>
                {course.discount && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {course.discount}
                  </Badge>
                )}
              </div>
              <h3 className="font-bold text-lg mb-1">{course.provider}</h3>
              <p className="text-sm text-gray-600 mb-3">{course.name}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="size-4" />
                  <span>{course.reviewsCount.toLocaleString()} отзывов</span>
                </div>
              </div>
              <div className="font-bold text-blue-600 text-lg">{course.price}</div>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <a href={course.referralLink} target="_blank" rel="noopener noreferrer">
                Подробнее
                <ExternalLink className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="bg-blue-600">
                Рекомендуемый партнёр
              </Badge>
              {course.discount && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {course.discount}
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{course.provider}</CardTitle>
            <CardDescription className="text-base mt-1">{course.name}</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">{course.rating}</span>
            </div>
            <div className="text-sm text-gray-600">{course.reviewsCount.toLocaleString()} отзывов</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">{course.description}</p>

        {/* Subjects */}
        <div>
          <h4 className="font-medium mb-2">Предметы:</h4>
          <div className="flex flex-wrap gap-2">
            {course.subjects.map((subject) => (
              <Badge key={subject} variant="outline">
                {subject}
              </Badge>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-medium mb-2">Преимущества:</h4>
          <ul className="space-y-2">
            {course.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <div className="text-sm text-gray-600">Стоимость</div>
            <div className="text-2xl font-bold text-blue-600">{course.price}</div>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <a href={course.referralLink} target="_blank" rel="noopener noreferrer">
              Узнать больше
              <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
