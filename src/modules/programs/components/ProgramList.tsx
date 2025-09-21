import Link from 'next/link';
import { getPrograms } from '../lib/actions';
import { paths } from '@/lib/paths';
import { ProgramStats } from '@/modules/stats/lib/actions';

type ProgramListProps = {
  stats: ProgramStats[];
};

export async function ProgramList({ stats }: ProgramListProps) {
  const programs = await getPrograms();

  if (programs.length === 0) {
    return <p>No programs found. Create one to get started!</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Programs</h2>
      <ul className="space-y-4">
        {programs.map((program) => {
          const programStat = stats.find(s => s.programId === program.id);
          const progress = programStat ? programStat.progress.toFixed(0) : 0;

          return (
            <li
              key={program.id}
              className="border border-gray-200 p-4 rounded-md flex justify-between items-center transition-colors hover:bg-gray-800/10"
            >
              <Link
                href={paths.program(program.id)}
                className="font-medium hover:underline"
              >
                {program.name}
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
