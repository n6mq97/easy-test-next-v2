import { getProgramById, deleteProgram } from '@/modules/programs/lib/actions';
import { JsonImportForm } from '@/modules/questions';
import { SectionList } from '@/modules/sections';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProgramHeader } from '@/modules/programs/components/ProgramHeader';
import { getCurrentUser } from '@/modules/auth';
import { getProgramsStats, getSectionsStats } from '@/modules/stats/lib/actions';

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

  const deleteProgramWithId = async () => {
    'use server';
    await deleteProgram(id);
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <ProgramHeader
        program={program}
        deleteAction={deleteProgramWithId}
        stats={programStat}
      />
      <div className="max-w-2xl mx-auto">
        <JsonImportForm programId={id} />
        <Suspense fallback={<p className="text-center mt-8">Loading sections...</p>}>
          <SectionList programId={id} stats={sectionStats} />
        </Suspense>
      </div>
    </main>
  );
}
