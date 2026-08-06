'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizComponentProps {
  module: string;
  onComplete: (moduleId: string) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ module, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const quizzes: Record<string, QuizQuestion[]> = {
    plant: [
      {
        question: "What part of the plant absorbs water and nutrients?",
        options: ["Leaves", "Roots", "Flowers", "Stems"],
        correct: 1,
        explanation: "Roots absorb water and nutrients from the soil, anchoring the plant securely.",
      },
      {
        question: "Which process uses sunlight to create food for plants?",
        options: ["Respiration", "Photosynthesis", "Transpiration", "Digestion"],
        correct: 1,
        explanation: "Photosynthesis uses sunlight, water, and CO2 to produce food for the plant.",
      },
    ],
    solar: [
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Mercury"],
        correct: 1,
        explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface.",
      },
      {
        question: "What provides energy to our solar system?",
        options: ["Moon", "Sun", "Earth", "Stars"],
        correct: 1,
        explanation: "The Sun is a massive star that provides energy to the entire solar system.",
      },
    ],
    body: [
      {
        question: "Which organ pumps blood throughout the body?",
        options: ["Lungs", "Heart", "Liver", "Kidneys"],
        correct: 1,
        explanation: "The heart pumps approximately 2,000 gallons of blood daily.",
      },
      {
        question: "How many breaths do you take per day on average?",
        options: ["10,000", "15,000", "20,000", "25,000"],
        correct: 2,
        explanation: "You take about 20,000 breaths per day to supply oxygen to your cells.",
      },
    ],
    coding: [
      {
        question: "What does HTML do in web development?",
        options: ["Styles webpages", "Structures webpages", "Adds interactivity", "Processes data"],
        correct: 1,
        explanation: "HTML structures the content of webpages.",
      },
      {
        question: "Which skill is most important in programming?",
        options: ["Typing speed", "Problem-solving", "Memory", "Art skills"],
        correct: 1,
        explanation: "Problem-solving is the foundation of effective programming.",
      },
    ],
  };

  const currentQuiz = quizzes[module] ?? quizzes.plant;
  const currentQuestion = currentQuiz[currentQuestionIndex];

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleOptionSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleNext = () => {
    if (selectedOption === currentQuestion.correct) {
      setScore(score + 1);
    }
    if (currentQuestionIndex + 1 < currentQuiz.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(module);
      if (score + (selectedOption === currentQuestion.correct ? 1 : 0) === currentQuiz.length) {
        setTimeout(() => {
          alert("🎉 Perfect Score! You've mastered this module! 🏆");
        }, 500);
      }
    }
    setIsAnswered(false);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-bold text-blue-200 mb-6 drop-shadow-[0_2px_8px_rgba(30,144,255,0.3)]">
        Knowledge Quiz: {currentQuestionIndex + 1}/{currentQuiz.length}
      </h3>
      <div className="bg-gradient-to-r from-blue-900/70 to-indigo-900/60 rounded-xl p-6 border border-blue-600/40 shadow-[0_4px_15px_rgba(30,144,255,0.3)]">
        <p className="text-lg text-slate-200 mb-6">{currentQuestion.question}</p>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full py-3 px-5 rounded-xl text-left transition-all duration-300 ${
                isAnswered
                  ? index === currentQuestion.correct
                    ? 'bg-gradient-to-r from-green-600/90 to-emerald-700/80 text-white shadow-[0_2px_10px_rgba(34,197,94,0.4)]'
                    : index === selectedOption
                    ? 'bg-gradient-to-r from-red-600/90 to-rose-700/80 text-white shadow-[0_2px_10px_rgba(220,20,60,0.4)] opacity-80'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90'
                  : selectedOption === index
                  ? 'bg-blue-600/90 text-white hover:bg-blue-700/90 shadow-[0_2px_10px_rgba(30,144,255,0.4)]'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90'
              }`}
              disabled={isAnswered}
            >
              <span className="flex items-center gap-3">
                {isAnswered && index === currentQuestion.correct && <CheckCircle className="w-5 h-5 text-green-400" />}
                {isAnswered && index === selectedOption && index !== currentQuestion.correct && (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                {option}
              </span>
            </button>
          ))}
        </div>
        {isAnswered && (
          <p className="mt-4 text-sm text-slate-300 bg-slate-800/90 p-3 rounded-lg border border-blue-600/30">
            {currentQuestion.explanation}
          </p>
        )}
      </div>
      <button
        onClick={() => {
          if (selectedOption !== null && !isAnswered) {
            setIsAnswered(true);
          } else if (isAnswered) {
            handleNext();
          }
        }}
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:-translate-y-1 ${
          selectedOption === null || isAnswered
            ? 'bg-gradient-to-r from-gray-600/90 to-gray-800/80 text-slate-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600/90 to-blue-600/80 text-white hover:from-purple-700/90 hover:to-blue-700/80'
        }`}
        disabled={selectedOption === null || isAnswered}
      >
        {isAnswered ? (currentQuestionIndex + 1 < currentQuiz.length ? 'Next Question' : 'Finish Quiz') : 'Submit Answer'}
        {isAnswered && currentQuestionIndex + 1 === currentQuiz.length && score + (selectedOption === currentQuestion.correct ? 1 : 0) === currentQuiz.length && (
          <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default QuizComponent;