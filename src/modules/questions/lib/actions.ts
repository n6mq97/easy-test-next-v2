'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const questionSchema = z.object({
  question: z.string(),
  answers: z.array(z.string()).min(2),
  correct: z.number().int(),
  section: z.string(),
});

const importSchema = z.array(questionSchema);

export async function importQuestionsFromJson(programId: string, jsonContent: string) {
  try {
    const data = JSON.parse(jsonContent);
    const parsedData = importSchema.safeParse(data);

    if (!parsedData.success) {
      throw new Error(`Invalid JSON structure: ${parsedData.error.message}`);
    }

    for (const item of parsedData.data) {
      let section = await prisma.section.findFirst({
        where: {
          name: item.section,
          programId: programId,
        },
      });

      if (!section) {
        section = await prisma.section.create({
          data: {
            name: item.section,
            programId: programId,
          },
        });
      }

      await prisma.question.create({
        data: {
          questionText: item.question,
          answers: JSON.stringify(item.answers),
          correctAnswerIndex: item.correct,
          sectionId: section.id,
        },
      });
    }
    revalidatePath(`/programs/${programId}`);
    return { success: `Successfully imported ${parsedData.data.length} questions.` };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: `Failed to import questions: ${errorMessage}` };
  }
}
