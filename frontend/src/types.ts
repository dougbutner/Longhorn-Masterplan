export type Status = "not_started" | "in_progress" | "review" | "done";

export interface PlanSource {
  path: string;
  url?: string;
  exists: boolean;
  language: string;
}

export interface PlanNode {
  id: string;
  title: string;
  parent: string | null;
  status: Status;
  progress: number;
  owners: string[];
  tags: string[];
  order: number;
  source?: PlanSource;
  body: string;
  editableBody: string;
  frontmatter: Record<string, unknown>;
  file: string;
  depth: number;
  children: string[];
}

export interface PendingPR {
  number: number;
  title: string;
  vaulta: string | undefined;
  url: string;
  updatedAt: string;
  draft: boolean;
}

export interface Contributor {
  color: string;
  vaulta: string;
  github?: string;
  role?: string;
}

export type Contributors = Record<string, Contributor>;

export interface SessionInfo {
  actor: string;
  permission: string;
  chain: string;
}
