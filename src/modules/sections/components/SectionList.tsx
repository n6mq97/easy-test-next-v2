import { getSections } from '../lib/actions';
import { SectionItem } from './SectionItem';
import { SectionStats } from '@/modules/stats/lib/actions';

interface SectionListProps {
  programId: string;
  stats: SectionStats[];
}

export async function SectionList({ programId, stats }: SectionListProps) {
  const sections = await getSections(programId);

  if (sections.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No sections found. Import some questions to get started!
      </p>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Sections</h2>
      <div className="space-y-4">
        {sections.map((section) => {
          const sectionStat = stats.find(s => s.sectionId === section.id);
          return (
            <SectionItem
              key={section.id}
              section={section}
              stat={sectionStat}
            />
          );
        })}
      </div>
    </div>
  );
}
