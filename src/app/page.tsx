import {
  getCurrentUser,
  SignOutButton,
} from '@/modules/auth';

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
      <p>Your role is: {user?.role}</p>
      <SignOutButton />
    </div>
  );
}
