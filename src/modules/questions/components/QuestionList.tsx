import type { Question } from '@prisma/client';
import { QuestionStats } from '@/modules/stats/lib/actions';

interface QuestionListProps {
  questions: Pick<Question, 'id' | 'questionText'>[];
  stats: QuestionStats[];
}

export function QuestionList({ questions, stats }: QuestionListProps) {
  if (questions.length === 0) {
    return null; // Don't render anything if there are no questions
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Questions</h2>
      <ul className="space-y-4">
        {questions.map((question) => {
          const questionStat = stats.find(s => s.questionId === question.id);
          return (
            <li
              key={question.id}
              className="border border-gray-200 p-4 rounded-md flex justify-between items-center"
            >
              <p className="font-medium">{question.questionText}</p>
              {questionStat && questionStat.totalAttempts > 0 && (
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {questionStat.correctAnswers} / {questionStat.totalAttempts} (
                  {questionStat.progress.toFixed(0)}%)
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
