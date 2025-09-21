'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Section } from '@prisma/client';
import { getSectionAsJson } from '../lib/actions';
import { CopyToClipboardButton } from '@/modules/common/components/CopyToClipboardButton';

interface SectionHeaderProps {
  section: Section;
  deleteAction: () => Promise<void>;
  textToCopy: string;
}

export function SectionHeader({
  section,
  deleteAction,
  textToCopy,
}: SectionHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCopyJson = async () => {
    const result = await getSectionAsJson(section.id);
    if (result.json) {
      await navigator.clipboard.writeText(result.json);
      // Consider adding user feedback here
      alert('JSON copied to clipboard!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <header className="mb-8">
      <div className="block md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Section: {section.name}</h1>
        </div>
        <div className="flex justify-end mt-4 md:mt-0">
          <div className="flex items-center gap-4">
            <Link
              href={`/sections/${section.id}/quiz`}
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Start Quiz
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
                      textToCopy={textToCopy}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-600"
                    >
                      Copy Theory & Questions
                    </CopyToClipboardButton>
                    <button
                      onClick={handleCopyJson}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-600"
                    >
                      Copy as JSON
                    </button>
                    <form action={deleteAction} method="POST">
                      <button
                        type="submit"
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-600"
                      >
                        Delete Section
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Link
        href={`/programs/${section.programId}`}
        className="text-sm text-white hover:underline mt-2 inline-block"
      >
        &larr; Back to program
      </Link>
    </header>
  );
}
