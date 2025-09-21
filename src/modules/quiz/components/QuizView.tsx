'use client';

import { useEffect, useState } from 'react';
import { getQuizQuestions, QuizQuestionData } from '../lib/actions';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { useRouter } from 'next/navigation';

interface QuizViewProps {
  sectionId?: string;
  programId?: string;
}

export const QuizView = ({ sectionId, programId }: QuizViewProps) => {
  const [questions, setQuestions] = useState<QuizQuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const fetchedQuestions = await getQuizQuestions({ sectionId, programId });
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [sectionId, programId]);

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions found.</div>;
  }

  if (isFinished) {
    return (
      <QuizResults
        score={score}
        totalQuestions={questions.length}
        onRestart={() => {
          setCurrentQuestionIndex(0);
          setScore(0);
          setIsAnswerSubmitted(false);
          setIsFinished(false);
          fetchQuestions();
        }}
        onExit={() => router.back()}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const handleAnswerSubmitted = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setIsAnswerSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 w-full">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Exit to Sections
        </button>
      </header>

      <QuizQuestion
        key={currentQuestion.id}
        question={currentQuestion}
        onAnswerSubmit={handleAnswerSubmitted}
      />

      <div className="mt-4">
        {isLastQuestion ? (
          <button
            onClick={handleFinish}
            disabled={!isAnswerSubmitted}
            className="p-2 rounded-md border disabled:bg-gray-800/50 disabled:text-white bg-white text-black"
          >
            Finish
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswerSubmitted}
            className="p-2 rounded-md border disabled:bg-gray-800/50 disabled:text-white bg-white text-black"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
