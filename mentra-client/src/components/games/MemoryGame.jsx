import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaTrophy, FaRedo } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const symbols = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🍀', '🌿'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols]
      .map((symbol, index) => ({ id: index, symbol, flipped: false }))
      .sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].symbol === cards[second].symbol) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaBrain className="text-5xl text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Memory Challenge
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Improve your memory and focus while relaxing your mind
          </p>
        </motion.div>

        <Card className="mb-6">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Moves: <span className="text-purple-600 dark:text-purple-400">{moves}</span>
            </div>
            <Button variant="outline" size="sm" onClick={initializeGame}>
              <FaRedo className="mr-2" /> New Game
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: matched.includes(index) ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                onClick={() => handleCardClick(index)}
                className={`aspect-square flex items-center justify-center text-4xl cursor-pointer transition-all ${
                  matched.includes(index)
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                    : flipped.includes(index)
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                hover={!matched.includes(index)}
              >
                {flipped.includes(index) || matched.includes(index) ? (
                  <motion.span
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                  >
                    {card.symbol}
                  </motion.span>
                ) : (
                  <FaBrain className="text-gray-300 dark:text-gray-600 text-3xl" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
              onClick={() => setGameWon(false)}
            >
              <Card className="max-w-md mx-4 text-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <FaTrophy className="text-6xl mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Congratulations! 🎉</h2>
                <p className="text-xl mb-4">
                  You completed the game in <strong>{moves}</strong> moves!
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    initializeGame();
                    setGameWon(false);
                  }}
                >
                  Play Again
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MemoryGame;
