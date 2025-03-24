import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import { useCurrentWeekData, useCurrentDayData } from '@/lib/hooks/useVulcanData';
import { formatDate, getDayOfWeek, formatTime } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  GraduationCap, 
  ClockCounterClockwise, 
  Notepad,
  Envelope,
  BookOpen,
  Building,
  Warning,
  Bug
} from '@phosphor-icons/react';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import DetailModal from '@/components/ui/DetailModal';
import withAuth from '@/lib/utils/withAuth';
import { getUserData } from '@/lib/utils/auth-utils';
import GradeUpdates from '@/components/ui/GradeUpdates';

function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useCurrentDayData('lessons');
  const { data: substitutions, isLoading: substitutionsLoading, error: substitutionsError } = useCurrentDayData('substitutions');
  const [todaysLessons, setTodaysLessons] = useState<any[]>([]);
  const [greeting, setGreeting] = useState('Good day');
  const [storageStatus, setStorageStatus] = useState<{available: boolean, error?: string}>({ available: false });
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check localStorage availability
  useEffect(() => {
    try {
      localStorage.setItem('storage_test', 'test');
      localStorage.removeItem('storage_test');
      setStorageStatus({ available: true });
      
      // Log all Vulcanic localStorage items
      const vulcanicItems: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('vulcanic_')) {
          vulcanicItems[key] = localStorage.getItem(key) || '';
        }
      }
      
      console.warn('[VULCANIC] localStorage items:', Object.keys(vulcanicItems));
      
      // Estimate used storage
      try {
        const allStorageData = JSON.stringify(localStorage);
        const usedKB = Math.round(allStorageData.length / 1024);
        console.warn(`[VULCANIC] Estimated storage usage: ~${usedKB}KB`);
      } catch (e) {
        console.warn('[VULCANIC] Could not estimate storage usage');
      }
      
    } catch (e) {
      console.error('[VULCANIC] localStorage error:', e);
      setStorageStatus({ 
        available: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      });
    }
  }, []);

  // Handle lesson click
  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isLoading = lessonsLoading || substitutionsLoading;
  const error = lessonsError || substitutionsError;

  // Get user information from localStorage
  const { name, email } = getUserData();
  // Sample static data
  const userInfo = {
    name: name || 'User',
    email: email || 'user@example.com',
    class: 'ZSE-I',
    school: 'Lodz'
  };

  useEffect(() => {
    // Update greeting based on time of day
    const hour = currentDate.getHours();
    if (hour < 6) setGreeting('Good night');
    else if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good day');
    else setGreeting('Good evening');

    // Update clock every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Combine lessons and substitutions for today
  useEffect(() => {
    if ((lessons && lessons.length > 0) || (substitutions && substitutions.length > 0)) {
      // Get today's date in local timezone format (YYYY-MM-DD)
      const todayObj = new Date();
      const todayYear = todayObj.getFullYear();
      const todayMonth = String(todayObj.getMonth() + 1).padStart(2, '0');
      const todayDay = String(todayObj.getDate()).padStart(2, '0');
      const today = `${todayYear}-${todayMonth}-${todayDay}`;
      
      console.log('[DEBUG] Today\'s date for filtering:', today);
      
      // Filter regular lessons
      const filteredLessons = lessons ? lessons.filter(lesson => {
        // Check date format from API
        let lessonDate = null;
        
        if (lesson.Date) {
          // If it's an object with Timestamp (Vulcan API format)
          if (lesson.Date.Timestamp) {
            // Convert timestamp to local date string (YYYY-MM-DD)
            const date = new Date(lesson.Date.Timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            lessonDate = `${year}-${month}-${day}`;
          } 
          // If it's an object with Date (Vulcan API format)
          else if (lesson.Date.Date) {
            lessonDate = lesson.Date.Date;
          }
          // If it's a date string in YYYY-MM-DD format
          else if (lesson.Date.DateDisplay) {
            // Convert from DD.MM.YYYY to YYYY-MM-DD
            const parts = lesson.Date.DateDisplay.split('.');
            if (parts.length === 3) {
              lessonDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
          }
          // If it's an object in another format
          else if (typeof lesson.Date === 'object') {
            try {
              // Try to extract year, month and day
              const year = lesson.Date.Year || lesson.Date.year;
              const month = (lesson.Date.Month || lesson.Date.month);
              const day = lesson.Date.Day || lesson.Date.day;
              
              if (year && month !== undefined && day) {
                lessonDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              }
            } catch (e) {
              console.error('Failed to parse lesson date:', e);
              return false; // Skip this lesson
            }
          }
        } 
        // If Date is a string
        else if (typeof lesson.Date === 'string') {
          lessonDate = lesson.Date.split('T')[0];
        }
        
        console.log(`[DEBUG] Lesson date: ${lessonDate}, comparing with today: ${today}`);
        return lessonDate === today;
      }) : [];
      
      // Filter substitutions
      const filteredSubstitutions = substitutions ? substitutions.filter(substitution => {
        let substitutionDate = null;
        
        if (substitution.LessonDate) {
          // Extract from LessonDate object
          if (typeof substitution.LessonDate === 'object') {
            if (substitution.LessonDate.Date) {
              substitutionDate = substitution.LessonDate.Date;
            } else if (substitution.LessonDate.Year && substitution.LessonDate.Month && substitution.LessonDate.Day) {
              const year = substitution.LessonDate.Year;
              const month = String(substitution.LessonDate.Month).padStart(2, '0');
              const day = String(substitution.LessonDate.Day).padStart(2, '0');
              substitutionDate = `${year}-${month}-${day}`;
            }
          }
        } else if (substitution.Date) {
          // Use existing date extraction logic as fallback
          if (typeof substitution.Date === 'object' && substitution.Date.Date) {
            substitutionDate = substitution.Date.Date;
          } 
          else if (typeof substitution.Date === 'string') {
            substitutionDate = substitution.Date.split('T')[0];
          }
        }
        
        return substitutionDate === today;
      }) : [];
      
      console.log(`[DEBUG] Found ${filteredLessons.length} lessons and ${filteredSubstitutions.length} substitutions for today`);
      
      // Process substitutions to mark replaced lessons
      const enhancedLessons = [...filteredLessons];
      
      // Add substitutions to the lessons array with a flag
      filteredSubstitutions.forEach(substitution => {
        // Get the original replaced lesson ID if available
        let replacedLessonId = null;
        if (substitution.ScheduleId) {
          replacedLessonId = substitution.ScheduleId;
        }
        
        // Determine if this is a direct replacement or a new lesson
        if (replacedLessonId) {
          // Check if this substitution replaces an existing lesson
          const existingLessonIndex = enhancedLessons.findIndex(lesson => 
            lesson.Id === replacedLessonId || lesson.ScheduleId === replacedLessonId
          );
          
          if (existingLessonIndex >= 0) {
            // Replace the existing lesson with this substitution but keep original info
            const originalInfo = enhancedLessons[existingLessonIndex];
            
            // Create the replacement object
            const replacementLesson = {
              ...substitution,
              isSubstitution: true,
              originalSubject: originalInfo.Subject,
              originalTeacher: originalInfo.TeacherPrimary || originalInfo.Teacher,
              originalRoom: originalInfo.Room,
              substitutionReason: substitution.TeacherAbsenceEffectName || 'Substitution',
              Change: substitution.Change
            };

            // Preserve TimeSlot from original lesson if not present in substitution
            if (!replacementLesson.TimeSlot && originalInfo.TimeSlot) {
              replacementLesson.TimeSlot = {
                ...originalInfo.TimeSlot,
                isFromOriginalLesson: true
              };
            }
            
            // Preserve TimeStart and TimeEnd from original lesson if not present in substitution
            if ((!replacementLesson.TimeStart || !replacementLesson.TimeEnd) && 
                (originalInfo.TimeStart || originalInfo.TimeEnd)) {
              replacementLesson.TimeStart = replacementLesson.TimeStart || originalInfo.TimeStart;
              replacementLesson.TimeEnd = replacementLesson.TimeEnd || originalInfo.TimeEnd;
            }
            
            // Replace the original lesson with the substitution
            enhancedLessons[existingLessonIndex] = replacementLesson;
          } else {
            // Add as a new lesson with substitution flag
            enhancedLessons.push({
              ...substitution,
              isSubstitution: true,
              substitutionReason: substitution.TeacherAbsenceEffectName || 'Substitution',
              Change: substitution.Change
            });
          }
        } else {
          // If there's no direct relation, just add as a new lesson with substitution flag
          enhancedLessons.push({
            ...substitution,
            isSubstitution: true,
            substitutionReason: substitution.TeacherAbsenceEffectName || 'Substitution',
            Change: substitution.Change
          });
        }
      });
      
      // Existing sorting and current lesson logic
      const sorted = enhancedLessons.sort((a, b) => {
        // Convert lesson start time to Date object for comparison
        let timeA, timeB;
        
        try {
          // Process TimeSlot in Vulcan API format
          if (a.TimeSlot && a.TimeSlot.Start) {
            const [hourA, minuteA] = a.TimeSlot.Start.split(':').map(Number);
            timeA = new Date(0, 0, 0, hourA || 0, minuteA || 0);
          } 
          // Other time formats
          else if (a.TimeStart) {
            if (typeof a.TimeStart === 'string') {
              timeA = new Date(a.TimeStart);
            } else if (a.TimeStart && a.TimeStart.Hour !== undefined) {
              timeA = new Date(0, 0, 0, a.TimeStart.Hour, a.TimeStart.Minute || 0);
            } else {
              timeA = new Date();
            }
          } else {
            timeA = new Date();
          }
          
          // Process TimeSlot in Vulcan API format
          if (b.TimeSlot && b.TimeSlot.Start) {
            const [hourB, minuteB] = b.TimeSlot.Start.split(':').map(Number);
            timeB = new Date(0, 0, 0, hourB || 0, minuteB || 0);
          }
          // Other time formats
          else if (b.TimeStart) {
            if (typeof b.TimeStart === 'string') {
              timeB = new Date(b.TimeStart);
            } else if (b.TimeStart && b.TimeStart.Hour !== undefined) {
              timeB = new Date(0, 0, 0, b.TimeStart.Hour, b.TimeStart.Minute || 0);
            } else {
              timeB = new Date();
            }
          } else {
            timeB = new Date();
          }
        } catch (e) {
          console.error('Error parsing lesson time:', e);
          return 0;
        }
        
        return timeA.getTime() - timeB.getTime();
      });
      
      // Add current lesson information
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      const mappedLessons = sorted.map(lesson => {
        // Check if this lesson is currently happening
        let isCurrentLesson = false;
        
        // Parse start and end times
        let startHour = 0, startMinute = 0, endHour = 0, endMinute = 0;
        
        if (lesson.TimeSlot) {
          if (lesson.TimeSlot.Start && lesson.TimeSlot.End) {
            const startParts = lesson.TimeSlot.Start.split(':').map(Number);
            const endParts = lesson.TimeSlot.End.split(':').map(Number);
            
            startHour = startParts[0] || 0;
            startMinute = startParts[1] || 0;
            endHour = endParts[0] || 0;
            endMinute = endParts[1] || 0;
          }
        } else if (lesson.TimeStart && lesson.TimeEnd) {
          if (typeof lesson.TimeStart === 'string' && typeof lesson.TimeEnd === 'string') {
            const startDate = new Date(lesson.TimeStart);
            const endDate = new Date(lesson.TimeEnd);
            
            startHour = startDate.getHours();
            startMinute = startDate.getMinutes();
            endHour = endDate.getHours();
            endMinute = endDate.getMinutes();
          } else if (lesson.TimeStart.Hour !== undefined && lesson.TimeEnd.Hour !== undefined) {
            startHour = lesson.TimeStart.Hour || 0;
            startMinute = lesson.TimeStart.Minute || 0;
            endHour = lesson.TimeEnd.Hour || 0;
            endMinute = lesson.TimeEnd.Minute || 0;
          }
        }
        
        // Convert all times to minutes for easier comparison
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        // Check if current time is between start and end
        isCurrentLesson = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
        
        return {
          ...lesson,
          isCurrentLesson
        };
      });
      
      setTodaysLessons(mappedLessons);
    } else {
      setTodaysLessons([]);
    }
  }, [lessons, substitutions]);

  const quickLinks = [
    { title: 'Schedule', icon: Calendar, color: 'bg-accent', href: '/dashboard/schedule' },
    { title: 'Grades', icon: GraduationCap, color: 'bg-primary', href: '/dashboard/grades' },
    { title: 'Attendance', icon: ClockCounterClockwise, color: 'bg-secondary', href: '/dashboard/attendance' },
    { title: 'Homework', icon: Notepad, color: 'bg-green-500', href: '/dashboard/homework' }
  ];

  const renderContent = () => {
    if (isLoading) {
      return <Loading text="Loading schedule..." />;
    }

    if (error) {
      return <ErrorDisplay message={error.message} />;
    }

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg font-bold">{userInfo.name}</h2>
                <div className="text-text-secondary text-xs space-y-1">
                  <div className="flex items-center">
                    <BookOpen size={12} className="mr-1" />
                    <span>Class {userInfo.class}</span>
                  </div>
                  <div className="flex items-center">
                    <Building size={12} className="mr-1" />
                    <span>{userInfo.school}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickLinks.map((link, index) => (
            <Link href={link.href} key={index} onClick={(e) => {
              e.preventDefault();
              window.location.href = link.href;
            }}>
              <Card className="p-4">
                <div className={`w-10 h-10 rounded-full ${link.color} flex items-center justify-center mb-3`}>
                  <link.icon size={24} weight="bold" className="text-white" />
                </div>
                <h3 className="font-medium">{link.title}</h3>
              </Card>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-mono font-bold mb-4">Today</h2>
        
        {/* Display lessons (including substitutions) */}
        {todaysLessons.length > 0 ? (
          <div className="space-y-3">
            {todaysLessons.map((lesson, index) => {
              // Check if this is a substitution
              const isSubstitution = lesson.isSubstitution || false;
              const substitutionReason = lesson.substitutionReason || '';
              let changeType = '';
              
              // Get change information if it exists
              if (lesson.Change && lesson.Change.Type) {
                switch (lesson.Change.Type) {
                  case 1:
                    changeType = 'Canceled';
                    break;
                  case 2:
                    changeType = 'Changed';
                    break;
                  case 3:
                    changeType = 'Moved to';
                    break;
                  default:
                    changeType = 'Modified';
                }
              }
              
              return (
                <Card 
                  key={index} 
                  className={`p-4 ${lesson.isCurrentLesson ? 'border-2 border-accent' : ''} ${isSubstitution ? 'border-l-4 border-warning' : ''} cursor-pointer hover:shadow-md transition-shadow`}
                  withHover={true}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-text-primary">
                          {lesson.Subject?.Name || lesson.Subject || 'Lesson'}
                        </h3>
                        {isSubstitution && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-warning text-white">
                            {substitutionReason || changeType || 'Substitution'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">
                        {lesson.Room?.Code ? `Room: ${lesson.Room.Code}` : (lesson.Room ? `Room: ${lesson.Room}` : '')}
                        {lesson.TeacherPrimary?.DisplayName ? ` • ${lesson.TeacherPrimary.DisplayName}` : 
                         (lesson.Teacher ? ` • ${lesson.Teacher}` : '')}
                      </p>
                      {isSubstitution && lesson.originalSubject && lesson.Subject && (
                        <p className="text-xs text-warning-dark mt-1">
                          {typeof lesson.originalSubject === 'string' 
                            ? `Changed from: ${lesson.originalSubject}` 
                            : `Changed from: ${lesson.originalSubject.Name || 'Unknown'}`}
                        </p>
                      )}
                      {isSubstitution && lesson.originalSubject && (!lesson.TimeSlot || (lesson.TimeSlot && !lesson.TimeSlot.isFromOriginalLesson)) && (
                        <p className="text-xs text-info-dark mt-1">
                          Using original lesson time
                        </p>
                      )}
                    </div>
                    <div className="bg-surface px-3 py-1 rounded-full text-text-secondary text-sm">
                      {lesson.TimeSlot?.Display || 
                       (lesson.TimeStart && lesson.TimeEnd ? `${formatTime(lesson.TimeStart)} - ${formatTime(lesson.TimeEnd)}` : 
                        (lesson.TimeSlot ? `${lesson.TimeSlot.Start} - ${lesson.TimeSlot.End}` : 'Time not specified'))}
                      {isSubstitution && lesson.originalSubject && 
                        lesson.TimeSlot && lesson.TimeSlot.isFromOriginalLesson && 
                        ' (Original time)'}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6 text-center" withHover={false}>
            <p className="text-text-secondary">No lessons for today</p>
          </Card>
        )}
        
        {/* Lesson Detail Modal */}
        {selectedLesson && (
          <DetailModal 
            isOpen={isModalOpen}
            onClose={closeModal}
            title={selectedLesson.Subject?.Name || selectedLesson.Subject || "Lesson Details"}
          >
            <div className="space-y-4">
              <div className="bg-surface p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Schedule Information</h4>
                <div className="space-y-2 text-text-secondary">
                  <p className="flex justify-between">
                    <span className="font-medium">Time:</span>
                    <span>
                      {selectedLesson.TimeSlot?.Display || 
                       (selectedLesson.TimeStart && selectedLesson.TimeEnd ? 
                        `${formatTime(selectedLesson.TimeStart)} - ${formatTime(selectedLesson.TimeEnd)}` : 
                        (selectedLesson.TimeSlot ? 
                          `${selectedLesson.TimeSlot.Start} - ${selectedLesson.TimeSlot.End}` : 
                          'N/A'))}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Room:</span>
                    <span>
                      {selectedLesson.Room?.Code ? 
                        selectedLesson.Room.Code : 
                        (typeof selectedLesson.Room === 'string' ? 
                          selectedLesson.Room : 
                          selectedLesson.Room?.Name || 'N/A')}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Position:</span>
                    <span>
                      {selectedLesson.TimeSlot?.Position || selectedLesson.Position || 'N/A'}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="bg-surface p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Teacher Information</h4>
                <div className="space-y-2 text-text-secondary">
                  <p className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>
                      {selectedLesson.TeacherPrimary?.DisplayName || 
                       (typeof selectedLesson.Teacher === 'string' ? 
                         selectedLesson.Teacher : 
                         selectedLesson.Teacher?.DisplayName || 'N/A')}
                    </span>
                  </p>
                  {selectedLesson.Teacher?.Email && (
                    <p className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{selectedLesson.Teacher.Email}</span>
                    </p>
                  )}
                </div>
              </div>
              
              {selectedLesson.Topic && (
                <div className="bg-surface p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Lesson Topic</h4>
                  <p className="text-text-secondary">
                    {typeof selectedLesson.Topic === 'string' ? 
                     selectedLesson.Topic : 
                     JSON.stringify(selectedLesson.Topic)}
                  </p>
                </div>
              )}
              
              {selectedLesson.isSubstitution && (
                <div className="bg-surface p-4 rounded-lg border-l-4 border-warning">
                  <h4 className="font-medium text-warning mb-2">Substitution Information</h4>
                  <div className="space-y-2 text-text-secondary">
                    <p className="flex justify-between">
                      <span className="font-medium">Reason:</span>
                      <span>{selectedLesson.substitutionReason || 'N/A'}</span>
                    </p>
                    {selectedLesson.originalSubject && (
                      <p className="flex justify-between">
                        <span className="font-medium">Original Subject:</span>
                        <span>
                          {typeof selectedLesson.originalSubject === 'string' ? 
                           selectedLesson.originalSubject : 
                           selectedLesson.originalSubject.Name || 'Unknown'}
                        </span>
                      </p>
                    )}
                    {selectedLesson.originalTeacher && (
                      <p className="flex justify-between">
                        <span className="font-medium">Original Teacher:</span>
                        <span>
                          {typeof selectedLesson.originalTeacher === 'string' ? 
                           selectedLesson.originalTeacher : 
                           selectedLesson.originalTeacher.DisplayName || 'Unknown'}
                        </span>
                      </p>
                    )}
                    {selectedLesson.originalRoom && (
                      <p className="flex justify-between">
                        <span className="font-medium">Original Room:</span>
                        <span>
                          {typeof selectedLesson.originalRoom === 'string' ? 
                           selectedLesson.originalRoom : 
                           selectedLesson.originalRoom.Name || selectedLesson.originalRoom.Code || 'Unknown'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Show additional data if available */}
              <div className="text-xs text-text-tertiary mt-4">
                <p>Lesson ID: {selectedLesson.Id || selectedLesson.ScheduleId || 'N/A'}</p>
              </div>
            </div>
          </DetailModal>
        )}
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-mono font-bold">
            {greeting}, {userInfo.name.split(' ')[0]}!
          </h1>
          <div className="text-right">
            <p className="text-text-secondary">
              {formatDate(currentDate, 'EEEE, MMMM d')}
            </p>
            <p className="text-text-tertiary text-sm">
              {formatDate(currentDate, 'h:mm a')}
            </p>
          </div>
        </div>
      </div>
      
      {renderContent()}
    </DashboardLayout>
  );
}

export default withAuth(Dashboard); 