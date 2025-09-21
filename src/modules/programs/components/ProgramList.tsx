'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Program } from '@prisma/client';
import { paths } from '@/lib/paths';
import { ProgramStats } from '@/modules/stats/lib/actions';

type ProgramListProps = {
  stats: ProgramStats[];
  initialPrograms: Program[];
};

export function ProgramList({ stats, initialPrograms }: ProgramListProps) {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedSelection = localStorage.getItem('selectedPrograms');
    if (savedSelection) {
      setSelectedPrograms(JSON.parse(savedSelection));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedPrograms', JSON.stringify(selectedPrograms));
  }, [selectedPrograms]);

  const handleCheckboxChange = (programId: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  const handleStartMultipleQuiz = () => {
    if (selectedPrograms.length > 0) {
      const query = new URLSearchParams({
        programIds: selectedPrograms.join(','),
      });
      router.push(`/quiz?${query.toString()}`);
    }
  };
  
  if (initialPrograms.length === 0) {
    return <p>No programs found. Create one to get started!</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Programs</h2>
        <button
          onClick={handleStartMultipleQuiz}
          disabled={selectedPrograms.length === 0}
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 disabled:bg-gray-800/50 disabled:text-white disabled:cursor-not-allowed"
        >
          Start Multiple Carousel
        </button>
      </div>
      <ul className="space-y-4">
        {initialPrograms.map((program) => {
          const programStat = stats.find((s) => s.programId === program.id);
          const progress = programStat ? programStat.progress.toFixed(0) : 0;

          return (
            <li
              key={program.id}
              className="border border-gray-200 p-4 rounded-md flex justify-between items-center transition-colors hover:bg-gray-800/10"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedPrograms.includes(program.id)}
                  onChange={() => handleCheckboxChange(program.id)}
                  className="h-5 w-5 rounded bg-neutral-800 border-neutral-600 text-white checked:bg-white checked:text-black focus:ring-white focus:ring-offset-neutral-900 accent-transparent"
                />
                <Link
                  href={paths.program(program.id)}
                  className="font-medium hover:underline"
                >
                  {program.name}
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
