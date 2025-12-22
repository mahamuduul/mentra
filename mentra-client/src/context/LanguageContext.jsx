import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'bn' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key) => {
    const translations = {
      en: {
        home: 'Home',
        services: 'Services',
        resources: 'Resources',
        about: 'About',
        contact: 'Contact',
        login: 'Log In',
        getStarted: 'Get Started',
        hero_title: 'Take Care of Your Mind, Anytime.',
        hero_desc: 'Your digital companion for emotional well-being and calm.',
        quick_assessment: 'Take a Quick Assessment',
        chat_feeltalk: 'Chat with FeelTalk',
        breathe_in: 'Breathe In',
        breathe_out: 'Breathe Out',
        crisis_text: 'Need help? You\'re not alone',
        crisis_button: 'Get Help Now',
      },
      bn: {
        home: 'হোম',
        services: 'সেবা',
        resources: 'রিসোর্স',
        about: 'সম্পর্কে',
        contact: 'যোগাযোগ',
        login: 'লগ ইন',
        getStarted: 'শুরু করুন',
        hero_title: 'আপনার মনের যত্ন নিন, যেকোনো সময়।',
        hero_desc: 'আপনার মানসিক সুস্থতা এবং শান্তির জন্য ডিজিটাল সঙ্গী।',
        quick_assessment: 'দ্রুত মূল্যায়ন করুন',
        chat_feeltalk: 'FeelTalk এর সাথে চ্যাট করুন',
        breathe_in: 'শ্বাস নিন',
        breathe_out: 'শ্বাস ছাড়ুন',
        crisis_text: 'সাহায্য দরকার? আপনি একা নন',
        crisis_button: 'এখনই সাহায্য পান',
      },
    };

    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
