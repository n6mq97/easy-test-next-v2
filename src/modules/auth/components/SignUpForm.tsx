'use client';

import { signUp } from '@/modules/auth/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthForm } from './AuthForm';
import Link from 'next/link';

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await signUp(formData);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/login');
    }
  };

  return (
    <AuthForm
      title="Sign Up"
      buttonText="Sign Up"
      error={error}
      onSubmit={handleSubmit}
    >
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </AuthForm>
  );
}
