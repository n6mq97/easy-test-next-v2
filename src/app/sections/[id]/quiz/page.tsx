import { QuizView } from '@/modules/quiz';

interface SectionQuizPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SectionQuizPage({ params }: SectionQuizPageProps) {
  const { id } = await params;
  return <QuizView sectionId={id} />;
}
