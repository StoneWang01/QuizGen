
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import QuizGenerator from './pages/QuizGenerator';
import QuizList from './pages/QuizList';
import Classrooms from './pages/Classrooms';
import Analytics from './pages/Analytics';
import LiveQuiz from './pages/LiveQuiz';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: '儀表板', path: '/' },
    { icon: PlusCircle, label: '製作測驗', path: '/generate' },
    { icon: BookOpen, label: '我嘅測驗', path: '/quizzes' },
    { icon: Users, label: '課室管理', path: '/classrooms' },
    { icon: BarChart3, label: '數據分析', path: '/analytics' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggle}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Sparkles size={24} />
            </div>
            <span className="text-xl font-bold text-indigo-950">QuizMind AI</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggle()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${location.pathname === item.path 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-slate-600 hover:bg-white hover:text-indigo-600'}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200/50">
            <div className="p-4 glass rounded-2xl mb-4">
              <div className="text-xs font-semibold text-indigo-600 uppercase mb-1">高級版計劃</div>
              <p className="text-sm text-slate-500 mb-3">獲取無限次 AI 測驗生成同埋 OCR 功能。</p>
              <button className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors">
                即刻升級
              </button>
            </div>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:text-red-600 transition-colors">
              <LogOut size={20} />
              <span className="font-medium">登出系統</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto relative">
          {/* Header Mobile */}
          <header className="lg:hidden flex items-center justify-between p-4 bg-white/50 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-600" />
              <span className="font-bold">QuizMind AI</span>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
              <Menu size={24} />
            </button>
          </header>

          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/generate" element={<QuizGenerator />} />
              <Route path="/quizzes" element={<QuizList />} />
              <Route path="/classrooms" element={<Classrooms />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/live/:id" element={<LiveQuiz />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
