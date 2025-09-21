'use client';

import { useState, useRef } from 'react';
import { exportDb, importDb } from '../lib/actions';

export function AdminPanel() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    const result = await exportDb();

    if (result.error) {
      alert(`Error exporting database: ${result.error}`);
    } else if (result.data) {
      const byteCharacters = atob(result.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/octet-stream' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup.db';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
    setIsExporting(false);
  };

  const handleImport = async (formData: FormData) => {
    const confirmation = window.confirm(
      'Вы уверены? Это действие необратимо заменит все текущие данные!',
    );
    if (!confirmation) {
      return;
    }

    setIsImporting(true);
    const result = await importDb(formData);
    setIsImporting(false);

    if (result.error) {
      alert(`Error importing database: ${result.error}`);
    } else if (result.success) {
      alert('База данных успешно импортирована. Страница будет перезагружена.');
      formRef.current?.reset();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Панель администратора</h1>

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">Экспорт данных</h2>
        <p>
          Скачайте полную резервную копию базы данных в виде одного файла.
        </p>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="rounded bg-gray-200 px-4 py-2 text-black hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? 'Экспорт...' : 'Скачать резервную копию'}
        </button>
      </section>

      <form action={handleImport} ref={formRef}>
        <section className="space-y-4 rounded-lg border p-4">
          <h2 className="text-xl font-semibold">Импорт данных</h2>
          <p className="text-sm text-red-500">
            Внимание: Эта операция полностью заменит все существующие данные на
            данные из загруженного файла.
          </p>
          <div className="flex items-center space-x-4">
            <input
              name="file"
              type="file"
              required
              className="rounded border border-gray-300 p-2"
            />
            <button
              type="submit"
              disabled={isImporting}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isImporting ? 'Импорт...' : 'Загрузить и заменить'}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
