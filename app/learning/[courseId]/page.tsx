'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, FileText, HelpCircle, PlayCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

type Lesson = { _id: string; order: number; title: string; type: 'lecture' | 'assignment' | 'quiz'; duration: string; content: string; assignment?: string; quiz?: { question: string; options: string[] }[] };

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, loading: userLoading } = useUser();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const selected = useMemo(() => lessons.find((lesson) => lesson._id === selectedId) || lessons[0], [lessons, selectedId]);

  useEffect(() => {
    if (userLoading || !courseId) return;
    fetch(`/api/courses?courseId=${encodeURIComponent(courseId)}${user?.id ? `&userId=${encodeURIComponent(user.id)}` : ''}`)
      .then((response) => { if (!response.ok) throw new Error(); return response.json(); })
      .then((data) => { setCourse(data.course); setLessons(data.lessons || []); setSelectedId(data.lessons?.[0]?._id || ''); setCompletedIds(data.progress?.completedLessonIds || []); })
      .catch(() => setError('Course could not be loaded.'));
  }, [courseId, user?.id, userLoading]);

  const completeLesson = async () => {
    if (!selected || !user?.id || completedIds.includes(selected._id)) return;
    const response = await fetch('/api/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, courseId, lessonId: selected._id }) });
    if (!response.ok) return;
    const data = await response.json();
    setCompletedIds(data.completedLessonIds || []);
  };

  if (error) return <main className="course-detail-page flex min-h-screen flex-col items-center justify-center text-white"><p>{error}</p><Link href="/learning" className="mt-4 text-cyan-300">Back to courses</Link></main>;
  if (!course || !selected) return <main className="course-detail-page flex min-h-screen items-center justify-center text-slate-300">Loading course...</main>;
  const progress = Math.round((completedIds.length / course.lessons) * 100);
  const Icon = selected.type === 'lecture' ? PlayCircle : selected.type === 'assignment' ? FileText : HelpCircle;

  return <main className="course-detail-page min-h-screen px-4 py-5 text-white sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl"><header className="course-detail-header"><Link href="/learning" className="learning-back-link"><ArrowLeft size={16} /> Course library</Link><strong className="text-cyan-300">{progress}% complete</strong></header><section className="course-detail-hero"><p className="learning-eyebrow"><BookOpen size={14} /> {course.subject} · {course.level}</p><h1>{course.title}</h1><p>{course.description}</p><div className="detail-progress"><span style={{ width: `${progress}%` }} /></div></section><div className="course-workspace"><aside className="lesson-sidebar"><div className="lesson-sidebar-heading"><div><p>Course outline</p><strong>{completedIds.length}/{course.lessons} lessons</strong></div></div><div className="lesson-list">{lessons.map((lesson) => <button key={lesson._id} className={`lesson-item ${selected._id === lesson._id ? 'selected' : ''}`} onClick={() => setSelectedId(lesson._id)}><span className="lesson-number">{completedIds.includes(lesson._id) ? <CheckCircle2 size={16} /> : String(lesson.order).padStart(2, '0')}</span><span><b>{lesson.title}</b><small><Icon size={12} /> {lesson.type} · {lesson.duration}</small></span></button>)}</div></aside><section className="lesson-content"><div className="lesson-content-kicker"><span>{selected.type}</span><span>Lesson {selected.order} of {course.lessons}</span></div><h2>{selected.title}</h2><p className="lesson-copy">{selected.content}</p><div className="activity-card"><Icon size={24} /><div><strong>{selected.type === 'assignment' ? 'Assignment' : selected.type === 'quiz' ? 'Knowledge check' : 'Lecture lesson'}</strong><p>{selected.assignment || 'Review this lesson, write one example in your own words, and continue when you are ready.'}</p></div></div><button className="complete-lesson-button" disabled={!user?.id || completedIds.includes(selected._id)} onClick={completeLesson}>{completedIds.includes(selected._id) ? 'Lesson completed' : user?.id ? 'Mark lesson complete' : 'Sign in to track progress'} <ChevronRight size={16} /></button></section></div></div></main>;
}
