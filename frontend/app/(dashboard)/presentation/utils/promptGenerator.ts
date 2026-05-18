import { SlidePage } from "../../../../src/types/presentation";

/**
 * Generates a structured, data-centric reconstruction prompt for AI models
 * based on the current slide deck layout and node artifacts.
 */
export const generateAiPrompt = (deck: SlidePage[]): string => {
  const fullDeckBlueprint = deck
    .map((slide, sIdx) => {
      const artifacts = slide.nodes
        .map((node, nIdx) => {
          // Serialize the raw data for factual reconstruction
          const rawDataString = node.item.chartPayload
            ? JSON.stringify(node.item.chartPayload, null, 2)
            : "No raw payload available (Summary: " +
              (node.item.metricsSummary || "N/A") +
              ")";

          return `### Artifact ${nIdx + 1}: ${node.item.title}
- **Data Type**: ${node.item.type}
- **Raw Analytical Data**:
\`\`\`json
${rawDataString}
\`\`\`
`;
        })
        .join("\n");

      return `## SLIDE ${sIdx + 1}: ${slide.title || "Untitled"}
**Context/Subtitle**: ${slide.subtitle || "N/A"}
**Strategic Notes**: ${slide.executiveNotes || "N/A"}

${artifacts}
`;
    })
    .join("\n\n---\n\n");

  return `
# SYSTEM ROLE: Data Analyst & Presentation Logic Architect
# TASK: Generate a data-driven presentation based on the following metrics.

You are provided with the logical structure and raw data for a marketing ROI deck. 
Focus exclusively on the data accuracy and the strategic narrative. 

# DATA HIERARCHY:

${fullDeckBlueprint}

# RECONSTRUCTION GUIDELINES:
1. **Data Accuracy**: Use the provided JSON payloads to represent the metrics exactly as they appear in the source.
2. **Logical Sequence**: Maintain the slide and artifact order to preserve the narrative flow.
3. **Note Integration**: Use the "Strategic Notes" to inform the insights or summaries for each slide.

# FINAL OUTPUT REQUEST:
Confirm that you have received all ${deck.length} slides and the associated data. 
Then, suggest a strategic summary for this deck based on the aggregated data provided.
`.trim();
};
