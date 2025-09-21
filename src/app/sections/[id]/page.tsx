import { getSectionDetails, deleteSection } from '@/modules/sections/lib/actions';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@/modules/sections/components/SectionHeader';
import { EditSectionTheoryForm } from '@/modules/sections';
import { QuestionList } from '@/modules/questions';
import { getCurrentUser } from '@/modules/auth';
import { getQuestionsStats } from '@/modules/stats/lib/actions';

type SectionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SectionPage({ params }: SectionPageProps) {
  const { id } = await params;
  const section = await getSectionDetails(id);
  const user = await getCurrentUser();

  if (!section || !user) {
    notFound();
  }

  const stats = await getQuestionsStats(section.id, user.id);

  const deleteSectionWithId = async () => {
    'use server';
    const formData = new FormData();
    formData.append('sectionId', section.id);
    await deleteSection(formData);
  };

  const textToCopy = `Theory:\n${section.theory || 'No theory provided.'}\n\nQuestions:\n${section.questions
    .map((q) => {
      const stat = stats.find((s) => s.questionId === q.id);
      const progress = stat ? stat.progress.toFixed(0) : 'N/A';
      return `- ${q.questionText} - ${progress}%`;
    })
    .join('\n')}`;

  return (
    <main className="container mx-auto">
      <SectionHeader
        section={section}
        deleteAction={deleteSectionWithId}
        textToCopy={textToCopy}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <EditSectionTheoryForm sectionId={section.id} initialTheory={section.theory} />
        </div>
        <div>
          <QuestionList questions={section.questions} stats={stats} />
        </div>
      </div>
    </main>
  );
}
