
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wand2, 
  FileUp, 
  Type, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Plus,
  FileText,
  X,
  FileCode,
  Check
} from 'lucide-react';
import { generateQuizFromText, generateQuizFromMedia } from '../services/geminiService';
import { Question } from '../types';

export default function QuizGenerator() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Partial<Question>[]>([]);
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (activeTab === 'text' && !inputText.trim()) return;
    if (activeTab === 'file' && !selectedFile) return;

    setIsGenerating(true);
    setGeneratedQuestions([]);
    setIsSaved(false);
    try {
      let qs: Partial<Question>[] = [];
      
      if (activeTab === 'text') {
        qs = await generateQuizFromText(inputText, questionCount);
      } else if (selectedFile) {
        const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        
        if (supportedTypes.includes(selectedFile.type)) {
          const base64 = await fileToBase64(selectedFile);
          const base64Data = base64.split(',')[1];
          qs = await generateQuizFromMedia(base64Data, selectedFile.type, questionCount);
        } else {
          alert("唔支援呢種格式。請上載 PDF 或者圖片 (JPG/PNG)。");
          setIsGenerating(false);
          return;
        }
      }
      
      if (qs.length === 0) {
        alert("AI 冇辦法根據呢段內容生成題目。");
      } else {
        setGeneratedQuestions(qs);
        if (!quizTitle) setQuizTitle(`測驗 - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
      }
    } catch (err) {
      console.error(err);
      alert("生成失敗。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!quizTitle.trim()) {
      alert("請輸入測驗標題。");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newQuiz = {
        id: `q_${Date.now()}`,
        title: quizTitle,
        category: '一般',
        questions: generatedQuestions,
        createdAt: new Date().toISOString(),
        modified: '啱啱'
      };

      // Real Persistence to localStorage
      const existingQuizzes = JSON.parse(localStorage.getItem('quizmind_quizzes') || '[]');
      localStorage.setItem('quizmind_quizzes', JSON.stringify([newQuiz, ...existingQuizzes]));

      setIsSaving(false);
      setIsSaved(true);
      
      setTimeout(() => {
        navigate('/quizzes');
      }, 1000);
    } catch (e) {
      alert("儲存失敗。");
      setIsSaving(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFilePreview(url);
      } else {
        setFilePreview(null);
      }
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI 測驗生成器</h1>
        <p className="text-slate-500">將任何內容即時轉化成互動測驗。</p>
      </div>

      <div className="glass p-1 rounded-2xl flex">
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'text' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white'}`}
        >
          <Type size={18} />
          <span className="font-semibold">貼上文字</span>
        </button>
        <button 
          onClick={() => setActiveTab('file')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'file' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white'}`}
        >
          <FileUp size={18} />
          <span className="font-semibold">上載文件</span>
        </button>
      </div>

      <div className="glass p-6 rounded-3xl space-y-6">
        {activeTab === 'text' ? (
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="請貼上你嘅教學筆記、文章，或者任何教學相關嘅文字..."
            className="w-full h-48 p-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
          />
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 hover:bg-slate-50 transition-colors cursor-pointer group relative overflow-hidden"
          >
            {selectedFile ? (
              <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-200">
                {filePreview ? (
                  <img src={filePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl shadow-md mb-4" />
                ) : (
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${selectedFile.type === 'application/pdf' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {selectedFile.type === 'application/pdf' ? <FileCode size={32} /> : <FileText size={32} />}
                  </div>
                )}
                <p className="text-lg font-semibold text-slate-700 max-w-[300px] truncate">{selectedFile.name}</p>
                <button 
                  onClick={clearFile}
                  className="mt-4 flex items-center gap-2 text-sm text-red-500 font-medium hover:text-red-700"
                >
                  <X size={16} />
                  移除文件
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                  <FileUp size={32} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-700">將文件拖到呢度或者點擊上載</p>
                  <p className="text-sm text-slate-400">支援 PDF 同埋圖片 (JPG, PNG)</p>
                </div>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*,application/pdf"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-xl">
            {[3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${questionCount === num ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {num} 題
              </button>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (activeTab === 'text' ? !inputText : !selectedFile)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
            <span>{isGenerating ? '生成中...' : '即刻生成測驗'}</span>
          </button>
        </div>
      </div>

      {generatedQuestions.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass p-6 rounded-3xl">
            <div className="w-full flex-1">
              <label className="text-xs font-bold text-indigo-500 uppercase tracking-wider block mb-2">測驗標題</label>
              <input 
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="請輸入測驗名..."
                className="w-full bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none text-xl font-bold py-2 transition-all"
              />
            </div>
            <button 
              onClick={handleSaveAndPublish}
              disabled={isSaving || isSaved}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg min-w-[200px] justify-center ${isSaved ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : isSaved ? <Check size={20} /> : <Save size={20} />}
              <span>{isSaving ? '儲存中...' : isSaved ? '已儲存！' : '儲存並發佈'}</span>
            </button>
          </div>

          <div className="grid gap-6">
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="glass p-6 rounded-3xl border-l-4 border-indigo-500">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">{idx + 1}</span>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{q.type === 'mcq' ? '選擇題' : q.type === 'tf' ? '是非題' : '填空題'}</div>
                      <p className="text-lg font-medium text-slate-800">{q.text}</p>
                    </div>
                    {q.options && (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {q.options.map((opt, i) => (
                          <div key={i} className={`p-3 rounded-xl border ${opt === q.correctAnswer ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white border-slate-200'}`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
