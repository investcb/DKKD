
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FileInfo, MessageRole } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (text: string, files: FileInfo[], rawFiles?: FileList | null) => void;
  isLoading: boolean;
  processingSteps: string[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, isLoading, processingSteps }) => {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<FileInfo[]>([]);
  const [currentRawFiles, setCurrentRawFiles] = useState<FileList | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, processingSteps]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachedFiles.length > 0) && !isLoading) {
      onSend(input, attachedFiles, currentRawFiles);
      setInput('');
      setAttachedFiles([]);
      setCurrentRawFiles(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setCurrentRawFiles(files);
      const newFiles: FileInfo[] = Array.from(files).map((f: File) => ({
        name: f.name,
        size: f.size,
        type: f.type
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Jr- Studio AI</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Trợ lý riêng của Mr V</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-indigo-500 animate-pulse' : 'bg-green-500'}`}></span>
            <span className="text-[10px] text-slate-600 font-bold uppercase">
              {isLoading ? 'Đang đọc nguồn...' : 'Sẵn sàng'}
            </span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl p-4 shadow-sm border ${
              msg.role === MessageRole.USER 
                ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-none' 
                : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
              
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {msg.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 bg-black/10 px-2 py-1 rounded text-[10px] font-bold">
                      <i className="fas fa-file-invoice"></i>
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 flex gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
            {/* Real-time processing log for Mr V */}
            {processingSteps.length > 0 && (
              <div className="ml-2 pl-4 border-l-2 border-indigo-100 flex flex-col gap-1">
                {processingSteps.map((step, idx) => (
                  <div key={idx} className="text-[10px] text-slate-400 flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <i className={`fas ${idx === processingSteps.length - 1 ? 'fa-sync-alt animate-spin' : 'fa-check text-green-500'}`}></i>
                    <span className={idx === processingSteps.length - 1 ? 'text-indigo-500 font-semibold' : ''}>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2">
              {attachedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold border border-indigo-100">
                  <i className="fas fa-paperclip"></i>
                  <span className="max-w-[120px] truncate">{f.name}</span>
                  <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-end gap-2">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-slate-400 hover:text-indigo-600 transition flex-shrink-0 bg-slate-50 rounded-xl"
              title="Gửi hồ sơ cá nhân cho Jr- Studio"
            >
              <i className="fas fa-cloud-upload-alt text-xl"></i>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple className="hidden" />
            
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition shadow-inner">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mr V cần lập hồ sơ gì hôm nay? Ví dụ: lập địa điểm kinh doanh..."
                className="w-full px-4 py-3 bg-transparent outline-none resize-none max-h-32 min-h-[48px] text-sm"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            <button 
              type="submit"
              disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
              className={`p-3 rounded-xl transition flex-shrink-0 shadow-lg ${
                (!input.trim() && attachedFiles.length === 0) || isLoading
                  ? 'bg-slate-200 text-slate-400' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <i className="fas fa-paper-plane text-lg"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
