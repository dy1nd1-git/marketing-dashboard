export interface RawMetricRow {
  date?: string;
  Date?: string;
  cvr?: number;
  CVR?: number;
  roas?: number;
  ROAS?: number;
  spend?: number;
  Spend?: number;
  revenue?: number;
  Revenue?: number;
  traffic?: number;
  Traffic?: number;
  roi?: number;
  ROI?: number;
  metric_value?: number;
  [key: string]: unknown;
}

// Declarative mapping of prompt keywords to their corresponding object keys
const METRIC_KEYWORDS: { keywords: string[]; keys: (keyof RawMetricRow)[] }[] = [
  { keywords: ["cvr", "コンバージョン"], keys: ["cvr", "CVR"] },
  { keywords: ["roas"], keys: ["roas", "ROAS"] },
  { keywords: ["spend", "広告費", "コスト"], keys: ["spend", "Spend"] },
  { keywords: ["revenue", "売上", "収益"], keys: ["revenue", "Revenue"] },
  { keywords: ["traffic", "トラフィック", "セッション"], keys: ["traffic", "Traffic"] },
  { keywords: ["roi"], keys: ["roi", "ROI"] },
];

/**
 * Intelligently extracts a metric value from raw row data based on prompt context.
 */
export function extractMetricValue(d: RawMetricRow, prompt: string): number {
  const lowerPrompt = prompt.toLowerCase();

  // 1. Traverse declarative keyword mappings
  for (const mapping of METRIC_KEYWORDS) {
    if (mapping.keywords.some((kw) => lowerPrompt.includes(kw))) {
      for (const key of mapping.keys) {
        if (d[key] !== undefined) return Number(d[key]);
      }
    }
  }

  // 2. Primary fallback chain (standard numeric metrics)
  const fallbackKeys: (keyof RawMetricRow)[] = [
    "roas",
    "cvr",
    "revenue",
    "spend",
    "traffic",
    "roi",
    "metric_value",
  ];
  for (const key of fallbackKeys) {
    if (d[key] !== undefined) return Number(d[key]);
  }

  // 3. Tertiary fallback: search for any dynamic numeric fields in the object
  for (const key in d) {
    if (key !== "date" && key !== "Date" && typeof d[key] === "number") {
      return Number(d[key]);
    }
  }

  return 0;
}

/**
 * Maps Go backend raw metrics response to fully-formed Recharts compatible chart payload.
 */
export function mapToChartData(rawData: RawMetricRow[], prompt: string) {
  if (!Array.isArray(rawData)) return [];

  return rawData.map((d) => {
    const dateStr = d.date || d.Date || new Date().toISOString();
    return {
      name: new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: extractMetricValue(d, prompt),
    };
  });
}
