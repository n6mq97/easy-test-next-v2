'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const questionSchema = z.object({
  section: z.string().min(1, 'Section name cannot be empty.'),
  question: z.string().min(1, 'Question text cannot be empty.'),
  answers: z.array(z.string()).min(2, 'There must be at least two answers.'),
  correct: z.number().int(),
});

const importSchema = z.array(questionSchema);

export async function importQuestionsFromJson(programId: string, jsonContent: string) {
  try {
    const data = JSON.parse(jsonContent);
    const validationResult = importSchema.safeParse(data);

    if (!validationResult.success) {
      return { error: 'Invalid JSON format.', details: validationResult.error.flatten() };
    }

    const validatedData = validationResult.data;

    await prisma.$transaction(async (tx) => {
      for (const item of validatedData) {
        const section = await tx.section.upsert({
          where: {
            programId_name: {
              programId,
              name: item.section,
            },
          },
          update: {},
          create: {
            name: item.section,
            programId,
          },
        });

        await tx.question.create({
          data: {
            questionText: item.question,
            answers: JSON.stringify(item.answers),
            correctAnswerIndex: item.correct,
            sectionId: section.id,
          },
        });
      }
    });

    revalidatePath(`/programs/${programId}`);
    return { success: `Successfully imported ${validatedData.length} questions.` };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.flatten() };
    }
    if (error instanceof SyntaxError) {
        return { error: 'Invalid JSON syntax.' };
    }
    console.error(error);
    return { error: 'An unexpected error occurred during import.' };
  }
}
