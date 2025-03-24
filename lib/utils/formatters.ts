import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Преобразование различных форматов даты в объект Date
export const parseDate = (date: any): Date | null => {
  if (!date) return null;
  
  // Если это строка, пробуем распарсить как ISO
  if (typeof date === 'string') {
    try {
      return parseISO(date);
    } catch (e) {
      console.error('Failed to parse date string:', e);
      return null;
    }
  }
  
  // Если это уже Date, возвращаем как есть
  if (date instanceof Date) {
    return date;
  }
  
  // Если это объект с полями Year/Month/Day (формат Vulcan API)
  if (typeof date === 'object') {
    try {
      const year = date.Year || date.year;
      const month = (date.Month || date.month) - 1; // JS месяцы начинаются с 0
      const day = date.Day || date.day;
      
      if (year && month !== undefined && day) {
        return new Date(year, month, day);
      }
    } catch (e) {
      console.error('Failed to parse date object:', e);
    }
  }
  
  return null;
};

// Форматирование даты
export const formatDate = (date: any, formatStr: string = 'dd.MM.yyyy'): string => {
  if (!date) return 'N/A';
  
  const dateObj = parseDate(date);
  if (!dateObj) return 'N/A';
  
  try {
    return format(dateObj, formatStr, { locale: enUS });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'N/A';
  }
};

// Преобразование времени в объект Date
export const parseTime = (time: any): Date | null => {
  if (!time) return null;
  
  // Если это строка ISO
  if (typeof time === 'string') {
    try {
      return parseISO(time);
    } catch (e) {
      console.error('Failed to parse time string:', e);
      return null;
    }
  }
  
  // Если это объект с полями Hour/Minute
  if (typeof time === 'object') {
    try {
      const hour = time.Hour || time.hour || 0;
      const minute = time.Minute || time.minute || 0;
      
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      return date;
    } catch (e) {
      console.error('Failed to parse time object:', e);
    }
  }
  
  return null;
};

// Форматирование времени
export const formatTime = (time: any): string => {
  if (!time) return 'N/A';
  
  const timeObj = parseTime(time);
  if (!timeObj) return 'N/A';
  
  try {
    return format(timeObj, 'HH:mm');
  } catch (e) {
    console.error('Error formatting time:', e);
    return 'N/A';
  }
};

// Получение дня недели
export const getDayOfWeek = (date: any): string => {
  if (!date) return 'N/A';
  
  const dateObj = parseDate(date);
  if (!dateObj) return 'N/A';
  
  try {
    return format(dateObj, 'EEEE', { locale: enUS });
  } catch (e) {
    console.error('Error getting day of week:', e);
    return 'N/A';
  }
};

// Форматирование оценки
export const formatGrade = (grade: any): string => {
  if (!grade) return 'N/A';
  
  // Если есть Content, используем его
  if (grade.Content) {
    // Проверяем, не является ли Content объектом
    const content = typeof grade.Content === 'object' && grade.Content !== null
      ? JSON.stringify(grade.Content)
      : String(grade.Content);
    
    // Проверяем, не является ли Comment объектом
    let comment = '';
    if (grade.Comment) {
      comment = typeof grade.Comment === 'object' && grade.Comment !== null
        ? JSON.stringify(grade.Comment)
        : String(grade.Comment);
    }
    
    if (comment.trim()) {
      return `${content} (${comment})`;
    }
    return content;
  }
  
  // Если есть ContentRaw, используем его
  if (grade.ContentRaw) {
    return typeof grade.ContentRaw === 'object' && grade.ContentRaw !== null
      ? JSON.stringify(grade.ContentRaw)
      : String(grade.ContentRaw);
  }
  
  // Если есть только Value, используем его
  if (grade.Value !== null && grade.Value !== undefined) {
    return typeof grade.Value === 'object' && grade.Value !== null
      ? JSON.stringify(grade.Value)
      : String(grade.Value);
  }
  
  return 'N/A';
};

