'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizQuestionData, getQuizQuestions } from '../lib/actions';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';

interface QuizViewProps {
  sectionId?: string;
  programId?: string;
  initialQuestions?: QuizQuestionData[];
  exitPath?: string;
}

export const QuizView = ({ sectionId, programId, initialQuestions, exitPath }: QuizViewProps) => {
  const [questions, setQuestions] = useState<QuizQuestionData[]>(initialQuestions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!initialQuestions);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initialQuestions) return;

    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const params = sectionId ? { sectionId } : { programId };
        const fetchedQuestions = await getQuizQuestions(params);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, [sectionId, programId, initialQuestions]);

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div>
        <p>No questions found.</p>
        <button onClick={() => router.push(exitPath || '/')} className="mt-4 bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600">
          Back
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <QuizResults
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        onRestart={() => {
          setQuestions([...questions].sort(() => Math.random() - 0.5));
          setCurrentQuestionIndex(0);
          setCorrectAnswers(0);
          setIsAnswerSubmitted(false);
          setIsFinished(false);
        }}
        onExit={() => router.push(exitPath || (programId ? `/programs/${programId}`: '/'))}
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
      setCorrectAnswers((prev) => prev + 1);
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
          onClick={() => router.push(exitPath || (programId ? `/programs/${programId}` : '/'))}
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
            className="p-2 px-8 rounded-md border disabled:bg-gray-800/50 disabled:text-white bg-white text-black"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
