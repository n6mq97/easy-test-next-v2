import Link from 'next/link';
import { getSections } from '../lib/actions';
import { paths } from '@/lib/paths';

interface SectionListProps {
  programId: string;
}

export async function SectionList({ programId }: SectionListProps) {
  const sections = await getSections(programId);

  if (sections.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No sections found. Import some questions to get started!</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Sections</h2>
      <ul className="space-y-4">
        {sections.map((section) => (
          <li
            key={section.id}
            className="border border-gray-200 p-4 rounded-md flex justify-between items-center"
          >
            <Link href={paths.section(section.id)} className="font-medium hover:underline">
              {section.name}
            </Link>
            {/* Action buttons can be added here in the future */}
          </li>
        ))}
      </ul>
    </div>
  );
}
