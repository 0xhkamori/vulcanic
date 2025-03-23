import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { getStoredGradeUpdate, clearGradeUpdate } from '@/lib/hooks/useGradeUpdates';
import { formatGrade, getGradeColor, formatDate } from '@/lib/utils/formatters';
import { GraduationCap, X, ArrowRight, Warning } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Grade } from '@/types/grades';
import DetailModal from '@/components/ui/DetailModal';
import { useRouter } from 'next/router';

/**
 * Component that displays new grade notifications
 * Fetches grade updates from localStorage and displays them
 */
const GradeUpdates: React.FC = () => {
  const router = useRouter();
  const [updates, setUpdates] = useState<{ 
    newGrades: Grade[], 
    timestamp: string | null 
  }>({ newGrades: [], timestamp: null });
  const [isVisible, setIsVisible] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load and display new grades
  useEffect(() => {
    console.warn('[VULCANIC_UI] GradeUpdates component mounted');
    
    try {
      // Get grade updates from localStorage
      const storedUpdates = getStoredGradeUpdate();
      
      // Only show if we actually have updates
      if (storedUpdates.newGrades && storedUpdates.newGrades.length > 0) {
        setUpdates(storedUpdates);
        setIsVisible(true);
        console.warn('[VULCANIC_UI] Displaying grade updates notification');
      }
    } catch (error) {
      console.error('[VULCANIC_UI] Error loading grade updates:', error);
      setLoadError(String(error));
    }
  }, []);

  // Clean up updates when dismissed
  const handleDismiss = () => {
    setIsVisible(false);
    
    // Clear the update after animation completes
    setTimeout(() => {
      clearGradeUpdate();
    }, 300);
  };

  // Handle viewing all grades
  const handleViewAllGrades = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clear the updates
    clearGradeUpdate();
    // Navigate to grades page with reload for fresh data
    window.location.href = '/dashboard/grades';
  };

  // Open grade detail modal
  const handleGradeClick = (grade: Grade, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGrade(null);
  };

  // Helper to get subject name
  const getSubjectName = (grade: Grade): string => {
    try {
      const subject = grade.Column?.Subject || grade.Subject;
      
      if (!subject) return 'Unknown Subject';
      
      if (typeof subject === 'string') return subject;
      
      if (typeof subject === 'object' && subject !== null) {
        if ('Name' in subject && subject.Name) {
          return String(subject.Name);
        } else {
          return JSON.stringify(subject);
        }
      }
      
      return 'Unknown Subject';
    } catch (error) {
      console.error('[VULCANIC_UI] Error getting subject name:', error);
      return 'Error';
    }
  };

  // Get topic if available
  const getTopic = (grade: Grade): string => {
    try {
      if (grade.Column?.Name) {
        return typeof grade.Column.Name === 'string' 
          ? grade.Column.Name 
          : JSON.stringify(grade.Column.Name);
      }
      
      if (grade.Topic) {
        return typeof grade.Topic === 'string' 
          ? grade.Topic 
          : JSON.stringify(grade.Topic);
      }
      
      return '';
    } catch (error) {
      console.error('[VULCANIC_UI] Error getting topic:', error);
      return '';
    }
  };

  // If there was an error, show a simple error indicator (only in development)
  if (loadError && process.env.NODE_ENV === 'development') {
    return (
      <Card className="p-3 border-l-4 border-red-500 mb-4">
        <div className="flex items-center text-text-secondary">
          <Warning size={16} className="text-red-500 mr-2" />
          <span className="text-sm">Error loading updates</span>
        </div>
      </Card>
    );
  }

  // Don't render anything if there are no updates or they've been dismissed
  if (!isVisible || !updates.newGrades || updates.newGrades.length === 0) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-5"
          >
            <Card 
              className="p-4 border-l-4 border-primary shadow-md hover:shadow-lg transition-shadow"
              onClick={() => handleViewAllGrades(new MouseEvent('click') as unknown as React.MouseEvent)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="bg-primary rounded-full p-2 mr-3 mt-1">
                    <GraduationCap size={20} weight="fill" className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">
                      {updates.newGrades.length === 1 
                        ? "1 new grade added" 
                        : `${updates.newGrades.length} new grades added`}
                    </h3>
                    {updates.timestamp && (
                      <p className="text-sm text-text-secondary mb-3">
                        Added {formatDate(updates.timestamp)}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-1 mb-1">
                      {updates.newGrades.slice(0, 3).map((grade, idx) => (
                        <div 
                          key={idx}
                          onClick={(e) => handleGradeClick(grade, e)}
                          className={`px-3 py-2 rounded-md shadow-sm bg-surface-hover ${getGradeColor(grade.Value || '')} font-medium border border-overlay hover:scale-105 transition-transform duration-150 cursor-pointer`}
                        >
                          {formatGrade(grade)}
                        </div>
                      ))}
                      {updates.newGrades.length > 3 && (
                        <div className="px-3 py-2 rounded-md bg-surface text-text-secondary text-sm flex items-center">
                          +{updates.newGrades.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDismiss();
                    }}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <X size={18} />
                  </button>
                  
                  <div className="mt-auto flex items-center text-primary text-sm pt-4">
                    <span className="mr-1">View all grades</span>
                    <ArrowRight size={16} className="text-primary" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grade Detail Modal */}
      {selectedGrade && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={getSubjectName(selectedGrade)}
        >
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className={`text-4xl font-bold ${getGradeColor(selectedGrade.Value || '')}`}>
                {formatGrade(selectedGrade)}
              </div>
            </div>
            
            <div className="bg-surface p-4 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Grade Details</h4>
              <div className="space-y-2 text-text-secondary">
                <p className="flex justify-between">
                  <span className="font-medium">Subject:</span>
                  <span>{getSubjectName(selectedGrade)}</span>
                </p>
                {getTopic(selectedGrade) && (
                  <p className="flex justify-between">
                    <span className="font-medium">Topic:</span>
                    <span>{getTopic(selectedGrade)}</span>
                  </p>
                )}
                {selectedGrade.Comment && (
                  <p className="flex justify-between">
                    <span className="font-medium">Comment:</span>
                    <span>
                      {typeof selectedGrade.Comment === 'string' 
                        ? selectedGrade.Comment 
                        : JSON.stringify(selectedGrade.Comment)}
                    </span>
                  </p>
                )}
                {selectedGrade.Column?.Weight && (
                  <p className="flex justify-between">
                    <span className="font-medium">Weight:</span>
                    <span>{selectedGrade.Column.Weight}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleViewAllGrades}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                View All Grades
              </button>
            </div>
          </div>
        </DetailModal>
      )}
    </>
  );
};

export default GradeUpdates; 