'use client';

import { useState } from 'react';
import { importQuestionsFromJson } from '../lib/actions';

interface JsonImportFormProps {
  programId: string;
}

export function JsonImportForm({ programId }: JsonImportFormProps) {
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);
  const [jsonContent, setJsonContent] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonContent(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setResult({ error: 'Failed to read from clipboard.' });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);

    if (!jsonContent) {
      setResult({ error: 'JSON content cannot be empty.' });
      return;
    }

    const importResult = await importQuestionsFromJson(programId, jsonContent);
    setResult(importResult);
    if (importResult.success) {
      setJsonContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Import Questions from JSON</h3>
        <button
          type="button"
          onClick={handlePaste}
          className="text-sm p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md"
        >
          Paste from Clipboard
        </button>
      </div>
      <textarea
        name="jsonContent"
        value={jsonContent}
        onChange={(e) => setJsonContent(e.target.value)}
        rows={10}
        className="w-full p-2 border rounded-md"
        placeholder='Paste your JSON here, for example:\n\n[\n  {\n    "section": "Section 1",\n    "question": "What is 2+2?",\n    "answers": ["3", "4", "5"],\n    "correct": 1\n  }\n]'
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200">
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
