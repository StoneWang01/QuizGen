
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Trophy, 
  Award,
  ArrowLeft,
  FileText,
  Loader2,
  CheckCircle2,
  Play
} from 'lucide-react';

interface ActiveStudent {
  id: string;
  name: string;
  progress: number;
  score: number;
  status: 'Active' | 'Finished' | 'Idle';
}

export default function LiveQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [students, setStudents] = useState<ActiveStudent[]>([]);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quizmind_quizzes') || '[]');
    const found = saved.find((q: any) => q.id === id);
    if (found) setQuiz(found);
    setLoading(false);

    let timer: any;
    if (sessionActive) {
      timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [id, sessionActive]);

  const simulateStudents = () => {
    setSessionActive(true);
    const names = ['阿明', '嘉嘉', '小明', '志偉', '美儀', '阿強', '婉珊', '子軒'];
    const newStudents: ActiveStudent[] = names.map((name, i) => ({
      id: `s_${i}`,
      name,
      progress: 0,
      score: 0,
      status: 'Active'
    }));
    setStudents(newStudents);

    const interval = setInterval(() => {
      setStudents(prev => prev.map(s => {
        if (s.progress >= 100) return { ...s, status: 'Finished' as const };
        const inc = Math.floor(Math.random() * 20);
        const newProg = Math.min(100, s.progress + inc);
        const newScore = s.score + (inc * 15);
        return { ...s, progress: newProg, score: newScore };
      }));
    }, 2000);

    return () => clearInterval(interval);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center p-20 text-slate-500 gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="font-medium">實時連線初始化中...</p>
    </div>
  );

  if (!quiz) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6 glass p-10 rounded-3xl border border-slate-100 shadow-xl">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <FileText size={40} />
        </div>
        <h2 className="text-2xl font-bold">搵唔到呢個測驗</h2>
        <p className="text-slate-500">測驗庫入面搵唔到對應嘅記錄。</p>
        <button 
          onClick={() => navigate('/quizzes')}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
        >
          <ArrowLeft size={18} />
          返去測驗庫
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass p-8 rounded-[40px] border-l-8 border-indigo-600">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${sessionActive ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
              {sessionActive && <div className="w-4 h-4 bg-red-600 rounded-full animate-ping absolute" />}
              <div className={`w-3 h-3 rounded-full relative z-10 ${sessionActive ? 'bg-red-600' : 'bg-slate-300'}`} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${sessionActive ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                {sessionActive ? '直播中' : '準備開始'}
              </span>
              <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
              <span className="flex items-center gap-1"><Users size={14} /> {students.length} 個參加者</span>
              <span className="font-mono text-indigo-600 bg-indigo-50 px-2 rounded font-bold">邀請碼: {quiz.id.slice(-5).toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">倒數計時</div>
            <div className="text-2xl font-mono font-bold text-slate-800 flex items-center justify-end gap-2">
              <Clock size={20} className="text-indigo-600" />
              {formatTime(timeLeft)}
            </div>
          </div>
          {!sessionActive ? (
            <button 
              onClick={simulateStudents}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Play size={20} fill="currentColor" />
              開始實時測驗
            </button>
          ) : (
            <button 
              onClick={() => {
                if (window.confirm("確定要結束測驗？結果將會儲存到數據分析入面。")) {
                  setSessionActive(false);
                  navigate('/analytics');
                }
              }}
              className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg"
            >
              結束測驗
            </button>
          )}
        </div>
      </div>

      {!sessionActive && students.length === 0 ? (
        <div className="glass p-20 rounded-[40px] text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
            <Users size={40} />
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-slate-800">等緊學生入嚟...</h3>
            <p className="text-slate-500 mt-2">將邀請碼或者連結發俾學生開始。或者點擊下面嘅模擬模式試下先。</p>
          </div>
          <button 
            onClick={simulateStudents}
            className="px-8 py-3 glass border border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all"
          >
            模擬學生 (Demo 模式)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 rounded-[40px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">實時參與情況</h2>
                <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-bold">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                  實時更新中
                </div>
              </div>

              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="p-5 rounded-3xl hover:bg-slate-50 transition-all flex items-center gap-6 border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-white border border-slate-100 text-indigo-600 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-800 text-lg">{student.name}</span>
                        <span className="text-sm font-bold text-slate-400">{student.progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 rounded-full ${student.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'}`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 min-w-[100px]">
                      <div className="text-2xl font-black text-indigo-600">{student.score}</div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${student.status === 'Finished' ? 'text-green-600' : 'text-slate-400'}`}>
                        {student.status === 'Finished' ? '已完成' : student.status === 'Active' ? '進行中' : '閒置'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-[40px]">
              <h2 className="text-xl font-bold text-slate-900 mb-8">測驗內容監察</h2>
              <div className="space-y-6">
                {quiz.questions?.map((q: any, i: number) => (
                  <div key={i} className="group relative">
                    <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-all text-indigo-400">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                      <p className="font-bold text-slate-800 text-lg mb-4">{i + 1}. {q.text}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options?.map((opt: string, idx: number) => (
                          <div key={idx} className={`text-sm p-3 rounded-xl border transition-all ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                            {String.fromCharCode(65 + idx)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">龍虎榜</h2>
                  <Trophy size={32} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                </div>

                <div className="space-y-4">
                  {[...students].sort((a, b) => b.score - a.score).slice(0, 5).map((student, i) => (
                    <div key={student.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl
                        ${i === 0 ? 'bg-yellow-500 text-slate-900' : i === 1 ? 'bg-slate-300 text-slate-900' : i === 2 ? 'bg-orange-400 text-slate-900' : 'bg-white/10 text-white'}
                      `}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold truncate">{student.name}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">獲得分數</p>
                      </div>
                      <div className="text-xl font-black text-indigo-400">{student.score}</div>
                    </div>
                  ))}
                  {students.length === 0 && <p className="text-slate-500 italic text-center py-4">等緊成績...</p>}
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="glass p-8 rounded-[40px] border-t-8 border-yellow-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-50 rounded-xl text-yellow-500">
                  <Award size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">AI 性能分析</h3>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed italic">
                {sessionActive ? 
                  "學生對概念性問題反應良好。第 3 題嘅選擇題出現較多遲疑。" : 
                  "開始測驗後，AI 會即時分析學生嘅表現並提供建議。"
                }
              </p>
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">實時分析</span>
                <span className="text-xs font-bold text-green-500">運行中</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
