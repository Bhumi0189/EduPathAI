'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Brain, CheckCircle2, ChevronRight, Clock3, Code2, FlaskConical, GraduationCap, Search, Star, Target, X } from 'lucide-react';
import { SmokeBackground } from '../components/smoke-background';
import { CursorGlow } from '../components/cursor-glow';
import { useUser } from '@/hooks/useUser';

type Course = {
  id: string;
  title: string;
  subject: string;
  level: string;
  lessons: number;
  duration: string;
  rating: string;
  progress: number;
  completedLessons?: number;
  description: string;
  color: string;
  icon: React.ReactNode;
};

const courses: Course[] = [
  { id: 'chemistry', title: 'Chemistry Foundations', subject: 'Chemistry', level: 'Beginner', lessons: 12, duration: '4h 20m', rating: '4.9', progress: 0, description: 'Build a strong foundation in atoms, bonding, reactions, and the language of chemistry.', color: 'cyan', icon: <FlaskConical size={22} /> },
  { id: 'biology', title: 'Biology: Life Systems', subject: 'Biology', level: 'Intermediate', lessons: 16, duration: '6h 10m', rating: '4.8', progress: 0, description: 'Understand cells, genetics, ecosystems, and the systems that keep living things working.', color: 'emerald', icon: <Brain size={22} /> },
  { id: 'physics', title: 'Physics in Practice', subject: 'Physics', level: 'Intermediate', lessons: 14, duration: '5h 35m', rating: '4.7', progress: 0, description: 'Learn motion, forces, energy, and electricity through clear explanations and worked examples.', color: 'violet', icon: <Target size={22} /> },
  { id: 'python', title: 'Python for Problem Solving', subject: 'Computer Science', level: 'Beginner', lessons: 18, duration: '7h 15m', rating: '4.9', progress: 0, description: 'Write useful Python programs while learning logic, data structures, and debugging habits.', color: 'amber', icon: <Code2 size={22} /> },
];

const colorStyles: Record<string, string> = {
  cyan: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
  emerald: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
  violet: 'border-violet-300/20 bg-violet-300/10 text-violet-200',
  amber: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
};

