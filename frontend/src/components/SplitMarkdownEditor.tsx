import { forwardRef, useImperativeHandle, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface SplitMarkdownEditorHandle {
  getValue: () => string;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export const SplitMarkdownEditor = forwardRef<SplitMarkdownEditorHandle, Props>(
  function SplitMarkdownEditor({ value, onChange }, ref) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      getValue: () => textareaRef.current?.value ?? value,
    }));

    return (
      <div className="lh-split-editor">
        <div className="lh-split-editor__shell">
          <div className="lh-split-editor__write">
            <label className="lh-split-editor__label">Edit</label>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
              className="lh-split-editor__textarea"
              aria-label="Markdown source"
            />
          </div>
          <div className="lh-split-editor__preview" aria-live="polite">
            <label className="lh-split-editor__label">Preview</label>
            <div className="lh-split-editor__preview-scroll prose-lh">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || "_Nothing to preview yet._"}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
