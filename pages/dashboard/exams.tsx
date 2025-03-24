import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import DetailModal from '@/components/ui/DetailModal';
import { useVulcanData } from '@/lib/hooks/useVulcanData';
import { format, parseISO, isAfter, isBefore, addMonths, isValid } from 'date-fns';
import { ClipboardText, CalendarCheck, WarningCircle, CaretLeft, CaretRight, CaretDown } from '@phosphor-icons/react';
import withAuth from '@/lib/utils/withAuth';
import axios from 'axios';

interface DateObject {
  Timestamp: number;
  Date: string;
  DateDisplay: string;
  Time: string;
}

interface ExamData {
  Id: string | number;
  Key?: string;
  Type: string;
  TypeId?: number;
  Content: string;
  DateCreated?: DateObject;
  DateModify?: DateObject;
  Deadline: DateObject;
  Creator?: {
    Id: number;
    Name: string;
    Surname: string;
    DisplayName: string;
  };
  Subject: {
    Id: number | string;
    Key?: string;
    Name: string;
    Kod?: string;
    Position?: number;
  };
  PupilId?: number;
  Didactics?: any;
  
  // Legacy format fields, keeping for compatibility
  Date?: string;
  Teacher?: {
    Id: string;
    Name: string;
  };
  Topic?: string;
  Weight?: number;
}

function ExamsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rawExams, setRawExams] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // Format dates for API request
  const startDate = format(currentDate, 'yyyy-MM-dd');
  const endDate = format(addMonths(currentDate, 1), 'yyyy-MM-dd');
  
  // Use the hook to fetch exam data with explicit date range
  const { data: exams, isLoading, error } = useVulcanData('exams', {
    startDate,
    endDate
  });
  
  // Debug logging
  useEffect(() => {
    console.log(`ExamsPage: Date range ${startDate} to ${endDate}`);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
    console.log("Exams data:", exams);
  }, [startDate, endDate, isLoading, error, exams]);
  
  // Fetch and log raw response
  useEffect(() => {
    const fetchRawExams = async () => {
      try {
        setFetchError(null);
        console.log(`Fetching raw exams for date range: ${startDate} to ${endDate}`);
        const response = await axios.get(`/api/vulcan/exams?startDate=${startDate}&endDate=${endDate}`);
        console.log("Raw API Exams Response:", response.data);
        
        // Validate response structure
        if (!response.data) {
          console.warn("Empty response from exams API");
        } else if (!Array.isArray(response.data)) {
          console.warn("API response is not an array:", typeof response.data);
        } else {
          console.log(`Received ${response.data.length} exams`);
        }
        
        setRawExams(response.data);
      } catch (err: any) {
        console.error("Error fetching raw exams data:", err);
        setFetchError(err?.message || "Failed to fetch exam data");
      }
    };
    
    fetchRawExams();
  }, [startDate, endDate]);
  
  // Navigate to previous/next month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  // Safe date formatting helper
  const safeFormatDate = (dateStr: string, formatStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (!isValid(date)) {
        console.warn(`Invalid date: ${dateStr}`);
        return 'Invalid date';
      }
      return format(date, formatStr);
    } catch (err) {
      console.error(`Error formatting date ${dateStr}:`, err);
      return 'Date error';
    }
  };

  // Toggle content expansion
  const toggleExpand = (id: string | number) => {
    setExpandedIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(String(id))) {
        newIds.delete(String(id));
      } else {
        newIds.add(String(id));
      }
      return newIds;
    });
  };

  // Extract date from exam using the appropriate field
  const getExamDate = (exam: ExamData): string => {
    // First try to use Deadline.Date which is the primary field in the actual API response
    if (exam.Deadline && exam.Deadline.Date) {
      return exam.Deadline.Date;
    } 
    // Fallback to Date field (legacy format)
    else if (exam.Date) {
      return exam.Date.split('T')[0];
    }
    // Last resort - create a date from timestamp if available
    else if (exam.Deadline && exam.Deadline.Timestamp) {
      const date = new Date(exam.Deadline.Timestamp);
      return format(date, 'yyyy-MM-dd');
    }
    // Return invalid date string if nothing is available
    else {
      console.warn("Exam with no valid date:", exam);
      return "1970-01-01"; // Fallback invalid date
    }
  };

  // Get formatted display name
  const getTeacherName = (exam: ExamData): string => {
    if (exam.Creator && exam.Creator.DisplayName) {
      return exam.Creator.DisplayName;
    } else if (exam.Teacher && exam.Teacher.Name) {
      return exam.Teacher.Name;
    } else if (exam.Creator) {
      return `${exam.Creator.Name} ${exam.Creator.Surname}`;
    }
    return 'Unknown Teacher';
  };
  
  // Group exams by date
  const examsByDate = React.useMemo(() => {
    // Use the local rawExams instead of the hook data
    // This ensures we're working with the correct data format
    const dataToProcess = rawExams && Array.isArray(rawExams) ? rawExams : [];
    
    if (dataToProcess.length === 0) {
      console.log("No valid exams data to process");
      return {};
    }
    
    console.log("Processing exams for date grouping:", dataToProcess.length);
    
    return dataToProcess.reduce((acc: Record<string, ExamData[]>, exam: ExamData) => {
      if (!exam) {
        console.log("Skipping null/undefined exam");
        return acc;
      }
      
      try {
        const date = getExamDate(exam);
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(exam);
      } catch (err) {
        console.error("Error processing exam date:", err, exam);
      }
      return acc;
    }, {});
  }, [rawExams]);
  
  // Sort dates
  const sortedDates = Object.keys(examsByDate).sort();
  
  // Determine if an exam is upcoming, past, or current
  const getExamStatus = (examDate: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const parsedDate = parseISO(examDate);
      if (!isValid(parsedDate)) {
        return 'past';
      }
      
      if (isAfter(parsedDate, today)) {
        return 'upcoming';
      } else if (isBefore(parsedDate, today)) {
        return 'past';
      } else {
        return 'current';
      }
    } catch (err) {
      console.error(`Error determining exam status for ${examDate}:`, err);
      return 'past';
    }
  };
  
  // Handle exam card click
  const handleExamClick = (exam: ExamData) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  // Check if we have any errors to display
  const displayError = error || fetchError;
  
  // Show raw API data if there's an error but we have raw data
  const hasRawExams = rawExams && Array.isArray(rawExams) && rawExams.length > 0;
  
  return (
    <DashboardLayout title="Exams">
      {isLoading && !hasRawExams ? (
        <Loading text="Loading exams..." />
      ) : displayError && !hasRawExams ? (
        <ErrorDisplay message={displayError?.toString() || "An error occurred while fetching exams"} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 bg-surface rounded-full shadow-md hover:bg-overlay transition-colors"
            >
              <CaretLeft size={20} />
            </button>
            
            <h2 className="text-lg font-bold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <button 
              onClick={goToNextMonth}
              className="p-2 bg-surface rounded-full shadow-md hover:bg-overlay transition-colors"
            >
              <CaretRight size={20} />
            </button>
          </div>
          
          {sortedDates.length === 0 ? (
            <Card className="p-4 text-center">
              <div className="flex flex-col items-center justify-center p-6">
                <CalendarCheck size={48} className="text-text-secondary mb-4" />
                <p className="text-lg font-medium">No exams found for this period</p>
                <p className="text-text-secondary mt-2">Try changing the date range</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {sortedDates.map(date => {
                const examsForDate = examsByDate[date];
                const status = getExamStatus(date);
                
                return (
                  <div key={date} className="mb-4">
                    <div className="flex items-center mb-2">
                      <div 
                        className={`w-3 h-3 rounded-full mr-2 ${
                          status === 'upcoming' ? 'bg-primary' : 
                          status === 'current' ? 'bg-warning' : 'bg-text-secondary'
                        }`}
                      />
                      <h3 className="text-md font-mono font-medium">
                        {safeFormatDate(date, 'EEEE, MMMM d, yyyy')}
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      {examsForDate.map((exam: ExamData, index: number) => {
                        const isExpanded = expandedIds.has(String(exam.Id));
                        
                        return (
                          <Card 
                            key={exam.Id || index} 
                            className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleExamClick(exam)}
                          >
                            <div className="flex">
                              <div className="mr-3 mt-0.5">
                                <ClipboardText size={18} className="text-primary" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">{exam.Subject?.Name || 'Unknown Subject'}</h4>
                                  <span className="text-xs bg-surface px-2 py-0.5 rounded-full text-text-secondary">
                                    {exam.Type || 'Exam'}
                                  </span>
                                </div>
                                
                                <p className="text-xs text-text-secondary mb-1">
                                  {getTeacherName(exam)}
                                </p>
                                
                                <div 
                                  className={`text-sm text-text-secondary ${!isExpanded ? 'line-clamp-1' : ''}`}
                                >
                                  {exam.Content || 'No description available.'}
                                </div>
                                
                                {exam.Content && exam.Content.length > 50 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent card click
                                      toggleExpand(exam.Id);
                                    }}
                                    className="mt-1 flex items-center text-xs text-primary hover:text-primary-dark"
                                  >
                                    {isExpanded ? 'Less' : 'More'}
                                    <CaretDown 
                                      size={12} 
                                      className={`ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                    />
                                  </button>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Show any errors at the bottom, but don't prevent showing data */}
          {displayError && (
            <div className="mt-6">
              <Card className="p-4 bg-surface/50 border border-warning/20">
                <div className="flex items-center">
                  <WarningCircle size={20} className="text-warning mr-2" />
                  <p className="text-sm text-text-secondary">
                    {displayError.toString()}
                  </p>
                </div>
              </Card>
            </div>
          )}
          
          {/* Exam Detail Modal */}
          {selectedExam && (
            <DetailModal
              isOpen={isModalOpen}
              onClose={closeModal}
              title={selectedExam.Subject?.Name || "Exam Details"}
            >
              <div className="space-y-4">
                <div className="bg-surface p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Exam Information</h4>
                  <div className="space-y-2 text-text-secondary">
                    <p className="flex justify-between">
                      <span className="font-medium">Type:</span>
                      <span>{selectedExam.Type || 'Not specified'}</span>
                    </p>
                    
                    {selectedExam.DateCreated && (
                      <p className="flex justify-between">
                        <span className="font-medium">Created:</span>
                        <span>{selectedExam.DateCreated.DateDisplay}</span>
                      </p>
                    )}
                    
                    {selectedExam.Deadline && (
                      <p className="flex justify-between">
                        <span className="font-medium">Deadline:</span>
                        <span>{selectedExam.Deadline.DateDisplay}</span>
                      </p>
                    )}
                    
                    <p className="flex justify-between">
                      <span className="font-medium">Teacher:</span>
                      <span>{getTeacherName(selectedExam)}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-surface p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Description</h4>
                  <p className="text-text-secondary">{selectedExam.Content || 'No description available.'}</p>
                </div>
                
                {selectedExam.Topic && (
                  <div className="bg-surface p-4 rounded-lg">
                    <h4 className="font-medium text-primary mb-2">Topic</h4>
                    <p className="text-text-secondary">{selectedExam.Topic}</p>
                  </div>
                )}
                
                {/* Additional fields if available */}
                {Object.entries(selectedExam).filter(([key, value]) => 
                  !['Id', 'Key', 'Type', 'Content', 'DateCreated', 'DateModify', 'Deadline', 
                    'Creator', 'Subject', 'PupilId', 'Didactics', 'Date', 'Teacher', 'Topic'].includes(key) && 
                  value !== null && value !== undefined
                ).length > 0 && (
                  <div className="bg-surface p-4 rounded-lg">
                    <h4 className="font-medium text-primary mb-2">Additional Information</h4>
                    <div className="space-y-2 text-text-secondary">
                      {Object.entries(selectedExam).filter(([key, value]) => 
                        !['Id', 'Key', 'Type', 'Content', 'DateCreated', 'DateModify', 'Deadline', 
                          'Creator', 'Subject', 'PupilId', 'Didactics', 'Date', 'Teacher', 'Topic'].includes(key) && 
                        value !== null && value !== undefined
                      ).map(([key, value]) => (
                        <p key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span>
                            {typeof value === 'object' 
                              ? JSON.stringify(value).substring(0, 50) 
                              : String(value).substring(0, 50)}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DetailModal>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default withAuth(ExamsPage); 