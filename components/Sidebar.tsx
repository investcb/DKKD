
import React from 'react';

interface SidebarProps {
  activeTab: 'chat' | 'sources';
  setActiveTab: (tab: 'chat' | 'sources') => void;
  sourceCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, sourceCount }) => {
  return (
    <aside className="w-16 md:w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i className="fas fa-microchip"></i>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight">Jr- Studio</span>
      </div>

      <nav className="flex-1 mt-6 px-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
            activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <i className="fas fa-comment-dots text-xl md:text-base"></i>
          <span className="hidden md:block font-medium">Tư vấn của AI</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-2 transition ${
            activeTab === 'sources' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-university text-xl md:text-base"></i>
            <span className="hidden md:block font-medium">Nguồn Pháp Lý</span>
          </div>
          <span className="hidden md:inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-800 rounded-full">
            {sourceCount}
          </span>
        </button>

        <div className="hidden md:block mt-8 px-4 mb-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hồ sơ gần đây</h3>
          <ul className="mt-4 space-y-2">
            <li className="text-sm text-slate-400 hover:text-white cursor-pointer transition flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              Hồ sơ thành lập - Mr V
            </li>
            <li className="text-sm text-slate-400 hover:text-white cursor-pointer transition flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
              Thay đổi địa chỉ...
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center overflow-hidden border-2 border-slate-700">
            <span className="font-bold text-white">V</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold">Mr V</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
