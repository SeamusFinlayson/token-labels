export function Label({ name, htmlFor }: { name: string; htmlFor: string }) {
  return (
    <label
      className="block text-xs font-normal text-black/60 dark:text-mirage-50/70"
      htmlFor={htmlFor}
    >
      {name}
    </label>
  );
}
