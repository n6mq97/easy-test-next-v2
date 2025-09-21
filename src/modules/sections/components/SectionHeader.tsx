'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Section } from '@prisma/client';

interface SectionHeaderProps {
  section: Section;
  deleteAction: () => Promise<void>;
}

export function SectionHeader({ section, deleteAction }: SectionHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Section: {section.name}</h1>
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
                  href={`/sections/${section.id}/quiz`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Start Quiz
                </Link>
                <form action={deleteAction} method="POST">
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Delete Section
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Link
        href={`/programs/${section.programId}`}
        className="text-sm text-blue-500 hover:underline mt-2 inline-block"
      >
        &larr; Back to program
      </Link>
    </header>
  );
}
