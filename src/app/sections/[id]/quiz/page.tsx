import { QuizView } from '@/modules/quiz';
import { notFound } from 'next/navigation';
import { getSectionDetails } from '@/modules/sections/lib/actions';

type SectionQuizPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SectionQuizPage({ params }: SectionQuizPageProps) {
  const { id } = await params;
  const section = await getSectionDetails(id);

  if (!section) {
    notFound();
  }

  return <QuizView sectionId={id} programId={section.programId} />;
}
