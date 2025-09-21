'use client';

import { useState } from 'react';
import { QuizQuestionData, submitAnswer } from '../lib/actions';

interface SubmittedAnswer {
  selectedIndex: number;
  isCorrect: boolean;
  correctAnswerIndex: number;
}

interface QuizQuestionProps {
  question: QuizQuestionData;
  onAnswerSubmit: (isCorrect: boolean) => void;
}

export const QuizQuestion = ({ question, onAnswerSubmit }: QuizQuestionProps) => {
  const [submittedAnswer, setSubmittedAnswer] = useState<SubmittedAnswer | null>(
    null,
  );

  const handleAnswerClick = async (index: number) => {
    if (submittedAnswer) return;

    try {
      const result = await submitAnswer({
        questionId: question.id,
        selectedAnswerIndex: index,
      });
      setSubmittedAnswer({ selectedIndex: index, ...result });
      onAnswerSubmit(result.isCorrect);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const answers = JSON.parse(question.answers);

  return (
    <div>
      <p>{question.questionText}</p>
      <div>
        {answers.map((answer: string, index: number) => {
          const isSubmitted = submittedAnswer !== null;
          const isSelected =
            isSubmitted && submittedAnswer.selectedIndex === index;
          const isCorrect =
            isSubmitted && submittedAnswer.correctAnswerIndex === index;

          let buttonClass = 'p-2 border rounded-md w-full my-1 text-left';
          if (isSubmitted) {
            if (isCorrect) {
              buttonClass += ' bg-green-900/50 border-green-700';
            } else if (isSelected) {
              buttonClass += ' bg-red-900/50 border-red-700';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={isSubmitted}
              className={buttonClass}
            >
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
};
