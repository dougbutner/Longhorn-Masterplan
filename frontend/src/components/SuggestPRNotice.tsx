import type { SuggestPRResult } from "../lib/preparePr";

interface Props {
  result: SuggestPRResult | null;
  onDismiss: () => void;
}

export function SuggestPRNotice({ result, onDismiss }: Props) {
  if (!result) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[300] w-[min(400px,92vw)] glass-panel p-4 shadow-lg border border-lh-gold/30"
      role="status"
    >
      <p className="text-sm text-lh-ivory whitespace-pre-line leading-relaxed">{result.message}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {result.prUrl && (
          <a href={result.prUrl} target="_blank" rel="noreferrer" className="btn-gold text-xs">
            Open PR
          </a>
        )}
        {result.editUrl && (
          <a href={result.editUrl} target="_blank" rel="noreferrer" className="btn-glass text-xs">
            GitHub editor
          </a>
        )}
        <button type="button" onClick={onDismiss} className="btn-glass text-xs ml-auto">
          Dismiss
        </button>
      </div>
    </div>
  );
}
