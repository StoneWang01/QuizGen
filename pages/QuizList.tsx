
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Trash2, 
  Layout,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quizmind_quizzes') || '[]');
    setQuizzes(saved);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("確定要刪除呢個測驗？")) {
      const updated = quizzes.filter(q => q.id !== id);
      localStorage.setItem('quizmind_quizzes', JSON.stringify(updated));
      setQuizzes(updated);
    }
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">我嘅測驗庫</h1>
          <p className="text-slate-500">管理你生成嘅所有測驗內容。</p>
        </div>
        <Link 
          to="/generate" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>新測驗</span>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="搜尋測驗..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 glass rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 mb-4">搵唔到測驗。即刻整返個先啦！</p>
          <Link to="/generate" className="text-indigo-600 font-bold hover:underline">整第一個測驗 &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="glass p-6 rounded-3xl hover:shadow-xl transition-all group flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Layout size={24} />
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{quiz.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Layout size={12}/> {quiz.questions?.length || 0} 條題目</span>
                  <span className="flex items-center gap-1"><Clock size={12}/> {quiz.modified || '啱啱'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link 
                  to={`/live/${quiz.id}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all"
                >
                  <Play size={14} fill="currentColor" />
                  Live 模式
                </Link>
                <button 
                  onClick={() => handleDelete(quiz.id)}
                  className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
