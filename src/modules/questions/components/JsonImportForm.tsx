'use client';

import { useState } from 'react';
import { importQuestionsFromJson } from '../lib/actions';

interface JsonImportFormProps {
  programId: string;
}

export function JsonImportForm({ programId }: JsonImportFormProps) {
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);
    const formData = new FormData(event.currentTarget);
    const jsonContent = formData.get('jsonContent') as string;

    if (!jsonContent) {
      setResult({ error: 'JSON content cannot be empty.' });
      return;
    }

    const importResult = await importQuestionsFromJson(programId, jsonContent);
    setResult(importResult);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Import Questions from JSON</h3>
      <textarea
        name="jsonContent"
        rows={10}
        className="w-full p-2 border rounded-md"
        placeholder='Paste your JSON here, for example:\n\n[\n  {\n    "section": "Section 1",\n    "question": "What is 2+2?",\n    "answers": ["3", "4", "5"],\n    "correct": 1\n  }\n]'
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Import
      </button>

      {result && (
        <div className={`mt-4 p-2 rounded-md ${result.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {result.error || result.success}
        </div>
      )}
    </form>
  );
}
