'use client';

type AuthFormProps = {
  title: string;
  buttonText: string;
  error: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function AuthForm({
  title,
  buttonText,
  error,
  onSubmit,
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full p-2 bg-neutral-800 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full p-2 bg-neutral-800 rounded-md"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md"
      >
        {buttonText}
      </button>
    </form>
  );
}
