'use server';

import { getCurrentUser } from '@/modules/auth';
import { promises as fs } from 'fs';
import path from 'path';

export async function exportDb(): Promise<{ data?: string; error?: string }> {
  try {
    const user = await getCurrentUser();

    if (user?.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || !dbUrl.startsWith('file:')) {
      return { error: 'Database URL is not configured correctly.' };
    }

    const filePath = dbUrl.replace('file:', '');
    const absolutePath = path.resolve(process.cwd(), filePath);
    const fileBuffer = await fs.readFile(absolutePath);
    const base64Data = fileBuffer.toString('base64');

    return { data: base64Data };
  } catch (error) {
    console.error('Failed to export DB:', error);
    return { error: 'Failed to export database.' };
  }
}

export async function importDb(
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const user = await getCurrentUser();
    if (user?.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { error: 'No file provided.' };
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || !dbUrl.startsWith('file:')) {
      return { error: 'Database URL is not configured correctly.' };
    }

    const filePath = dbUrl.replace('file:', '');
    const absolutePath = path.resolve(process.cwd(), filePath);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(absolutePath, fileBuffer);

    return { success: true };
  } catch (error) {
    console.error('Failed to import DB:', error);
    return { error: 'Failed to import database.' };
  }
}
