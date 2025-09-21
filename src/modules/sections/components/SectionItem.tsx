import { Section } from '@prisma/client';
import Link from 'next/link';
import { paths } from '@/lib/paths';

interface SectionItemProps {
  section: Section;
}

export function SectionItem({ section }: SectionItemProps) {
  return (
    <Link
      href={paths.section(section.id)}
      className="block p-4 border rounded-md hover:bg-gray-100"
    >
      <h3 className="text-xl font-semibold">{section.name}</h3>
    </Link>
  );
}
