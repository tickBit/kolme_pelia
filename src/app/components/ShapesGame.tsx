import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, RotateCcw, Circle, Square, Triangle } from 'lucide-react';

interface Shape {
  id: string;
  name: string;
  color: string;
  colorName: string;
  icon: React.ReactNode;
}

const shapes: Shape[] = [
  { 
    id: 'red-circle', 
    name: 'Circle', 
    color: 'bg-red-500', 
    colorName: 'Red',
    icon: <Circle className="w-full h-full fill-current" />
  },
  { 
    id: 'blue-square', 
    name: 'Square', 
    color: 'bg-blue-500', 
    colorName: 'Blue',
    icon: <Square className="w-full h-full fill-current" />
  },
  { 
    id: 'yellow-triangle', 
    name: 'Triangle', 
    color: 'bg-yellow-500', 
    colorName: 'Yellow',
    icon: <Triangle className="w-full h-full fill-current" />
  },
  { 
    id: 'green-circle', 
    name: 'Circle', 
    color: 'bg-green-500', 
    colorName: 'Green',
    icon: <Circle className="w-full h-full fill-current" />
  },
  { 
    id: 'purple-square', 
    name: 'Square', 
    color: 'bg-purple-500', 
    colorName: 'Purple',
    icon: <Square className="w-full h-full fill-current" />
  },
  { 
    id: 'orange-triangle', 
    name: 'Triangle', 
    color: 'bg-orange-500', 
    colorName: 'Orange',
    icon: <Triangle className="w-full h-full fill-current" />
  },
];

interface ShapesGameProps {
  onBack: () => void;
}

export default function ShapesGame({ onBack }: ShapesGameProps) {
  const [targetShape, setTargetShape] = useState<Shape>(shapes[0]);
  const [options, setOptions] = useState<Shape[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [questionType, setQuestionType] = useState<'shape' | 'color'>('shape');

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const type = Math.random() > 0.5 ? 'shape' : 'color';
    setQuestionType(type);

    const correct = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(correct);

    // Get wrong answers based on question type
    let wrongAnswers: Shape[];
    if (type === 'shape') {
      wrongAnswers = shapes
        .filter(s => s.id !== correct.id && s.name !== correct.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    } else {
      wrongAnswers = shapes
        .filter(s => s.id !== correct.id && s.colorName !== correct.colorName)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    }

    const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setShowFeedback(null);
  };

  const handleAnswer = (selected: Shape) => {
    const isCorrect = questionType === 'shape' 
      ? selected.name === targetShape.name
      : selected.colorName === targetShape.colorName;

    if (isCorrect) {
      setShowFeedback('correct');
      setScore(s => s + 1);
      
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      setShowFeedback('incorrect');
      
      setTimeout(() => {
        setShowFeedback(null);
      }, 1000);
    }
  };

  const resetGame = () => {
    setScore(0);
    generateQuestion();
  };

  const getQuestionText = () => {
    if (questionType === 'shape') {
      return `Find another ${targetShape.name}!`;
    } else {
      return `Find another ${targetShape.colorName} shape!`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-pink-300 to-purple-300 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="bg-white/90 p-4 rounded-2xl shadow-lg"
        >
          <Home className="w-8 h-8 text-orange-600" />
        </motion.button>
        
        <div className="bg-white/90 px-6 py-3 rounded-2xl shadow-lg">
          <p className="text-2xl font-black text-orange-600">Score: {score}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetGame}
          className="bg-white/90 p-4 rounded-2xl shadow-lg"
        >
          <RotateCcw className="w-8 h-8 text-orange-600" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-12 max-w-4xl w-full">
        {/* Question */}
        <div className="bg-white/90 rounded-3xl p-12 shadow-2xl text-center">
          <h2 className="text-4xl font-black text-gray-800 mb-8">
            {getQuestionText()}
          </h2>
          
          <motion.div
            key={targetShape.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className={`w-48 h-48 mx-auto ${targetShape.color} rounded-3xl flex items-center justify-center text-white p-8 shadow-xl`}
          >
            {targetShape.icon}
          </motion.div>
          
          <div className="mt-6">
            <p className="text-3xl font-black text-gray-700">
              {targetShape.colorName} {targetShape.name}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-6 w-full">
          {options.map((shape, index) => (
            <motion.button
              key={shape.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(shape)}
              disabled={showFeedback !== null}
              className={`${shape.color} aspect-square rounded-2xl shadow-xl hover:shadow-2xl transition-shadow disabled:opacity-50 flex items-center justify-center text-white p-6`}
            >
              {shape.icon}
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
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 0.6 }}
              className="text-9xl"
            >
              🌟
            </motion.div>
          </motion.div>
        )}
        
        {showFeedback === 'incorrect' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              animate={{ 
                scale: [1, 0.8, 1],
                rotate: [-10, 10, -10, 10, 0]
              }}
              transition={{ duration: 0.5 }}
              className="text-9xl"
            >
              💭
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
