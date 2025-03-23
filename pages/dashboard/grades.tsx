import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { useVulcanData } from '@/lib/hooks/useVulcanData';
import { formatGrade, getGradeColor } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { Trophy, CaretDown, CaretUp, MagnifyingGlass } from '@phosphor-icons/react';
import withAuth from '@/lib/utils/withAuth';
import DetailModal from '@/components/ui/DetailModal';

// Интерфейс для оценки
interface Grade {
  Value?: string | number;
  Content?: string;
  ContentRaw?: string;
  Comment?: string;
  Topic?: string;
  Column?: {
    Subject?: string | SubjectObject;
    Name?: string;
    Code?: string;
    Weight?: number;
    Category?: {
      Id?: number;
      Name?: string;
      Code?: string;
    };
  };
  Subject?: string | SubjectObject;
}

// Интерфейс для объекта предмета
interface SubjectObject {
  Id?: number | string;
  Key?: string;
  Name?: string;
  Kod?: string;
  Position?: number | string;
  [key: string]: any; // Для других возможных свойств
}

// Интерфейс для предмета с оценками
interface SubjectWithGrades {
  name: string;
  grades: Grade[];
  average: number;
}

function Grades() {
  const { data: grades, isLoading, error } = useVulcanData('grades');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState<'name' | 'average'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSubject, setSelectedSubject] = useState<SubjectWithGrades | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (grades) {
      console.log('Полученные оценки:', grades);
      if (grades.length > 0) {
        console.log('Структура первой оценки:', grades[0]);
        // Проверим, есть ли Subject в оценках
        console.log('Subject поле:', grades.some(g => g.Subject) ? 'Да' : 'Нет');
        // Проверим Column поле, которое может содержать информацию о предмете
        console.log('Column поле:', grades.some(g => g.Column) ? 'Да' : 'Нет');
        if (grades.some(g => g.Column)) {
          console.log('Пример Column:', grades.find(g => g.Column)?.Column);
        }
      }
    }
  }, [grades]);

  // Группировка оценок по предметам
  const subjectGrades = useMemo(() => {
    if (!grades || !grades.length) return [];

    console.log('Начинаю группировку оценок');
    
    const subjectsMap = new Map<string, SubjectWithGrades>();
    
    grades.forEach((grade: Grade) => {
      // Используем Column.Subject вместо grade.Subject, если доступно
      let subject = grade.Column?.Subject || grade.Subject;
      
      // Проверяем, является ли subject объектом и преобразуем его в строку при необходимости
      if (subject && typeof subject === 'object') {
        console.log('Subject - это объект:', subject);
        // Пытаемся использовать Name или другое подходящее поле
        if ('Name' in subject && subject.Name) {
          subject = String(subject.Name);
        } else {
          // Если нет подходящего поля, используем строковое представление JSON
          subject = JSON.stringify(subject);
        }
      }
      
      if (!subject) {
        console.log('Оценка без предмета:', grade);
        return;
      }
      
      if (!subjectsMap.has(subject)) {
        subjectsMap.set(subject, {
          name: subject,
          grades: [],
          average: 0
        });
      }
      
      subjectsMap.get(subject)?.grades.push(grade);
    });
    
    // Расчет средних оценок
    subjectsMap.forEach(subject => {
      const numericGrades = subject.grades
        .filter((g: Grade) => g.Value && !isNaN(parseFloat(String(g.Value))))
        .map((g: Grade) => parseFloat(String(g.Value)));
      
      if (numericGrades.length > 0) {
        const sum = numericGrades.reduce((a: number, b: number) => a + b, 0);
        subject.average = +(sum / numericGrades.length).toFixed(2);
      }
    });
    
    console.log('Результат группировки:', Array.from(subjectsMap.values()));
    return Array.from(subjectsMap.values());
  }, [grades]);

  // Фильтрация и сортировка предметов
  const filteredAndSortedSubjects = useMemo(() => {
    if (!subjectGrades.length) return [];
    
    let filtered = subjectGrades;
    
    // Фильтрация по поисковому запросу
    if (searchTerm) {
      filtered = filtered.filter(subject => 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Сортировка
    return filtered.sort((a: SubjectWithGrades, b: SubjectWithGrades) => {
      if (sortCriteria === 'name') {
        // Убедимся, что name это строка
        const aName = a.name ? String(a.name) : '';
        const bName = b.name ? String(b.name) : '';
        const comparison = aName.localeCompare(bName);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = (a.average || 0) - (b.average || 0);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });
  }, [subjectGrades, searchTerm, sortCriteria, sortDirection]);

  // Переключение направления сортировки
  const toggleSort = (criteria: 'name' | 'average') => {
    if (sortCriteria === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortDirection('asc');
    }
  };

  // Расчет общего среднего балла
  const overallAverage = useMemo(() => {
    if (!subjectGrades.length) return 0;
    
    const subjectsWithAverage = subjectGrades.filter((s: SubjectWithGrades) => s.average > 0);
    if (!subjectsWithAverage.length) return 0;
    
    const sum = subjectsWithAverage.reduce((acc: number, subject: SubjectWithGrades) => acc + subject.average, 0);
    return +(sum / subjectsWithAverage.length).toFixed(2);
  }, [subjectGrades]);

  // Handle subject card click
  const handleSubjectClick = (subject: SubjectWithGrades) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout title="Grades">
      {isLoading ? (
        <Loading text="Loading grades..." />
      ) : error ? (
        <ErrorDisplay message={error.message} />
      ) : (
        <>
          <div className="mb-6">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-mono font-bold mb-2">Average Grade</h2>
                  <div className="flex items-center">
                    <Trophy size={24} weight="fill" className="text-yellow-500 mr-3" />
                    <span className={`text-xl font-bold ${getGradeColor(overallAverage)}`}>
                      {overallAverage || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className={`text-5xl font-bold ${getGradeColor(overallAverage)}`}>
                  {overallAverage || 'N/A'}
                </div>
              </div>
            </Card>
          </div>

          <div className="mb-5">
            <div className="relative">
              <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search by subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-overlay rounded-lg py-2 pl-10 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center px-2 py-1 text-sm text-text-secondary">
              <button 
                onClick={() => toggleSort('name')}
                className="flex items-center focus:outline-none"
              >
                Subject
                {sortCriteria === 'name' && (
                  sortDirection === 'asc' ? <CaretUp size={16} className="ml-1" /> : <CaretDown size={16} className="ml-1" />
                )}
              </button>
              
              <button 
                onClick={() => toggleSort('average')}
                className="flex items-center focus:outline-none"
              >
                Average Grade
                {sortCriteria === 'average' && (
                  sortDirection === 'asc' ? <CaretUp size={16} className="ml-1" /> : <CaretDown size={16} className="ml-1" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {filteredAndSortedSubjects.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
                className="space-y-6"
              >
                {filteredAndSortedSubjects.map((subject, index) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-2"
                  >
                    <Card 
                      className="p-5 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
                      onClick={() => handleSubjectClick(subject)}
                    >
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-overlay">
                        <h3 className="font-medium text-lg">{
                          // Ensure subject name is always a string
                          typeof subject.name === 'string' 
                            ? subject.name 
                            : (typeof subject.name === 'object' && subject.name !== null)
                              ? JSON.stringify(subject.name)
                              : 'Unknown Subject'
                        }</h3>
                        <span className={`font-bold text-xl ${getGradeColor(subject.average)}`}>
                          {subject.average || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 pt-1">
                        {subject.grades.map((grade: Grade, gradeIndex: number) => {
                          // Format topic for display - use Column.Name as the primary source
                          const topicContent = (() => {
                            // Primary source: Column.Name (as shown in the reference data)
                            if (grade.Column && grade.Column.Name) {
                              return typeof grade.Column.Name === 'string' ? grade.Column.Name : 
                                    typeof grade.Column.Name === 'object' && grade.Column.Name !== null ? 
                                    JSON.stringify(grade.Column.Name) : '';
                            }
                            
                            // Fallback: Topic field
                            if (grade.Topic) {
                              return typeof grade.Topic === 'string' ? grade.Topic : 
                                    typeof grade.Topic === 'object' && grade.Topic !== null ? 
                                    JSON.stringify(grade.Topic) : '';
                            }
                            
                            // Further fallbacks if needed
                            return 'No topic';
                          })();
                          
                          // Format comment for display
                          const commentContent = (() => {
                            if (grade.Comment) {
                              return typeof grade.Comment === 'string' ? grade.Comment :
                                    typeof grade.Comment === 'object' && grade.Comment !== null ?
                                    JSON.stringify(grade.Comment) : '';
                            }
                            return '';
                          })();

                          // Get weight if available
                          const weight = grade.Column?.Weight !== undefined ? grade.Column.Weight : '';
                          
                          // Create a rich tooltip with all available information
                          const tooltipContent = [
                            topicContent && `Topic: ${topicContent}`,
                            commentContent && `Comment: ${commentContent}`,
                            weight && `Weight: ${weight}`,
                            grade.Column?.Category?.Name && `Category: ${grade.Column.Category.Name}`,
                            grade.Column?.Code && `Code: ${grade.Column.Code}`
                          ].filter(Boolean).join('\n');
                          
                          return (
                            <div 
                              key={gradeIndex}
                              className={`px-4 py-2 rounded-md shadow-sm bg-surface-hover ${getGradeColor(grade.Value || '')} font-medium border border-overlay hover:scale-105 transition-transform duration-150`}
                              title={tooltipContent}
                            >
                              {formatGrade(grade)}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card className="p-8 text-center shadow-md">
                <p className="text-text-secondary text-lg">
                  {searchTerm ? 'Subjects not found' : 'Grades not available'}
                </p>
              </Card>
            )}
          </div>

          {/* Subject Detail Modal */}
          {selectedSubject && (
            <DetailModal 
              isOpen={isModalOpen}
              onClose={closeModal}
              title={
                typeof selectedSubject.name === 'string' 
                  ? selectedSubject.name 
                  : (typeof selectedSubject.name === 'object' && selectedSubject.name !== null)
                    ? JSON.stringify(selectedSubject.name)
                    : 'Subject Details'
              }
            >
              <div className="space-y-4">
                <div className="bg-surface p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Performance Summary</h4>
                  <div className="space-y-2 text-text-secondary">
                    <p className="flex justify-between">
                      <span className="font-medium">Average Grade:</span>
                      <span className={`font-bold ${getGradeColor(selectedSubject.average)}`}>
                        {selectedSubject.average || 'N/A'}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Total Grades:</span>
                      <span>{selectedSubject.grades.length}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-surface p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">All Grades</h4>
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-text-secondary border-b border-overlay">
                        <th className="text-left pb-2 font-medium">Grade</th>
                        <th className="text-left pb-2 font-medium">Topic</th>
                        <th className="text-left pb-2 font-medium">Comment</th>
                        <th className="text-left pb-2 font-medium">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSubject.grades.map((grade: Grade, index: number) => {
                        // Format topic for display - use Column.Name as the primary source
                        const topicContent = (() => {
                          // Primary source: Column.Name (as shown in the reference data)
                          if (grade.Column && grade.Column.Name) {
                            return typeof grade.Column.Name === 'string' ? grade.Column.Name : 
                                  typeof grade.Column.Name === 'object' && grade.Column.Name !== null ? 
                                  JSON.stringify(grade.Column.Name) : '';
                          }
                          
                          // Fallback: Topic field
                          if (grade.Topic) {
                            return typeof grade.Topic === 'string' ? grade.Topic : 
                                  typeof grade.Topic === 'object' && grade.Topic !== null ? 
                                  JSON.stringify(grade.Topic) : '';
                          }
                          
                          // Further fallbacks if needed
                          return 'No topic';
                        })();
                        
                        // Format comment for display
                        const commentContent = (() => {
                          if (grade.Comment) {
                            return typeof grade.Comment === 'string' ? grade.Comment :
                                  typeof grade.Comment === 'object' && grade.Comment !== null ?
                                  JSON.stringify(grade.Comment) : '';
                          }
                          return '';
                        })();

                        // Get weight if available
                        const weight = grade.Column?.Weight !== undefined ? grade.Column.Weight : '';
                        
                        // Create a rich tooltip with all available information
                        const tooltipContent = [
                          topicContent && `Topic: ${topicContent}`,
                          commentContent && `Comment: ${commentContent}`,
                          weight && `Weight: ${weight}`,
                          grade.Column?.Category?.Name && `Category: ${grade.Column.Category.Name}`,
                          grade.Column?.Code && `Code: ${grade.Column.Code}`
                        ].filter(Boolean).join('\n');
                        
                        return (
                          <tr key={index} className="border-b border-overlay/50 hover:bg-overlay/20" title={tooltipContent}>
                            <td className={`py-2 ${getGradeColor(grade.Value || '')}`}>
                              {formatGrade(grade)}
                            </td>
                            <td className="py-2 text-text-secondary text-sm">
                              {topicContent}
                              {grade.Column?.Category?.Name && (
                                <span className="ml-1 text-xs text-text-tertiary">
                                  ({grade.Column.Category.Name})
                                </span>
                              )}
                            </td>
                            <td className="py-2 text-text-secondary text-sm">
                              {commentContent}
                            </td>
                            <td className="py-2 text-text-secondary text-sm text-center">
                              {weight || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </DetailModal>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default withAuth(Grades); 