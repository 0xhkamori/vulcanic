import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { useCurrentDayData } from '@/lib/hooks/useVulcanData';
import { formatDate, formatTime, formatAttendance, parseDate, parseTime } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChartPie, 
  Calendar,
  Check,
  X,
  Warning,
  MinusCircle,
  MagnifyingGlass
} from '@phosphor-icons/react';
import withAuth from '@/lib/utils/withAuth';
import DetailModal from '@/components/ui/DetailModal';

function Attendance() {
  // Remove monthly navigation and store only today's date
  const today = useMemo(() => new Date(), []);
  const formattedToday = useMemo(() => {
    return today.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    });
  }, [today]);
  
  // Getting attendance type from different data formats
  const getPresenceTypeId = (record: any): number => {
    if (record.PresenceType) {
      // Check if PresenceType is an object with Id property
      if (typeof record.PresenceType === 'object' && record.PresenceType !== null) {
        if (typeof record.PresenceType.Id === 'number') {
          // Mapping non-standard codes to standard ones
          if (record.PresenceType.Id === 1228) return 0; // Absence
          if (record.PresenceType.Id === 1229) return 1; // Presence
          if (record.PresenceType.Id === 1231) return 2; // Late
          
          console.log('Using PresenceType.Id:', record.PresenceType.Id);
          return record.PresenceType.Id;
        } else if (record.PresenceType.Type !== undefined) {
          // In some API responses there might be a Type field instead of Id
          console.log('Using PresenceType.Type:', record.PresenceType.Type);
          return record.PresenceType.Type;
        }
      }
      
      // If PresenceType is a number
      if (typeof record.PresenceType === 'number') {
        // Mapping non-standard codes to standard ones
        if (record.PresenceType === 1228) return 0; // Absence
        if (record.PresenceType === 1229) return 1; // Presence
        if (record.PresenceType === 1231) return 2; // Late
        
        console.log('Using PresenceType as number:', record.PresenceType);
        return record.PresenceType;
      }
    }
    
    // Format with presenceTypeId directly
    if (typeof record.presenceTypeId === 'number') {
      // Mapping non-standard codes to standard ones
      if (record.presenceTypeId === 1228) return 0; // Absence
      if (record.presenceTypeId === 1229) return 1; // Presence
      if (record.presenceTypeId === 1231) return 2; // Late
      
      console.log('Using presenceTypeId:', record.presenceTypeId);
      return record.presenceTypeId;
    }
    
    // If we have a string representation of type
    if (record.presenceType) {
      let id = -1;
      switch (record.presenceType) {
        case 'present': id = 0; break;
        case 'absent': id = 1; break;
        case 'late': id = 2; break;
        case 'excused': id = 3; break;
        default: id = -1; break;
      }
      console.log('Using presenceType string:', record.presenceType, '→', id);
      return id;
    }
    
    // Check for LessonId property (characteristic for Vulcan API)
    if (record.LessonId && record.PresenceType === undefined) {
      console.log('Assuming default presence type 0 for record with LessonId');
      return 0; // Assume it's presence by default
    }
    
    // Get ID from Type field (specific to certain API formats)
    if (record.Type !== undefined) {
      console.log('Using Type field:', record.Type);
      return typeof record.Type === 'number' ? record.Type : -1;
    }
    
    console.log('Could not determine presence type, defaulting to 0');
    return 0; // For this specific API we assume presence by default
  };
  
  // Getting attendance data for today
  const { data: attendance, isLoading, error } = useCurrentDayData('attendance');
  
  // Debug received data
  useEffect(() => {
    if (attendance && attendance.length > 0) {
      console.log('Attendance data:', attendance[0]);
      console.log('Total number of records:', attendance.length);
      console.log('All keys of first record:', Object.keys(attendance[0]));
      
      // Check record dates for debugging
      const todayStr = today.toISOString().split('T')[0];
      attendance.forEach((record, index) => {
        let recordDate = '';
        if (record.Date) {
          if (typeof record.Date === 'string') {
            recordDate = record.Date.split('T')[0];
          } else if (record.Date instanceof Date) {
            recordDate = record.Date.toISOString().split('T')[0];
          } else if (typeof record.Date === 'object') {
            const dateObj = parseDate(record.Date);
            if (dateObj) {
              recordDate = dateObj.toISOString().split('T')[0];
            }
          }
        } else if (record.Lesson && record.Lesson.Date) {
          const dateObj = parseDate(record.Lesson.Date);
          if (dateObj) {
            recordDate = dateObj.toISOString().split('T')[0];
          }
        }
        if (recordDate) {
          console.log(`Record ${index}: date = ${recordDate}, today = ${todayStr}, match: ${recordDate === todayStr}`);
        }
      });
    }
  }, [attendance, today]);
  
  // Use all attendance data without filtering by day
  const filteredAttendance = useMemo(() => {
    if (!attendance || !attendance.length) return [];
    
    // Check each record's day only in debug mode and keep all records
    return attendance;
  }, [attendance]);
  
  // Attendance statistics
  const stats = useMemo(() => {
    if (!filteredAttendance || !filteredAttendance.length) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        presentPercentage: 0,
        absentPercentage: 0,
        latePercentage: 0
      };
    }
    
    const total = filteredAttendance.length;
    
    // For compatibility we check both possible formats of attendance data
    const present = filteredAttendance.filter(a => {
      const typeId = getPresenceTypeId(a);
      return typeId === 1 || (a.PresenceType && a.PresenceType.Id === 1229);
    }).length;
    
    const absent = filteredAttendance.filter(a => {
      const typeId = getPresenceTypeId(a);
      return typeId === 0 || (a.PresenceType && a.PresenceType.Id === 1228);
    }).length;
    
    const late = filteredAttendance.filter(a => {
      const typeId = getPresenceTypeId(a);
      return typeId === 2 || (a.PresenceType && a.PresenceType.Id === 1231);
    }).length;
    
    const excused = filteredAttendance.filter(a => {
      const typeId = getPresenceTypeId(a);
      return typeId === 3;
    }).length;
    
    // Make sure percentage sum doesn't exceed 100%
    const calculatedTotal = present + absent + late + excused;
    
    return {
      total,
      present,
      absent,
      late,
      excused,
      presentPercentage: calculatedTotal ? Math.round((present / calculatedTotal) * 100) : 0,
      absentPercentage: calculatedTotal ? Math.round((absent / calculatedTotal) * 100) : 0,
      latePercentage: calculatedTotal ? Math.round((late / calculatedTotal) * 100) : 0
    };
  }, [filteredAttendance]);
  
  // Group attendance by day
  const groupedByDay = useMemo(() => {
    if (!filteredAttendance || !filteredAttendance.length) return [];
    
    const grouped = new Map();
    
    // Check for Date or Lesson.Date field in any record
    const hasDates = filteredAttendance.some(record => 
      record.Date || 
      record.date || 
      (record.Lesson && record.Lesson.Date)
    );
    
    // Use only one grouping method to avoid duplication
    if (!hasDates) {
      // If no date data, group by attendance type
      // Create a single group for all records instead of splitting by type
      grouped.set('Today', filteredAttendance);
    } else {
      // Group by date
      filteredAttendance.forEach(record => {
        // Format date using our enhanced function
        let date = 'Today'; // Use "Today" as default instead of "No date"
        
        if (record.Date) {
          date = formatDate(record.Date);
        } else if (record.date) {
          date = formatDate(record.date);
        } else if (record.Lesson && record.Lesson.Date) {
          date = formatDate(record.Lesson.Date);
        }
        
        if (!grouped.has(date)) {
          grouped.set(date, []);
        }
        
        grouped.get(date).push(record);
      });
    }
    
    // Sort by date (with "Today" always at the beginning)
    return Array.from(grouped.entries()).sort((a, b) => {
      if (a[0] === 'Today') return -1;
      if (b[0] === 'Today') return 1;
      
      if (a[0] === 'No date') return 1;
      if (b[0] === 'No date') return -1;
      
      const dateA = new Date(a[0].split('.').reverse().join('-'));
      const dateB = new Date(b[0].split('.').reverse().join('-'));
      return dateB.getTime() - dateA.getTime(); // Sort in descending order
    });
  }, [filteredAttendance]);
  
  // Get icon based on attendance type
  const getAttendanceIcon = (presenceTypeId: number) => {
    switch (presenceTypeId) {
      case 0: // Present
        return <CheckCircle size={20} weight="fill" className="text-green-500" />;
      case 1: // Absent
        return <XCircle size={20} weight="fill" className="text-red-500" />;
      case 2: // Late
        return <Clock size={20} weight="fill" className="text-orange-500" />;
      case 3: // Excused
        return <CheckCircle size={20} weight="fill" className="text-blue-500" />;
      default:
        return <XCircle size={20} weight="fill" className="text-text-secondary" />;
    }
  };
  
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle attendance card click
  const handleAttendanceClick = (record: any) => {
    setSelectedAttendance(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout title="Attendance">
      {isLoading ? (
        <Loading text="Loading attendance data..." />
      ) : error ? (
        <ErrorDisplay message={error.message} />
      ) : (
        <>
          <div className="mb-5">
            {/* Replace month navigation with a simple header with today's date */}
            <div className="flex justify-center items-center mb-4">
              <h2 className="font-mono text-lg flex items-center">
                <Calendar size={20} className="mr-2 text-primary" />
                {formattedToday}
              </h2>
            </div>
            
            <Card className="p-4">
              <h3 className="text-lg font-mono font-bold mb-3 flex items-center">
                <ChartPie size={20} className="mr-2 text-primary" />
                Attendance Statistics
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-surface p-3 rounded-lg">
                  <div className="text-text-secondary text-sm mb-1">Absence</div>
                  <div className="flex items-center">
                    <div className="text-xl font-bold text-red-500 mr-2">{stats.presentPercentage}%</div>
                    <div className="text-sm text-text-secondary">({stats.present} of {stats.total})</div>
                  </div>
                </div>
                
                <div className="bg-surface p-3 rounded-lg">
                  <div className="text-text-secondary text-sm mb-1">Presence</div>
                  <div className="flex items-center">
                    <div className="text-xl font-bold text-green-500 mr-2">{stats.absentPercentage}%</div>
                    <div className="text-sm text-text-secondary">({stats.absent} of {stats.total})</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-5">
            {groupedByDay.length > 0 ? (
              groupedByDay.map(([date, records]) => (
                <div key={date} className="space-y-2">
                  <h3 className="text-lg font-mono font-bold px-1">{date}</h3>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                    className="space-y-2"
                  >
                    {records.map((record: any, index: number) => {
                      const presenceTypeId = getPresenceTypeId(record);
                      const attendanceData = formatAttendance(record);
                      
                      // Get subject name
                      let subject = 'Lesson';
                      if (record.Subject) {
                        if (typeof record.Subject === 'object' && record.Subject.Name) {
                          subject = record.Subject.Name;
                        } else {
                          subject = String(record.Subject);
                        }
                      } else if (record.subject) {
                        subject = String(record.subject);
                      } else if (record.Lesson && record.Lesson.Subject) {
                        if (typeof record.Lesson.Subject === 'object' && record.Lesson.Subject.Name) {
                          subject = record.Lesson.Subject.Name;
                        } else {
                          subject = String(record.Lesson.Subject);
                        }
                      }
                      
                      // Get start and end times
                      const timeStart = formatTime(
                        record.TimeStart || record.timeStart || 
                        (record.TimeSlot && record.TimeSlot.TimeStart ? record.TimeSlot.TimeStart : null) ||
                        (record.Lesson && record.Lesson.TimeStart ? record.Lesson.TimeStart : null) ||
                        (record.Lesson && record.Lesson.TimeSlot && record.Lesson.TimeSlot.TimeStart ? record.Lesson.TimeSlot.TimeStart : null)
                      );
                      
                      const timeEnd = formatTime(
                        record.TimeEnd || record.timeEnd || 
                        (record.TimeSlot && record.TimeSlot.TimeEnd ? record.TimeSlot.TimeEnd : null) ||
                        (record.Lesson && record.Lesson.TimeEnd ? record.Lesson.TimeEnd : null) ||
                        (record.Lesson && record.Lesson.TimeSlot && record.Lesson.TimeSlot.TimeEnd ? record.Lesson.TimeSlot.TimeEnd : null)
                      );
                      
                      // Get teacher name
                      let teacher = '';
                      if (record.Teacher) {
                        if (typeof record.Teacher === 'object' && record.Teacher.DisplayName) {
                          teacher = record.Teacher.DisplayName;
                        } else {
                          teacher = String(record.Teacher);
                        }
                      } else if (record.teacher) {
                        teacher = String(record.teacher);
                      } else if (record.TeacherPrimary && record.TeacherPrimary.DisplayName) {
                        teacher = record.TeacherPrimary.DisplayName;
                      } else if (record.Lesson) {
                        if (record.Lesson.Teacher) {
                          if (typeof record.Lesson.Teacher === 'object' && record.Lesson.Teacher.DisplayName) {
                            teacher = record.Lesson.Teacher.DisplayName;
                          } else {
                            teacher = String(record.Lesson.Teacher);
                          }
                        } else if (record.Lesson.TeacherPrimary && record.Lesson.TeacherPrimary.DisplayName) {
                          teacher = record.Lesson.TeacherPrimary.DisplayName;
                        }
                      }
                      
                      // Get lesson ID for display
                      const lessonId = record.LessonId || (record.Lesson ? record.Lesson.Id : null);
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card 
                            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleAttendanceClick(record)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {getAttendanceIcon(presenceTypeId)}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{subject}</h4>
                                  <span className={`text-sm ${attendanceData.color}`}>
                                    {attendanceData.status}
                                  </span>
                                </div>
                                
                                <div className="text-sm text-text-secondary">
                                  {timeStart !== 'N/A' && timeEnd !== 'N/A' ? (
                                    <span>{timeStart} - {timeEnd}</span>
                                  ) : (
                                    <span>n/a</span>
                                  )}
                                  
                                  {teacher && (
                                    <span className="ml-2">• {teacher}</span>
                                  )}
                                  
                                  {lessonId && (
                                    <span className="ml-2 text-xs">ID: {lessonId}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-text-secondary">
                  No attendance data
                </p>
              </Card>
            )}
          </div>
        </>
      )}
      
      {/* Attendance Detail Modal */}
      {selectedAttendance && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Attendance Details"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0">
                {getAttendanceIcon(getPresenceTypeId(selectedAttendance))}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {selectedAttendance.Subject?.Name || 
                   typeof selectedAttendance.Subject === 'string' ? selectedAttendance.Subject : 
                   selectedAttendance.Lesson?.Subject?.Name || 'Lesson'}
                </h3>
                <p className={`${formatAttendance(selectedAttendance).color} font-medium`}>
                  {formatAttendance(selectedAttendance).status}
                </p>
              </div>
            </div>

            <div className="bg-surface p-4 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Attendance Information</h4>
              <div className="space-y-2 text-text-secondary">
                <p className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>
                    {selectedAttendance.Date || 
                     (selectedAttendance.DateFrom ? 
                      selectedAttendance.DateFrom.split('T')[0] : 'N/A')}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>
                    {formatTime(selectedAttendance.TimeStart || 
                                selectedAttendance.timeStart || 
                                (selectedAttendance.TimeSlot?.TimeStart) || 
                                (selectedAttendance.Lesson?.TimeStart))} - 
                    {formatTime(selectedAttendance.TimeEnd || 
                                selectedAttendance.timeEnd || 
                                (selectedAttendance.TimeSlot?.TimeEnd) || 
                                (selectedAttendance.Lesson?.TimeEnd))}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Teacher:</span>
                  <span>
                    {selectedAttendance.Teacher?.DisplayName || 
                     typeof selectedAttendance.Teacher === 'string' ? selectedAttendance.Teacher : 
                     selectedAttendance.Lesson?.Teacher?.DisplayName || 
                     selectedAttendance.TeacherPrimary?.DisplayName || 'N/A'}
                  </span>
                </p>
              </div>
            </div>

            {(selectedAttendance.Reason || selectedAttendance.reason) && (
              <div className="bg-surface p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Reason</h4>
                <p className="text-text-secondary">
                  {selectedAttendance.Reason || selectedAttendance.reason}
                </p>
              </div>
            )}

            {(selectedAttendance.Topic || selectedAttendance.Lesson?.Topic) && (
              <div className="bg-surface p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Lesson Topic</h4>
                <p className="text-text-secondary">
                  {selectedAttendance.Topic || selectedAttendance.Lesson?.Topic}
                </p>
              </div>
            )}

            {/* Show lesson ID if available */}
            <div className="text-xs text-text-tertiary mt-2">
              Lesson ID: {selectedAttendance.LessonId || 
                          (selectedAttendance.Lesson?.Id) || 'N/A'}
            </div>
          </div>
        </DetailModal>
      )}
    </DashboardLayout>
  );
}

export default withAuth(Attendance);