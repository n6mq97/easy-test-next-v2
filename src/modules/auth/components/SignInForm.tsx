'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthForm } from './AuthForm';

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      redirect: false,
      name,
      password,
    });

    if (result?.error) {
      setError('Invalid name or password');
    } else {
      router.push('/');
    }
  };

  return (
    <AuthForm
      title="Sign In"
      buttonText="Sign In"
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
