"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Trophy, Star, BookOpen, Target, Brain, Users, Award, TrendingUp, Play, CheckCircle, X, Home as HomeIcon } from 'lucide-react';
import { SmokeBackground } from "../components/smoke-background";
import { CursorGlow } from "../components/cursor-glow";
import { useUser } from "@/hooks/useUser";

// Types
interface UserProfile {
    id: string;
    name: string;
    level: number;
    points: number;
    badges: string[];
    completedQuizzes: string[];
    completedGames: string[];
    quizAttempts: number;
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed';
    interactions: {
        visual: number;
        auditory: number;
        kinesthetic: number;
        reading: number;
    };
}

interface Quiz {
    id: string;
    title: string;
    category: string;
    questions: Question[];
    points: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    learningType: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
}

interface Game {
    id: string;
    title: string;
    type: 'memory' | 'puzzle' | 'decision' | 'drag-drop';
    description: string;
    points: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

// Remote quizzes loaded from backend
const useRemoteQuizzes = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/quizzes', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load quizzes');
            const data = await res.json();
            setQuizzes(Array.isArray(data.quizzes) ? data.quizzes : []);
        } catch (e: any) {
            setError(e?.message || 'Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);
    return { quizzes, loading, error, reload: load };
};

const sampleGames: Game[] = [
    {
        id: '1',
        title: 'Memory Cards',
        type: 'memory',
        description: 'Match pairs of cards to improve your memory',
        points: 50,
        difficulty: 'easy'
    },
    {
        id: '2',
        title: 'Code Puzzle',
        type: 'puzzle',
        description: 'Arrange code blocks in the correct order',
        points: 75,
        difficulty: 'medium'
    },
    {
        id: '3',
        title: 'Decision Challenge',
        type: 'decision',
        description: 'Make the right choices in various scenarios',
        points: 100,
        difficulty: 'hard'
    }
];

const GameifiedLearningPlatform = () => {
    // Resolve user id (auth or anonymous)
    const { user } = useUser();
    // Reactive effective user id: switches from anonymous -> authenticated when user loads
    const [effectiveUserId, setEffectiveUserId] = useState<string>('');
    useEffect(() => {
        // prefer auth user id when available
        if (user?.id) {
            setEffectiveUserId(user.id);
            return;
        }
        // otherwise, use a stable anonymous id in browser
        if (typeof window !== 'undefined') {
            let uid = localStorage.getItem('edupath-user-id');
            if (!uid) {
                uid = 'user-' + Math.random().toString(36).slice(2, 11);
                localStorage.setItem('edupath-user-id', uid);
            }
            setEffectiveUserId(uid);
        } else {
            setEffectiveUserId('anonymous-user');
        }
    }, [user?.id]);
    const storageKey = `userProfile:${effectiveUserId}`;
    // State management
    const [currentView, setCurrentView] = useState('dashboard');
    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: '1',
        name: 'Student',
        level: 1,
        points: 0,
        badges: [],
        completedQuizzes: [],
        completedGames: [],
        quizAttempts: 0,
        learningStyle: 'mixed',
        interactions: {
            visual: 0,
            auditory: 0,
            kinesthetic: 0,
            reading: 0
        }
    });
    const [mounted, setMounted] = useState(false);

    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const { quizzes, loading: quizzesLoading, error: quizzesError, reload: reloadQuizzes } = useRemoteQuizzes();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [showQuizResults, setShowQuizResults] = useState(false);

    const [currentGame, setCurrentGame] = useState<Game | null>(null);
    const [gameCards, setGameCards] = useState<{ id: number; value: string; flipped: boolean; matched: boolean }[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [gameScore, setGameScore] = useState(0);
    const [moves, setMoves] = useState(0);

    // Learning style quiz state
    const styleQuestions: { id: number; text: string; options: { label: string; style: 'visual' | 'auditory' | 'kinesthetic' }[] }[] = [
        {
            id: 1,
            text: 'When learning something new, you prefer to…',
            options: [
                { label: 'See a diagram or video', style: 'visual' },
                { label: 'Hear an explanation', style: 'auditory' },
                { label: 'Try it with hands-on practice', style: 'kinesthetic' },
            ],
        },
        {
            id: 2,
            text: 'In class, you remember best when the teacher…',
            options: [
                { label: 'Shows slides and images', style: 'visual' },
                { label: 'Explains out loud with examples', style: 'auditory' },
                { label: 'Gives activities and labs', style: 'kinesthetic' },
            ],
        },
        {
            id: 3,
            text: 'For directions, you prefer…',
            options: [
                { label: 'A map or visual route', style: 'visual' },
                { label: 'Spoken directions', style: 'auditory' },
                { label: 'Exploring the route yourself', style: 'kinesthetic' },
            ],
        },
        {
            id: 4,
            text: 'When studying, you usually…',
            options: [
                { label: 'Use charts, color-coding, and notes', style: 'visual' },
                { label: 'Read notes aloud or discuss', style: 'auditory' },
                { label: 'Build, draw, or simulate', style: 'kinesthetic' },
            ],
        },
        {
            id: 5,
            text: 'To understand a concept, you prefer…',
            options: [
                { label: 'Graphics/animations', style: 'visual' },
                { label: 'Audio explanation or lecture', style: 'auditory' },
                { label: 'Interactive examples', style: 'kinesthetic' },
            ],
        },
        {
            id: 6,
            text: 'Your favorite learning resources are…',
            options: [
                { label: 'Infographics and videos', style: 'visual' },
                { label: 'Podcasts and discussions', style: 'auditory' },
                { label: 'Projects and labs', style: 'kinesthetic' },
            ],
        },
        {
            id: 7,
            text: 'When solving problems, you…',
            options: [
                { label: 'Sketch the problem out', style: 'visual' },
                { label: 'Talk it through', style: 'auditory' },
                { label: 'Test ideas by doing', style: 'kinesthetic' },
            ],
        },
        {
            id: 8,
            text: 'Which feedback helps you most?',
            options: [
                { label: 'Visual examples of correct answers', style: 'visual' },
                { label: 'Verbal explanation of mistakes', style: 'auditory' },
                { label: 'Practice with step-by-step tasks', style: 'kinesthetic' },
            ],
        },
    ];
    const [styleAnswers, setStyleAnswers] = useState<Array<'visual' | 'auditory' | 'kinesthetic' | null>>(Array(styleQuestions.length).fill(null));
    const [styleCurrent, setStyleCurrent] = useState(0);
    const [styleSubmitting, setStyleSubmitting] = useState(false);
    const [styleResult, setStyleResult] = useState<{ learningStyle: string; scores: Record<string, number>; recommendations: string[] } | null>(null);

    // Mark mounted to avoid hydration mismatches; then load any stored profile for this user
    useEffect(() => { setMounted(true); }, []);

    // Load from localStorage for current user
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                setUserProfile(prev => ({ ...prev, ...parsed }));
            }
        } catch { /* ignore */ }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

    // When effective user changes (anon -> auth or user switch), reset view state and refetch
    useEffect(() => {
        if (!effectiveUserId) return;
        // reset local profile to avoid showing previous user's data
        setUserProfile({
            id: '1',
            name: user?.name || 'Student',
            level: 1,
            points: 0,
            badges: [],
            completedQuizzes: [],
            completedGames: [],
            quizAttempts: 0,
            learningStyle: 'mixed',
            interactions: { visual: 0, auditory: 0, kinesthetic: 0, reading: 0 },
        });
        // trigger a fresh fetch for the new user id
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveUserId]);

    // Persist to localStorage per-user for offline feel
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(userProfile));
        }
    }, [userProfile, storageKey]);

    // Helpers to normalize data coming from/to backend
    const normalizeNumber = (n: any, fallback = 0) => {
        const v = typeof n === 'number' ? n : parseFloat(n)
        return isFinite(v) && !isNaN(v) ? v : fallback
    }

    const normalizeProfile = (p: Partial<UserProfile> | any): UserProfile => {
        const base: UserProfile = {
            id: '1',
            name: 'Student',
            level: 1,
            points: 0,
            badges: [],
            completedQuizzes: [],
            completedGames: [],
            quizAttempts: 0,
            learningStyle: 'mixed',
            interactions: { visual: 0, auditory: 0, kinesthetic: 0, reading: 0 },
        }
        const src = p || {}
        return {
            ...base,
            ...src,
            name: typeof src.name === 'string' && src.name.trim() ? src.name : base.name,
            level: normalizeNumber(src.level, base.level),
            points: normalizeNumber(src.points, base.points),
            badges: Array.isArray(src.badges) ? src.badges : base.badges,
            completedQuizzes: Array.isArray(src.completedQuizzes) ? src.completedQuizzes : base.completedQuizzes,
            completedGames: Array.isArray(src.completedGames) ? src.completedGames : base.completedGames,
            quizAttempts: normalizeNumber(src.quizAttempts, base.quizAttempts),
            learningStyle: (src.learningStyle as UserProfile['learningStyle']) || base.learningStyle,
            interactions: {
                visual: normalizeNumber(src?.interactions?.visual, 0),
                auditory: normalizeNumber(src?.interactions?.auditory, 0),
                kinesthetic: normalizeNumber(src?.interactions?.kinesthetic, 0),
                reading: normalizeNumber(src?.interactions?.reading, 0),
            },
        }
    }

    // small helpers
    const unique = <T,>(arr: T[]) => Array.from(new Set(arr))

    // Backend integration: fetch from Mongo and keep in sync (poll lightweight)
    const fetchProfile = useCallback(async () => {
        try {
            if (!effectiveUserId) return;
            const res = await fetch(`/api/gamified?userId=${encodeURIComponent(effectiveUserId)}`, { cache: 'no-store' });
            if (!res.ok) return;
            const data = await res.json();
            if (data && data.userId) {
                setUserProfile((prev) => {
                    const incoming = normalizeProfile({ ...(data || {}) })
                    // union arrays so we don't regress while POST and GET race
                    const merged = normalizeProfile({
                        ...prev,
                        ...incoming,
                        badges: unique([...(prev.badges || []), ...(incoming.badges || [])]),
                        completedQuizzes: unique([...(prev.completedQuizzes || []), ...(incoming.completedQuizzes || [])]),
                        completedGames: unique([...(prev.completedGames || []), ...(incoming.completedGames || [])]),
                    })
                    return merged
                });
                if (data.exists === false) {
                    // create initial record in background
                    saveProfile({});
                }
            }
        } catch (e) {
            // ignore network issues for now
        }
    }, [effectiveUserId]);

    const saveProfile = useCallback(async (profileOverride?: Partial<UserProfile>) => {
        const payload = normalizeProfile({ ...userProfile, ...(profileOverride || {}) });
        try {
            if (!effectiveUserId) return;
            await fetch('/api/gamified', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: effectiveUserId, profile: payload }),
            });
        } catch (e) {
            // ignore for now
        }
    }, [effectiveUserId, userProfile]);

    // Initial load and adaptive polling (faster on dashboard and quizzes)
    useEffect(() => {
        fetchProfile();
        const intervalMs = (currentView === 'dashboard' || currentView === 'quizzes') ? 2000 : 10000;
        const id = setInterval(fetchProfile, intervalMs);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchProfile, currentView]);

    // Cross-tab real-time sync via localStorage events (per-user)
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === storageKey && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    setUserProfile((prev) => ({ ...prev, ...parsed }));
                } catch { /* ignore */ }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [storageKey]);

    // Refresh when tab regains focus
    useEffect(() => {
        const onVis = () => { if (!document.hidden) fetchProfile(); };
        document.addEventListener('visibilitychange', onVis);
        return () => document.removeEventListener('visibilitychange', onVis);
    }, [fetchProfile]);

    // If logged in, prefer real user name for greeting and persist once
    useEffect(() => {
        if (user?.name && userProfile.name !== user.name) {
            const updated = { ...userProfile, name: user.name };
            setUserProfile(updated);
            // Save in background (ignore errors)
            saveProfile({ name: user.name });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.name]);

    // Learning style analysis
    const analyzeLearningStyle = useCallback((interactions: UserProfile['interactions']) => {
        const total = Object.values(interactions).reduce((sum, val) => sum + val, 0);
        if (total < 10) return 'mixed';

        const max = Math.max(...Object.values(interactions));
        const style = Object.entries(interactions).find(([_, value]) => value === max)?.[0];
        return style as UserProfile['learningStyle'] || 'mixed';
    }, []);

    // Update learning interactions
    const updateLearningInteraction = (type: keyof UserProfile['interactions']) => {
        setUserProfile(prev => {
            const newInteractions = {
                ...prev.interactions,
                [type]: prev.interactions[type] + 1
            };
            const newLearningStyle = analyzeLearningStyle(newInteractions);

            const updated = {
                ...prev,
                interactions: newInteractions,
                learningStyle: newLearningStyle
            };
            // Persist immediately for real-time dashboard and cross-tab updates
            saveProfile(updated);
            return updated;
        });
    };

    // Award points and badges
    const awardPoints = (points: number, activity: string) => {
        setUserProfile(prev => {
            const newPoints = prev.points + points;
            const newLevel = Math.floor(newPoints / 500) + 1;
            const newBadges = [...prev.badges];

            if (newPoints >= 100 && !newBadges.includes('First Steps')) {
                newBadges.push('First Steps');
            }
            if (newPoints >= 500 && !newBadges.includes('Point Collector')) {
                newBadges.push('Point Collector');
            }
            if (prev.completedQuizzes.length >= 5 && !newBadges.includes('Quiz Master')) {
                newBadges.push('Quiz Master');
            }

            const updated = {
                ...prev,
                points: newPoints,
                level: newLevel,
                badges: newBadges
            };
            // Fire-and-forget save
            saveProfile(updated);
            return updated;
        });
    };

    // Quiz functions
    const startQuiz = (quiz: Quiz) => {
        setCurrentQuiz(quiz);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setQuizScore(0);
        setShowQuizResults(false);
        setCurrentView('quiz');
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(answerIndex);
        setShowExplanation(true);

        const question = currentQuiz!.questions[currentQuestionIndex];
        updateLearningInteraction(question.learningType);

        if (answerIndex === question.correctAnswer) {
            setQuizScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < currentQuiz!.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        const pointsEarned = Math.floor((quizScore / currentQuiz!.questions.length) * currentQuiz!.points);
        try {
            // Atomically record quiz completion on the backend to keep counts accurate
            const res = await fetch('/api/gamified/complete-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: effectiveUserId, quizId: currentQuiz!.id, pointsDelta: pointsEarned }),
            })
            if (res.ok) {
                const data = await res.json()
                if (data?.profile) {
                    setUserProfile(prev => normalizeProfile({ ...prev, ...(data.profile || {}) }))
                }
            } else {
                // Fallback to client-side update if server call fails
                setUserProfile(prev => {
                    const already = prev.completedQuizzes.includes(currentQuiz!.id)
                    const updated = {
                        ...prev,
                        quizAttempts: (prev.quizAttempts || 0) + 1,
                        points: prev.points + pointsEarned,
                        completedQuizzes: already ? prev.completedQuizzes : [...prev.completedQuizzes, currentQuiz!.id],
                    } as UserProfile
                    saveProfile(updated)
                    return updated
                })
            }
        } catch (e) {
            setUserProfile(prev => {
                const already = prev.completedQuizzes.includes(currentQuiz!.id)
                const updated = {
                    ...prev,
                    quizAttempts: (prev.quizAttempts || 0) + 1,
                    points: prev.points + pointsEarned,
                    completedQuizzes: already ? prev.completedQuizzes : [...prev.completedQuizzes, currentQuiz!.id],
                } as UserProfile
                saveProfile(updated)
                return updated
            })
        }

        setShowQuizResults(true);
    };

    // Memory Game functions
    const initializeMemoryGame = () => {
        const cards = [
            '🍎', '🍌', '🍊', '🍇', '🥝', '🍓', '🍑', '🥭'
        ];

        const gameCards = [...cards, ...cards]
            .sort(() => Math.random() - 0.5)
            .map((value, index) => ({
                id: index,
                value,
                flipped: false,
                matched: false
            }));

        setGameCards(gameCards);
        setFlippedCards([]);
        setGameScore(0);
        setMoves(0);
    };

    const handleCardClick = (cardId: number) => {
        if (flippedCards.length === 2) return;
        if (gameCards[cardId].flipped || gameCards[cardId].matched) return;

        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);

        const newGameCards = [...gameCards];
        newGameCards[cardId].flipped = true;
        setGameCards(newGameCards);

        if (newFlippedCards.length === 2) {
            setMoves(prev => prev + 1);
            updateLearningInteraction('kinesthetic');

            setTimeout(() => {
                const [first, second] = newFlippedCards;
                if (gameCards[first].value === gameCards[second].value) {
                    newGameCards[first].matched = true;
                    newGameCards[second].matched = true;
                    setGameScore(prev => prev + 10);

                    if (newGameCards.every(card => card.matched)) {
                        awardPoints(Math.max(0, 100 - moves * 2), 'memory-game');
                        setUserProfile(prev => {
                            const updated = { ...prev, completedGames: [...prev.completedGames, currentGame!.id] };
                            saveProfile(updated);
                            return updated;
                        });
                    }
                } else {
                    newGameCards[first].flipped = false;
                    newGameCards[second].flipped = false;
                }

                setGameCards([...newGameCards]);
                setFlippedCards([]);
            }, 1000);
        }
    };

    const startGame = (game: Game) => {
        setCurrentGame(game);
        setCurrentView('game');

        if (game.type === 'memory') {
            initializeMemoryGame();
        }
    };

    // Component rendering functions
    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                        <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, <span suppressHydrationWarning>{userProfile.name}</span>!</h1>
                        <p className="text-blue-100">Ready to continue your learning journey?</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{mounted ? userProfile.points : 0}</div>
                        <div className="text-sm text-blue-200">Points</div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4 shadow-sm border border-white/10">
                    <div className="flex items-center">
                        <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
                        <div>
                            <div className="text-2xl font-bold">{mounted ? userProfile.level : 0}</div>
                            <div className="text-gray-300">Level</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 shadow-sm border border-white/10">
                    <div className="flex items-center">
                        <Award className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                            <div className="text-2xl font-bold">{mounted ? userProfile.badges.length : 0}</div>
                            <div className="text-gray-300">Badges</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 shadow-sm border border-white/10">
                    <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                            <div className="text-2xl font-bold">{mounted ? userProfile.quizAttempts : 0}</div>
                            <div className="text-gray-300">Quizzes</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 shadow-sm border border-white/10">
                    <div className="flex items-center">
                        <Brain className="h-8 w-8 text-purple-500 mr-3" />
                        <div>
                            <div className="text-lg font-bold capitalize">{mounted ? userProfile.learningStyle : 'mixed'}</div>
                            <div className="text-gray-300">Style</div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <button
                            onClick={() => { setCurrentView('style'); setStyleResult(null); setStyleAnswers(Array(styleQuestions.length).fill(null)); setStyleCurrent(0); }}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Take Style Quiz
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white/5 rounded-lg p-6 shadow-sm border border-white/10">
                <h2 className="text-xl font-bold mb-4">Your Progress</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span>Level Progress</span>
                            <span>{mounted ? (userProfile.points % 500) : 0}/500</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${mounted ? ((userProfile.points % 500) / 500) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-sm text-gray-400">Next Target: {mounted ? userProfile.level * 500 : 500} pts</div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Learning Style Analysis</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(userProfile.interactions).map(([style, count]) => (
                                <div key={style} className="flex justify-between">
                                    <span className="capitalize">{style}:</span>
                                    <span className="font-medium text-gray-300">{mounted ? count : 0} interactions</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges */}
            {userProfile.badges.length > 0 && (
                <div className="bg-white/5 rounded-lg p-6 shadow-sm border border-white/10">
                    <h2 className="text-xl font-bold mb-4">Your Badges</h2>
                    <div className="flex flex-wrap gap-3">
                        {userProfile.badges.map(badge => (
                            <div key={badge} className="flex items-center bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                                <Award className="h-4 w-4 text-yellow-400 mr-2" />
                                <span className="text-yellow-300 font-medium">{badge}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderStyleQuiz = () => {
        const total = styleQuestions.length;
        const q = styleQuestions[styleCurrent];
        const selected = styleAnswers[styleCurrent];
        const progress = Math.round(((styleCurrent + 1) / total) * 100);

        const allAnswered = styleAnswers.every(a => a !== null);

        const submit = async () => {
            if (!allAnswered) return;
            try {
                setStyleSubmitting(true);
                const res = await fetch('/api/learning-style', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answers: styleAnswers }),
                });
                const data = await res.json();
                if (data?.learningStyle) {
                    const lower = String(data.learningStyle).toLowerCase();
                    setStyleResult(data);

                    // Persist detected learning style (interactions were already updated live per-question)
                    setUserProfile(prev => {
                        const updated = { ...prev, learningStyle: (lower as any) };
                        saveProfile(updated);
                        return updated;
                    });
                }
            } finally {
                setStyleSubmitting(false);
            }
        };

        const onNext = () => {
            if (styleCurrent < total - 1) {
                setStyleCurrent(styleCurrent + 1);
            } else {
                submit();
            }
        };

        const onPrev = () => {
            if (styleCurrent > 0) setStyleCurrent(styleCurrent - 1);
        };

        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-white/5 rounded-lg p-6 shadow-sm border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Learning Style Quiz</h2>
                        <span className="text-sm text-gray-300">{styleCurrent + 1} / {total}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="mb-4 font-medium">{styleCurrent + 1}. {q.text}</div>
                    <div className="grid sm:grid-cols-3 gap-3">
                        {q.options.map((opt, oi) => (
                            <button
                                key={oi}
                                onClick={() => {
                                    // adjust interactions live (increment new, decrement previous if changed)
                                    const next = [...styleAnswers];
                                    const prevSel = next[styleCurrent];
                                    next[styleCurrent] = opt.style;
                                    setStyleAnswers(next);

                                    setUserProfile(prev => {
                                        const newInteractions = { ...prev.interactions };
                                        if (prevSel) {
                                            newInteractions[prevSel] = Math.max(0, newInteractions[prevSel] - 1);
                                        }
                                        newInteractions[opt.style] = (newInteractions[opt.style] || 0) + 1;
                                        const updated = { ...prev, interactions: newInteractions };
                                        saveProfile(updated);
                                        return updated;
                                    });
                                }}
                                className={`text-left px-4 py-3 rounded-lg border transition-colors ${selected === opt.style
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <button onClick={() => setCurrentView('dashboard')} className="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>
                        <div className="flex items-center gap-2">
                            <button onClick={onPrev} disabled={styleCurrent === 0} className="px-4 py-2 rounded-lg border border-white/10 text-white/90 disabled:opacity-50">Back</button>
                            <button onClick={onNext} disabled={!selected || styleSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                {styleCurrent < total - 1 ? 'Next' : (styleSubmitting ? 'Submitting…' : 'Submit')}
                            </button>
                        </div>
                    </div>
                </div>

                {styleResult && (
                    <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-2">Your style: {styleResult.learningStyle}</h3>
                        <p className="text-gray-200 mb-3">Scores: Visual {styleResult.scores.visual ?? 0}, Auditory {styleResult.scores.auditory ?? 0}, Kinesthetic {styleResult.scores.kinesthetic ?? 0}</p>
                        <div>
                            <h4 className="font-medium mb-2">Recommendations</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-200">
                                {styleResult.recommendations?.map((rec: string, idx: number) => (
                                    <li key={idx}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <button
                                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10"
                                onClick={() => { setStyleResult(null); setStyleAnswers(Array(styleQuestions.length).fill(null)); setStyleCurrent(0); }}
                            >
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderQuizzes = () => (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Interactive Quizzes</h1>
            {quizzesError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded">{quizzesError}</div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
                {(quizzesLoading ? [] : quizzes).map(quiz => (
                    <div key={quiz.id} className="bg-white/5 rounded-lg p-6 shadow-sm border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                                <p className="text-gray-300 mb-2">{quiz.category}</p>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                        {quiz.difficulty}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {quiz.questions.length} questions
                                    </span>
                                    <span className="text-sm text-green-400 font-medium">
                                        +{quiz.points} points
                                    </span>
                                </div>
                            </div>
                            {userProfile.completedQuizzes.includes(quiz.id) && (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            )}
                        </div>
                        <button
                            onClick={() => startQuiz(quiz)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {userProfile.completedQuizzes.includes(quiz.id) ? 'Retake Quiz' : 'Start Quiz'}
                        </button>
                    </div>
                ))}
                {quizzesLoading && (
                    <div className="col-span-full text-gray-300">Loading quizzes…</div>
                )}
            </div>
        </div>
    );

    const renderQuiz = () => {
        if (!currentQuiz) return null;

        const question = currentQuiz.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

        if (showQuizResults) {
            const percentage = Math.floor((quizScore / currentQuiz.questions.length) * 100);
            const pointsEarned = Math.floor((quizScore / currentQuiz.questions.length) * currentQuiz.points);

            return (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
                        <div className="mb-6">
                            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
                            <p className="text-gray-600">Great job on completing the quiz!</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-600">{quizScore}/{currentQuiz.questions.length}</div>
                                <div className="text-sm text-gray-600">Correct Answers</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-600">{percentage}%</div>
                                <div className="text-sm text-gray-600">Score</div>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-yellow-600">+{pointsEarned}</div>
                                <div className="text-sm text-gray-600">Points Earned</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => setCurrentView('quizzes')}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Back to Quizzes
                            </button>
                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/5 rounded-lg p-6 shadow-sm border border-white/10">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentQuiz.title}</h2>
                            <span className="text-sm text-gray-400">
                                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                            </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">{question.text}</h3>
                        <div className="space-y-3">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${selectedAnswer === null
                                            ? 'border-white/10 hover:border-blue-400 hover:bg-white/10'
                                            : selectedAnswer === index
                                                ? index === question.correctAnswer
                                                    ? 'border-green-500 bg-green-500/10'
                                                    : 'border-red-500 bg-red-500/10'
                                                : index === question.correctAnswer
                                                    ? 'border-green-500 bg-green-500/10'
                                                    : 'border-white/10 bg-white/5'
                                        }`}
                                >
                                    <span className="font-medium mr-3">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    {option}
                                    {selectedAnswer !== null && (
                                        <span className="float-right">
                                            {index === question.correctAnswer ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : selectedAnswer === index ? (
                                                <X className="h-5 w-5 text-red-500" />
                                            ) : null}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {showExplanation && (
                        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <h4 className="font-medium mb-2">Explanation:</h4>
                            <p className="text-gray-200">{question.explanation}</p>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <button
                            onClick={() => setCurrentView('quizzes')}
                            className="px-4 py-2 text-gray-300 hover:text-white"
                        >
                            Exit Quiz
                        </button>
                        {showExplanation && (
                            <button
                                onClick={nextQuestion}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderGames = () => (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Learning Games</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleGames.map(game => (
                    <div key={game.id} className="bg-white/5 rounded-lg p-6 shadow-sm border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                                <p className="text-gray-300 mb-3">{game.description}</p>
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                        {game.difficulty}
                                    </span>
                                    <span className="text-sm text-green-400 font-medium">
                                        +{game.points} points
                                    </span>
                                </div>
                            </div>
                            {userProfile.completedGames.includes(game.id) && (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            )}
                        </div>
                        <button
                            onClick={() => startGame(game)}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Play Game
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGame = () => {
        if (!currentGame) return null;

        if (currentGame.type === 'memory') {
            return (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/5 rounded-lg p-6 shadow-sm border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{currentGame.title}</h2>
                            <div className="text-right">
                    <div className="text-lg font-bold">Score: {gameScore}</div>
                        <div className="text-sm text-gray-300">Moves: {moves}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {gameCards.map(card => (
                                <button
                                    key={card.id}
                                    onClick={() => handleCardClick(card.id)}
                                    className={`aspect-square text-2xl rounded-lg border-2 transition-all ${card.flipped || card.matched
                                            ? 'bg-blue-500/10 border-blue-400/40'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {card.flipped || card.matched ? card.value : '?'}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentView('games')}
                                className="px-4 py-2 text-gray-300 hover:text-white"
                            >
                                Back to Games
                            </button>
                            <button
                                onClick={initializeMemoryGame}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                New Game
                            </button>
                        </div>

                        {gameCards.every(card => card.matched) && (
                            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                                <h3 className="text-lg font-bold text-green-300 mb-2">Congratulations! 🎉</h3>
                                <p className="text-green-200">You completed the game in {moves} moves!</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return <div>Game type not implemented yet.</div>;
    };

    const renderProfile = () => (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Your Profile</h1>

            <div className="bg-white/5 rounded-lg p-6 shadow-sm border border-white/10">
                <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                        <span suppressHydrationWarning>{userProfile.name.charAt(0)}</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold"><span suppressHydrationWarning>{userProfile.name}</span></h2>
                        <p className="text-gray-300">Level {userProfile.level} Learner</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-3">Learning Statistics</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Total Points:</span>
                                <span className="font-medium">{mounted ? userProfile.points : 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Quizzes Completed:</span>
                                <span className="font-medium">{mounted ? userProfile.completedQuizzes.length : 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Games Played:</span>
                                <span className="font-medium">{mounted ? userProfile.completedGames.length : 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Badges Earned:</span>
                                <span className="font-medium">{mounted ? userProfile.badges.length : 0}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Learning Style Analysis</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Preferred Style:</span>
                                <span className="font-medium capitalize">{mounted ? userProfile.learningStyle : 'mixed'}</span>
                            </div>
                            {Object.entries(userProfile.interactions).map(([style, count]) => (
                                <div key={style} className="flex justify-between">
                                    <span className="capitalize">{style}:</span>
                                    <span className="font-medium text-gray-300">{mounted ? count : 0} interactions</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {userProfile.badges.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-semibold mb-3">Your Badges</h3>
                        <div className="flex flex-wrap gap-2">
                            {userProfile.badges.map(badge => (
                                <span key={badge} className="bg-yellow-500/10 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Navigation
    const navigation = [
        { id: 'dashboard', label: 'Dashboard', icon: Target },
        { id: 'quizzes', label: 'Quizzes', icon: BookOpen },
        { id: 'games', label: 'Games', icon: Play },
        { id: 'profile', label: 'Profile', icon: Users },
        { id: 'style', label: 'Style Quiz', icon: Brain },
    ];

    return (
        <div className="min-h-screen bg-black text-white relative">
            <SmokeBackground />
            <CursorGlow />
            {/* Navigation */}
            <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Brain className="h-8 w-8 text-blue-400 mr-1" />
                            <h1 className="text-xl font-bold text-white">EduPathAI</h1>
                            <Link href="/" className="ml-2 text-gray-300 hover:text-white px-3 py-1 rounded-lg hover:bg-white/10 flex items-center gap-1">
                                <HomeIcon className="h-4 w-4" />
                                <span>Home</span>
                            </Link>
                        </div>

                        <div className="flex space-x-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setCurrentView(item.id)}
                                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === item.id
                                                ? 'bg-white/10 text-white'
                                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentView === 'dashboard' && renderDashboard()}
                {currentView === 'quizzes' && renderQuizzes()}
                {currentView === 'quiz' && renderQuiz()}
                {currentView === 'games' && renderGames()}
                {currentView === 'game' && renderGame()}
                {currentView === 'profile' && renderProfile()}
                {currentView === 'style' && renderStyleQuiz()}
            </main>
        </div>
    );
};

export default GameifiedLearningPlatform;