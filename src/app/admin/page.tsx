import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/modules/auth';
import { AdminPanel } from '@/modules/admin';

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (user?.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <main className="container mx-auto p-4">
      <AdminPanel />
    </main>
  );
}
