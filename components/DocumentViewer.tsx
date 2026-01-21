
import React from 'react';
import { GeneratedDoc } from '../types';

interface DocumentViewerProps {
  document: GeneratedDoc | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  if (!document) {
    return (
      <div className="document-paper flex flex-col items-center justify-center text-slate-300">
        <i className="fas fa-file-invoice text-6xl mb-4"></i>
        <p className="text-lg font-medium">Chưa có tài liệu được soạn thảo</p>
        <p className="text-sm">Hãy yêu cầu AI hỗ trợ ở cửa sổ tư vấn</p>
      </div>
    );
  }

  // Simple Markdown-ish processing for the preview
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-center uppercase mb-6">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>;
      if (line.includes('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM')) return <div key={i} className="text-center font-bold mb-1">{line}</div>;
      if (line.includes('Độc lập - Tự do - Hạnh phúc')) return <div key={i} className="text-center font-bold mb-4 border-b border-black w-1/2 mx-auto pb-1">{line}</div>;
      return <p key={i} className="text-sm leading-6 mb-2">{line}</p>;
    });
  };

  return (
    <div className="document-paper animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="prose prose-sm max-w-none text-slate-900">
        {formatContent(document.content)}
      </div>
      
      <div className="mt-12 flex justify-end gap-12 text-sm italic">
        <div className="text-center">
          <p className="font-bold">ĐẠI DIỆN PHÁP LUẬT</p>
          <p className="text-xs text-slate-400 mt-1">(Ký và ghi rõ họ tên)</p>
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
