
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, ShieldAlert, Image as ImageIcon, LogOut, Loader2, Mail, Lock, UserPlus, LogIn, Bold, Underline, Heading3, User, CheckCircle2 } from 'lucide-react';
import { NewsItem } from '../types';
import { supabase } from '../supabaseClient';

interface AdminPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (news: NewsItem) => void;
}

const AdminPublishModal: React.FC<AdminPublishModalProps> = ({ isOpen, onClose, onPublish }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    category: 'Actualité',
    author: '',
    content: '',
    title: '',
    image: '',
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
  });

  const ADMIN_EMAIL = 'jacquesmasuruku2@gmail.com';

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && session.user.email === ADMIN_EMAIL) {
        setUser(session.user);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (session?.user && session.user.email === ADMIN_EMAIL) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const applyFormat = (type: 'bold' | 'underline' | 'subtitle') => {
    if (!contentRef.current) return;
    const start = contentRef.current.selectionStart;
    const end = contentRef.current.selectionEnd;
    const text = formData.content || '';
    const selected = text.substring(start, end);
    
    let formatted = "";
    switch(type) {
      case 'bold': formatted = `**${selected}**`; break;
      case 'underline': formatted = `<u>${selected}</u>`; break;
      case 'subtitle': formatted = `\n### ${selected}\n`; break;
    }
    
    const newText = text.substring(0, start) + formatted + text.substring(end);
    setFormData({ ...formData, content: newText });
    
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.setSelectionRange(start + formatted.length, start + formatted.length);
      }
    }, 10);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    try {
      if (email !== ADMIN_EMAIL) throw new Error("Accès refusé : Identifiants non autorisés.");
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newNews: NewsItem = {
        id: Date.now().toString(),
        title: formData.title || '',
        content: formData.content || '',
        author: formData.author || 'Direction UPG',
        date: formData.date || '',
        category: formData.category as any,
        image: formData.image || 'https://picsum.photos/id/24/800/600'
      };
      await onPublish(newNews);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setShowSuccess(false);
    setFormData({
      category: 'Actualité',
      author: '',
      content: '',
      title: '',
      image: '',
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-upgBlue/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="bg-upgBlue p-6 text-white flex justify-between items-center border-b border-white/10">
          <h3 className="font-bold flex items-center gap-3 tracking-tight">
            <ShieldAlert size={22} className="text-upgGold" />
            Portail Administration UPG
          </h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform p-1 rounded-full hover:bg-white/10">
            <X size={24} />
          </button>
        </div>

        {showSuccess ? (
          <div className="p-12 text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-xl">
              <CheckCircle2 size={56} className="text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-3xl font-serif font-bold text-upgBlue dark:text-white uppercase tracking-tighter">Publication Terminée</h4>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
              Le communiqué est désormais en ligne et accessible à l'ensemble de la communauté universitaire.
            </p>
            <button 
              onClick={resetAndClose}
              className="w-full bg-upgBlue text-white py-5 rounded-2xl font-bold shadow-2xl hover:bg-upgBlue/90 hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-[0.2em] uppercase"
            >
              Fermer le portail
            </button>
          </div>
        ) : !user ? (
          <form onSubmit={handleAuth} className="p-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="bg-upgBlue/5 dark:bg-upgGold/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-upgGold/20">
                <Lock size={32} className="text-upgBlue dark:text-upgGold" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-upgBlue dark:text-white uppercase tracking-tighter">Accès Restreint</h4>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-[0.2em]">Identification requise</p>
            </div>

            {authError && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 text-xs text-red-700 dark:text-red-400 font-bold animate-in shake">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Email administrateur" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-upgGold dark:text-white text-sm border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="Mot de passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-upgGold dark:text-white text-sm border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-upgBlue text-white py-5 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 hover:bg-upgBlue/90 transition-all text-sm tracking-widest uppercase disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn size={20}/> Valider l'accès</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-upgBlue dark:text-upgGold uppercase tracking-widest flex items-center gap-2">Catégorie</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 dark:text-white text-sm font-bold"
                >
                  <option>Actualité</option>
                  <option>Événement</option>
                  <option>Annonce</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-upgBlue dark:text-upgGold uppercase tracking-widest">Signé par (Auteur)</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    placeholder="Ex: Secrétariat Académique" 
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 dark:text-white text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-upgBlue dark:text-upgGold uppercase tracking-widest">Titre du Communiqué</label>
              <input 
                placeholder="Indiquez l'objet de la publication" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 dark:text-white text-sm font-serif font-bold text-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-upgBlue dark:text-upgGold uppercase tracking-widest">Contenu du message</label>
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <button type="button" onClick={() => applyFormat('bold')} className="p-2 bg-white dark:bg-slate-700 rounded shadow-sm hover:text-upgGold transition-colors" title="Gras"><Bold size={16} /></button>
                  <button type="button" onClick={() => applyFormat('underline')} className="p-2 bg-white dark:bg-slate-700 rounded shadow-sm hover:text-upgGold transition-colors" title="Souligné"><Underline size={16} /></button>
                  <button type="button" onClick={() => applyFormat('subtitle')} className="p-2 bg-white dark:bg-slate-700 rounded shadow-sm hover:text-upgGold transition-colors" title="Sous-titre (H3)"><Heading3 size={16} /></button>
                </div>
              </div>
              <textarea 
                ref={contentRef}
                placeholder="Rédigez votre texte ici. Utilisez la barre d'outils pour formater le texte sélectionné..." 
                rows={8}
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 dark:text-white text-sm resize-none leading-relaxed font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-upgBlue dark:text-upgGold uppercase tracking-widest">URL de l'Illustration (Optionnel)</label>
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <ImageIcon size={20} className="text-slate-400" />
                <input 
                  placeholder="Lien de l'image (Ex: https://...)" 
                  className="flex-1 bg-transparent outline-none text-xs dark:text-white"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-upgBlue text-white py-5 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-3 hover:bg-upgBlue/90 hover:scale-[1.01] active:scale-95 transition-all text-sm tracking-widest uppercase disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={22} /> PUBLIER SUR LE SITE</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPublishModal;
