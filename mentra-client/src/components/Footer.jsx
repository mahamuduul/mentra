import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { 
  FaBrain, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGlobe
} from 'react-icons/fa';

const Footer = () => {
  const { language, toggleLanguage } = useLanguage();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/about' },
      { name: 'Careers', path: '/contact' },
      { name: 'Contact', path: '/contact' },
    ],
    resources: [
      { name: 'Mental Health Tips', path: '/resources' },
      { name: 'Meditation Guides', path: '/resources' },
      { name: 'Sleep Resources', path: '/resources' },
      { name: 'Blog', path: '/resources' },
    ],
    support: [
      { name: 'Help Center', path: '/contact' },
      { name: 'Crisis Helpline', path: '/contact' },
      { name: 'Privacy Policy', path: '/about' },
      { name: 'Terms of Service', path: '/about' },
    ],
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaBrain className="text-3xl text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Mentra
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your digital companion for emotional well-being and mental health support.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" Icon={FaFacebook} label="Facebook" />
              <SocialLink href="#" Icon={FaTwitter} label="Twitter" />
              <SocialLink href="#" Icon={FaInstagram} label="Instagram" />
              <SocialLink href="#" Icon={FaLinkedin} label="LinkedIn" />
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Mentra. All rights reserved.
            </p>

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <FaGlobe className="text-lg" />
              <span className="text-sm font-medium">
                {language === 'en' ? 'English' : 'বাংলা'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, Icon, label }) => (
  <motion.a
    whileHover={{ scale: 1.2, y: -5 }}
    whileTap={{ scale: 0.9 }}
    href={href}
    aria-label={label}
    className="text-2xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
  >
    <Icon />
  </motion.a>
);

export default Footer;
