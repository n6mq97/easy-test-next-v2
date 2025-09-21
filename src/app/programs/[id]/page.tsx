import { getProgramById, deleteProgram } from '@/modules/programs/lib/actions';
import { JsonImportForm } from '@/modules/questions';
import { SectionList, getSections } from '@/modules/sections';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProgramHeader } from '@/modules/programs/components/ProgramHeader';
import { getCurrentUser } from '@/modules/auth';
import { getProgramsStats, getSectionsStats } from '@/modules/stats/lib/actions';
import { EditProgramPlanForm } from '@/modules/programs/components/EditProgramPlanForm';

type ProgramPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = await params;
  const program = await getProgramById(id);
  const user = await getCurrentUser();

  if (!program || !user) {
    notFound();
  }

  const stats = await getProgramsStats(user.id);
  const programStat = stats.find(s => s.programId === program.id);
  const sectionStats = await getSectionsStats(program.id, user.id);
  const sections = await getSections(program.id);

  const deleteProgramWithId = async () => {
    'use server';
    await deleteProgram(id);
  };

  return (
    <main className="container mx-auto">
      <ProgramHeader
        program={program}
        deleteAction={deleteProgramWithId}
        stats={programStat}
        sections={sections}
        sectionStats={sectionStats}
      />
      <div className="max-w-2xl mx-auto">
        <JsonImportForm programId={id} />
        <EditProgramPlanForm programId={program.id} initialPlan={program.plan} />
        <Suspense fallback={<p className="text-center mt-8">Loading sections...</p>}>
          <SectionList programId={id} stats={sectionStats} initialSections={sections} />
        </Suspense>
      </div>
    </main>
  );
}
