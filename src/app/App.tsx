import { useState } from 'react';
import { Home, Brain, Eye, Shapes } from 'lucide-react';
import { motion } from 'motion/react';
import MemoryGame from './components/MemoryGame';
import RecognitionGame from './components/RecognitionGame';
import ShapesGame from './components/ShapesGame';

type GameType = 'home' | 'memory' | 'recognition' | 'shapes';

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('home');

  const renderGame = () => {
    switch (currentGame) {
      case 'memory':
        return <MemoryGame onBack={() => setCurrentGame('home')} />;
      case 'recognition':
        return <RecognitionGame onBack={() => setCurrentGame('home')} />;
      case 'shapes':
        return <ShapesGame onBack={() => setCurrentGame('home')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-300 flex flex-col items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg">
                Hauskaa oppimista! 🎉
              </h1>
              <p className="text-2xl text-white drop-shadow-md">Valitse peli!</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
              <GameButton
                icon={<Brain className="w-24 h-24" />}
                title="Muistipeli"
                color="bg-gradient-to-br from-blue-400 to-blue-600"
                emoji="🧠"
                delay={0.1}
                onClick={() => setCurrentGame('memory')}
              />
              
              <GameButton
                icon={<Eye className="w-24 h-24" />}
                title="Löydä eläimet"
                color="bg-gradient-to-br from-green-400 to-green-600"
                emoji="🐶"
                delay={0.2}
                onClick={() => setCurrentGame('recognition')}
              />
              
              <GameButton
                icon={<Shapes className="w-24 h-24" />}
                title="Muodot & Värit"
                color="bg-gradient-to-br from-orange-400 to-orange-600"
                emoji="🔶"
                delay={0.3}
                onClick={() => setCurrentGame('shapes')}
              />
            </div>
          </div>
        );
    }
  };

  return <div className="w-full h-screen overflow-hidden">{renderGame()}</div>;
}

interface GameButtonProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  emoji: string;
  delay: number;
  onClick: () => void;
}

function GameButton({ icon, title, color, emoji, delay, onClick }: GameButtonProps) {
  return (
    <motion.button
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} rounded-3xl p-8 shadow-2xl text-white flex flex-col items-center justify-center gap-4 min-h-[280px] hover:shadow-3xl transition-shadow`}
    >
      <div className="text-6xl">{emoji}</div>
      <div className="text-white/90">{icon}</div>
      <h2 className="text-3xl font-black text-center">{title}</h2>
    </motion.button>
  );
}
