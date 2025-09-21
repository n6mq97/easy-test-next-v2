'use client';

import { useRef } from 'react';
import { createProgram } from '../lib/actions';

export function CreateProgramForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await createProgram(formData);
    
    if (result?.error) {
      // Here you can handle the error, e.g., show a toast notification
      alert(result.error);
    } else {
      formRef.current?.reset();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Create a New Program</h2>
      <div className="flex gap-4">
        <input
          type="text"
          name="name"
          placeholder="Program Name"
          required
          className="border border-gray-300 p-2 rounded-md w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create
        </button>
      </div>
    </form>
  );
}
