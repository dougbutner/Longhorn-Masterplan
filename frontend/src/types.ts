export type Status = "not_started" | "in_progress" | "review" | "done";

export interface PlanNode {
  id: string;
  title: string;
  status: Status;
  progress: number;
  owners: string[];
  depends_on: string[];
  tags: string[];
  body: string;
  file: string;
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
