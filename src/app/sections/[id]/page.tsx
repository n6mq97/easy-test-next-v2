import { getSectionDetails } from '@/modules/sections/lib/actions';
import { notFound } from 'next/navigation';
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

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Section: {section.name}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
