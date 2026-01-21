
import React, { useRef } from 'react';
import { DocumentSource } from '../types';

interface SourceControlProps {
  sources: DocumentSource[];
  onAddSourceDirect: (files: FileList) => void;
}

const SourceControl: React.FC<SourceControlProps> = ({ sources, onAddSourceDirect }) => {
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddSourceDirect(files);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Nguồn Pháp Lý Của Mr V</h2>
          <p className="text-xs text-slate-500 font-medium">Jr- Studio chỉ tra cứu trong các văn bản này</p>
        </div>
        <button 
          onClick={() => folderInputRef.current?.click()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
        >
          <i className="fas fa-folder-plus"></i> Nạp Thư Mục Nguồn
        </button>
        <input
          type="file"
          ref={folderInputRef}
          className="hidden"
          multiple
          // @ts-ignore
          webkitdirectory="true"
          directory=""
          onChange={handleFolderUpload}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm border border-slate-100">
              <i className="fas fa-balance-scale-left text-indigo-300"></i>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-600">Hệ thống Jr- Studio chưa có dữ liệu</p>
              <p className="text-sm max-w-xs mx-auto mt-2">Mr V vui lòng tải lên thư mục chứa Luật DN, Nghị định 168 và Thông tư 68 để tôi làm việc.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {sources.map(source => (
              <div key={source.id} className="p-4 border border-slate-200 rounded-xl bg-white hover:border-indigo-300 transition group shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-inner ${
                      source.type === 'law' ? 'bg-red-500' : 
                      source.type === 'circular' ? 'bg-amber-500' : 
                      source.type === 'decree' ? 'bg-indigo-500' : 'bg-slate-400'
                    }`}>
                      <i className={`fas fa-2x ${
                        source.type === 'law' ? 'fa-gavel' : 
                        source.type === 'circular' ? 'fa-file-signature' : 
                        source.type === 'decree' ? 'fa-landmark' : 'fa-file-contract'
                      }`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{source.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold uppercase tracking-wider">
                          {source.type}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {source.content.length > 1000 ? `${(source.content.length / 1024).toFixed(1)} KB` : 'Đã đọc'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-500 font-bold opacity-0 group-hover:opacity-100 transition">
                      <i className="fas fa-check-circle mr-1"></i> ĐÃ NẠP
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 bg-amber-50 border-t border-amber-100 m-4 rounded-2xl shadow-sm border">
        <h5 className="text-amber-800 font-bold text-xs mb-2 flex items-center gap-2 uppercase tracking-tight">
          <i className="fas fa-exclamation-triangle"></i> Lưu ý cho Mr V
        </h5>
        <ul className="text-[11px] text-amber-700 space-y-1 list-disc list-inside leading-relaxed">
          <li>Jr- Studio chỉ trích xuất thông tin từ các file trên.</li>
          <li>Đảm bảo các file Thông tư 68 chứa đầy đủ các Phụ lục mẫu biểu (.doc/.txt).</li>
          <li>Hệ thống <strong>không dùng internet</strong> để đảm bảo bảo mật và chính xác theo nguồn Mr V cung cấp.</li>
        </ul>
      </div>
    </div>
  );
};

export default SourceControl;
