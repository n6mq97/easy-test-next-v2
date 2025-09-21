'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/modules/auth';
import prisma from '@/lib/prisma';

export async function createProgram(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('You must be logged in to create a program.');
  }

  const programName = formData.get('name') as string;

  if (!programName || programName.trim().length === 0) {
    return {
      error: 'Program name cannot be empty.',
    };
  }

  try {
    await prisma.program.create({
      data: {
        name: programName,
        userId: user.id,
      },
    });

    revalidatePath('/');
    return {
      success: true,
    };
  } catch (_error) {
    return {
      error: 'Failed to create the program.',
    };
  }
}

export async function getPrograms() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  return prisma.program.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getProgramById(id: string) {
  const program = await prisma.program.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      plan: true,
      userId: true,
    },
  });
  return program;
}

export async function deleteProgram(programId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('You must be logged in to delete a program.');
  }

  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program || program.userId !== user.id) {
    throw new Error('Program not found or you do not have permission to delete it.');
  }

  try {
    await prisma.program.delete({
      where: { id: programId },
    });
    revalidatePath('/');
    return { success: true };
  } catch (_error) {
    return { error: 'Failed to delete the program.' };
  }
}

export async function updateProgramPlan(programId: string, plan: string) {
  try {
    await prisma.program.update({
      where: { id: programId },
      data: { plan },
    });
    revalidatePath(`/programs/${programId}`);
  } catch (error) {
    console.error('Failed to update program plan:', error);
    // Handle error appropriately
  }
}

