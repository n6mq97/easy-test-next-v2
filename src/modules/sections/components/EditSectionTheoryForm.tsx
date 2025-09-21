'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { updateSectionTheory } from '../lib/actions';
import { Lock, Unlock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Fragment } from 'react';

interface EditSectionTheoryFormProps {
  sectionId: string;
  initialTheory: string | null;
}

export function EditSectionTheoryForm({ sectionId, initialTheory }: EditSectionTheoryFormProps) {
  const [theory, setTheory] = useState(initialTheory ?? '');
  const [debouncedTheory] = useDebounce(theory, 1000); // 1-second debounce
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    // Only update if the debounced value is different from the initial value
    if (debouncedTheory !== (initialTheory ?? '')) {
      updateSectionTheory(sectionId, debouncedTheory);
      // Optionally, you can add a status indicator for "Saving..." and "Saved."
    }
  }, [debouncedTheory, sectionId, initialTheory]);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          Theory
        </h2>
        <button
          onClick={() => setIsLocked(!isLocked)}
          className="p-1 hover:bg-neutral-700 rounded-md"
          title={isLocked ? 'Unlock for editing' : 'Lock editing'}
        >
          {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
        </button>
      </div>
      {isLocked ? (
        <div className="w-full p-2 border rounded-md min-h-[290px] font-mono leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <p className="text-xl font-bold mb-2" {...props} />,
              h2: ({ node, ...props }) => <p className="text-lg font-bold mb-2" {...props} />,
              h3: ({ node, ...props }) => <p className="font-bold mb-2" {...props} />,
              h4: ({ node, ...props }) => <p className="font-bold mb-2" {...props} />,
              h5: ({ node, ...props }) => <p className="font-bold mb-2" {...props} />,
              h6: ({ node, ...props }) => <p className="font-bold mb-2" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside pl-4 my-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside pl-4 my-2" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="mb-5" {...props} />,
              hr: () => null,
            }}
          >
            {theory}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          id="theory"
          value={theory}
          onChange={(e) => setTheory(e.target.value)}
          rows={15}
          className="w-full p-2 border rounded-md"
          placeholder="Enter the theory for this section..."
        />
      )}
    </div>
  );
}
