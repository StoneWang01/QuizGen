
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  TrendingUp,
  Plus,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    quizzes: 0,
    students: 0,
    classrooms: 0,
    accuracy: '0%'
  });

  useEffect(() => {
    const quizzes = JSON.parse(localStorage.getItem('quizmind_quizzes') || '[]');
    const classrooms = JSON.parse(localStorage.getItem('quizmind_classrooms') || '[]');
    const totalStudents = classrooms.reduce((acc: number, curr: any) => acc + (curr.students?.length || 0), 0);
    
    setStats({
      quizzes: quizzes.length,
      students: totalStudents,
      classrooms: classrooms.length,
      accuracy: quizzes.length > 0 ? '78%' : '0%' // Simulated until we have real attempt data
    });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">歡迎返嚟，老師！</h1>
          <p className="text-slate-500">管理你嘅 AI 智能教學環境。</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/classrooms" 
            className="flex items-center gap-2 px-4 py-2 glass text-indigo-600 rounded-xl hover:bg-white transition-all border border-indigo-100"
          >
            <Users size={20} />
            <span>進入課室</span>
          </Link>
          <Link 
            to="/generate" 
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            <Plus size={20} />
            <span>製作新測驗</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '測驗總數', value: stats.quizzes, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '學生人數', value: stats.students, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: '課室總數', value: stats.classrooms, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '平均準確率', value: stats.accuracy, icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-3">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-slate-500 font-semibold text-sm">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {stats.quizzes === 0 ? (
        <div className="glass p-12 rounded-[40px] text-center space-y-4 border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Plus size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">你仲未有測驗住</h2>
          <p className="text-slate-500 max-w-md mx-auto">即刻上載份 PDF 或者貼段文字，用 AI 整你第一個測驗啦。</p>
          <Link to="/generate" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all">
            即刻開始 &rarr;
          </Link>
        </div>
      ) : (
        <div className="glass p-8 rounded-[40px] bg-slate-900 text-white overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-4">準備好開始 Live 未？</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                將測驗指派俾你嘅課室，開啟實時測驗模式同學生互動。
              </p>
              <div className="flex gap-4 mt-8">
                <Link to="/quizzes" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                  去我嘅測驗庫
                </Link>
                <Link to="/classrooms" className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all">
                  管理課室
                </Link>
              </div>
            </div>
            <div className="hidden lg:block w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl absolute -right-10 top-0" />
            <TrendingUp size={120} className="text-indigo-500/10 absolute right-10 -bottom-10" />
          </div>
        </div>
      )}
    </div>
  );
}
