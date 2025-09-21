import Link from 'next/link';
import { getPrograms } from '../lib/actions';
import { DeleteProgramButton } from './DeleteProgramButton';
import { paths } from '@/lib/paths';

export async function ProgramList() {
  const programs = await getPrograms();

  if (programs.length === 0) {
    return <p>No programs found. Create one to get started!</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Programs</h2>
      <ul className="space-y-4">
        {programs.map((program) => (
          <li
            key={program.id}
            className="border border-gray-200 p-4 rounded-md flex justify-between items-center"
          >
            <Link href={paths.program(program.id)} className="font-medium hover:underline">
              {program.name}
            </Link>
            <DeleteProgramButton programId={program.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
