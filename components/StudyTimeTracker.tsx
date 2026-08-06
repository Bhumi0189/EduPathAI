"use client"

import React from 'react'
import useStudyTime from '@/hooks/useStudyTime'

export default function StudyTimeTracker() {
  // hook does the work; component just mounts it
  useStudyTime()
  return null
}
