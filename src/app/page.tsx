import { Suspense } from 'react';
import { getCurrentUser, SignOutButton } from '@/modules/auth';
import { CreateProgramForm, ProgramList } from '@/modules/programs';
import { getProgramsStats } from '@/modules/stats/lib/actions';

export default async function Page() {
  const user = await getCurrentUser();
  const stats = user ? await getProgramsStats(user.id) : [];

  return (
    <main className="container mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-gray-500">Manage your programs and start testing.</p>
        </div>
        <SignOutButton />
      </header>
      
      <div className="max-w-2xl mx-auto">
        <CreateProgramForm />
        <Suspense fallback={<p>Loading programs...</p>}>
          <ProgramList stats={stats} />
        </Suspense>
      </div>
    </main>
  );
}
