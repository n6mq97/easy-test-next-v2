'use client';

import { Section } from '@prisma/client';
import { SectionItem } from './SectionItem';
import { SectionStats } from '@/modules/stats/lib/actions';
import { useEffect, useState, useMemo } from 'react';

interface SectionListProps {
  programId: string;
  stats: SectionStats[];
  initialSections: Section[];
}

type SortKey = 'createdAt' | 'updatedAt' | 'name';
type SortOrder = 'asc' | 'desc';

export function SectionList({
  stats,
  initialSections,
}: SectionListProps) {
  const [sections, setSections] = useState(initialSections);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    const savedSortKey = localStorage.getItem('sectionsSortKey') as SortKey;
    const savedSortOrder = localStorage.getItem('sectionsSortOrder') as SortOrder;
    if (savedSortKey) setSortKey(savedSortKey);
    if (savedSortOrder) setSortOrder(savedSortOrder);
  }, []);

  useEffect(() => {
    localStorage.setItem('sectionsSortKey', sortKey);
    localStorage.setItem('sectionsSortOrder', sortOrder);
  }, [sortKey, sortOrder]);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [sections, sortKey, sortOrder]);

  if (initialSections.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No sections found. Import some questions to get started!
      </p>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sections</h2>
        <div className="flex gap-2 items-center text-sm">
          <span>Sort by:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="bg-neutral-800 p-1 rounded-md"
          >
            <option value="name">Name</option>
            <option value="createdAt">Date Added</option>
            <option value="updatedAt">Last Modified</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="bg-neutral-800 p-1 rounded-md"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {sortedSections.map((section) => {
          const sectionStat = stats.find((s) => s.sectionId === section.id);
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
