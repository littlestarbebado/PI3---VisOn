export function brandText(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\bvis\s*-?\s*on\b/gi, 'CyberBox Secur');
}
