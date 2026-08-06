import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  learningType: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
}

interface QuizDoc {
  _id: string; // stable string id
  id: string; // duplicate for frontend type compatibility
  title: string;
  category: string;
  points: number;
  difficulty: Difficulty;
  questions: QuizQuestion[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const seedQuizzes = (): QuizDoc[] => {
  const now = new Date();
  const wrap = (q: Omit<QuizDoc, '_id' | 'createdAt' | 'updatedAt' | 'active'>): QuizDoc => ({
    ...q,
    _id: q.id,
    active: true,
    createdAt: now,
    updatedAt: now,
  });

  return [
    wrap({
      id: 'js-101',
      title: 'JavaScript Fundamentals',
      category: 'Programming',
      points: 150,
      difficulty: 'easy',
      questions: [
        { id: 'q1', text: 'How do you declare a constant in JS?', options: ['const', 'var', 'let', 'static'], correctAnswer: 0, explanation: 'Use const for constants.', learningType: 'reading' },
        { id: 'q2', text: 'Which method adds to end of array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: 0, explanation: 'push() adds to the end.', learningType: 'visual' },
        { id: 'q3', text: 'What is typeof null?', options: ['object', 'null', 'undefined', 'number'], correctAnswer: 0, explanation: 'Legacy quirk: typeof null is "object".', learningType: 'reading' },
        { id: 'q4', text: 'Strict equality operator is…', options: ['==', '===', '=~', '=:'], correctAnswer: 1, explanation: '=== compares value and type.', learningType: 'auditory' },
        { id: 'q5', text: 'Array.isArray([]) returns…', options: ['true', 'false', '[]', 'undefined'], correctAnswer: 0, explanation: 'It returns true for arrays.', learningType: 'visual' },
      ],
    }),
    wrap({
      id: 'math-201',
      title: 'Mathematics Quiz: Algebra',
      category: 'Math',
      points: 200,
      difficulty: 'medium',
      questions: [
        { id: 'q1', text: 'Solve: 2x + 6 = 14', options: ['x=3', 'x=4', 'x=6', 'x=8'], correctAnswer: 1, explanation: '2x=8 so x=4', learningType: 'kinesthetic' },
        { id: 'q2', text: 'Simplify: (x^2)(x^3)', options: ['x^5', 'x^6', 'x^9', 'x^4'], correctAnswer: 0, explanation: 'Add exponents: 2+3=5', learningType: 'visual' },
        { id: 'q3', text: 'Derivative of x^2 is…', options: ['x', '2x', 'x^3', '2'], correctAnswer: 1, explanation: 'Power rule: 2x', learningType: 'reading' },
        { id: 'q4', text: 'Value of 15×8', options: ['120', '125', '115', '130'], correctAnswer: 0, explanation: '15×8=120', learningType: 'kinesthetic' },
      ],
    }),
    wrap({
      id: 'web-101',
      title: 'HTML & CSS Basics',
      category: 'Web',
      points: 120,
      difficulty: 'easy',
      questions: [
        { id: 'q1', text: 'Semantic tag for navigation?', options: ['<nav>', '<section>', '<aside>', '<div>'], correctAnswer: 0, explanation: '<nav> contains navigation links.', learningType: 'visual' },
        { id: 'q2', text: 'CSS to make text bold?', options: ['font-weight: bold;', 'text-style: bold;', 'font: bold;', 'weight: bold;'], correctAnswer: 0, explanation: 'Use font-weight.', learningType: 'reading' },
        { id: 'q3', text: 'Flexbox axis controlled by…', options: ['flex-direction', 'justify-items', 'grid-auto-flow', 'display'], correctAnswer: 0, explanation: 'flex-direction sets main axis.', learningType: 'auditory' },
        { id: 'q4', text: 'Correct HTML image tag attribute for text?', options: ['alt', 'title', 'desc', 'text'], correctAnswer: 0, explanation: 'alt provides alternative text.', learningType: 'visual' },
      ],
    }),
    wrap({
      id: 'cs-101',
      title: 'Computer Science Basics',
      category: 'CS',
      points: 180,
      difficulty: 'medium',
      questions: [
        { id: 'q1', text: 'Big-O of binary search?', options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'], correctAnswer: 0, explanation: 'Binary search halves input each step.', learningType: 'reading' },
        { id: 'q2', text: 'Which is not a programming paradigm?', options: ['Object-oriented', 'Functional', 'Procedural', 'Spectral'], correctAnswer: 3, explanation: 'Spectral is not a programming paradigm.', learningType: 'auditory' },
        { id: 'q3', text: 'Stack follows…', options: ['FIFO', 'LIFO', 'LILO', 'Random'], correctAnswer: 1, explanation: 'Stacks are LIFO.', learningType: 'visual' },
        { id: 'q4', text: 'Database language for queries?', options: ['SQL', 'HTML', 'CSS', 'JSON'], correctAnswer: 0, explanation: 'SQL is for relational databases.', learningType: 'reading' },
      ],
    }),
  ];
};

export async function GET() {
  try {
    const db = await getDatabase();
    const col = db.collection<QuizDoc>('quizzes');
    const count = await col.countDocuments({});
    if (count === 0) {
      const seed = seedQuizzes();
      await col.insertMany(seed);
    }
    const quizzes = await col.find({ active: true }).sort({ title: 1 }).toArray();
    // Strip Mongo metadata and return a clean payload
    const payload = quizzes.map(q => ({
      id: q.id,
      title: q.title,
      category: q.category,
      points: q.points,
      difficulty: q.difficulty,
      questions: q.questions,
    }));
    return NextResponse.json({ quizzes: payload });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch quizzes' }, { status: 500 });
  }
}
