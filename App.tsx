
import React, { useState } from 'react';
import { analyzeLegalRequest } from './geminiService';
import { ChatMessage, MessageRole, DocumentSource, FileInfo, GeneratedDoc } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import DocumentViewer from './components/DocumentViewer';
import SourceControl from './components/SourceControl';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: MessageRole.ASSISTANT,
      content: 'Chào Mr V, Jr- Studio đã sẵn sàng. Hãy cung cấp nguồn tài liệu pháp lý và yêu cầu của Mr V để tôi bắt đầu phân tích thực tế.',
      timestamp: new Date()
    }
  ]);
  const [sources, setSources] = useState<DocumentSource[]>([]);
  const [currentDoc, setCurrentDoc] = useState<GeneratedDoc | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'sources'>('chat');

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleSendMessage = async (text: string, files: FileInfo[], rawFiles?: FileList | null) => {
    setIsLoading(true);
    setProcessingSteps(["Jr- Studio đang tiếp nhận yêu cầu...", "Đang đọc các file đính kèm..."]);
    
    const processedAttachments: FileInfo[] = [...files];
    if (rawFiles) {
      for (let i = 0; i < rawFiles.length; i++) {
        try {
          const content = await readFileAsText(rawFiles[i]);
          const match = processedAttachments.find(a => a.name === rawFiles[i].name);
          if (match) match.content = content;
        } catch (e) {
          console.warn("Lỗi đọc file:", rawFiles[i].name);
        }
      }
    }

    setProcessingSteps(prev => [...prev, "Đang đối chiếu với Nghị định 168 trong nguồn...", "Đang tìm kiếm mẫu biểu tại Thông tư 68..."]);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: text,
      timestamp: new Date(),
      attachments: processedAttachments
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      setProcessingSteps(prev => [...prev, "Đang tổng hợp dữ liệu hồ sơ cho Mr V..."]);
      const response = await analyzeLegalRequest(updatedMessages, sources);
      
      setProcessingSteps(prev => [...prev, "Đã hoàn tất phân tích."]);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.ASSISTANT,
        content: response || 'Lỗi xử lý hệ thống Jr- Studio.',
        timestamp: new Date(),
        processingSteps: [...processingSteps]
      };
      
      setMessages(prev => [...prev, assistantMsg]);

      if (response && (response.includes('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM') || response.includes('GIẤY ĐỀ NGHỊ'))) {
        setCurrentDoc({
          id: Date.now().toString(),
          title: 'Hồ sơ dự thảo',
          content: response,
          type: 'draft',
          status: 'draft'
        });
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: MessageRole.ASSISTANT,
        content: 'Hệ thống Jr- Studio gặp sự cố kết nối. Mr V vui lòng kiểm tra lại.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setProcessingSteps([]);
    }
  };

  const handleAddSource = async (newRawSources: FileList) => {
    setProcessingSteps(["Đang nạp nguồn pháp lý mới...", "Trích xuất dữ liệu văn bản..."]);
    const newProcessedSources: DocumentSource[] = [];
    
    for (let i = 0; i < newRawSources.length; i++) {
      const file = newRawSources[i];
      const content = await readFileAsText(file);
      const name = file.name.toLowerCase();
      let type: DocumentSource['type'] = 'template';
      if (name.includes('luật')) type = 'law';
      else if (name.includes('thông tư')) type = 'circular';
      else if (name.includes('nghị định')) type = 'decree';

      newProcessedSources.push({
        id: Date.now().toString() + i,
        name: file.name.replace(/\.[^/.]+$/, ""),
        type,
        fileName: file.name,
        content: content
      });
    }

    setSources(prev => [...prev, ...newProcessedSources]);
    setProcessingSteps(["Đã cập nhật nguồn pháp lý thành công."]);
    setTimeout(() => setProcessingSteps([]), 2000);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sourceCount={sources.length}
      />

      <main className="flex-1 flex overflow-hidden">
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
          {activeTab === 'chat' ? (
            <ChatWindow 
              messages={messages} 
              onSend={handleSendMessage} 
              isLoading={isLoading} 
              processingSteps={processingSteps}
            />
          ) : (
            <SourceControl 
              sources={sources} 
              onAddSourceDirect={handleAddSource} 
            />
          )}
        </div>

        <div className="w-1/2 overflow-y-auto bg-slate-200 p-8 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-eye text-indigo-500"></i> Xem trước hồ sơ
              </h2>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-semibold shadow-md"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-file-pdf"></i> Xuất hồ sơ PDF
                </button>
              </div>
            </div>
            
            <DocumentViewer document={currentDoc} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
