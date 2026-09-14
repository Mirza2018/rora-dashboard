export const normalizePhone = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
};
