import { getProgramById } from '@/modules/programs/lib/actions';
import { JsonImportForm } from '@/modules/questions';
import { SectionList } from '@/modules/sections';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type ProgramPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = await params;
  const program = await getProgramById(id);

  if (!program) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Program: {program.name}</h1>
        <p className="text-gray-500">Import questions and manage sections.</p>
      </header>

      <div className="max-w-2xl mx-auto">
        <JsonImportForm programId={id} />
        <Suspense fallback={<p className="text-center mt-8">Loading sections...</p>}>
          <SectionList programId={id} />
        </Suspense>
      </div>
    </main>
  );
}
