'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md"
    >
      Sign Out
    </button>
  );
}
