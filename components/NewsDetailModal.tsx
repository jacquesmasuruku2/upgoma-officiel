
import React from 'react';
import { X, Calendar, Tag, ChevronRight, User, Award } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  if (!news) return null;

  const renderEnrichedContent = (content: string) => {
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/### (.*?)\n/g, '<h3 class="text-xl md:text-2xl font-serif font-bold text-upgBlue dark:text-upgGold mt-8 mb-4 border-l-4 border-upgGold pl-4">$1</h3>')
      .replace(/<u>(.*?)<\/u>/g, '<u class="decoration-upgGold decoration-2 underline-offset-4">$1</u>');

    return (
      <div 
        className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-sans space-y-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-upgBlue/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 md:h-80 w-full overflow-hidden shrink-0">
          <img 
            src={news.image || 'https://picsum.photos/id/24/800/600'} 
            alt={news.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all z-10 shadow-lg"
          >
            <X size={24} />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-upgGold text-upgBlue px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                {news.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/90 text-xs font-bold uppercase tracking-widest">
                <Calendar size={14} className="text-upgGold" /> {news.date}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight drop-shadow-xl">
              {news.title}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-upgBlue/5 dark:bg-upgGold/10 flex items-center justify-center text-upgBlue dark:text-upgGold border border-upgGold/20">
              <Award size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Communiqué signé par</p>
              <h4 className="font-bold text-upgBlue dark:text-white uppercase tracking-tight">{news.author}</h4>
            </div>
          </div>

          {renderEnrichedContent(news.content)}
          
          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              <Tag size={14} className="text-upgGold" /> Document Officiel UPG
            </div>
            <button 
              onClick={onClose}
              className="bg-upgBlue dark:bg-upgGold text-white dark:text-upgBlue px-10 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl tracking-widest uppercase"
            >
              Terminer la lecture <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;
