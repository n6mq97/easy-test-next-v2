'use server';

import { getServerSession } from 'next-auth';
import * as bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import { Role } from '@prisma/client';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function signUp(formData: FormData) {
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  if (!name || !password) {
    return { error: 'Name and password are required' };
  }

  const existingUser = await prisma.user.findUnique({
    where: { name },
  });

  if (existingUser) {
    return { error: 'User with this name already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
      role: name === 'Herman' ? Role.ADMIN : Role.USER,
    },
  });

  return { success: true };
}
