'use client';

import { deleteProgram } from '../lib/actions';

interface DeleteProgramButtonProps {
  programId: string;
}

export function DeleteProgramButton({ programId }: DeleteProgramButtonProps) {
  const handleClick = async () => {
    if (confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      const result = await deleteProgram(programId);
      if (result?.error) {
        alert(result.error);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
    >
      Delete
    </button>
  );
}
