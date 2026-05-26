import type EasyMDE from "easymde";

/** Exit preview / side-by-side / CodeMirror fullscreen so unmount does not leave the app stuck. */
export function teardownEasyMDE(mde: EasyMDE | null | undefined): void {
  if (!mde) return;

  const cm = mde.codemirror;
  const wrapper = cm.getWrapperElement();

  try {
    if (mde.isPreviewActive()) {
      const preview = wrapper.lastChild as HTMLElement | null;
      preview?.classList.remove("editor-preview-active");
    }
  } catch {
    /* ignore */
  }

  try {
    if (mde.isSideBySideActive()) {
      const preview = wrapper.nextSibling as HTMLElement | null;
      preview?.classList.remove("editor-preview-active-side");
      wrapper.classList.remove("CodeMirror-sided");
      const container = wrapper.parentElement;
      container?.classList.remove("sided--no-fullscreen");
    }
  } catch {
    /* ignore */
  }

  try {
    if (mde.isFullscreenActive()) {
      // CodeMirror fullscreen addon (not in @types/codemirror)
      (cm as { setOption(option: string, value: boolean): void }).setOption("fullScreen", false);
    }
  } catch {
    /* ignore */
  }

  try {
    mde.toTextArea();
  } catch {
    /* ignore */
  }

  resetEasyMDEDom();
}

/** Clear global side effects EasyMDE / CodeMirror fullscreen can leave behind. */
export function resetEasyMDEDom(): void {
  document.body.style.overflow = "";
  document.body.style.removeProperty("overflow");

  document.querySelectorAll(".CodeMirror-fullscreen").forEach((el) => {
    el.classList.remove("CodeMirror-fullscreen");
  });
  document.querySelectorAll(".editor-toolbar.fullscreen").forEach((el) => {
    el.classList.remove("fullscreen");
  });
}
