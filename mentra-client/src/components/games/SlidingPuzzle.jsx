import { useState, useEffect, useCallback } from 'react';
import { FaRedo, FaStar } from 'react-icons/fa';

const SlidingPuzzle = () => {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Check if puzzle is solvable
  const isSolvable = (puzzle) => {
    let inversions = 0;
    for (let i = 0; i < puzzle.length - 1; i++) {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] && puzzle[j] && puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  // Check if puzzle is solved
  const isSolved = (puzzle) => {
    for (let i = 0; i < puzzle.length - 1; i++) {
      if (puzzle[i] !== i + 1) return false;
    }
    return puzzle[puzzle.length - 1] === 0;
  };

  // Create initial puzzle state (3x3 grid)
  const createPuzzle = useCallback(() => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 represents empty space
    // Shuffle until solvable
    let shuffled;
    do {
      shuffled = [...numbers].sort(() => Math.random() - 0.5);
    } while (!isSolvable(shuffled) || isSolved(shuffled));
    return shuffled;
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    setTiles(createPuzzle());
    setMoves(0);
    setIsWon(false);
    setTimer(0);
    setIsPlaying(false);
  }, [createPuzzle]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  // Handle tile click
  const handleTileClick = (index) => {
    if (isWon) return;

    if (!isPlaying) setIsPlaying(true);

    const emptyIndex = tiles.indexOf(0);
    const canMove = isAdjacent(index, emptyIndex);

    if (canMove) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);

      // Check if won
      if (isSolved(newTiles)) {
        setIsWon(true);
        setIsPlaying(false);
      }
    }
  };

  // Check if tiles are adjacent
  const isAdjacent = (index1, index2) => {
    const row1 = Math.floor(index1 / 3);
    const col1 = index1 % 3;
    const row2 = Math.floor(index2 / 3);
    const col2 = index2 % 3;

    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🧩</span> Sliding Puzzle
          </h3>
          <p className="text-purple-200 text-sm">Arrange tiles in order</p>
        </div>
        <button
          onClick={initializeGame}
          className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all hover:scale-110 active:scale-95"
          title="New Game"
        >
          <FaRedo className="text-lg" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <p className="text-purple-200 text-xs mb-1">Moves</p>
          <p className="text-2xl font-bold text-white">{moves}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <p className="text-purple-200 text-xs mb-1">Time</p>
          <p className="text-2xl font-bold text-white">{formatTime(timer)}</p>
        </div>
      </div>

      {/* Puzzle Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4 bg-purple-900/30 p-3 rounded-xl">
        {tiles.map((tile, index) => (
          <button
            key={index}
            onClick={() => handleTileClick(index)}
            disabled={tile === 0 || isWon}
            className={`
              aspect-square rounded-lg font-bold text-2xl transition-all duration-200
              ${tile === 0 
                ? 'bg-transparent cursor-default' 
                : isAdjacent(index, tiles.indexOf(0))
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg cursor-pointer hover:scale-105 hover:shadow-purple-500/50 active:scale-95'
                  : 'bg-purple-700/50 text-purple-300 cursor-not-allowed'
              }
              ${isWon && tile !== 0 ? 'animate-pulse' : ''}
            `}
          >
            {tile !== 0 && tile}
          </button>
        ))}
      </div>

      {/* Win Message */}
      {isWon && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaStar className="text-yellow-300 text-2xl animate-spin" />
            <p className="text-white font-bold text-xl">Puzzle Solved!</p>
            <FaStar className="text-yellow-300 text-2xl animate-spin" />
          </div>
          <p className="text-purple-100 text-sm">
            {moves} moves in {formatTime(timer)}
          </p>
        </div>
      )}

      {/* Instructions */}
      {!isPlaying && !isWon && (
        <div className="text-center text-purple-200 text-sm bg-white/5 rounded-lg p-3">
          Click tiles adjacent to the empty space to slide them
        </div>
      )}
    </div>
  );
};

export default SlidingPuzzle;
