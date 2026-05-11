import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, UploadCloud, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const Summarizer = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setText(''); // Kosongkan teks jika file dipilih
    }
  };

  const handleSummarize = async () => {
    if (!text.trim() && !file) return;
    setIsLoading(true);
    setSummary(null);
    
    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        res = await fetch('http://localhost:5000/api/summarize-file', {
          method: 'POST',
          body: formData
        });
      } else {
        const prompt = `Summarize this cybersecurity learning material. Requirements: Extract key concepts, Use beginner-friendly explanations. Create: short summary, important points, key terms, practical takeaways. Keep the output concise and easy to scan. Material: \n\n${text}`;
        res = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt })
        });
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate summary");
      
      setSummary(data.text);
      
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, {
            topicsLearned: increment(1),
            activityScore: increment(10)
          });
          await addDoc(collection(db, 'users', auth.currentUser.uid, 'activities'), {
            title: `Summarized a cybersecurity document`,
            timestamp: serverTimestamp()
          });
        } catch (err) {
          console.error("Failed to update stats", err);
        }
      }
    } catch (error) {
      setSummary(t('summarizer.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t('summarizer.title')}</h1>
        <p className="text-gray-400 mt-2">{t('summarizer.subtitle')}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center"><FileText className="mr-2 text-primary" /> {t('summarizer.inputMaterial')}</h2>
          </div>
          
          <div className="flex-1 bg-background rounded-xl border border-white/10 p-1 relative group mb-4 flex flex-col">
            <textarea 
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (e.target.value) setFile(null); // Kosongkan file jika mengetik teks
              }}
              placeholder={file ? `${t('summarizer.fileSelected')} ${file.name}` : t('summarizer.placeholderText')}
              disabled={file !== null}
              className={`w-full h-64 bg-transparent resize-none p-4 focus:outline-none text-gray-300 ${file ? 'opacity-50 cursor-not-allowed' : ''}`}
            ></textarea>
            
            <div className="p-4 border-t border-white/10 mt-auto">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('summarizer.uploadLabel')}</label>
              <input 
                type="file" 
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
              />
              {file && (
                <button 
                  onClick={() => setFile(null)} 
                  className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
                >
                  {t('summarizer.removeFile')}
                </button>
              )}
            </div>
          </div>

          <button 
            onClick={handleSummarize}
            disabled={isLoading || (!text.trim() && !file)}
            className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-cyan-400 disabled:opacity-50 transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <UploadCloud className="w-6 h-6 mr-2" />}
            {t('summarizer.generateBtn')}
          </button>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col relative overflow-hidden">
          <h2 className="text-xl font-bold mb-4 flex items-center"><FileText className="mr-2 text-secondary" /> {t('summarizer.aiSummary')}</h2>
          
          <div className="flex-1 bg-card/50 rounded-xl border border-white/5 p-6 overflow-y-auto min-h-[400px]">
            {!summary && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>{t('summarizer.emptyState')}</p>
              </div>
            )}
            
            {isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-primary">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="animate-pulse">{t('summarizer.analyzing')}</p>
              </div>
            )}

            {summary && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-invert max-w-none"
              >
                {summary.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line.startsWith('###') ? <h4 className="text-lg font-bold text-white mt-4 mb-2">{line.replace(/###/g, '').trim()}</h4> :
                     line.startsWith('##') ? <h3 className="text-xl font-bold text-primary mt-6 mb-3">{line.replace(/##/g, '').trim()}</h3> :
                     line.startsWith('#') ? <h2 className="text-2xl font-bold text-secondary mt-4 mb-4 border-b border-white/10 pb-2">{line.replace(/#/g, '').trim()}</h2> :
                     line.startsWith('-') ? <li className="ml-4 text-gray-300 mb-1">{line.replace('-', '').trim()}</li> :
                     line.startsWith('*') ? <li className="ml-4 text-gray-300 mb-1">{line.replace(/\*/g, '').trim()}</li> :
                     line.trim() !== '' ? <p className="mb-3 text-gray-300">{line}</p> : null}
                  </React.Fragment>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
