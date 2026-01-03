
import React, { useState, useEffect } from 'react';
import { Users, Plus, X, Search, MoreVertical, Layout, UserPlus, BookOpen, Trash2 } from 'lucide-react';

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    const savedClasses = JSON.parse(localStorage.getItem('quizmind_classrooms') || '[]');
    const savedQuizzes = JSON.parse(localStorage.getItem('quizmind_quizzes') || '[]');
    setClassrooms(savedClasses);
    setQuizzes(savedQuizzes);
  }, []);

  const handleCreate = () => {
    if (!newClassName.trim()) return;
    const newClass = {
      id: `c_${Date.now()}`,
      name: newClassName,
      students: [],
      assignedQuizIds: [],
      code: Math.random().toString(36).substring(2, 7).toUpperCase()
    };
    const updated = [newClass, ...classrooms];
    localStorage.setItem('quizmind_classrooms', JSON.stringify(updated));
    setClassrooms(updated);
    setNewClassName('');
    setShowModal(false);
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm("確定要刪除呢個課室？")) {
      const updated = classrooms.filter(c => c.id !== id);
      localStorage.setItem('quizmind_classrooms', JSON.stringify(updated));
      setClassrooms(updated);
    }
  };

  const handleAssignQuiz = (classId: string, quizId: string) => {
    const updated = classrooms.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          assignedQuizIds: c.assignedQuizIds.includes(quizId) 
            ? c.assignedQuizIds 
            : [...c.assignedQuizIds, quizId]
        };
      }
      return c;
    });
    localStorage.setItem('quizmind_classrooms', JSON.stringify(updated));
    setClassrooms(updated);
    setShowAssignModal(null);
  };

  const filtered = classrooms.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">課室管理</h1>
          <p className="text-slate-500">組織你嘅學生並指派測驗。</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg transition-all"
        >
          <Plus size={20} />
          <span>建立新課室</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="搜尋課室..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 glass rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {classrooms.length === 0 ? (
        <div className="text-center py-24 glass rounded-[40px] border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={32} />
          </div>
          <p className="text-slate-500 font-medium">仲未有課室住。整返個先啦。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((cls) => (
            <div key={cls.id} className="glass p-6 rounded-[32px] hover:shadow-xl transition-all border border-slate-100 group relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                    {cls.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
                    <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                      邀請碼: {cls.code}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteClass(cls.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">學生人數</div>
                  <div className="text-2xl font-bold text-slate-800">{cls.students?.length || 0}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">已指派測驗</div>
                  <div className="text-2xl font-bold text-slate-800">{cls.assignedQuizIds?.length || 0}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAssignModal(cls.id)}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Layout size={16} />
                  指派測驗
                </button>
                <button className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                  管理課室
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass p-8 rounded-[32px] w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">新課室</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">課室名</label>
                <input 
                  type="text"
                  placeholder="例如：物理 101"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  autoFocus
                />
              </div>
              <button 
                onClick={handleCreate}
                disabled={!newClassName.trim()}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                建立課室
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Quiz Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass p-8 rounded-[32px] w-full max-w-2xl animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">指派測驗去 {classrooms.find(c => c.id === showAssignModal)?.name}</h2>
                <p className="text-slate-500 text-sm">喺測驗庫揀一個測驗指派俾呢個課室。</p>
              </div>
              <button onClick={() => setShowAssignModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {quizzes.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>測驗庫空空如也。請先製作一個測驗。</p>
                </div>
              ) : (
                quizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 group transition-all border border-transparent hover:border-indigo-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{quiz.title}</h4>
                        <p className="text-xs text-slate-400">{quiz.questions?.length} 條題目</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAssignQuiz(showAssignModal, quiz.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-700"
                    >
                      指派
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
