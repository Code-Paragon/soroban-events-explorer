import { xdr, scValToNative } from '@stellar/stellar-sdk';

/**
 * Recursively parses and formats native values returned by scValToNative.
 * Specifically converts ES6 Maps to plain objects, Uint8Arrays/Buffers to hex strings,
 * and recursively handles arrays and nested objects.
 */
export function formatNativeValue(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  // Handle Buffers / Uint8Arrays (binary data like hashes, public keys, addresses)
  if (value instanceof Uint8Array || (value && value.constructor && value.constructor.name === 'Buffer')) {
    return '0x' + Array.from(value as Uint8Array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Handle ES6 Maps (often returned for Soroban map values)
  if (value instanceof Map) {
    const obj: Record<string, any> = {};
    for (const [k, v] of value.entries()) {
      // Stringify the key if it is an object/complex type, otherwise cast to string
      const keyStr = typeof k === 'object' ? JSON.stringify(formatNativeValue(k)) : String(k);
      obj[keyStr] = formatNativeValue(v);
    }
    return obj;
  }

  // Handle Arrays recursively
  if (Array.isArray(value)) {
    return value.map(formatNativeValue);
  }

  // Handle plain objects recursively
  if (typeof value === 'object') {
    const obj: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      obj[key] = formatNativeValue(value[key]);
    }
    return obj;
  }

  // Pass primitives (string, number, boolean, bigint) as-is
  return value;
}

/**
 * Decodes a base64 XDR ScVal string into a native, formatted JavaScript value.
 * Falls back to the raw string if decoding fails.
 */
export function decodeScValBase64(base64: string): any {
  if (!base64) return '';
  try {
    const scVal = xdr.ScVal.fromXDR(base64, 'base64');
    const native = scValToNative(scVal);
    return formatNativeValue(native);
  } catch (error) {
    console.warn('[Soroban Decoder] Failed to decode base64 ScVal:', error);
    return base64; // Fallback to raw string
  }
}

/**
 * Decodes a comma-separated list of base64 XDR ScVal topics.
 */
export function decodeTopics(topicsCsv: string): any[] {
  if (!topicsCsv) return [];
  const parts = topicsCsv.split(',').map((p) => p.trim()).filter(Boolean);
  return parts.map((part) => {
    try {
      return decodeScValBase64(part);
    } catch {
      return part;
    }
  });
}
