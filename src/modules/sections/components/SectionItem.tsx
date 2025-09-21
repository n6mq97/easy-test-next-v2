import { Section } from '@prisma/client';
import Link from 'next/link';
import { paths } from '@/lib/paths';
import { SectionStats } from '@/modules/stats/lib/actions';

interface SectionItemProps {
  section: Section;
  stat?: SectionStats;
}

export function SectionItem({ section, stat }: SectionItemProps) {
  const progress = stat ? stat.progress.toFixed(0) : 0;
  return (
    <Link
      href={paths.section(section.id)}
      className="block p-4 border rounded-md transition-colors hover:bg-gray-800/10"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{section.name}</h3>
        {stat && stat.totalAttempts > 0 && (
          <span className="text-sm text-gray-500">{progress}%</span>
        )}
      </div>
    </Link>
  );
}
