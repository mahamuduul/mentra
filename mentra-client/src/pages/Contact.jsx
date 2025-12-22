import { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactMethods = [
    { icon: '📧', title: 'Email', value: 'support@mentra.com', link: 'mailto:support@mentra.com' },
    { icon: '📞', title: 'Phone', value: '1-800-MENTRA-1', link: 'tel:1-800-636-8721' },
    { icon: '💬', title: 'Live Chat', value: 'Available 24/7', link: '#' },
    { icon: '🆘', title: 'Crisis Line', value: '1-800-273-8255', link: 'tel:1-800-273-8255' },
  ];

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-96 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Contact Us
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            We're here to help. Reach out to us anytime.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 transition-all text-center cursor-pointer h-full">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-white">
                  {method.title}
                </h3>
                <p className="text-sm text-purple-200">
                  {method.value}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/50">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-200">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-purple-400/30 bg-purple-700/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-200">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-purple-400/30 bg-purple-700/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-purple-200">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-purple-400/30 bg-purple-700/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-purple-200">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-purple-400/30 bg-purple-700/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-all shadow-lg shadow-purple-500/50">
                Send Message
              </button>
            </form>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
              <h3 className="font-bold text-lg mb-2 text-white">
                Is Mentra free to use?
              </h3>
              <p className="text-purple-200">
                Yes! Basic features are completely free. Premium features are available with a subscription.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
              <h3 className="font-bold text-lg mb-2 text-white">
                Is my data private?
              </h3>
              <p className="text-purple-200">
                Absolutely. Your conversations are encrypted and confidential. We never share your personal data.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
              <h3 className="font-bold text-lg mb-2 text-white">
                Can I talk to a human counselor?
              </h3>
              <p className="text-purple-200">
                Yes, premium members can schedule sessions with licensed mental health professionals.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
              <h3 className="font-bold text-lg mb-2 text-white">
                What if I'm in crisis?
              </h3>
              <p className="text-purple-200">
                Please call our crisis hotline at 1-800-273-8255 or go to your nearest emergency room.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
