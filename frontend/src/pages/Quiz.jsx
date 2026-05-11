import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Loader2, Play, CheckCircle, XCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const Quiz = () => {
  const { t } = useTranslation();
  const [topic, setTopic] = useState('Phishing');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const topics = ['Phishing', 'SQL Injection', 'Cross-Site Scripting (XSS)', 'Network Security', 'Cryptography'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const handleGenerate = async () => {
    setIsLoading(true);
    setQuizData(null);
    setShowResults(false);
    setUserAnswers({});
    try {
      const res = await fetch('http://localhost:5000/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });
      const data = await res.json();
      setQuizData(data.quiz);
    } catch (error) {
      console.error('Failed to generate quiz', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex, option) => {
    if (showResults) return;
    setUserAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const calculateScore = () => {
    let score = 0;
    quizData.forEach((q, i) => {
      if (userAnswers[i] === q.answer) score++;
    });
    return score;
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t('quiz.title')}</h1>
        <p className="text-gray-400 mt-2">{t('quiz.subtitle')}</p>
      </header>

      <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-2">{t('quiz.topicLabel')}</label>
          <select 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-background border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 text-white transition-colors"
          >
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-2">{t('quiz.difficultyLabel')}</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-background border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 text-white transition-colors"
          >
            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-3 bg-primary text-background font-bold rounded-xl hover:bg-cyan-400 disabled:opacity-50 transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {t('quiz.generateBtn')}
          </button>
        </div>
      </div>

      {quizData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mt-8"
        >
          {quizData.map((q, idx) => (
            <div key={idx} className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold mb-4">{idx + 1}. {q.question}</h3>
              <div className="space-y-3">
                {q.options.map((option, oIdx) => {
                  const isSelected = userAnswers[idx] === option;
                  const isCorrect = option === q.answer;
                  let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-300 ";
                  
                  if (!showResults) {
                    btnClass += isSelected ? "bg-primary/20 border-primary shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]" : "bg-white/5 border-white/10 hover:bg-white/10";
                  } else {
                    if (isCorrect) {
                      btnClass += "bg-secondary/20 border-secondary text-secondary";
                    } else if (isSelected && !isCorrect) {
                      btnClass += "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                      btnClass += "bg-white/5 border-white/10 opacity-50";
                    }
                  }

                  return (
                    <button 
                      key={oIdx}
                      onClick={() => handleSelectAnswer(idx, option)}
                      className={btnClass}
                      disabled={showResults}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option}</span>
                        {showResults && isCorrect && <CheckCircle className="w-5 h-5 text-secondary" />}
                        {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {showResults && (
                <div className="mt-4 p-4 bg-card rounded-xl border border-white/10">
                  <p className="text-sm text-gray-300"><span className="font-bold text-primary">{t('quiz.explanation')}</span> {q.explanation}</p>
                </div>
              )}
            </div>
          ))}

          {!showResults ? (
            <div className="flex justify-end">
              <button 
                onClick={async () => {
                  setShowResults(true);
                  const score = calculateScore();
                  if (auth.currentUser && score > 0) {
                    try {
                      const userRef = doc(db, 'users', auth.currentUser.uid);
                      await updateDoc(userRef, {
                        quizzesPassed: increment(1),
                        activityScore: increment(score * 10)
                      });
                      await addDoc(collection(db, 'users', auth.currentUser.uid, 'activities'), {
                        title: `Completed ${topic} Quiz with score ${score}/${quizData.length}`,
                        timestamp: serverTimestamp()
                      });
                    } catch (err) {
                      console.error("Failed to update stats", err);
                    }
                  }
                }}
                disabled={Object.keys(userAnswers).length < quizData.length}
                className="px-8 py-3 bg-secondary text-background font-bold rounded-xl hover:bg-green-400 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.4)]"
              >
                {t('quiz.submitBtn')}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 rounded-2xl border border-secondary/50 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-secondary/10 pointer-events-none"></div>
              <h2 className="text-3xl font-bold mb-2 text-white">{t('quiz.completedTitle')}</h2>
              <p className="text-xl text-gray-300 mb-4">{t('quiz.scoreText')}</p>
              <div className="text-6xl font-extrabold text-secondary mb-6">{calculateScore()} / {quizData.length}</div>
              <button 
                onClick={handleGenerate}
                className="px-8 py-3 bg-primary text-background font-bold rounded-xl hover:bg-cyan-400 transition-colors"
              >
                {t('quiz.tryAnotherBtn')}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;
