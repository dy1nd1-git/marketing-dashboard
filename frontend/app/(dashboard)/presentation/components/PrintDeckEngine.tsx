import React from "react";
import { SlidePage, SlideNode } from "./types";
import { InsightItem } from "../../../../src/context/InsightCartContext";

interface PrintDeckEngineProps {
  deck: SlidePage[];
  renderNodeVisual: (item: InsightItem, isExporting?: boolean, height?: number) => React.ReactNode;
  isExporting: boolean;
}

export const PrintDeckEngine: React.FC<PrintDeckEngineProps> = ({
  deck,
  renderNodeVisual,
  isExporting = false,
}) => {
  return (
    <div 
      className="print-capture-engine"
      style={{
        position: "fixed",
        left: "-5000px",
        top: "-5000px",
        width: "1280px",
        height: "auto",
        zIndex: -9999,
        pointerEvents: "none",
        visibility: isExporting ? "visible" : "hidden",
        backgroundColor: "transparent",
      }}
    >
      {deck.map((slide: SlidePage, index: number) => (
        <div
          key={`print_slide_${slide.id}`}
          id={`print-slide-container-${index}`}
          style={{
            width: "1280px",
            height: "720px",
            backgroundColor: slide.theme === "dark" ? "#1E1E1E" : slide.theme === "mellow" ? "#F5F4EE" : "#FFFFFF",
            color: slide.theme === "dark" ? "#FFFFFF" : "#1A1C1E",
            padding: "30px 50px", // Aggressively reduced padding
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            marginBottom: "50px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Header Section (Super Compact) */}
          <div style={{
            borderLeft: `4px solid ${slide.theme === "dark" ? "#FFFFFF" : "#87A996"}`,
            paddingLeft: "20px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}>
            <h1 style={{
              fontSize: "32px",
              fontWeight: 800,
              margin: 0,
              padding: 0,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              {slide.title || "Strategic Horizon"}
            </h1>
            {slide.subtitle && (
              <p style={{
                fontSize: "14px",
                margin: 0,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: slide.theme === "dark" ? "#A8A8A8" : "#87A996",
                opacity: 0.8,
              }}>
                {slide.subtitle}
              </p>
            )}
          </div>

          {/* Nodes Container (Maximized Space) */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            // If multiple nodes, they stack. If one node, it has more room.
          }}>
            {slide.nodes.map((node: SlideNode) => (
              <div
                key={node.id}
                style={{
                  backgroundColor: slide.theme === "dark" ? "#2A2A2A" : "#FFFFFF",
                  border: `1px solid ${slide.theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(135,169,150,0.15)"}`,
                  borderRadius: "16px",
                  padding: "15px", // Minimal padding inside card
                  boxShadow: "0 2px 15px rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  // Use the height directly, or flex-grow if only one node
                  minHeight: node.height ? `${node.height}px` : "400px",
                  flex: slide.nodes.length === 1 ? 1 : "none", 
                  width: "100%",
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  opacity: 0.9,
                }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#87A996",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      {node.item.type === "table" ? (
                        <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/>
                      ) : (
                        <path d="M3 3v18h18M18 9l-6 6-3-3-3 3"/>
                      )}
                    </svg>
                  </div>
                  <span style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: slide.theme === "dark" ? "#FFFFFF" : "#444444",
                  }}>
                    {node.item.title}
                  </span>
                </div>

                <div style={{
                  flex: 1,
                  width: "100%",
                  display: "flex",
                  alignItems: "stretch", // Stretch to fill the card
                  justifyContent: "center",
                }}>
                  {renderNodeVisual(node.item, isExporting, node.height)}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Section (Minimal Footprint) */}
          <div style={{
            marginTop: "15px",
            paddingTop: "15px",
            borderTop: `1px solid ${slide.theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <span style={{
                color: "#87A996",
                fontWeight: 900,
                fontSize: "20px",
                fontFamily: "serif",
              }}>“</span>
              <p style={{
                fontSize: "11px",
                fontStyle: "italic",
                margin: 0,
                color: slide.theme === "dark" ? "#A8A8A8" : "#888888",
                maxWidth: "80%",
              }}>
                {slide.executiveNotes || "Analytical summary provided for decision support."}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {slide.footerText && (
                <span style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#87A996",
                  opacity: 0.6,
                }}>
                  {slide.footerText}
                </span>
              )}
              <div style={{
                fontSize: "12px",
                fontWeight: 900,
                fontFamily: "monospace",
                color: "#87A996",
                opacity: 0.4,
              }}>
                PG {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
