import { useState, useEffect } from 'react';
import { FaTimes, FaCircle } from 'react-icons/fa';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result);
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
    } else if (board.every(cell => cell !== null)) {
      setWinner({ winner: 'Draw', line: [] });
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const isWinningCell = (index) => {
    return winner?.line?.includes(index);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">Relax & Play</h3>
        <p className="text-purple-200 text-sm">Take a mental break with Tic-Tac-Toe</p>
      </div>

      {/* Score Board */}
      <div className="flex justify-between mb-4 text-white text-sm">
        <div className="bg-purple-500/30 px-3 py-1 rounded">X: {scores.X}</div>
        <div className="bg-purple-500/30 px-3 py-1 rounded">Draws: {scores.draws}</div>
        <div className="bg-purple-500/30 px-3 py-1 rounded">O: {scores.O}</div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`
              aspect-square bg-white/10 border-2 rounded-lg
              flex items-center justify-center text-4xl font-bold
              transition-all duration-300 hover:bg-white/20
              ${isWinningCell(index) ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/30'}
              ${!cell && !winner ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
            `}
            disabled={!!cell || !!winner}
          >
            {cell === 'X' && <FaTimes className="text-purple-300" />}
            {cell === 'O' && <FaCircle className="text-pink-300" />}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="text-center mb-3">
        {winner ? (
          <p className="text-white font-semibold text-lg">
            {winner.winner === 'Draw' ? "It's a Draw!" : `${winner.winner} Wins! 🎉`}
          </p>
        ) : (
          <p className="text-purple-200">
            Next Player: <span className="font-bold text-white">{isXNext ? 'X' : 'O'}</span>
          </p>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={resetGame}
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        New Game
      </button>
    </div>
  );
};

export default TicTacToe;
