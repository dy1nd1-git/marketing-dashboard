import React from "react";

export interface FloatingActionInsightProps {
  data: {
    title: string;
    description: string;
  };
}

export const FloatingActionInsight: React.FC<FloatingActionInsightProps> = ({ data }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button className="flex items-center gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-2xl hover:scale-105 transition-transform group">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            data-alt="close up of a cheerful AI assistant avatar with professional business attire"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMV92ecFOmGrAh9tO6KRKzMayVVYY7neoIVLJnILnj3ItLMv6T8snnQ5YSnFDsUuxIFgk9NKELn6LA-bRe0CbPQThRzBXZRyPto14X9B-JmVNo6N3bg1MBEQ-OoPEAvdrXb1M0qZiIrdFD1jQ3DjwEJDAWF3iMkZkCR_-KNN7qnW8HgTS8Sk_8A9ZLf-q6entkoxN35VCC4h84Bg9RV6UYE9qNVa0vqddjy_zZPpWmZFXQF9HllVh_gowMXIMlN3ikuS7UpFwHPFMV"
          />
        </div>
        <div className="pr-2 text-left">
          <div className="text-label-sm text-primary">{data.title}</div>
          <div className="text-label-md font-bold text-slate-800">
            {data.description}
          </div>
        </div>
        <div className="bg-indigo-50 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
      </button>
    </div>
  );
};
