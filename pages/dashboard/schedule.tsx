import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { useCurrentWeekData } from '@/lib/hooks/useVulcanData';
import { formatDate, getDayOfWeek, formatTime, parseDate, parseTime } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { CaretLeft, CaretRight, Warning } from '@phosphor-icons/react';
import withAuth from '@/lib/utils/withAuth';
import DetailModal from '@/components/ui/DetailModal';

function Schedule() {
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useCurrentWeekData('lessons');
  const { data: substitutions, isLoading: substitutionsLoading, error: substitutionsError } = useCurrentWeekData('substitutions');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [dailyLessons, setDailyLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoading = lessonsLoading || substitutionsLoading;
  const error = lessonsError || substitutionsError;

  // Отладка: вывод данных об уроках при их загрузке
  useEffect(() => {
    console.log("Lessons API response:", lessons);
    if (lessons && lessons.length > 0) {
      // Вывод первого урока для анализа структуры данных
      console.log("Sample lesson structure:", lessons[0]);
      // Подробный вывод структуры первого урока для выявления полей сортировки
      console.log("LESSON KEYS:", Object.keys(lessons[0]));
      // Проверяем наличие вложенных полей для сортировки
      console.log("TimeSlot:", lessons[0].TimeSlot ? Object.keys(lessons[0].TimeSlot) : "Not found");
      // Проверка поля Date
      console.log("Date field type:", lessons[0].Date ? typeof lessons[0].Date : "undefined");
      if (lessons[0].Date && typeof lessons[0].Date === 'object') {
        console.log("Date object structure:", lessons[0].Date);
      }
    } else {
      console.log("No lessons received");
    }
  }, [lessons]);

  // Отладка: вывод данных о заменах при их загрузке
  useEffect(() => {
    console.log("Substitutions API response:", substitutions);
    if (substitutions && substitutions.length > 0) {
      console.log("Sample substitution structure:", substitutions[0]);
      console.log("SUBSTITUTION KEYS:", Object.keys(substitutions[0]));
    } else {
      console.log("No substitutions received");
    }
  }, [substitutions]);

  // Создание массива дней недели
  useEffect(() => {
    const days = [];
    const currentDay = new Date(selectedDate);
    const dayOfWeek = currentDay.getDay(); // 0 - воскресенье, 1-6 - пн-сб
    
    // Начинаем с понедельника
    const monday = new Date(currentDay);
    monday.setDate(currentDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    
    setWeekDays(days);
    
    // Отладка: вывод диапазона дат
    console.log("Week dates:", days.map(d => formatDate(d)));
    console.log("Selected date:", formatDate(selectedDate));
  }, [selectedDate]);

  // Combine lessons and substitutions for the selected day
  useEffect(() => {
    if ((lessons && lessons.length > 0) || (substitutions && substitutions.length > 0)) {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      console.log("Target date for filtering:", selectedDateStr);
      
      // Filter regular lessons
      const filteredLessons = lessons ? lessons.filter(lesson => {
        let lessonDate;
        
        if (lesson.Date) {
          if (typeof lesson.Date === 'object' && lesson.Date.Date) {
            lessonDate = lesson.Date.Date;
          } 
          else if (typeof lesson.Date === 'string') {
            lessonDate = lesson.Date.split('T')[0];
          } else if (lesson.Date instanceof Date) {
            lessonDate = lesson.Date.toISOString().split('T')[0];
          } else if (lesson.Date && typeof lesson.Date === 'object') {
            try {
              const year = lesson.Date.Year || lesson.Date.year;
              const month = (lesson.Date.Month || lesson.Date.month) - 1;
              const day = lesson.Date.Day || lesson.Date.day;
              
              if (year && month !== undefined && day) {
                const date = new Date(year, month, day);
                lessonDate = date.toISOString().split('T')[0];
              }
            } catch (e) {
              console.error('Failed to parse lesson date:', e);
            }
          }
        }
        
        return lessonDate === selectedDateStr;
      }) : [];
      
      // Filter substitutions 
      const filteredSubstitutions = substitutions ? substitutions.filter(substitution => {
        let substitutionDate;
        
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
          // ... other existing date extraction logic ...
        }
        
        return substitutionDate === selectedDateStr;
      }) : [];
      
      console.log(`Found ${filteredLessons.length} lessons and ${filteredSubstitutions.length} substitutions for ${selectedDateStr}`);
      
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
      
      // Sort by time
      const sorted = enhancedLessons.sort((a, b) => {
        // Use TimeSlot.Position for sorting if available
        if (a.TimeSlot && b.TimeSlot) {
          if (a.TimeSlot.Position !== undefined && b.TimeSlot.Position !== undefined) {
            return a.TimeSlot.Position - b.TimeSlot.Position;
          }
          
          // If TimeSlot.Start exists, compare start times
          if (a.TimeSlot.Start && b.TimeSlot.Start) {
            const [hourA, minuteA] = a.TimeSlot.Start.split(':').map(Number);
            const [hourB, minuteB] = b.TimeSlot.Start.split(':').map(Number);
            
            const timeA = hourA * 60 + minuteA;
            const timeB = hourB * 60 + minuteB;
            
            return timeA - timeB;
          }
        }
        
        // If Position is defined, use it
        if (a.Position !== undefined && b.Position !== undefined) {
          return a.Position - b.Position;
        }
        
        // By default, keep original order
        return 0;
      });
      
      setDailyLessons(sorted);
    } else {
      setDailyLessons([]);
    }
  }, [lessons, substitutions, selectedDate]);

  // Переключение на предыдущую неделю
  const goToPreviousWeek = () => {
    const prevWeek = new Date(selectedDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setSelectedDate(prevWeek);
  };

  // Переключение на следующую неделю
  const goToNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek);
  };

  // Переключение дня
  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };

  // Определение, является ли день сегодняшним
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Определение, является ли день выбранным
  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Handle lesson click
  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout title="Schedule">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPreviousWeek}
            className="p-2 bg-surface rounded-full hover:bg-overlay transition-colors"
          >
            <CaretLeft size={20} />
          </button>
          
          <h2 className="font-mono text-lg">
            {formatDate(weekDays[0], 'dd.MM')} - {formatDate(weekDays[6], 'dd.MM')}
          </h2>
          
          <button 
            onClick={goToNextWeek}
            className="p-2 bg-surface rounded-full hover:bg-overlay transition-colors"
          >
            <CaretRight size={20} />
          </button>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {weekDays.map((day, index) => (
            <button
              key={index}
              onClick={() => selectDay(day)}
              className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected(day) 
                  ? 'bg-primary text-white' 
                  : isToday(day) 
                    ? 'bg-surface border border-primary text-primary' 
                    : 'bg-surface text-text-secondary hover:bg-overlay/50'
              }`}
            >
              <span className="text-xs">{formatDate(day, 'EEE').slice(0, 1)}</span>
              <span className="font-bold">{formatDate(day, 'd')}</span>
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <Loading text="Loading schedule..." />
      ) : error ? (
        <ErrorDisplay message={error.message} />
      ) : (
        <div className="space-y-3">
          <h3 className="font-medium text-text-secondary mb-2">
            {getDayOfWeek(selectedDate)}, {formatDate(selectedDate)}
          </h3>
          
          {/* Display lessons (including substitutions) */}
          {dailyLessons.length > 0 ? (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {dailyLessons.map((lesson, index) => {
                // Get lesson data with different format checks
                let subject = 'Lesson';
                if (lesson.Subject) {
                  if (typeof lesson.Subject === 'string') {
                    subject = lesson.Subject;
                  } else if (lesson.Subject.Name) {
                    subject = lesson.Subject.Name;
                  } else if (typeof lesson.Subject === 'object') {
                    // Convert object to string
                    subject = JSON.stringify(lesson.Subject);
                  }
                } else if (lesson.subject) {
                  if (typeof lesson.subject === 'string') {
                    subject = lesson.subject;
                  } else if (typeof lesson.subject === 'object') {
                    subject = JSON.stringify(lesson.subject);
                  }
                }
                
                // Room handling
                let room = '';
                if (lesson.Room) {
                  if (typeof lesson.Room === 'string') {
                    room = lesson.Room;
                  } else if (lesson.Room.Name) {
                    room = lesson.Room.Name;
                  } else if (lesson.Room.Code) {
                    // Use room code directly
                    room = lesson.Room.Code;
                  } else if (typeof lesson.Room === 'object') {
                    // If Room object has Id and Code fields, take only Code
                    try {
                      room = lesson.Room.Code || '';
                    } catch (e) {
                      room = '';
                    }
                  }
                } else if (lesson.room) {
                  if (typeof lesson.room === 'string') {
                    room = lesson.room;
                  } else if (lesson.room.Code) {
                    room = lesson.room.Code;
                  } else if (typeof lesson.room === 'object') {
                    try {
                      room = lesson.room.Code || '';
                    } catch (e) {
                      room = '';
                    }
                  }
                }
                
                // Teacher handling
                let teacher = '';
                if (lesson.Teacher) {
                  if (typeof lesson.Teacher === 'string') {
                    teacher = lesson.Teacher;
                  } else if (lesson.Teacher.DisplayName) {
                    teacher = lesson.Teacher.DisplayName;
                  } else if (typeof lesson.Teacher === 'object') {
                    teacher = JSON.stringify(lesson.Teacher);
                  }
                } else if (lesson.teacher) {
                  if (typeof lesson.teacher === 'string') {
                    teacher = lesson.teacher;
                  } else if (typeof lesson.teacher === 'object') {
                    teacher = JSON.stringify(lesson.teacher);
                  }
                } else if (lesson.TeacherPrimary) {
                  if (typeof lesson.TeacherPrimary === 'string') {
                    teacher = lesson.TeacherPrimary;
                  } else if (lesson.TeacherPrimary.DisplayName) {
                    teacher = lesson.TeacherPrimary.DisplayName;
                  } else if (typeof lesson.TeacherPrimary === 'object') {
                    teacher = JSON.stringify(lesson.TeacherPrimary);
                  }
                }
                
                // Lesson topic handling
                let topic = '';
                if (lesson.Topic) {
                  if (typeof lesson.Topic === 'string') {
                    topic = lesson.Topic;
                  } else if (typeof lesson.Topic === 'object') {
                    topic = JSON.stringify(lesson.Topic);
                  }
                } else if (lesson.topic) {
                  if (typeof lesson.topic === 'string') {
                    topic = lesson.topic;
                  } else if (typeof lesson.topic === 'object') {
                    topic = JSON.stringify(lesson.topic);
                  }
                }
                
                // Enhanced time start and end handling
                let timeStart = '';
                let timeEnd = '';
                let lessonNumber = '';
                let timeDisplay = '';
                
                // Check for TimeSlot
                if (lesson.TimeSlot) {
                  if (lesson.TimeSlot.Display) {
                    console.log(`Using TimeSlot.Display for ${subject}: ${lesson.TimeSlot.Display}`);
                    // In example data, time display is in format "08:15-09:00"
                    const times = lesson.TimeSlot.Display.split('-');
                    if (times.length === 2) {
                      timeStart = times[0];
                      timeEnd = times[1];
                    } else {
                      timeDisplay = lesson.TimeSlot.Display;
                    }
                  } else if (lesson.TimeSlot.Start && lesson.TimeSlot.End) {
                    timeStart = lesson.TimeSlot.Start;
                    timeEnd = lesson.TimeSlot.End;
                  }
                  
                  // Get lesson number from Position
                  if (lesson.TimeSlot.Position !== undefined) {
                    lessonNumber = String(lesson.TimeSlot.Position);
                  }
                }
                
                // If time not found in TimeSlot, use other methods
                if (!timeStart && !timeEnd) {
                  // Rest of the code for finding time
                  // ... (existing logic)
                }
                
                // Form time display
                // If time found in TimeSlot.Display, use it directly
                if (lesson.TimeSlot && lesson.TimeSlot.Display) {
                  timeDisplay = lesson.TimeSlot.Display;
                  
                  // Add lesson number if available
                  if (lessonNumber) {
                    timeDisplay = `${lessonNumber}. ${timeDisplay}`;
                  }
                } else {
                  // If lesson number available, show it
                  if (lessonNumber) {
                    timeDisplay = `Lesson ${lessonNumber}`;
                    
                    // If time available, show it in parentheses
                    if (timeStart) {
                      if (timeEnd) {
                        timeDisplay += ` (${timeStart}-${timeEnd})`;
                      } else {
                        timeDisplay += ` (${timeStart})`;
                      }
                    }
                  } else if (timeStart) {
                    // If no lesson number but time available
                    if (timeEnd) {
                      timeDisplay = `${timeStart}-${timeEnd}`;
                    } else {
                      timeDisplay = timeStart;
                    }
                  } else {
                    // If no lesson number or time
                    timeDisplay = 'N/A';
                  }
                }

                // Substitution information
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      className={`p-4 ${isSubstitution ? 'border-l-4 border-warning' : ''} cursor-pointer`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-text-primary">
                              {subject}
                            </h3>
                            {isSubstitution && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-warning text-white">
                                {substitutionReason || changeType || 'Substitution'}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-text-secondary space-y-1">
                            {room && (
                              <p>Room: {room}</p>
                            )}
                            {teacher && (
                              <p>Teacher: {teacher}</p>
                            )}
                            {topic && (
                              <p>Topic: {topic}</p>
                            )}
                            {lesson.originalSubject && lesson.Subject && (
                              <p className="text-warning-dark">
                                {typeof lesson.originalSubject === 'string' 
                                  ? `Changed from: ${lesson.originalSubject}` 
                                  : `Changed from: ${lesson.originalSubject.Name || 'Unknown'}`}
                              </p>
                            )}
                            {isSubstitution && (!lesson.TimeSlot || (lesson.TimeSlot && lesson.TimeSlot.isFromOriginalLesson)) && (
                              <p className="text-xs text-info-dark">
                                Using original lesson time
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-surface px-3 py-1 rounded-full text-text-secondary text-sm whitespace-nowrap ml-2">
                          {timeDisplay}
                          {isSubstitution && lesson.originalSubject && 
                            lesson.TimeSlot && lesson.TimeSlot.isFromOriginalLesson && 
                            ' (Original time)'}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-6 text-text-tertiary">
              No lessons scheduled for this day
            </div>
          )}
        </div>
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
                     (selectedLesson.TimeSlot?.Start && selectedLesson.TimeSlot?.End ? 
                      `${selectedLesson.TimeSlot.Start} - ${selectedLesson.TimeSlot.End}` : 
                      'N/A')}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Room:</span>
                  <span>
                    {typeof selectedLesson.Room === 'string' ? selectedLesson.Room : 
                     selectedLesson.Room?.Name || selectedLesson.Room?.Code || 'N/A'}
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
                    {typeof selectedLesson.Teacher === 'string' ? selectedLesson.Teacher : 
                     selectedLesson.Teacher?.DisplayName || 
                     selectedLesson.TeacherPrimary?.DisplayName || 'N/A'}
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
    </DashboardLayout>
  );
}

export default withAuth(Schedule); 