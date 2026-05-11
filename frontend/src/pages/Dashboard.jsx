import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BookOpen, CheckCircle, Activity, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setStats(docSnap.data());
          }
        } catch (err) {
          console.error("Error fetching stats:", err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      return;
    }
    const q = query(
      collection(db, 'users', user.uid, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const acts = [];
      snapshot.forEach(doc => acts.push({ id: doc.id, ...doc.data() }));
      setActivities(acts);
    });
    return () => unsub();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t('dashboard.welcome')}{user?.email?.split('@')[0] || t('dashboard.hacker')}</h1>
        <p className="text-gray-400 mt-2">{t('dashboard.subtitle')}</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: t('dashboard.topicsLearned'), value: stats?.topicsLearned || 0, icon: BookOpen, color: 'text-primary' },
          { title: t('dashboard.quizzesPassed'), value: stats?.quizzesPassed || 0, icon: CheckCircle, color: 'text-secondary' },
          { title: t('dashboard.threatsAnalyzed'), value: 0, icon: ShieldAlert, color: 'text-purple-400' },
          { title: t('dashboard.activityScore'), value: stats?.activityScore || 0, icon: Activity, color: 'text-yellow-400' },
        ].map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass p-6 rounded-2xl border border-white/5 mt-8">
        <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">{t('dashboard.recentActivity')}</h2>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-gray-400 italic text-sm">{t('dashboard.emptyActivity')}</div>
          ) : (
            activities.map(act => (
              <div key={act.id} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-primary mr-4 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{act.title}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
