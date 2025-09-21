'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { updateSectionTheory } from '../lib/actions';

interface EditSectionTheoryFormProps {
  sectionId: string;
  initialTheory: string | null;
}

export function EditSectionTheoryForm({ sectionId, initialTheory }: EditSectionTheoryFormProps) {
  const [theory, setTheory] = useState(initialTheory ?? '');
  const [debouncedTheory] = useDebounce(theory, 1000); // 1-second debounce

  useEffect(() => {
    // Only update if the debounced value is different from the initial value
    if (debouncedTheory !== (initialTheory ?? '')) {
      updateSectionTheory(sectionId, debouncedTheory);
      // Optionally, you can add a status indicator for "Saving..." and "Saved."
    }
  }, [debouncedTheory, sectionId, initialTheory]);

  return (
    <div className="mt-6">
      <label htmlFor="theory" className="block text-lg font-semibold mb-2">
        Theory
      </label>
      <textarea
        id="theory"
        value={theory}
        onChange={(e) => setTheory(e.target.value)}
        rows={15}
        className="w-full p-2 border rounded-md"
        placeholder="Enter the theory for this section..."
      />
    </div>
  );
}
