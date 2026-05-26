/**
 * EasyMDE — full default toolbar (minus built-in fullscreen).
 * sideBySideFullscreen: false keeps preview split inside our overlay.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import EasyMDE from "easymde";
import { resetEasyMDEDom, teardownEasyMDE } from "../lib/teardownEasyMDE";
import "codemirror/lib/codemirror.css";
import "easymde/dist/easymde.min.css";

export interface EasyMarkdownEditorHandle {
  getValue: () => string;
  destroy: () => void;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  minHeight?: string;
}

const TOOLBAR: EasyMDE.Options["toolbar"] = [
  "bold",
  "italic",
  "strikethrough",
  "|",
  "heading-1",
  "heading-2",
  "heading-3",
  "|",
  "code",
  "quote",
  "unordered-list",
  "ordered-list",
  "check-list",
  "|",
  "link",
  "image",
  "table",
  "horizontal-rule",
  "|",
  "preview",
  "side-by-side",
  "|",
  "undo",
  "redo",
  "|",
  "guide",
];

export const EasyMarkdownEditor = forwardRef<EasyMarkdownEditorHandle, Props>(
  function EasyMarkdownEditor({ value, onChange, minHeight = "calc(100vh - 11rem)" }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const mdeRef = useRef<EasyMDE | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useImperativeHandle(ref, () => ({
      getValue: () => mdeRef.current?.value() ?? "",
      destroy: () => {
        teardownEasyMDE(mdeRef.current);
        mdeRef.current = null;
        if (hostRef.current) hostRef.current.innerHTML = "";
      },
    }));

    useEffect(() => {
      const host = hostRef.current;
      if (!host) return;

      host.innerHTML = "";
      const textarea = document.createElement("textarea");
      host.appendChild(textarea);

      const mde = new EasyMDE({
        element: textarea,
        initialValue: value,
        spellChecker: false,
        autofocus: true,
        autoDownloadFontAwesome: true,
        status: ["lines", "words", "cursor"],
        minHeight,
        sideBySideFullscreen: false,
        renderingConfig: { singleLineBreaks: false },
        toolbar: TOOLBAR,
      });

      mde.codemirror.on("change", () => {
        onChangeRef.current(mde.value());
      });

      mdeRef.current = mde;

      return () => {
        teardownEasyMDE(mde);
        mdeRef.current = null;
        host.innerHTML = "";
        resetEasyMDEDom();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={hostRef} className="easymde-host h-full min-h-0" />;
  },
);
