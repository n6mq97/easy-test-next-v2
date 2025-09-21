import { getSectionDetails, deleteSection } from '@/modules/sections/lib/actions';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@/modules/sections/components/SectionHeader';
import { EditSectionTheoryForm } from '@/modules/sections';
import { QuestionList } from '@/modules/questions';

type SectionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SectionPage({ params }: SectionPageProps) {
  const { id } = await params;
  const section = await getSectionDetails(id);

  if (!section) {
    notFound();
  }

  const deleteSectionWithId = async () => {
    'use server';
    const formData = new FormData();
    formData.append('sectionId', section.id);
    await deleteSection(formData);
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <SectionHeader section={section} deleteAction={deleteSectionWithId} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <EditSectionTheoryForm sectionId={section.id} initialTheory={section.theory} />
        </div>
        <div>
          <QuestionList questions={section.questions} />
        </div>
      </div>
    </main>
  );
}
