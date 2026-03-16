import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MatchResult } from '../types';

interface MatchScoreChartProps {
  matches: MatchResult[];
}

export function MatchScoreChart({ matches }: MatchScoreChartProps) {
  const topMatches = matches.slice(0, 10);
  
  const data = topMatches.map((match, index) => ({
    name: `${match.university.name.split(' ')[0]} - ${match.program.name.slice(0, 20)}...`,
    score: match.matchScore,
    rank: index + 1,
  }));

  const getColor = (rank: number) => {
    if (rank === 1) return '#3b82f6'; // blue
    if (rank === 2) return '#8b5cf6'; // purple
    if (rank === 3) return '#10b981'; // green
    return '#94a3b8'; // gray
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Топ-10 программ по уровню соответствия</CardTitle>
        <CardDescription>
          Визуализация наиболее подходящих образовательных программ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="rank" 
              label={{ value: 'Позиция', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Соответствие (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded-lg shadow-lg">
                      <p className="font-medium">{payload[0].payload.name}</p>
                      <p className="text-blue-600">
                        Соответствие: <span className="font-bold">{payload[0].value}%</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.rank)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
