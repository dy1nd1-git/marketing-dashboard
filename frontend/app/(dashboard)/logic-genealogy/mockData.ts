import { HistoryLogItem, StrategyNode } from "../../../src/types/genealogy";

export const CURRENT_PATH_D =
  "M 150,450 C 300,450 300,300 450,300 C 625,300 650,210 800,210";
export const RECOMMENDED_PATH_D =
  "M 450,300 C 475,200 450,180 500,180 C 675,180 700,90 850,90";

export const STRATEGY_NODES: StrategyNode[] = [
  {
    id: "node-1",
    type: "current",
    cx: 150,
    cy: 450,
    label: "Awareness Phase",
    roi: "120%",
    cvr: "2.4%",
    sql: "SELECT phase, sum(spend) FROM `project.dataset.ads`\nWHERE phase = 'awareness' GROUP BY 1",
    insight:
      "Initial acquisition costs are stable but drop-off prior to checkout is elevated.",
  },
  {
    id: "node-2",
    type: "current",
    cx: 450,
    cy: 300,
    label: "Mid-Funnel Retargeting",
    roi: "240%",
    cvr: "4.8%",
    sql: "SELECT phase, avg(cvr) FROM `project.dataset.ads`\nWHERE target = 'retargeting' AND days < 14",
    insight:
      "Strong click-through resilience. Users engaged here show higher lifetime retention.",
  },
  {
    id: "node-3",
    type: "current",
    cx: 800,
    cy: 210,
    label: "Current Conversion Core",
    roi: "342%",
    cvr: "6.2%",
    sql: "SELECT final_roi, total_conversions FROM `project.dataset.ga4`\nWHERE is_active = true",
    insight:
      "Current trajectory mirrors the 2023 Spring Campaign success. Baseline established.",
  },
  {
    id: "node-rec-1",
    type: "recommended",
    cx: 500,
    cy: 180,
    label: "Organic Social Pivot",
    roi: "410%",
    cvr: "8.5%",
    sql: "SELECT predicted_lift FROM `ml.roi_models`\nWHERE scenario = 'organic_shift_15pct'",
    insight:
      "Reallocating 15% budget towards organic creator nodes shows a highly compressed CPA probability.",
  },
  {
    id: "node-rec-2",
    type: "recommended",
    cx: 850,
    cy: 90,
    label: "Compounded Future ROI",
    roi: "485%",
    cvr: "11.2%",
    sql: "SELECT cumulative_roi FROM `ml.forecast_engine`\nWHERE horizon_days = 90",
    insight:
      "Compounding network effects expected to achieve +40% efficiency gains over the baseline curve.",
  },
];

export const INITIAL_DEMO_HISTORY: HistoryLogItem[] = [
  {
    id: "hist-1",
    timestamp: "2026-05-12 14:20",
    type: "exploration",
    title: "Explored Context Segment: Paid Social",
    detail:
      "Focused dashboard context parameters to review Paid Social channel efficiency curves.",
    badge: "Explored",
  },
  {
    id: "hist-2",
    timestamp: "2026-05-10 09:15",
    type: "approval",
    title: "Approved Q2 Creative Reallocation",
    detail:
      "Executed strategy to shift 10% budget from static banners to high-engagement video networks.",
    badge: "Executed",
  },
  {
    id: "hist-3",
    timestamp: "2026-05-08 17:45",
    type: "exploration",
    title: "Explored Context Segment: Organic Search",
    detail:
      "Evaluated mid-funnel conversion leakage and long-term retention resilience.",
    badge: "Explored",
  },
];
