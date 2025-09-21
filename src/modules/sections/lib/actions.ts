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

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: { programId: true },
  });

  if (!section) {
    throw new Error('Section not found');
  }

  await prisma.section.delete({
    where: { id: sectionId },
  });

  revalidatePath(`/programs/${section.programId}`);
}

export async function getSectionAsJson(sectionId: string) {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      questions: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!section) {
    return { error: 'Section not found' };
  }

  const jsonForExport = section.questions.map((q) => ({
    section: section.name,
    question: q.questionText,
    answers: JSON.parse(q.answers as string), // Assuming answers are stored as a JSON string
    correct: q.correctAnswerIndex,
  }));

  return { success: true, json: JSON.stringify(jsonForExport, null, 2) };
}
