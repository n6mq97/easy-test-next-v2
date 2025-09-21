import { QuizView } from '@/modules/quiz';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface SectionQuizPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SectionQuizPage({ params }: SectionQuizPageProps) {
  const { id } = await params;
  const section = await prisma.section.findUnique({
    where: { id },
    select: { programId: true },
  });

  if (!section) {
    notFound();
  }

  return <QuizView sectionId={id} programId={section.programId} />;
}
