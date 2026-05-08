export function FieldInputError({ message }: { message?: string }) {
  return <p className="text-xs text-destructive h-2.5 italic">{message}</p>;
}
