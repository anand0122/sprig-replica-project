
import { useState, useEffect } from 'react';

export interface StudyResponse {
  id: string;
  studyId: string;
  userId?: string;
  sessionId: string;
  responses: Record<string, any>;
  completedAt: string;
  timeSpent: number;
  metadata: {
    userAgent: string;
    referrer: string;
    location?: string;
  };
}

export interface ResponseStats {
  totalResponses: number;
  completionRate: number;
  averageTimeSpent: number;
  responsesByDay: Array<{ date: string; count: number }>;
  questionStats: Record<string, {
    totalAnswers: number;
    averageRating?: number;
    responseDistribution?: Record<string, number>;
  }>;
}

export const useResponses = (studyId?: string) => {
  const [responses, setResponses] = useState<StudyResponse[]>([]);
  const [stats, setStats] = useState<ResponseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResponses();
  }, [studyId]);

  const loadResponses = () => {
    setIsLoading(true);
    try {
      const allResponses = JSON.parse(localStorage.getItem('sprig_responses') || '[]');
      const filteredResponses = studyId 
        ? allResponses.filter((r: StudyResponse) => r.studyId === studyId)
        : allResponses;
      
      setResponses(filteredResponses);
      setStats(calculateStats(filteredResponses));
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (responses: StudyResponse[]): ResponseStats => {
    if (responses.length === 0) {
      return {
        totalResponses: 0,
        completionRate: 0,
        averageTimeSpent: 0,
        responsesByDay: [],
        questionStats: {}
      };
    }

    const totalResponses = responses.length;
    const completionRate = 100; // All stored responses are completed
    const averageTimeSpent = responses.reduce((sum, r) => sum + r.timeSpent, 0) / totalResponses;

    // Group responses by day
    const responsesByDay = responses.reduce((acc, response) => {
      const date = new Date(response.completedAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const responsesByDayArray = Object.entries(responsesByDay).map(([date, count]) => ({
      date,
      count
    }));

    // Calculate question stats
    const questionStats: Record<string, any> = {};
    responses.forEach(response => {
      Object.entries(response.responses).forEach(([questionId, answer]) => {
        if (!questionStats[questionId]) {
          questionStats[questionId] = {
            totalAnswers: 0,
            values: []
          };
        }
        questionStats[questionId].totalAnswers++;
        questionStats[questionId].values.push(answer);
      });
    });

    // Process question stats
    Object.keys(questionStats).forEach(questionId => {
      const values = questionStats[questionId].values;
      
      // Calculate average for numeric responses
      const numericValues = values.filter(v => typeof v === 'number');
      if (numericValues.length > 0) {
        questionStats[questionId].averageRating = 
          numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      }

      // Calculate response distribution
      const distribution: Record<string, number> = {};
      values.forEach(value => {
        const key = String(value);
        distribution[key] = (distribution[key] || 0) + 1;
      });
      questionStats[questionId].responseDistribution = distribution;
    });

    return {
      totalResponses,
      completionRate,
      averageTimeSpent,
      responsesByDay: responsesByDayArray,
      questionStats
    };
  };

  const addResponse = (response: Omit<StudyResponse, 'id' | 'completedAt'>) => {
    const newResponse: StudyResponse = {
      ...response,
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString()
    };

    const allResponses = JSON.parse(localStorage.getItem('sprig_responses') || '[]');
    const updatedResponses = [...allResponses, newResponse];
    localStorage.setItem('sprig_responses', JSON.stringify(updatedResponses));
    
    loadResponses();
    return newResponse;
  };

  return {
    responses,
    stats,
    isLoading,
    addResponse,
    refreshResponses: loadResponses
  };
};
