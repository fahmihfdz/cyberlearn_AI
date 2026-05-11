import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Loader2, Play } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const Roadmap = () => {
  const { t } = useTranslation();
  const [career, setCareer] = useState('Penetration Tester');
  const [level, setLevel] = useState('Beginner');
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const careers = ['Penetration Tester', 'Security Analyst', 'Cloud Security Engineer', 'Malware Analyst'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleGenerate = async () => {
    setIsLoading(true);
    setRoadmap(null);
    try {
      const res = await fetch('http://localhost:5000/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career, level })
      });
      const data = await res.json();
      setRoadmap(data.text);
      
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, {
            topicsLearned: increment(1),
            activityScore: increment(20)
          });
          await addDoc(collection(db, 'users', auth.currentUser.uid, 'activities'), {
            title: `Generated Learning Roadmap for ${career}`,
            timestamp: serverTimestamp()
          });
        } catch (err) {
          console.error("Failed to update stats", err);
        }
      }
    } catch (error) {
      setRoadmap(t('roadmap.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t('roadmap.title')}</h1>
        <p className="text-gray-400 mt-2">{t('roadmap.subtitle')}</p>
      </header>

      <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-2">{t('roadmap.careerLabel')}</label>
          <select 
            value={career} 
            onChange={(e) => setCareer(e.target.value)}
            className="w-full bg-background border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 text-white transition-colors"
          >
            {careers.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-2">{t('roadmap.levelLabel')}</label>
          <select 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-background border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 text-white transition-colors"
          >
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-3 bg-primary text-background font-bold rounded-xl hover:bg-cyan-400 disabled:opacity-50 transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {t('roadmap.generateBtn')}
          </button>
        </div>
      </div>

      {roadmap && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl border border-primary/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
          <h2 className="text-2xl font-bold mb-6 text-primary flex items-center"><Map className="mr-3" /> {t('roadmap.learningPath')}</h2>
          <div className="prose prose-invert max-w-none">
             {roadmap.split('\n').map((line, i) => (
               <React.Fragment key={i}>
                 {line.startsWith('###') ? <h4 className="text-lg font-bold text-white mt-4 mb-2">{line.replace(/###/g, '').trim()}</h4> :
                  line.startsWith('##') ? <h3 className="text-xl font-bold text-primary mt-6 mb-3">{line.replace(/##/g, '').trim()}</h3> :
                  line.startsWith('#') ? <h2 className="text-2xl font-bold text-white mt-6 mb-4">{line.replace(/#/g, '').trim()}</h2> :
                  line.startsWith('-') ? <li className="ml-4 text-gray-300 mb-1">{line.replace('-', '').trim()}</li> :
                  line.startsWith('*') ? <li className="ml-4 text-gray-300 mb-1">{line.replace(/\*/g, '').trim()}</li> :
                  line.trim() !== '' ? <p className="mb-2 text-gray-300">{line}</p> : null}
               </React.Fragment>
             ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Roadmap;
