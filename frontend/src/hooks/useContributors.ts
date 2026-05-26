import { useCallback, useMemo, useState } from "react";
import {
  ensureLocalContributor,
  mergeContributors,
  readLocalContributors,
} from "../lib/contributors";
import type { Contributors } from "../types";

export function useContributors(staticBase: Contributors) {
  const [local, setLocal] = useState<Contributors>(() => readLocalContributors());

  const contributors = useMemo(
    () => mergeContributors(staticBase, local),
    [staticBase, local],
  );

  const registerContributor = useCallback((actor: string) => {
    ensureLocalContributor(actor);
    setLocal(readLocalContributors());
  }, []);

  return { contributors, registerContributor };
}
