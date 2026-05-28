'use client';

import { Dispatch, SetStateAction, useRef } from 'react';

const MAX_IMAGES = 5;
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3000';

export interface UploadedImage {
  /** Local blob: URL for preview (created via URL.createObjectURL) */
  previewUrl: string;
  /** S3 object key returned by backend; null while uploading */
  remoteKey: string | null;
  /** Pre-signed URL for display after upload; null while uploading */
  remoteUrl: string | null;
  /** Upload in progress */
  uploading: boolean;
  /** Upload failed */
  error: boolean;
}

interface ImageUploadPreviewProps {
  images: UploadedImage[];
  /**
   * Typed as Dispatch<SetStateAction> to accept functional updaters,
   * matching React.useState setter — pass setImages directly from the parent.
   */
  onChange: Dispatch<SetStateAction<UploadedImage[]>>;
  addLabel: string;
}

/**
 * Raw multipart upload — must NOT use apiFetch because that helper always
 * injects `Content-Type: application/json`, which corrupts the multipart
 * boundary that the browser sets automatically for FormData.
 */
async function uploadImageFile(file: File): Promise<{ key: string; url: string }> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE}/kudos/images`, {
    method: 'POST',
    // No Content-Type header — browser sets multipart boundary automatically
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return (await res.json()) as { key: string; url: string };
}

export function ImageUploadPreview({ images, onChange, addLabel }: ImageUploadPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const remaining = MAX_IMAGES - images.length;
    const toProcess = Array.from(files).slice(0, remaining);
    if (toProcess.length === 0) return;

    // Add all previews immediately with uploading=true
    const newEntries: UploadedImage[] = toProcess.map((file) => ({
      previewUrl: URL.createObjectURL(file),
      remoteKey: null,
      remoteUrl: null,
      uploading: true,
      error: false,
    }));

    onChange((prev) => [...prev, ...newEntries]);

    // Upload concurrently; use previewUrl as stable identity to avoid index shifts
    await Promise.all(
      toProcess.map(async (file, idx) => {
        const id = newEntries[idx].previewUrl;
        try {
          const { key, url } = await uploadImageFile(file);
          onChange((prev) =>
            prev.map((img) =>
              img.previewUrl === id
                ? { ...img, remoteKey: key, remoteUrl: url, uploading: false, error: false }
                : img,
            ),
          );
        } catch {
          onChange((prev) =>
            prev.map((img) =>
              img.previewUrl === id ? { ...img, uploading: false, error: true } : img,
            ),
          );
        }
      })
    );
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].previewUrl);
    onChange((prev) => prev.filter((_, i) => i !== index));
  };

  const canAdd = images.length < MAX_IMAGES;

  return (
    <div className="flex flex-wrap gap-2">
      {/* Thumbnails */}
      {images.map((img, idx) => (
        <div
          key={img.previewUrl}
          className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#998C5F]/40 shrink-0"
        >
          {/*
           * Plain <img> is required here — next/image does not support blob: URLs
           * (object URLs created via URL.createObjectURL for local previews).
           * eslint-disable-next-line @next/next/no-img-element
           */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.previewUrl}
            alt={`Upload ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Uploading spinner overlay */}
          {img.uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            </div>
          )}
          {/* Error overlay */}
          {img.error && (
            <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
              <span className="text-red-300 text-xs font-bold">!</span>
            </div>
          )}
          {/* Remove button */}
          <button
            type="button"
            onClick={() => removeImage(idx)}
            className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center
                       rounded-full bg-black/70 text-white/80 hover:text-white text-[9px]
                       transition-colors"
            aria-label={`Remove image ${idx + 1}`}
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add image button */}
      {canAdd && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-16 h-16 rounded-lg border border-dashed border-[#998C5F]
                       flex items-center justify-center text-xs text-[#00101A]/50
                       hover:border-[#00101A] hover:text-[#00101A]/80 transition-colors shrink-0"
          >
            {addLabel}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              // Reset so the same file can be re-selected after removal
              e.target.value = '';
            }}
          />
        </>
      )}
    </div>
  );
}
