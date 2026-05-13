export interface StrategyNode {
  id: string;
  type: "current" | "recommended";
  cx: number;
  cy: number;
  label: string;
  roi: string;
  cvr: string;
  sql: string;
  insight: string;
}

export interface HistoryLogItem {
  id: string;
  timestamp: string;
  type: "exploration" | "approval";
  title: string;
  detail: string;
  badge: string;
}
