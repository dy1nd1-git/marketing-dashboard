'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AnaliseContent() {
  const searchParams = useSearchParams();
  
  // 3. 日常ダッシュボードからの遷移（Context Bridge）
  // URLSearchParamsを使用し、日常ダッシュボードで選択中の date_range, segment_id, metric を分析ページへ引き継ぐ処理
  const segmentId = searchParams?.get('segment_id') || 'all_users';
  const metric = searchParams?.get('metric') || 'revenue';

  const [prompt, setPrompt] = useState('');
  
  interface AnalysisResult {
    id: string;
    prompt: string;
    sql: string;
    data: { name: string; value: number }[];
    insight: string;
    timestamp: string;
    addedAt?: string;
  }
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cartItems, setCartItems] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 1. データ連携ロジック（BigQuery / GA4）
  // AIからの自然言語をSQLに変換し、BigQueryへリクエストを投げるコアロジック
  async function executeAIGeneratedAnalysis(prompt: string) {
    setIsAnalyzing(true);
    try {
      // 1. LLMによるPrompt to SQL変換 (現状はモック実装)
      console.log(`[AI Logic] Converting prompt to SQL: "${prompt}"`);
      const mockSql = `SELECT date, metric_value FROM \`project.dataset.marketing_data\` WHERE metric = '${metric}' AND segment = '${segmentId}' AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)`;
      
      // 2. BigQuery APIによるクエリ実行 (擬似的なAPIコール)
      console.log(`[BigQuery] Executing SQL: ${mockSql}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // API遅延をシミュレート
      
      // 3. 結果をRecharts等の形式に整形してフロントへ返却
      const mockResult = {
        id: crypto.randomUUID(),
        prompt: prompt,
        sql: mockSql,
        data: [
          { name: 'Mon', value: 1200 },
          { name: 'Tue', value: 1900 },
          { name: 'Wed', value: 1500 },
          { name: 'Thu', value: 2100 },
          { name: 'Fri', value: 2400 },
          { name: 'Sat', value: 1800 },
          { name: 'Sun', value: 2600 },
        ],
        insight: '【AI Insight】 該当セグメントにおいて、指定期間中のコンバージョン率が前週比で20%増加しています。キャンペーンAの影響が考えられます。',
        timestamp: new Date().toISOString()
      };
      
      setAnalysisResult(mockResult);
    } catch (error) {
      console.error('Failed to execute analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  // 2. ドラッグ＆ドロップの状態遷移
  // カードをカートへドロップした際の処理
  const onDropToCart = (analysisData: AnalysisResult) => {
    // 1. 分析結果、SQL、AIの洞察をパッケージ化
    const packageData = {
      ...analysisData,
      addedAt: new Date().toISOString()
    };
    
    // 2. 保存用State（CartItems）へ追加
    setCartItems(prev => [...prev, packageData]);
    
    // 3. 次のGenSpark連携用プロンプトのコンテキストとして蓄積
    console.log('[Context Builder] Added to cart. Current context state for next generation:', [...cartItems, packageData]);
  };

  const handleAnalyze = () => {
    if (prompt.trim()) {
      executeAIGeneratedAnalysis(prompt);
    }
  };

  return (
    <div className="p-10 pb-32 min-h-screen bg-background relative flex flex-col font-sans">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[36px] font-semibold text-on-surface mb-2 tracking-tight">Exploration Workspace</h1>
        <p className="text-body-md text-outline">Analyze and pivot your marketing data with organic precision.</p>
      </div>

      <div className="flex gap-8 flex-1 items-start">
        {/* Left Area: Grid of Graphs */}
        <div className="flex-1 grid grid-cols-3 gap-6">
          
          {/* Top Left: Conversion Funnel (col-span-2) */}
          <div className="col-span-2 bg-surface-container-lowest rounded-[20px] p-6 shadow-[0_10px_30px_rgba(135,169,150,0.05)] border border-outline-variant/30 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-on-surface mb-2">Yesterday&apos;s Conversion Funnel</h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fdf2e9] text-[#c98e68] text-data-sm rounded-full font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  Campaign Q3
                </span>
              </div>
              <button className="text-data-sm text-outline font-data-sm tracking-wider hover:text-primary transition-colors">&lt;&gt; SQL</button>
            </div>
            
            {/* Bar Chart placeholder */}
            <div className="flex-1 min-h-[200px] flex items-end justify-around gap-4 px-4 pt-4">
               <div className="w-full flex flex-col items-center gap-2">
                 <span className="text-data-sm text-outline">12k</span>
                 <div className="w-full bg-[#e8eee9] rounded-t-lg h-[180px]"></div>
               </div>
               <div className="w-full flex flex-col items-center gap-2">
                 <span className="text-data-sm text-outline">7.2k</span>
                 <div className="w-full bg-[#d6e3db] rounded-t-lg h-[140px]"></div>
               </div>
               <div className="w-full flex flex-col items-center gap-2">
                 <span className="text-data-sm text-outline">4.8k</span>
                 <div className="w-full bg-[#c2d7cd] rounded-t-lg h-[100px]"></div>
               </div>
               <div className="w-full flex flex-col items-center gap-2">
                 <span className="text-data-sm text-outline">1.8k</span>
                 <div className="w-full bg-primary rounded-t-lg opacity-80 h-[40px]"></div>
               </div>
            </div>
          </div>

          {/* Top Right: Traffic Source (col-span-1) */}
          <div className="col-span-1 bg-surface-container-lowest rounded-[20px] p-6 shadow-[0_10px_30px_rgba(135,169,150,0.05)] border border-outline-variant/30 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-semibold text-on-surface leading-tight">Traffic<br/>Source</h3>
              <button className="text-data-sm text-outline font-data-sm tracking-wider hover:text-primary transition-colors">&lt;&gt; SQL</button>
            </div>
            
            {/* Donut Chart placeholder */}
            <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
               <div className="w-36 h-36 rounded-full border-[14px] border-primary border-r-[#d4a373] opacity-90 transform -rotate-45"></div>
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-auto w-36 h-36 border-[14px] border-transparent shadow-[inset_0_4px_10px_rgba(0,0,0,0.02)]">
                 <span className="text-3xl font-bold text-on-surface tracking-tighter">42%</span>
                 <span className="text-data-sm text-outline mt-1">Organic</span>
               </div>
            </div>
          </div>

          {/* Bottom: ROAS Trendline (col-span-3) */}
          <div className="col-span-3 bg-surface-container-lowest rounded-[20px] p-6 shadow-[0_10px_30px_rgba(135,169,150,0.05)] border border-outline-variant/30">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-semibold text-on-surface">ROAS Trendline</h3>
                <p className="text-data-sm text-outline mt-1 font-data-sm">Last 30 Days vs Target</p>
              </div>
              <button className="text-data-sm text-outline font-data-sm tracking-wider hover:text-primary transition-colors">&lt;&gt; SQL</button>
            </div>
            
            {/* Scatter Chart Placeholder */}
            <div className="h-[220px] w-full relative border-l border-b border-outline-variant/40 ml-6 mb-2">
              {/* y-axis label */}
              <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-data-sm text-outline font-data-sm">2.5</span>
              
              {/* Target Line */}
              <div className="absolute top-1/2 w-full border-t border-dashed border-primary/40"></div>
              
              {/* Dots */}
              <div className="absolute left-[10%] top-[80%] w-3 h-3 rounded-full bg-primary/80"></div>
              <div className="absolute left-[20%] top-[75%] w-3 h-3 rounded-full bg-primary/80"></div>
              <div className="absolute left-[30%] top-[65%] w-3 h-3 rounded-full bg-primary/80"></div>
              <div className="absolute left-[40%] top-[70%] w-3 h-3 rounded-full bg-primary/80"></div>
              <div className="absolute left-[50%] top-[40%] w-3 h-3 rounded-full bg-primary/80"></div>
              <div className="absolute left-[60%] top-[45%] w-3 h-3 rounded-full bg-primary/80"></div>
              <div className="absolute left-[70%] top-[90%] w-3 h-3 rounded-full bg-[#d4a373]"></div>
              <div className="absolute left-[80%] top-[25%] w-3 h-3 rounded-full bg-[#d4a373]"></div>
            </div>
          </div>
        </div>

        {/* Right Area: Insight Cart */}
        <div className="w-80 bg-surface-container-low/50 rounded-[24px] p-6 h-full min-h-[600px] border border-outline-variant/20 shadow-inner">
          <div className="flex items-center gap-3 mb-6 px-2">
            <svg className="w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="font-semibold text-on-surface">Insight Cart</h2>
          </div>

          <div className="space-y-4">
            {/* Drop zone */}
            <div 
              className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-[16px] h-32 flex flex-col items-center justify-center text-outline/80 text-data-sm transition-all hover:bg-primary/10 hover:border-primary/40 cursor-pointer font-data-sm"
              onClick={() => analysisResult && onDropToCart(analysisResult)}
            >
              <svg className="w-5 h-5 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Drop card here to save insight {analysisResult && "(Click to save recent analysis)"}
            </div>

            {/* Added Items */}
            {cartItems.map((item, index) => (
              <div key={index} className="bg-surface-container-lowest border border-outline-variant/40 p-5 rounded-[16px] shadow-sm relative group transition-all hover:shadow-md">
                <h4 className="font-medium text-[15px] text-on-surface mb-2">Analysis Result</h4>
                <p className="text-data-sm text-outline font-data-sm">Added recently</p>
                <button 
                  className="absolute top-4 right-4 text-outline/40 hover:text-outline transition-colors"
                  onClick={() => setCartItems(prev => prev.filter((_, i) => i !== index))}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Existing Card */}
            {cartItems.length === 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant/40 p-5 rounded-[16px] shadow-sm relative group transition-all hover:shadow-md">
                <h4 className="font-medium text-[15px] text-on-surface mb-2">CAC by Region</h4>
                <p className="text-data-sm text-outline font-data-sm">Saved 2h ago</p>
                <button className="absolute top-4 right-4 text-outline/40 hover:text-outline transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Input Bar */}
      <div className="absolute bottom-12 left-[40%] -translate-x-1/2 w-[700px] z-50">
        <div className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/40 rounded-full py-2 px-3 shadow-[0_20px_40px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-primary/20 transition-all focus-within:shadow-[0_20px_40px_rgba(69,101,85,0.15)]">
          <div className="pl-4 text-primary opacity-80 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input 
            type="text" 
            className="flex-1 bg-transparent px-2 py-3 text-data-lg focus:outline-none placeholder:text-outline/60 font-data-sm text-on-surface"
            placeholder="// [INPUT]: Verify yesterday's drop-off with..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <button 
            className="bg-primary text-on-primary hover:opacity-90 w-12 h-12 flex items-center justify-center rounded-full shadow-md disabled:opacity-50 transition-all hover:scale-[1.02] shrink-0"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !prompt.trim()}
            aria-label="Analyze"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalisePage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Loading workspace...</div>}>
      <AnaliseContent />
    </Suspense>
  );
}