export default function LearningPage() {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseCatalog, setCourseCatalog] = useState<Course[]>(courses);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [courseStats, setCourseStats] = useState({ active: 0, completed: 0, progress: 0 });
  const { user, loading: userLoading } = useUser();

  React.useEffect(() => {
    let mounted = true;
    const loadCourseStats = async () => {
      try {
        const response = await fetch(user?.id ? `/api/courses?userId=${encodeURIComponent(user.id)}` : '/api/courses');
        if (!response.ok) return;
        const data = await response.json();
        const iconBySubject: Record<string, React.ReactNode> = { Chemistry: <FlaskConical size={22} />, Biology: <Brain size={22} />, Physics: <Target size={22} />, 'Computer Science': <Code2 size={22} />, Mathematics: <Target size={22} />, 'Personal Growth': <Brain size={22} /> };
        const colorBySubject: Record<string, string> = { Chemistry: 'cyan', Biology: 'emerald', Physics: 'violet', 'Computer Science': 'amber', Mathematics: 'cyan', 'Personal Growth': 'emerald' };
        const loadedCourses = (data?.courses || []).map((course: any) => ({ ...course, color: colorBySubject[course.subject] || 'cyan', icon: iconBySubject[course.subject] || <BookOpen size={22} /> }));
        if (mounted) {
          setCourseCatalog(loadedCourses);
          setCourseStats(user?.id ? { active: data?.summary?.activeCourses || 0, completed: data?.summary?.completedLessons || 0, progress: data?.summary?.learningProgress || 0 } : { active: 0, completed: 0, progress: 0 });
        }
      } catch {
        // Keep the empty state when progress is unavailable.
      }
    };

    loadCourseStats();
    return () => { mounted = false; };
  }, [user?.id]);

  const filteredCourses = useMemo(() => courseCatalog.filter((course) => {
    const matchesSubject = subject === 'All courses' || course.subject === subject;
    const matchesQuery = `${course.title} ${course.subject} ${course.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesSubject && matchesQuery;
  }), [courseCatalog, query, subject]);
  const visibleCourses = showAllCourses ? filteredCourses : filteredCourses.slice(0, 4);
  const openCourse = async (course: Course) => {
    setSelectedCourse(course);
    if (!user?.id) return;
    try {
      await fetch('/api/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, courseId: course.id, progress: course.progress, completedLessons: course.completedLessons || 0 }) });
    } catch {
      // Opening a course should still work if progress saving is temporarily unavailable.
    }
  };

  return (
    <main className="learning-page min-h-screen px-4 py-5 text-white sm:px-6 lg:px-10">
      <SmokeBackground />
      <CursorGlow />
      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link href="/" className="learning-brand"><span><GraduationCap size={18} /></span> EduPath AI</Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex"><Link href="/dashboard" className="hover:text-white">Dashboard</Link><Link href="/ai-coach" className="hover:text-white">AI Coach</Link><span className="text-cyan-300">Courses</span></nav>
          <Link href="/dashboard" className="learning-back-link">My progress <ChevronRight size={15} /></Link>
        </header>

        <section className="learning-hero">
          <div>
            <p className="learning-eyebrow"><BookOpen size={14} /> Course library</p>
            <h1>Learn more.<br /><span>Go further.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Clear courses, practical lessons, and visible progress.</p>
          </div>
          <div className="learning-summary"><div><strong>{userLoading ? '—' : courseStats.active}</strong><span>active courses</span></div><div><strong>{userLoading ? '—' : courseStats.completed}</strong><span>lessons completed</span></div><div><strong>{userLoading ? '—' : `${courseStats.progress}%`}</strong><span>learning progress</span></div></div>
        </section>

        <section className="learning-toolbar">
          <div className="learning-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses" aria-label="Search courses" /></div>
          <div className="learning-filters">{['All courses', 'Chemistry', 'Biology', 'Physics', 'Computer Science'].map((item) => <button key={item} className={subject === item ? 'active' : ''} onClick={() => setSubject(item)}>{item}</button>)}</div>
        </section>

        <section className="learning-section-heading"><div><p className="learning-eyebrow">Your learning library</p><h2>Continue learning</h2></div><div className="learning-section-actions"><span>{filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}</span>{filteredCourses.length > 4 && <button onClick={() => setShowAllCourses((value) => !value)}>{showAllCourses ? 'Show less' : 'View all courses'} <ChevronRight size={14} className={showAllCourses ? 'rotate-[-90deg]' : ''} /></button>}</div></section>
        <section className={`learning-grid ${showAllCourses ? 'learning-grid-expanded' : 'learning-carousel'}`}>
          {visibleCourses.map((course) => <article key={course.id} className="learning-card">
            <div className="learning-card-top"><div className={`learning-course-icon ${colorStyles[course.color]}`}>{course.icon}</div><span className="learning-level">{course.level}</span></div>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{course.subject}</p>
            <h3>{course.title}</h3>
            <p className="learning-description">{course.description}</p>
            <div className="learning-meta"><span><BookOpen size={14} /> {course.lessons} lessons</span><span><Clock3 size={14} /> {course.duration}</span><span><Star size={14} /> {course.rating}</span></div>
            <div className="learning-progress-row"><span>Progress</span><strong>{course.progress}%</strong></div><div className="learning-progress"><span style={{ width: `${course.progress}%` }} /></div>
            <button className="learning-card-button" onClick={() => openCourse(course)}>{course.progress > 0 ? 'Continue course' : 'Start course'} <ChevronRight size={16} /></button>
          </article>)}
          {filteredCourses.length === 0 && <div className="learning-empty"><Search size={24} /><h3>No courses found</h3><p>Try a different search or choose another subject.</p><button onClick={() => { setQuery(''); setSubject('All courses'); }}>Clear filters</button></div>}
        </section>
      </div>

      {selectedCourse && <div className="learning-modal-backdrop" onClick={() => setSelectedCourse(null)}><section className="learning-modal" onClick={(event) => event.stopPropagation()}><button className="learning-close" onClick={() => setSelectedCourse(null)} aria-label="Close course"><X size={18} /></button><div className={`learning-course-icon ${colorStyles[selectedCourse.color]}`}>{selectedCourse.icon}</div><p className="learning-eyebrow mt-6">{selectedCourse.subject} · {selectedCourse.level}</p><h2>{selectedCourse.title}</h2><p>{selectedCourse.description}</p><div className="learning-lesson-list"><div><CheckCircle2 size={17} /> Welcome and course goals</div><div><span>02</span> Core concepts and examples</div><div><span>03</span> Practice and knowledge check</div></div><button className="learning-card-button" onClick={() => setSelectedCourse(null)}>Open first lesson <ChevronRight size={16} /></button></section></div>}
    </main>
  );
}