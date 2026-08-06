
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// UPDATE THIS IMPORT TO USE NEW COMPONENT
import Enhanced3DVRVideoPlayer from './Enhanced3DVRVideoPlayer'; // Changed from VRVideoPlayer
import { X, Glasses, Info } from 'lucide-react';

interface VRCourseModalProps {
  course: any;
  onClose: () => void;
}

const VRCourseModal: React.FC<VRCourseModalProps> = ({ course, onClose }) => {
  const [progress, setProgress] = useState(35);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-7xl h-full max-h-[90vh] overflow-hidden"
      >
        <Card className="bg-slate-900/95 backdrop-blur-lg border-slate-700/50 h-full overflow-hidden">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-2xl font-bold text-white">{course.title}</h2>
              <p className="text-slate-400">{course.instructor} • {course.subject}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* 3D Mode Info */}
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Glasses className="w-4 h-4" />
                <span>3D Mode Available</span>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 h-[calc(100%-80px)] overflow-hidden">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6 overflow-y-auto">
              {/* UPDATED: Use Enhanced3DVRVideoPlayer instead of VRVideoPlayer */}
              <Enhanced3DVRVideoPlayer 
                video={course} 
                onComplete={() => {
                  // Handle completion
                  console.log('Video completed');
                }}
                onError={(error) => {
                  console.error('Video error:', error);
                }}
              />
              
              {/* Rest of your existing modal content... */}
            </div>
            
            {/* Sidebar - your existing sidebar content */}
            <div className="space-y-6 overflow-y-auto">
              {/* Your existing sidebar content */}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default VRCourseModal;
