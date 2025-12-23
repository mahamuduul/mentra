import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaHeart, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdPsychology } from 'react-icons/md';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MentalHealthQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: "How often have you felt down, depressed, or hopeless in the past two weeks?",
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 },
      ],
    },
    {
      question: "How often have you had little interest or pleasure in doing things?",
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 },
      ],
    },
    {
      question: "How often have you felt nervous, anxious, or on edge?",
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 },
      ],
    },
    {
      question: "How often have you had trouble falling asleep or staying asleep?",
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 },
      ],
    },
    {
      question: "How often have you felt tired or had little energy?",
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 },
      ],
    },
    {
      question: "How often have you had trouble concentrating on things?",
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 },
      ],
    },
  ];

  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((sum, score) => sum + score, 0);
  };

  const getRecommendation = (score) => {
    if (score <= 4) {
      return {
        level: "Minimal",
        color: "from-green-500 to-emerald-500",
        icon: <FaCheckCircle />,
        message: "You're doing great! Your responses suggest minimal signs of depression or anxiety. Keep maintaining your healthy habits!",
        tips: [
          "Continue your current self-care routine",
          "Stay connected with friends and family",
          "Maintain regular exercise and sleep schedule",
          "Practice gratitude daily",
        ],
      };
    } else if (score <= 9) {
      return {
        level: "Mild",
        color: "from-yellow-500 to-orange-500",
        icon: <FaHeart />,
        message: "Your responses suggest mild symptoms. It's important to pay attention to your mental health and practice self-care.",
        tips: [
          "Try our breathing exercises and meditation guides",
          "Consider talking to a friend or family member",
          "Establish a regular sleep routine",
          "Engage in activities you enjoy",
          "Monitor your symptoms over the next few weeks",
        ],
      };
    } else if (score <= 14) {
      return {
        level: "Moderate",
        color: "from-orange-500 to-red-500",
        icon: <MdPsychology />,
        message: "Your responses suggest moderate symptoms. We recommend speaking with a mental health professional for support.",
        tips: [
          "Consider scheduling an appointment with a therapist",
          "Use our crisis support resources if needed",
          "Try our mood tracking and journaling features",
          "Reach out to trusted friends or family",
          "Practice daily self-care and stress management",
        ],
      };
    } else {
      return {
        level: "Severe",
        color: "from-red-500 to-pink-600",
        icon: <FaTimesCircle />,
        message: "Your responses suggest significant symptoms. Please reach out to a mental health professional or crisis helpline soon.",
        tips: [
          "Contact a mental health professional immediately",
          "Call our 24/7 crisis helpline: 1-800-273-8255",
          "Don't hesitate to visit an emergency room if needed",
          "Inform someone you trust about how you're feeling",
          "Remember: You're not alone, and help is available",
        ],
      };
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const recommendation = getRecommendation(score);

    return (
      <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className={`bg-gradient-to-br ${recommendation.color} text-white`}>
              <div className="text-center">
                <div className="text-6xl mb-4 flex justify-center">
                  {recommendation.icon}
                </div>
                <h2 className="text-3xl font-bold mb-2">Assessment Complete</h2>
                <p className="text-xl mb-4">
                  Your Score: <strong>{score}</strong> / {questions.length * 3}
                </p>
                <p className="text-2xl font-semibold mb-6">
                  Level: {recommendation.level}
                </p>
              </div>
            </Card>

            <Card className="mt-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                What This Means
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {recommendation.message}
              </p>

              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Recommended Next Steps:
              </h4>
              <ul className="space-y-2 mb-6">
                {recommendation.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-4">
                <Button variant="primary" size="lg" onClick={resetQuiz} className="flex-1">
                  Take Quiz Again
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'} className="flex-1">
                  Get Professional Help
                </Button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
                <strong>Disclaimer:</strong> This quiz is not a diagnostic tool. Please consult with a qualified mental health professional for an accurate assessment.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
      <Helmet>
        <title>Mental Health Quiz - Mentra</title>
        <meta name="description" content="Take a confidential mental health assessment to better understand your wellbeing and receive personalized recommendations." />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <MdPsychology className="text-6xl text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mental Health Assessment
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Take a few minutes to check in with yourself
          </p>
        </motion.div>

        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Progress: {Math.round(((currentQuestion) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            />
          </div>
        </Card>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full p-4 text-left rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 border-transparent hover:border-blue-500 transition-all"
                >
                  <span className="text-lg text-gray-900 dark:text-white">
                    {option.text}
                  </span>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Your responses are private and not stored anywhere
        </p>
      </div>
    </div>
  );
};

export default MentalHealthQuiz;
