import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Award, TrendingUp, Target } from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfileSummaryProps {
  profile: StudentProfile;
}

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  const totalGrades = Object.keys(profile.grades).length;
  const averageGrade = totalGrades > 0 
    ? Object.values(profile.grades).reduce((sum, grade) => sum + grade, 0) / totalGrades 
    : 0;

  const gradePercentage = (averageGrade / 5) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <TrendingUp className="size-4 mr-2" />
            Средний балл
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {averageGrade.toFixed(2)}
          </div>
          <Progress value={gradePercentage} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">
            По {totalGrades} предмет{totalGrades === 1 ? 'у' : 'ам'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Award className="size-4 mr-2" />
            Достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {profile.achievements.length}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.achievements.slice(0, 3).map((achievement, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {achievement.type === 'olympiad' ? '🏆' : '✨'}
              </Badge>
            ))}
            {profile.achievements.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{profile.achievements.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Target className="size-4 mr-2" />
            Интересы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {profile.interests.length}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.interests.slice(0, 2).map((interest, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {interest.split(' ')[0]}
              </Badge>
            ))}
            {profile.interests.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{profile.interests.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
