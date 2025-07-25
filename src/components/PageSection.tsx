import { ReactNode } from 'react';

export default function PageSection({
  children,
  title,
  className = ''
}: {
  children: ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
      {children}
    </section>
  );
}