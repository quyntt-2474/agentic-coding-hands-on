'use client';

import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link2 from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { CreateKudosDto, Hashtag, UserSearchResult } from '@/lib/types/kudos';
import { RichTextToolbar } from './rich-text-toolbar';
import { RecipientSearch } from './recipient-search';
import { HashtagSelector } from './hashtag-selector';
import { ImageUploadPreview, UploadedImage } from './image-upload-preview';
import { KudosToast } from './kudos-toast';

interface WriteKudosModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormErrors {
  recipient?: string;
  title?: string;
  content?: string;
  hashtags?: string;
}

export function WriteKudosModal({ onClose, onSuccess }: WriteKudosModalProps) {
  const t = useTranslations();

  // Form state
  const [recipient, setRecipient] = useState<UserSearchResult | null>(null);
  const [title, setTitle] = useState('');
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [senderAlias, setSenderAlias] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link2.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: t.writeKudosContentPlaceholder }),
    ],
    editorProps: {
      attributes: { class: 'tiptap' },
    },
  });

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Cleanup editor on unmount
  useEffect(() => () => { editor?.destroy(); }, [editor]);

  const getContentText = () => editor?.getText().trim() ?? '';

  const showMessage = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const runValidation = useCallback(
    (
      r: UserSearchResult | null,
      titleVal: string,
      ht: Hashtag[],
      contentText: string,
    ): boolean => {
      const next: FormErrors = {};
      if (!r) next.recipient = t.writeKudosRequiredField;
      if (!titleVal.trim()) next.title = t.writeKudosRequiredField;
      if (!contentText) next.content = t.writeKudosRequiredField;
      if (ht.length === 0) next.hashtags = t.writeKudosHashtagRequired;
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [t],
  );

  // Live re-validation after first submit attempt
  useEffect(() => {
    if (!submitted) return;
    runValidation(recipient, title, hashtags, getContentText());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipient, title, hashtags, submitted]);

  const handleSubmit = async () => {
    setSubmitted(true);
    const contentText = getContentText();
    if (!runValidation(recipient, title, hashtags, contentText)) return;

    setSubmitting(true);
    try {
      // Collect successfully uploaded S3 keys
      const imageKeys = images
        .filter((img) => img.remoteKey !== null && !img.error)
        .map((img) => img.remoteKey as string);

      const dto: CreateKudosDto = {
        receiverEmail: recipient!.email,
        title: title.trim(),
        message: editor?.getHTML() ?? '',
        hashtags: hashtags.map((h) => h.name),
        imageKeys: imageKeys.length ? imageKeys : undefined,
        isAnonymous,
        senderAlias: isAnonymous && senderAlias.trim() ? senderAlias.trim() : undefined,
      };

      await apiFetch('/kudos', { method: 'POST', body: JSON.stringify(dto) });

      showMessage(t.writeKudosSuccessToast);
      setTimeout(() => { onSuccess?.(); onClose(); }, 1500);
    } catch {
      showMessage(t.writeKudosErrorToast);
    } finally {
      setSubmitting(false);
    }
  };

  const promptLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter URL:', 'https://');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const isSubmitDisabled =
    submitting || !recipient || !title.trim() || !getContentText() || hashtags.length === 0;
  const hasContentError = submitted && !getContentText();

  // Shared label column — bold dark text sitting to the left of each field
  const labelClass =
    'w-40 shrink-0 min-h-[56px] flex items-center text-[22px] font-bold text-[#00101A] leading-tight';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={t.writeKudosModalTitle}
    >
      <div className="relative my-auto w-full max-w-[752px] rounded-[24px] bg-[#FFF8E1] shadow-2xl">
        <div className="p-10 flex flex-col gap-6">

          {/* A — Title */}
          <h2 className="text-center text-[32px] font-bold text-[#00101A] leading-[40px]">
            {t.writeKudosModalTitle}
          </h2>

          {/* B — Recipient */}
          <div className="flex items-start gap-4">
            <label className={labelClass}>
              {t.writeKudosRecipientLabel}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <RecipientSearch
                value={recipient}
                onChange={setRecipient}
                placeholder={t.writeKudosRecipientPlaceholder}
                hasError={submitted && !recipient}
              />
              {errors.recipient && (
                <p className="text-xs text-red-500">{errors.recipient}</p>
              )}
            </div>
          </div>

          {/* Danh hiệu — title/badge */}
          <div className="flex items-start gap-4">
            <label className={labelClass}>
              {t.writeKudosTitleLabel}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.writeKudosTitlePlaceholder}
                maxLength={200}
                className={`w-full px-3 h-14 rounded-lg border bg-white text-sm text-[#00101A]
                            placeholder:text-[#00101A]/40 outline-none transition-colors
                            ${submitted && !title.trim()
                              ? 'border-red-500'
                              : 'border-[#998C5F] focus:border-[#00101A]'
                            }`}
              />
              <p className="text-sm text-[#00101A]/50 leading-snug">
                {t.writeKudosTitleHint1}
                <br />
                {t.writeKudosTitleHint2}
              </p>
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>
          </div>

          {/* C + D — Rich-text editor (Tiptap) */}
          <div className="flex flex-col gap-1.5">
            <div
              className={`rounded-lg border overflow-hidden bg-white transition-colors
                ${hasContentError
                  ? 'border-red-500'
                  : 'border-[#998C5F] focus-within:border-[#00101A]'
                }`}
            >
              {/* C — Toolbar (callbacks wired here where StarterKit types are in scope) */}
              <RichTextToolbar
                isBoldActive={editor?.isActive('bold') ?? false}
                isItalicActive={editor?.isActive('italic') ?? false}
                isStrikeActive={editor?.isActive('strike') ?? false}
                isOrderedListActive={editor?.isActive('orderedList') ?? false}
                isLinkActive={editor?.isActive('link') ?? false}
                isBlockquoteActive={editor?.isActive('blockquote') ?? false}
                onBold={() => editor?.chain().focus().toggleBold().run()}
                onItalic={() => editor?.chain().focus().toggleItalic().run()}
                onStrike={() => editor?.chain().focus().toggleStrike().run()}
                onOrderedList={() => editor?.chain().focus().toggleOrderedList().run()}
                onLink={promptLink}
                onBlockquote={() => editor?.chain().focus().toggleBlockquote().run()}
                rightSlot={
                  <Link
                    href="/community-standards"
                    className="text-sm font-bold text-[#E0533F] underline hover:opacity-80"
                  >
                    {t.writeKudosCommunityStandards}
                  </Link>
                }
              />

              {/* D — Editor area */}
              <EditorContent editor={editor} />
            </div>

            {errors.content && (
              <p className="text-xs text-red-500">{errors.content}</p>
            )}

            {/* D.1 — @mention hint */}
            <p className="text-sm text-[#00101A]/70 text-center font-medium">
              {t.writeKudosMentionHint}
            </p>
          </div>

          {/* E — Hashtags */}
          <div className="flex items-start gap-4">
            <label className={labelClass}>
              {t.writeKudosHashtagLabel}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <HashtagSelector
                selected={hashtags}
                onChange={setHashtags}
                addLabel={t.writeKudosHashtagAddButton}
                maxLabel={t.writeKudosHashtagMax}
                hasError={submitted && hashtags.length === 0}
              />
              {errors.hashtags && (
                <p className="text-xs text-red-500">{errors.hashtags}</p>
              )}
            </div>
          </div>

          {/* F — Images (optional) */}
          <div className="flex items-start gap-4">
            <label className={labelClass}>{t.writeKudosImageLabel}</label>
            <div className="flex-1 min-w-0">
              <ImageUploadPreview
                images={images}
                onChange={setImages}
                addLabel={t.writeKudosImageAddButton}
              />
            </div>
          </div>

          {/* G — Anonymous toggle + alias input */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded accent-[#FFEA9E] cursor-pointer"
              />
              <span className="text-base text-[#00101A]">{t.writeKudosAnonymousLabel}</span>
            </label>
            {isAnonymous && (
              <input
                type="text"
                value={senderAlias}
                onChange={(e) => setSenderAlias(e.target.value)}
                placeholder={t.writeKudosAliasPlaceholder}
                className="w-full px-3 h-12 rounded-lg border border-[#998C5F] bg-white
                           text-sm text-[#00101A] placeholder:text-[#00101A]/40 outline-none
                           focus:border-[#00101A] transition-colors"
              />
            )}
          </div>

          {/* H — Footer actions */}
          <div className="flex gap-6 pt-2">
            {/* H.1 — Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-10 py-4 rounded border border-[#998C5F]
                         bg-[#FFEA9E]/10 text-base font-bold text-[#00101A]
                         hover:bg-[#FFEA9E]/20 transition-colors"
            >
              {t.writeKudosCancelButton}
              <span aria-hidden>✕</span>
            </button>

            {/* H.2 — Send */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg
                          text-base font-bold transition-colors
                          ${isSubmitDisabled
                            ? 'bg-[#FFEA9E]/40 text-[#00101A]/40 cursor-not-allowed'
                            : 'bg-[#FFEA9E] text-[#00101A] hover:bg-[#ffe066]'
                          }`}
            >
              {submitting && (
                <span
                  className="w-4 h-4 rounded-full border-2 border-[#00101A]/30
                             border-t-[#00101A] animate-spin inline-block"
                />
              )}
              {t.writeKudosSubmitButton}
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
                <path d="M3 11l18-8-8 18-2.5-7.5L3 11z" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <KudosToast message={toastMsg} visible={showToast} />
    </div>
  );
}
