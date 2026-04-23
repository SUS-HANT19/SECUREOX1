import { createError, ErrorCode } from './errorHandler';
import { validateFileName, validateFileSize } from './validation';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE_MB = 10;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  const nameValidation = validateFileName(file.name);
  if (!nameValidation.isValid) {
    return { valid: false, error: nameValidation.error };
  }

  const sizeValidation = validateFileSize(file.size, MAX_FILE_SIZE_MB);
  if (!sizeValidation.isValid) {
    return { valid: false, error: sizeValidation.error };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only PNG, JPEG, GIF, and WebP images are allowed.'
    };
  }

  return {
    valid: true,
    sanitizedName: nameValidation.sanitized
  };
}

export function validateDocumentFile(file: File): FileValidationResult {
  const nameValidation = validateFileName(file.name);
  if (!nameValidation.isValid) {
    return { valid: false, error: nameValidation.error };
  }

  const sizeValidation = validateFileSize(file.size, MAX_FILE_SIZE_MB);
  if (!sizeValidation.isValid) {
    return { valid: false, error: sizeValidation.error };
  }

  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only images and documents are allowed.'
    };
  }

  return {
    valid: true,
    sanitizedName: nameValidation.sanitized
  };
}

export async function scanFileContent(file: File): Promise<boolean> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const signatures: Record<string, number[]> = {
      png: [0x89, 0x50, 0x4E, 0x47],
      jpg: [0xFF, 0xD8, 0xFF],
      gif: [0x47, 0x49, 0x46, 0x38],
      webp: [0x52, 0x49, 0x46, 0x46],
      pdf: [0x25, 0x50, 0x44, 0x46]
    };

    for (const [type, signature] of Object.entries(signatures)) {
      if (signature.every((byte, index) => bytes[index] === byte)) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

export function createFileValidationError(message: string) {
  return createError(ErrorCode.INVALID_FILE, message);
}

export function createFileSizeError() {
  return createError(ErrorCode.FILE_TOO_LARGE, `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
}

export async function validateAndScanFile(file: File, allowedTypes: 'image' | 'document' = 'image'): Promise<FileValidationResult> {
  const validation = allowedTypes === 'image'
    ? validateImageFile(file)
    : validateDocumentFile(file);

  if (!validation.valid) {
    return validation;
  }

  const isValidContent = await scanFileContent(file);
  if (!isValidContent) {
    return {
      valid: false,
      error: 'File content does not match file type. The file may be corrupted or malicious.'
    };
  }

  return validation;
}
