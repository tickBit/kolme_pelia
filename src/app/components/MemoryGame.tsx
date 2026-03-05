import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, RotateCcw, Star, Trophy, Zap } from 'lucide-react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];

interface MemoryGameProps {
  onBack: () => void;
}

export default function MemoryGame({ onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [perfectMatches, setPerfectMatches] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setCards(currentCards => {
        const [first, second] = flippedIndices;
        const isMatch = currentCards[first].emoji === currentCards[second].emoji;
        
        if (isMatch) {
          // Match found - award points
          const basePoints = 20;
          setMoves(currentMoves => {
            const bonusPoints = Math.max(0, 10 - currentMoves) * 2;
            const earnedPoints = basePoints + bonusPoints;
            setScore(s => s + earnedPoints);
            return currentMoves + 1;
          });
          
          setTimeout(() => {
            setCards(prev =>
              prev.map((card, idx) =>
                idx === first || idx === second ? { ...card, isMatched: true } : card
              )
            );
            setFlippedIndices([]);
            setMatches(m => m + 1);
            setPerfectMatches(pm => pm + 1);
            checkWin();
          }, 600);
        } else {
          // No match - reset perfect match counter
          setPerfectMatches(0);
          setMoves(m => m + 1);
          
          setTimeout(() => {
            setCards(prev =>
              prev.map((card, idx) =>
                idx === first || idx === second ? { ...card, isFlipped: false } : card
              )
            );
            setFlippedIndices([]);
          }, 1000);
        }
        
        return currentCards;
      });
    }
  }, [flippedIndices]);

  const initializeGame = () => {
    const selectedEmojis = emojis.slice(0, 6);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(
      shuffled.map((emoji, idx) => ({
        id: idx,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    );
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
    setScore(0);
    setMatches(0);
    setPerfectMatches(0);
  };

  const checkWin = () => {
    setTimeout(() => {
      setCards(prev => {
        const allMatched = prev.every(card => card.isMatched);
        if (allMatched) {
          setIsWon(true);
          // Update best score
          setScore(currentScore => {
            if (currentScore > bestScore) {
              setBestScore(currentScore);
            }
            return currentScore;
          });
        }
        return prev;
      });
    }, 700);
  };

  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    setCards(prev =>
      prev.map((card, idx) =>
        idx === index ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedIndices(prev => [...prev, index]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-5xl mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="bg-white/90 p-4 rounded-2xl shadow-lg"
        >
          <Home className="w-8 h-8 text-blue-600" />
        </motion.button>
        
        {/* Score Display */}
        <div className="flex gap-4">
          <motion.div 
            className="bg-gradient-to-br from-yellow-400 to-orange-500 px-8 py-4 rounded-2xl shadow-lg"
            animate={{ scale: matches > 0 && flippedIndices.length === 0 ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-white fill-white" />
              <div>
                <p className="text-sm font-bold text-white/80">Score</p>
                <p className="text-3xl font-black text-white">{score}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Moves Counter */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm font-bold text-white/80">Moves</p>
                <p className="text-3xl font-black text-white">{moves}</p>
              </div>
            </div>
          </div>
          
          {/* Perfect Match Streak */}
          {perfectMatches > 1 && (
            <motion.div 
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 px-6 py-4 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm font-bold text-white/80">Streak</p>
                  <p className="text-3xl font-black text-white">{perfectMatches}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Best Score */}
          {bestScore > 0 && (
            <motion.div 
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              className="bg-gradient-to-br from-green-500 to-teal-600 px-6 py-4 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-white" />
                <div>
                  <p className="text-sm font-bold text-white/80">Best</p>
                  <p className="text-2xl font-black text-white">{bestScore}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={initializeGame}
          className="bg-white/90 p-4 rounded-2xl shadow-lg"
        >
          <RotateCcw className="w-8 h-8 text-blue-600" />
        </motion.button>
      </div>

      {/* Game Board - Increased gaps */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-8 max-w-4xl">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
            onClick={() => handleCardClick(index)}
            className="aspect-square cursor-pointer"
          >
            <div className="relative w-full h-full perspective-1000">
              <motion.div
                className="w-full h-full"
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Back of card */}
                <div
                  className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-6xl">❓</div>
                </div>
                
                {/* Front of card */}
                <div
                  className={`absolute w-full h-full ${
                    card.isMatched
                      ? 'bg-gradient-to-br from-green-400 to-green-600'
                      : 'bg-gradient-to-br from-yellow-300 to-orange-400'
                  } rounded-2xl shadow-xl flex items-center justify-center`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="text-7xl">{card.emoji}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={initializeGame}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-lg"
            >
              <div className="text-9xl mb-6">🎉</div>
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                You Won!
              </h2>
              <p className="text-3xl text-gray-700 mb-4">Great job! You found all pairs!</p>
              
              {/* Final Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-lg text-gray-600">Final Score</p>
                    <p className="text-4xl font-black text-purple-600">{score}</p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-600">Moves Used</p>
                    <p className="text-4xl font-black text-blue-600">{moves}</p>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={initializeGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl text-2xl font-black shadow-lg"
              >
                Play Again! 🎮
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
