import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SplitMarkdownEditor, type SplitMarkdownEditorHandle } from "./SplitMarkdownEditor";

interface Props {
  open: boolean;
  title: string;
  value: string;
  readOnly: boolean;
  dirty: boolean;
  hasDraft: boolean;
  canSuggestPR: boolean;
  suggestingPR?: boolean;
  syncKey: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  onDiscard: () => void;
  onSuggestPR: (editedBody: string) => void | Promise<void>;
}

export function FullscreenEditor({
  open,
  title,
  value,
  readOnly,
  dirty,
  hasDraft,
  canSuggestPR,
  suggestingPR = false,
  syncKey,
  onChange,
  onClose,
  onSave,
  onDiscard,
  onSuggestPR,
}: Props) {
  const editorRef = useRef<SplitMarkdownEditorHandle>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      handleClose();
    };
    window.addEventListener("keydown", onKey, true);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open, handleClose]);

  if (!open) return null;

  const handleSuggestPR = async () => {
    const text = editorRef.current?.getValue() ?? value;
    onChange(text);
    await onSuggestPR(text);
  };

  const overlay = (
    <div
      className="lh-editor-overlay fixed inset-0 z-[200] flex flex-col bg-lh-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Editor: ${title}`}
    >
      <header className="glass-bar flex items-center gap-3 px-5 py-3 shrink-0">
        <h2 className="text-sm font-semibold text-lh-ivory truncate flex-1">{title}</h2>
        {(hasDraft || dirty) && (
          <span className="text-[10px] uppercase tracking-wider text-lh-gold-light">unsaved</span>
        )}
        <button type="button" onClick={handleClose} className="btn-glass">
          Close
        </button>
      </header>

      <div className="flex-1 min-h-0 py-4 overflow-hidden">
        {readOnly ? (
          <div className="lh-split-editor">
            <div className="lh-split-editor__shell lh-split-editor__shell--readonly max-w-[720px] mx-auto">
              <div className="prose-lh lh-split-editor__preview-scroll w-full">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <SplitMarkdownEditor ref={editorRef} key={syncKey} value={value} onChange={onChange} />
        )}
      </div>

      {!readOnly && (
        <footer className="glass-bar px-5 py-3 flex flex-wrap items-center gap-2 shrink-0">
          <button type="button" onClick={onSave} disabled={!dirty} className="btn-glass disabled:opacity-40">
            Save draft
          </button>
          <button
            type="button"
            onClick={onDiscard}
            disabled={!hasDraft && !dirty}
            className="btn-glass disabled:opacity-40"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => void handleSuggestPR()}
            disabled={!canSuggestPR || suggestingPR}
            className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
            title={canSuggestPR ? "Open your edits on GitHub and start a PR" : "Claim this node first"}
          >
            {suggestingPR ? "Opening GitHub…" : "Suggest PR"}
          </button>
          {!canSuggestPR && (
            <span className="text-[11px] text-lh-ivory-muted">Claim this node to suggest a PR.</span>
          )}
        </footer>
      )}
    </div>
  );

  return createPortal(overlay, document.body);
}
