import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import html2canvas from "html2canvas";
import pptxgen from "pptxgenjs";
import { SlidePage } from "./types";

interface ExportGuidanceModalProps {
  isExportModalOpen: boolean;
  setIsExportModalOpen: (val: boolean) => void;
  deck: SlidePage[];
  setIsExporting: (val: boolean) => void;
}

export const ExportGuidanceModal: React.FC<ExportGuidanceModalProps> = ({
  isExportModalOpen,
  setIsExportModalOpen,
  deck,
  setIsExporting,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const generatePPTX = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setProgress(0);
    setIsExporting(true);

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      const pptx = new pptxgen();
      pptx.layout = "LAYOUT_16x9";
      pptx.title = "Mellow Marketing ROI Deck";

      // PowerPoint export requires the elements to be visible for capture.
      // We increased the wait time to ensure all charts have finished their initial paint.
      await wait(1500); 

      for (let i = 0; i < deck.length; i++) {
        const slideId = `print-slide-container-${i}`;
        const element = document.getElementById(slideId);
        
        if (element) {
          setProgress(Math.round(((i + 0.2) / deck.length) * 100));
          
          if (document.fonts) {
            await document.fonts.ready;
          }

          // html2canvas with a VERY aggressive onclone to fix the "lab()" error once and for all
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: null,
            width: 1280,
            height: 720,
            onclone: (clonedDoc) => {
              // THE ULTIMATE FIX: 
              // We remove all style/link tags that might contain the unsupported "lab()" function.
              // Since PrintDeckEngine now uses HEX colors and inline styles, it will still render correctly.
              const styles = clonedDoc.getElementsByTagName("style");
              for (let j = styles.length - 1; j >= 0; j--) {
                styles[j].remove();
              }
              const links = clonedDoc.getElementsByTagName("link");
              for (let j = links.length - 1; j >= 0; j--) {
                if (links[j].rel === "stylesheet") {
                  links[j].remove();
                }
              }
              
              // Ensure the element itself is visible in the clone
              const clonedElement = clonedDoc.getElementById(slideId);
              if (clonedElement) {
                clonedElement.style.visibility = "visible";
                clonedElement.style.position = "static";
                clonedElement.style.left = "0";
              }
            }
          });

          const dataUrl = canvas.toDataURL("image/png");

          const slide = pptx.addSlide();
          slide.addImage({
            data: dataUrl,
            x: 0,
            y: 0,
            w: "100%",
            h: "100%",
          });
          
          setProgress(Math.round(((i + 1) / deck.length) * 100));
        }
      }

      setProgress(100);
      await pptx.writeFile({ fileName: `Marketing_Deck_${new Date().toISOString().slice(0, 10)}.pptx` });
      setIsExportModalOpen(false);
    } catch (error) {
      console.error("PPTX Generation Failed:", error);
      alert(`PowerPointの書き出しに失敗しました。PDFエクスポートをお試しください。\nError: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGenerating(false);
      setIsExporting(false);
    }
  };

  if (!mounted || typeof window === "undefined" || !isExportModalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none print:hidden">
      {/* 
        インラインスタイルで絶対的なピクセル最小・最大幅を強制指定し、
        Tailwindパーサーの未定義や親のFlex圧縮仕様による横潰れ（細長い線状の帯化）を完全に根絶する設計 
      */}
      <div
        className="bg-white dark:bg-[#1E1F25] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden text-left transition-all"
        style={{ width: "100%", maxWidth: "540px", minWidth: "420px", boxSizing: "border-box" }}
        role="dialog"
        aria-modal="true"
        aria-label="Export Guidance Workflow"
      >
        {/* Header accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />

        <div className="flex items-start justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl block">
              ios_share
            </span>
            <div>
              <h3 className="font-h1 text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Export Deck Horizon
              </h3>
              <p className="text-xs font-label text-slate-500 dark:text-slate-400">
                Google Slides / PowerPoint Native Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            aria-label="Close guidance"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base block">close</span>
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex flex-col gap-3 shadow-2xs">
          <p className="text-xs font-body text-slate-800 dark:text-slate-200 font-semibold">
            💡 ピクセルパーフェクトなフルスクリーン・スライドの書き出し手順:
          </p>
          <ol className="text-xs font-body text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
            <li>
              下の <span className="font-bold text-primary">「フルスクリーンPDFを出力」</span> ボタンをクリックします。
            </li>
            <li>
              開いたブラウザの印刷設定にて以下を指定してください：
              <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                <li>送信先: <span className="font-bold text-primary">PDFとして保存</span></li>
                <li>レイアウト: <span className="font-bold text-primary">横方向 (Landscape)</span></li>
                <li>オプション: <span className="font-bold text-primary">背景のグラフィックにチェック</span></li>
              </ul>
            </li>
            <li>
              保存した高品質PDFファイルを、<span className="font-bold">Google スライドの「ファイル ＞ スライドをインポート」</span>からアップロードするか、PowerPointに配置することで、ベクター画質でそのままご活用いただけます。
            </li>
          </ol>
        </div>

        {isGenerating && (
          <div className="px-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
                Generating PowerPoint Deck...
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                {progress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsExportModalOpen(false)}
            disabled={isGenerating}
            className="px-4 py-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-label border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
          
          <button
            onClick={generatePPTX}
            disabled={isGenerating}
            className="px-4 py-2 bg-surface text-on-surface border border-primary/30 hover:border-primary hover:bg-primary/5 rounded-xl text-xs font-label font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm block">
              present_to_all
            </span>
            <span>PowerPoint (.pptx) で出力</span>
          </button>

          <button
            onClick={() => {
              setIsExportModalOpen(false);
              setTimeout(() => {
                window.print();
              }, 100);
            }}
            disabled={isGenerating}
            className="px-5 py-2 bg-primary text-on-primary hover:shadow-md hover:scale-105 rounded-xl text-xs font-label font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm block">
              print
            </span>
            <span>フルスクリーンPDFを出力</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
