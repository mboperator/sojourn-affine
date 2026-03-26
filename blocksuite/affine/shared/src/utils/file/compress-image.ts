/**
 * Compresses an image file if it exceeds a size threshold.
 * Targets large mobile camera photos (typically 10-20MB) by resizing
 * and re-encoding as JPEG. Returns the original file if compression
 * is not beneficial or if an error occurs.
 */

const DEFAULT_SIZE_THRESHOLD = 5 * 1024 * 1024; // 5MB
const DEFAULT_MAX_DIMENSION = 4096;
const DEFAULT_JPEG_QUALITY = 0.85;

// Image types that can be decoded by createImageBitmap and benefit from compression
const COMPRESSIBLE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/bmp',
]);

export interface CompressImageOptions {
  /** Files larger than this (bytes) will be compressed. Default: 5MB */
  sizeThreshold?: number;
  /** Max pixels on the longest side. Default: 4096 */
  maxDimension?: number;
  /** JPEG output quality (0-1). Default: 0.85 */
  quality?: number;
}

export async function compressImageIfNeeded(
  file: File,
  options?: CompressImageOptions
): Promise<File> {
  const sizeThreshold = options?.sizeThreshold ?? DEFAULT_SIZE_THRESHOLD;
  const maxDimension = options?.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const quality = options?.quality ?? DEFAULT_JPEG_QUALITY;

  // Skip compression for small files or non-compressible formats
  if (file.size <= sizeThreshold || !COMPRESSIBLE_TYPES.has(file.type)) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    // Calculate new dimensions maintaining aspect ratio
    let newWidth = width;
    let newHeight = height;
    const longest = Math.max(width, height);

    if (longest > maxDimension) {
      const scale = maxDimension / longest;
      newWidth = Math.round(width * scale);
      newHeight = Math.round(height * scale);
    }

    // Use OffscreenCanvas if available, otherwise fall back to regular canvas
    let blob: Blob | null = null;

    if (typeof OffscreenCanvas !== 'undefined') {
      const canvas = new OffscreenCanvas(newWidth, newHeight);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        bitmap.close();
        return file;
      }
      ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);
      blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
    } else if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        bitmap.close();
        return file;
      }
      ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);
      blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/jpeg', quality)
      );
    }

    bitmap.close();

    // Only use compressed version if it's actually smaller
    if (!blob || blob.size >= file.size) {
      return file;
    }

    // Preserve the original filename but change extension to .jpg
    const name = file.name.replace(/\.[^.]+$/, '.jpg');
    return new File([blob], name, { type: 'image/jpeg', lastModified: file.lastModified });
  } catch {
    // On any error, return the original file
    return file;
  }
}
