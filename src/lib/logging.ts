import { supabase } from './supabase';

/**
 * CRITICAL SECURITY NOTICE:
 * This logging system MUST NEVER log sensitive data including:
 * - Plaintext content
 * - Passphrases or passwords
 * - Ciphertext or encrypted data
 * - Encryption keys or derived keys
 * - File contents or file data
 * - Personal identifiable information (PII)
 *
 * ONLY log metadata: request IDs, operation types, latency, confidence scores,
 * status codes, and error codes.
 */

export type OperationType = 'encrypt' | 'decrypt' | 'ocr' | 'file-protect' | 'file-unlock';

export interface OperationLog {
  id: string;
  request_id: string;
  operation_type: OperationType;
  latency_ms: number;
  ocr_confidence?: number;
  status: 'success' | 'error';
  error_code?: string;
  created_at: string;
}

/**
 * Generates a unique request ID for tracking related operations
 * @returns A UUID v4 string
 */
export function generateRequestId(): string {
  return crypto.randomUUID();
}

/**
 * Logs an operation with metadata only (NO SENSITIVE DATA)
 * @param operationType - Type of operation performed
 * @param latencyMs - Operation duration in milliseconds
 * @param status - Success or error status
 * @param requestId - Optional request ID for tracking related operations
 * @param ocrConfidence - Optional OCR confidence score (0-100)
 * @param errorCode - Optional error code for failures
 */
export async function logOperation(
  operationType: OperationType,
  latencyMs: number,
  status: 'success' | 'error',
  requestId?: string,
  ocrConfidence?: number,
  errorCode?: string
): Promise<void> {
  try {
    const logRequestId = requestId || generateRequestId();

    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('operation_logs').insert({
      request_id: logRequestId,
      user_id: user?.id || null,
      operation_type: operationType,
      latency_ms: latencyMs,
      ocr_confidence: ocrConfidence || null,
      status: status,
      error_code: errorCode || null,
    });
  } catch (error) {
    console.error('Failed to log operation:', error);
  }
}

export async function fetchOperationLogs(limit: number = 50): Promise<OperationLog[]> {
  try {
    const { data, error } = await supabase
      .from('operation_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch operation logs:', error);
    return [];
  }
}