// Форматирование оценки с цветом
export const getGradeColor = (grade: string | number): string => {
  if (!grade) return 'text-text-secondary';
  
  const numericGrade = typeof grade === 'string' ? parseFloat(grade) : grade;
  
  if (isNaN(numericGrade)) return 'text-text-secondary';
  
  if (numericGrade <= 1.5) return 'text-red-500';
  if (numericGrade <= 2.5) return 'text-orange-500';
  if (numericGrade <= 3.5) return 'text-yellow-500';
  if (numericGrade <= 4.5) return 'text-green-400';
  return 'text-green-500';
};

// Format attendance
export const formatAttendance = (attendance: any): { status: string, color: string } => {
  if (!attendance) {
    return { status: 'N/A', color: 'text-text-secondary' };
  }
  
  try {
    // Determine attendance type from different data formats
    let presenceTypeId: number = -1;
    
    // Old format: attendance.PresenceType.Id
    if (attendance.PresenceType) {
      // If PresenceType is an object with Id
      if (typeof attendance.PresenceType === 'object' && attendance.PresenceType !== null && 
          typeof attendance.PresenceType.Id === 'number') {
        presenceTypeId = attendance.PresenceType.Id;
        
        // Non-standard Vulcan API codes
        if (presenceTypeId > 1000) {
          // Mapping specific codes 
          if (presenceTypeId === 1228) return { status: 'Present', color: 'text-green-500' }; // Was absence
          if (presenceTypeId === 1229) return { status: 'Absent', color: 'text-red-500' }; // Was presence
          if (presenceTypeId === 1231) return { status: 'Present', color: 'text-green-500' }; // Was late
        }
      } 
      // If PresenceType is a number
      else if (typeof attendance.PresenceType === 'number') {
        presenceTypeId = attendance.PresenceType;
      }
    } 
    // New format: attendance.presenceTypeId
    else if (typeof attendance.presenceTypeId === 'number') {
      presenceTypeId = attendance.presenceTypeId;
    }
    
    // String format: attendance.presenceType
    else if (attendance.presenceType) {
      if (attendance.presenceType === 'present') presenceTypeId = 0;
      else if (attendance.presenceType === 'absent') presenceTypeId = 1;
      else if (attendance.presenceType === 'late') presenceTypeId = 2;
      else if (attendance.presenceType === 'excused') presenceTypeId = 3;
    }
    
    // Map presenceTypeId to status and color
    switch (presenceTypeId) {
      case 0:
        return { status: 'Present', color: 'text-green-500' };
      case 1:
        return { status: 'Absent', color: 'text-red-500' };
      case 2:
        return { status: 'Late', color: 'text-orange-500' };
      case 3:
        return { status: 'Excused', color: 'text-blue-500' };
      default:
        return { status: 'Unknown', color: 'text-text-secondary' };
    }
  } catch (error) {
    console.error('Error formatting attendance:', error);
    return { status: 'Error', color: 'text-red-500' };
  }
};

// Сокращение длинного текста
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

// Форматирование экзаменов
export const formatExamType = (type: string): { label: string, color: string } => {
  if (!type) return { label: 'Неизвестно', color: 'bg-gray-500' };
  
  switch (type.toLowerCase()) {
    case 'sprawdzian':
    case 'тест':
      return { label: 'Тест', color: 'bg-red-500' };
    case 'kartkówka':
    case 'опрос':
      return { label: 'Опрос', color: 'bg-orange-500' };
    case 'praca klasowa':
    case 'классная работа':
      return { label: 'Классная работа', color: 'bg-yellow-500' };
    case 'zadanie':
    case 'задание':
      return { label: 'Задание', color: 'bg-green-500' };
    case 'aktywność':
    case 'активность':
      return { label: 'Активность', color: 'bg-blue-500' };
    default:
      return { label: type, color: 'bg-purple-500' };
  }
}; 