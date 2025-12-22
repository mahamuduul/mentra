import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaRedo } from 'react-icons/fa';

const MemoryMatchGame = () => {
  const emojis = useMemo(() => ['🧠', '💜', '✨', '🌸', '🦋', '🌟', '💎', '🎯'], []);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initializeGame = useCallback(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
  }, [emojis]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setTimeout(() => setIsWon(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">Memory Match</h3>
        <p className="text-purple-200 text-sm">Find matching pairs to relax your mind</p>
      </div>

      {/* Score */}
      <div className="flex justify-between mb-4 text-white text-sm">
        <div className="bg-purple-500/30 px-3 py-1 rounded">Moves: {moves}</div>
        <div className="bg-purple-500/30 px-3 py-1 rounded">
          Matched: {matched.length / 2}/{emojis.length}
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={isFlipped}
              className={`
                aspect-square rounded-lg text-3xl font-bold
                transition-all duration-300 transform
                ${isFlipped 
                  ? 'bg-white/90 scale-100' 
                  : 'bg-purple-600/50 hover:bg-purple-600/70 hover:scale-105'
                }
                ${matched.includes(index) ? 'ring-2 ring-yellow-400' : ''}
                disabled:cursor-not-allowed
              `}
            >
              {isFlipped ? card.emoji : '?'}
            </button>
          );
        })}
      </div>

      {/* Win Message */}
      {isWon && (
        <div className="text-center mb-3 p-3 bg-yellow-400/20 rounded-lg border border-yellow-400/50">
          <p className="text-white font-semibold text-lg">
            🎉 Perfect! Completed in {moves} moves!
          </p>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={initializeGame}
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <FaRedo />
        <span>New Game</span>
      </button>
    </div>
  );
};

export default MemoryMatchGame;
