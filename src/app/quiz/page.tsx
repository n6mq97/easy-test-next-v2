import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getQuizQuestionsForMultiplePrograms } from '@/modules/quiz/lib/actions';
import { QuizView } from '@/modules/quiz';
import { getCurrentUser } from '@/modules/auth';

type QuizPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    notFound();
  }

  const params = await searchParams;
  const programIds = Array.isArray(params.programIds)
    ? params.programIds
    : params.programIds?.split(',') || [];

  if (programIds.length === 0) {
    return <p>No programs selected.</p>;
  }

  const questions = await getQuizQuestionsForMultiplePrograms(programIds);

  return (
    <Suspense fallback={<p>Loading questions...</p>}>
      <QuizView initialQuestions={questions} exitPath="/" programId={programIds.join(',')} />
    </Suspense>
  );
}
