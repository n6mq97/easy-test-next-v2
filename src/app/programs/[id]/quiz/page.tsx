import { QuizView } from '@/modules/quiz';

interface ProgramQuizPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProgramQuizPage({ params }: ProgramQuizPageProps) {
  const { id } = await params;
  return <QuizView programId={id} />;
}
