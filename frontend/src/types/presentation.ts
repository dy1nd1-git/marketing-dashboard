import { InsightItem } from "../context/InsightCartContext";

export interface SlideNode {
  id: string;
  item: InsightItem;
  customLabel?: string;
  position: { x: number; y: number };
  height?: number;
}

export interface SlidePage {
  id: string;
  title: string;
  subtitle?: string;
  theme: "light" | "dark" | "mellow";
  nodes: SlideNode[];
  executiveNotes: string;
  footerText?: string;
}
