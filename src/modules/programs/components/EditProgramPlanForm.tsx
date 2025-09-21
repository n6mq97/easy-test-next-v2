'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { updateProgramPlan } from '../lib/actions';
import { Lock, Unlock, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface EditProgramPlanFormProps {
  programId: string;
  initialPlan: string | null;
}

export function EditProgramPlanForm({ programId, initialPlan }: EditProgramPlanFormProps) {
  const [plan, setPlan] = useState(initialPlan ?? '');
  const [debouncedPlan] = useDebounce(plan, 1000);
  const [isLocked, setIsLocked] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (debouncedPlan !== (initialPlan ?? '')) {
      updateProgramPlan(programId, debouncedPlan);
    }
  }, [debouncedPlan, programId, initialPlan]);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Plan</h2>
          <button
            onClick={() => setIsLocked(!isLocked)}
            className="p-1 hover:bg-neutral-700 rounded-md"
            title={isLocked ? 'Unlock for editing' : 'Lock editing'}
          >
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
          </button>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-neutral-700 rounded-md"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>
      {!isCollapsed && (
        <>
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
                {plan}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              rows={15}
              className="w-full p-2 border rounded-md"
              placeholder="Enter the plan for this program..."
            />
          )}
        </>
      )}
    </div>
  );
}
