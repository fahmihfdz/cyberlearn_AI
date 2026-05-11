import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Chrome, Loader2, ArrowLeft } from 'lucide-react';
import { auth, googleProvider, db } from '../firebase';
import logoNoBg from '../assets/logo-no-bg.png';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const Auth = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          quizzesPassed: 0,
          topicsLearned: 0,
          activityScore: 0,
          createdAt: new Date().toISOString()
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Simplify Firebase error messages
      const errorMsg = err.code ? err.code.replace('auth/', '').replace(/-/g, ' ') : t('auth.authFailed');
      setError(errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          quizzesPassed: 0,
          topicsLearned: 0,
          activityScore: 0,
          createdAt: new Date().toISOString()
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(t('auth.googleFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Back to Home CTA */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors group"
      >
        <div className="p-2 rounded-full glass border border-white/10 group-hover:border-primary/50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-medium hidden sm:block">{t('auth.backToHome')}</span>
      </Link>

      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-2xl border border-white/10 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] mb-4">
            <img src={logoNoBg} alt="CyberLearn Logo" className="w-14 h-14 object-contain" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {isLogin ? t('auth.welcomeBack') : t('auth.join')}
          </h2>
          <p className="text-gray-400 mt-2 text-sm text-center">
            {isLogin ? t('auth.loginDesc') : t('auth.signupDesc')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t('auth.emailLabel')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 text-white transition-colors"
                placeholder="hacker@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t('auth.passwordLabel')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 text-white transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-primary text-background font-bold rounded-xl hover:bg-cyan-400 disabled:opacity-50 transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5 mr-2" />}
            {isLogin ? t('auth.login') : t('auth.createAccount')}
          </button>
        </form>

        <div className="my-6 flex items-center before:flex-1 before:border-t before:border-white/10 after:flex-1 after:border-t after:border-white/10">
          <span className="px-4 text-sm text-gray-500 uppercase tracking-widest">{t('auth.or')}</span>
        </div>

        <button 
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center"
        >
          <Chrome className="w-5 h-5 mr-2" />
          {t('auth.continueWithGoogle')}
        </button>

        <div className="mt-8 text-center text-sm text-gray-400">
          {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-cyan-300 transition-colors font-medium underline underline-offset-4"
          >
            {isLogin ? t('auth.signUpHere') : t('auth.logInHere')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
