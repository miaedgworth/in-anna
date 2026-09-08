export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-line bg-blush/50 px-6 py-16 text-center">
      <p className="mx-auto max-w-md text-charcoal-muted">{children}</p>
    </div>
  );
}
