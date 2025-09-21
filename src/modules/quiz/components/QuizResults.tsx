'use client';

interface QuizResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
  onExit: () => void;
}

export const QuizResults = ({ correctAnswers, totalQuestions, onRestart, onExit }: QuizResultsProps) => {
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
      <p className="text-lg">
        You scored {correctAnswers} out of {totalQuestions} ({percentage.toFixed(0)}%)
      </p>
      <div className="mt-6">
        <button onClick={onRestart} className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md mr-2">
          Try Again
        </button>
        <button onClick={onExit} className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md">
          Back to Program
        </button>
      </div>
    </div>
  );
};
