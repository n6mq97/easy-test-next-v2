'use client';

import { useState } from 'react';

interface CopyToClipboardButtonProps {
  textToCopy: string;
  className?: string;
  children: React.ReactNode;
}

export function CopyToClipboardButton({
  textToCopy,
  className,
  children,
}: CopyToClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // You might want to show an error message to the user
    }
  };

  return (
    <button onClick={handleCopy} className={className} disabled={isCopied}>
      {isCopied ? 'Copied!' : children}
    </button>
  );
}
