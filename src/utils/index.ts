/**
 * Converts a Uint8Array buffer to a hexadecimal string representation.
 *
 * @param {Uint8Array} buffer - The buffer to convert.
 * @return {string} The hexadecimal string representation of the buffer.
 */
export function toHex(buffer: Uint8Array): string {
  return Array.from(buffer).map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function hexToArray(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((h) => parseInt(h, 16)));
}
