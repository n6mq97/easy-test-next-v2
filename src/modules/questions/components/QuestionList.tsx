import type { Question } from '@prisma/client';

interface QuestionListProps {
  questions: Pick<Question, 'id' | 'questionText'>[];
}

export function QuestionList({ questions }: QuestionListProps) {
  if (questions.length === 0) {
    return null; // Don't render anything if there are no questions
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Questions</h3>
      <ul className="space-y-4">
        {questions.map((question) => (
          <li
            key={question.id}
            className="border border-gray-200 p-4 rounded-md flex justify-between items-center"
          >
            <p className="font-medium">{question.questionText}</p>
            {/* Action buttons like Edit/Delete can be added here */}
          </li>
        ))}
      </ul>
    </div>
  );
}
