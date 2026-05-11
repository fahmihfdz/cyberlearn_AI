import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Lock, Code, ShieldCheck, Target, Users, Sparkles, BookOpen, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import logoNoBg from '../assets/logo-no-bg.png';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
const LandingPage = () => {
  const { t } = useTranslation();
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Navbar */}
      <nav className="glass px-6 md:px-8 py-4 flex justify-between items-center fixed w-full z-50">
        <div className="flex items-center space-x-3">
          <img src={logoNoBg} alt="CyberLearn Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">CyberLearn</span>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <Link to="/auth" className="px-5 py-2 md:px-6 md:py-2 bg-primary/20 text-primary border border-primary/50 rounded-lg hover:bg-primary hover:text-background transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] font-medium text-sm md:text-base">
            {t('landing.signIn')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/20 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-secondary animate-ping"></span>
          <span className="text-xs md:text-sm text-primary font-medium">{t('landing.badge')}</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 md:mb-8"
        >
          {t('landing.heroTitle1')} <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{t('landing.heroTitle2')}</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mb-10"
        >
          {t('landing.heroDesc')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link to="/auth" className="px-8 py-4 bg-primary text-background font-bold rounded-lg hover:bg-cyan-400 transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)] w-full sm:w-auto">
            {t('landing.startLearning')} <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/auth" className="px-8 py-4 glass border border-white/10 font-bold rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center justify-center w-full sm:w-auto">
            {t('landing.tryAssistant')}
          </Link>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="py-10 border-y border-white/5 bg-white/[0.02] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <motion.div {...fadeIn}>
            <h4 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t('landing.stats.247')}</h4>
            <p className="text-gray-400 text-sm">{t('landing.stats.aiMentorship')}</p>
          </motion.div>
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <h4 className="text-3xl md:text-4xl font-bold text-secondary mb-2">{t('landing.stats.custom')}</h4>
            <p className="text-gray-400 text-sm">{t('landing.stats.learningPaths')}</p>
          </motion.div>
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <h4 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{t('landing.stats.interactive')}</h4>
            <p className="text-gray-400 text-sm">{t('landing.stats.interactiveDesc')}</p>
          </motion.div>
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <h4 className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{t('landing.stats.free')}</h4>
            <p className="text-gray-400 text-sm">{t('landing.stats.toGetStarted')}</p>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-6 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.coreFeatures')}<span className="text-primary">{t('landing.coreFeaturesHighlight')}</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('landing.coreFeaturesDesc')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: Zap, title: t('landing.features.chat.title'), desc: t('landing.features.chat.desc'), color: 'text-primary' },
            { icon: Target, title: t('landing.features.roadmap.title'), desc: t('landing.features.roadmap.desc'), color: 'text-secondary' },
            { icon: BrainCircuit, title: t('landing.features.quiz.title'), desc: t('landing.features.quiz.desc'), color: 'text-blue-400' },
            { icon: BookOpen, title: t('landing.features.pdf.title'), desc: t('landing.features.pdf.desc'), color: 'text-purple-400' },
            { icon: ShieldCheck, title: t('landing.features.scenarios.title'), desc: t('landing.features.scenarios.desc'), color: 'text-green-400' },
            { icon: Sparkles, title: t('landing.features.updated.title'), desc: t('landing.features.updated.desc'), color: 'text-yellow-400' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-6 md:p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-white/10 transition-colors">
                <feature.icon className={`w-6 h-6 md:w-7 md:h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-black/40 relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.howItWorks')} <span className="text-secondary">{t('landing.howItWorksHighlight')}</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('landing.howItWorksDesc')}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>

            {[
              { step: '01', title: t('landing.steps.1.title'), desc: t('landing.steps.1.desc') },
              { step: '02', title: t('landing.steps.2.title'), desc: t('landing.steps.2.desc') },
              { step: '03', title: t('landing.steps.3.title'), desc: t('landing.steps.3.desc') },
              { step: '04', title: t('landing.steps.4.title'), desc: t('landing.steps.4.desc') }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/50 flex items-center justify-center text-xl font-bold text-primary mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-16 border border-primary/30 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('landing.ctaTitle')}</h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            {t('landing.ctaDesc')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/auth" className="px-8 py-4 bg-primary text-background font-bold rounded-xl hover:bg-cyan-400 transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)] w-full sm:w-auto text-lg">
              {t('landing.getStarted')} <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-primary mr-2" /> {t('landing.noCreditCard')}</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-primary mr-2" /> {t('landing.instantAccess')}</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm relative z-10">
        <p>{t('landing.footer', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
