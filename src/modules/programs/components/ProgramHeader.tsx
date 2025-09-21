'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Program } from '@prisma/client';
import { ProgramStats } from '@/modules/stats/lib/actions';

interface ProgramHeaderProps {
  program: Pick<Program, 'id' | 'name'>;
  deleteAction: () => Promise<void>;
  stats?: ProgramStats;
}

export function ProgramHeader({
  program,
  deleteAction,
  stats,
}: ProgramHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="mb-8">
      <div className="flex items-start justify-between">
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
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
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
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <Link
                  href={`/programs/${program.id}/quiz`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Start Carousel Quiz
                </Link>
                <form action={deleteAction} method="POST">
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Delete Program
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Link href="/" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
        &larr; Back to all programs
      </Link>
    </header>
  );
}
