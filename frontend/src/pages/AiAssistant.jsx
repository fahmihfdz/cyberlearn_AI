import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const AiAssistant = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('aiAssistant.defaultGreeting') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(collection(db, 'users', auth.currentUser.uid, 'chats'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => doc.data());
      if (fetchedMessages.length > 0) {
        setMessages(fetchedMessages);
      }
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleSend = async () => {
    if (!input.trim() || !auth.currentUser) return;
    
    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Save user message to Firestore
    try {
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'chats'), {
        role: 'user',
        content: userMessage,
        createdAt: serverTimestamp()
      });

      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      
      if (!res.ok || !data.text) {
        throw new Error("Backend failed to return a valid response.");
      }
      
      // Save assistant message to Firestore
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'chats'), {
        role: 'assistant',
        content: data.text,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: t('aiAssistant.fetchError') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-100px)] flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{t('aiAssistant.title')}</h1>
        <p className="text-gray-400 mt-2">{t('aiAssistant.subtitle')}</p>
      </header>

      <div className="flex-1 glass rounded-2xl border border-white/5 flex flex-col overflow-hidden relative shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex space-x-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'bg-secondary/10 border border-secondary/20' : 'bg-white/5 border border-white/10'}`}>
                <div className="prose prose-invert max-w-none">
                  {msg.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.startsWith('#') ? <h3 className="text-lg font-bold text-primary mt-2 mb-1">{line.replace(/#/g, '').trim()}</h3> :
                       line.startsWith('-') ? <li className="ml-4">{line.replace('-', '').trim()}</li> :
                       line.startsWith('*') ? <li className="ml-4">{line.replace(/\*/g, '').trim()}</li> :
                       <p className="mb-2">{line}</p>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/20 text-primary border border-primary/30">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center h-[56px]">
                <span className="flex space-x-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-card/80 backdrop-blur-sm">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('aiAssistant.placeholder')} 
              className="w-full bg-background border border-white/10 rounded-xl py-4 pl-4 pr-16 focus:outline-none focus:border-primary/50 transition-colors shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2.5 bg-primary text-background rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
