// FNV-1a 32-bit déterministe — utilisé pour dériver des indices stables.
export function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function pickIndex(seed: string, salt: string, modulo: number): number {
  return fnv1a(`${seed}::${salt}`) % Math.max(1, modulo);
}
