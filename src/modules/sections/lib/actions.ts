'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/modules/auth';

export async function getSections(programId: string) {
  return prisma.section.findMany({
    where: {
      programId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function getSectionDetails(sectionId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return prisma.section.findFirst({
    where: {
      id: sectionId,
      program: {
        userId: user.id,
      },
    },
    include: {
      questions: {
        select: {
          id: true,
          questionText: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}

export async function updateSectionTheory(sectionId: string, theory: string) {
  try {
    await prisma.section.update({
      where: {
        id: sectionId,
      },
      data: {
        theory,
      },
    });
    revalidatePath(`/sections/${sectionId}`);
    return { success: true };
  } catch (_error) {
    return { error: 'Failed to update theory.' };
  }
}

export async function deleteSection(formData: FormData) {
  const sectionId = formData.get('sectionId') as string;

  if (!sectionId) {
    throw new Error('Section ID is required');
  }

  await prisma.section.delete({
    where: { id: sectionId },
  });

  revalidatePath('/programs/[id]', 'page');
}
