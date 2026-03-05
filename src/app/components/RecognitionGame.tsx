import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, RotateCcw, Star, Trophy } from 'lucide-react';

interface Animal {
  emoji: string;
  name: string;
  sound: string;
}

const animals: Animal[] = [
  { emoji: '🐶', name: 'Koira', sound: 'Hau!' },
  { emoji: '🐱', name: 'Kissa', sound: 'Miau!' },
  { emoji: '🐮', name: 'Lehmä', sound: 'Ammuuu!' },
  { emoji: '🐷', name: 'Sika', sound: 'Röh!' },
  { emoji: '🐸', name: 'Sammakko', sound: 'Kurnuttaa!' },
  { emoji: '🐔', name: 'Kana', sound: 'Kot!' },
  { emoji: '🦁', name: 'Leijona', sound: 'Murrr!' },
  { emoji: '🐘', name: 'Norsu', sound: 'Trumpetti!' },
];

interface RecognitionGameProps {
  onBack: () => void;
}

export default function RecognitionGame({ onBack }: RecognitionGameProps) {
  const [currentAnimal, setCurrentAnimal] = useState<Animal>(animals[0]);
  const [options, setOptions] = useState<Animal[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [questionId, setQuestionId] = useState(0);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const correct = animals[Math.floor(Math.random() * animals.length)];
    
    // Get 3 random wrong answers
    const wrongAnswers = animals
      .filter(a => a.name !== correct.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 1);

    // Shuffle correct answer with wrong answers
    const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    // Update state together to ensure consistency
    setCurrentAnimal(correct);
    setOptions(allOptions);
    setQuestionId(prev => prev + 1);
    setShowFeedback(null);
  };

  const handleAnswer = (selected: Animal) => {
    setAttempts(a => a + 1);
    
    if (selected.name === currentAnimal.name) {
      setShowFeedback('correct');
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      
      // Update best score
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
      
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      setShowFeedback('incorrect');
      setStreak(0);
      
      setTimeout(() => {
        setShowFeedback(null);
      }, 1000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setStreak(0);
    generateQuestion();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-teal-300 to-blue-300 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-5xl mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="bg-white/90 p-4 rounded-2xl shadow-lg"
        >
          <Home className="w-8 h-8 text-green-600" />
        </motion.button>
        
        {/* Score Display - Enhanced */}
        <div className="flex gap-4">
          <motion.div 
            className="bg-gradient-to-br from-yellow-400 to-orange-500 px-8 py-4 rounded-2xl shadow-lg"
            animate={{ scale: showFeedback === 'correct' ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-white fill-white" />
              <div>
                <p className="text-sm font-bold text-white/80">Pisteet</p>
                <p className="text-3xl font-black text-white">{score}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Streak Display */}
          {streak > 1 && (
            <motion.div 
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 px-6 py-4 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm font-bold text-white/80">Putki</p>
                  <p className="text-3xl font-black text-white">{streak}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Best Score */}
          {bestScore > 0 && (
            <motion.div 
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 py-4 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-white" />
                <div>
                  <p className="text-sm font-bold text-white/80">Paras</p>
                  <p className="text-2xl font-black text-white">{bestScore}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetGame}
          className="bg-white/90 p-4 rounded-2xl shadow-lg"
        >
          <RotateCcw className="w-8 h-8 text-green-600" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-12 max-w-4xl w-full">
        {/* Question */}
        <div className="bg-white/90 rounded-2xl p-12 shadow-1xl text-center">
          <motion.div
            key={currentAnimal.name}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-9xl mb-6"
          >
            {currentAnimal.emoji}
          </motion.div>
          <h2 className="text-4xl font-black text-gray-700 mb-2">
            Kumpi eläin tämä on?
          </h2>
          <p className="text-2xl text-gray-500">{currentAnimal.sound}</p>
        </div>

        {/* Options - With increased gaps */}
        <div className="grid grid-cols-2 gap-8 w-full px-4">
          {options.map((animal, index) => (
            <motion.button
              key={`q${questionId}-${animal.name}-${animal.emoji}-${index}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(animal)}
              disabled={showFeedback !== null}
              className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 border-4 border-transparent hover:border-green-400"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="text-5xl mb-2">{animal.emoji}</div>
                <p className="text-4xl font-black text-gray-600">{animal.name}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback === 'correct' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5 }}
              className="text-9xl mb-4"
            >
              ⭐
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl"
            >
              <p className="text-3xl font-black">+10 Pistettä!</p>
            </motion.div>
          </motion.div>
        )}
        
        {showFeedback === 'incorrect' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              animate={{ 
                x: [-20, 20, -20, 20, 0],
              }}
              transition={{ duration: 0.4 }}
              className="text-9xl mb-4"
            >
              ❌
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl"
            >
              <p className="text-3xl font-black">Yritä uudelleen!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
