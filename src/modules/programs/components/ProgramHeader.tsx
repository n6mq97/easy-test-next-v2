'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Program, Section } from '@prisma/client';
import { ProgramStats, SectionStats } from '@/modules/stats/lib/actions';
import { CopyToClipboardButton } from '@/modules/common/components/CopyToClipboardButton';

interface ProgramHeaderProps {
  program: Pick<Program, 'id' | 'name'>;
  deleteAction: () => Promise<void>;
  stats?: ProgramStats;
  sections: Section[];
  sectionStats: SectionStats[];
}

export function ProgramHeader({
  program,
  deleteAction,
  stats,
  sections,
  sectionStats,
}: ProgramHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sectionsWithStatsText = sections
    .map((section) => {
      const stat = sectionStats.find((s) => s.sectionId === section.id);
      const progress = stat ? stat.progress.toFixed(0) : 0;
      return `${section.name} - ${progress}%`;
    })
    .join('\n');

  return (
    <header className="mb-8">
      <div className="block md:flex md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Program: {program.name}</h1>
          {stats ? (
            <div className="text-sm text-gray-500 mt-1 flex gap-4">
              <span>Total Attempts: {stats.totalAttempts}</span>
              <span>
                Success: {stats.progress.toFixed(0)}% ({stats.correctAnswers}/
                {stats.totalAttempts})
              </span>
            </div>
          ) : (
            <p className="text-gray-500">
              Import questions and manage sections.
            </p>
          )}
        </div>
        <div className="flex justify-end mt-4 md:mt-0">
          <div className="flex items-center gap-4">
            <Link
              href={`/programs/${program.id}/quiz`}
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Start Carousel Quiz
            </Link>
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-ellipsis-vertical"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-700 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <CopyToClipboardButton
                      textToCopy={sectionsWithStatsText}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-600"
                    >
                      Copy Sections List
                    </CopyToClipboardButton>
                    <form action={deleteAction} method="POST">
                      <button
                        type="submit"
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-600"
                      >
                        Delete Program
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Link href="/" className="text-sm text-white hover:underline mt-2 inline-block">
        &larr; Back to all programs
      </Link>
    </header>
  );
}
