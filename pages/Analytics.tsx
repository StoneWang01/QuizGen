
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, Calendar, ArrowUpRight, ArrowDownRight, FileText, Layout, Award } from 'lucide-react';

const quizData = [
  { name: '第一單元', avg: 85, top: 98, low: 62 },
  { name: '第二單元', avg: 78, top: 95, low: 55 },
  { name: '第三單元', avg: 92, top: 100, low: 75 },
  { name: '第四單元', avg: 74, top: 92, low: 48 },
  { name: '第五單元', avg: 81, top: 96, low: 65 },
];

const categoryData = [
  { name: '已完成', value: 450, color: '#4f46e5' },
  { name: '進行中', value: 120, color: '#818cf8' },
  { name: '未開始', value: 80, color: '#e2e8f0' },
];

export default function Analytics() {
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quizmind_quizzes') || '[]');
    setTotalQuizzes(saved.length);
    setRecentQuizzes(saved.slice(0, 3));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">學生成績分析</h1>
          <p className="text-slate-500">根據你測驗庫入面嘅 {totalQuizzes} 個測驗分析所得嘅數據。</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 glass text-slate-600 rounded-xl hover:bg-white transition-all">
            <Calendar size={18} />
            <span className="hidden sm:inline">最近 30 日</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
          >
            <Download size={18} />
            <span>匯出報告</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-6 rounded-3xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">測驗表現概覽</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="avg" name="平均得分" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="top" name="最高得分" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl">
              <h3 className="font-bold text-slate-800 mb-4">進度指標</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">平均分</p>
                      <p className="text-lg font-bold">82.4%</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">+4.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <ArrowDownRight size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">未完成測驗</p>
                      <p className="text-lg font-bold">12</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-red-600">-15%</span>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl flex flex-col items-center justify-center">
              <h3 className="font-bold text-slate-800 mb-2 self-start">參與度分析</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 text-xs font-bold">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-500">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-6 rounded-3xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">測驗庫摘要</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-600" />
                  <span className="text-sm font-bold text-slate-700">測驗總數</span>
                </div>
                <span className="text-lg font-black">{totalQuizzes}</span>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase">最近生成</p>
                {recentQuizzes.length > 0 ? (
                  recentQuizzes.map((q: any) => (
                    <div key={q.id} className="flex items-center gap-3 p-3 glass rounded-xl text-sm">
                      <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Layout size={16} />
                      </div>
                      <span className="font-bold text-slate-700 truncate flex-1">{q.title}</span>
                      <span className="text-xs text-slate-400">{q.questions?.length} 題</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">仲未有測驗住。</p>
                )}
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl bg-slate-900 text-white border-b-4 border-indigo-600">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Award className="text-indigo-400" />
              AI 智能分析
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed italic">
              "根據 {totalQuizzes} 個測驗嘅學生表現，發現加入互動性視覺輔助工具同較高嘅選擇題得分有明顯關係。建議可以增加多啲圖片題。"
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full py-2 bg-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all"
            >
              分析新內容
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
