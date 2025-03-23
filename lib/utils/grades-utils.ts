import { Grade } from '@/types/grades';

// Helper to log storage information
const logStorageInfo = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const used = JSON.stringify(localStorage).length;
    const available = 5 * 1024 * 1024; // Estimate - most browsers allow at least 5MB
    console.warn(`[VULCANIC_STORAGE] Used storage: ${Math.round(used/1024)}KB / ~${Math.round(available/1024)}KB`);
  } catch (err) {
    console.warn('[VULCANIC_STORAGE] Failed to check storage usage', err);
  }
};

// Check if localStorage is available and has space
const checkStorage = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Test that localStorage is available
    localStorage.setItem('_storage_test', 'test');
    localStorage.removeItem('_storage_test');
    return true;
  } catch (e) {
    console.warn('[VULCANIC_STORAGE] localStorage not available', e);
    return false;
  }
};

// Helper function to split data into chunks if needed
const saveWithChunking = (key: string, data: string): void => {
  // Max size for each chunk (slightly under 1MB)
  const maxChunkSize = 900 * 1024;
  
  if (data.length <= maxChunkSize) {
    // Data fits in a single item
    localStorage.setItem(key, data);
    return;
  }
  
  // Need to split into chunks
  console.warn(`[VULCANIC_STORAGE] Data size (${Math.round(data.length/1024)}KB) exceeds chunk size, splitting...`);
  
  // Clear any existing chunks
  for (let i = 0; i < localStorage.length; i++) {
    const storageKey = localStorage.key(i);
    if (storageKey && storageKey.startsWith(`${key}_chunk_`)) {
      localStorage.removeItem(storageKey);
    }
  }
  
  // Store chunk count for future retrieval
  const chunkCount = Math.ceil(data.length / maxChunkSize);
  localStorage.setItem(`${key}_info`, JSON.stringify({
    chunkCount,
    timestamp: new Date().toISOString(),
    totalSize: data.length
  }));
  
  // Store each chunk
  for (let i = 0; i < chunkCount; i++) {
    const start = i * maxChunkSize;
    const end = Math.min(start + maxChunkSize, data.length);
    const chunk = data.substring(start, end);
    localStorage.setItem(`${key}_chunk_${i}`, chunk);
  }
  
  console.warn(`[VULCANIC_STORAGE] Split data into ${chunkCount} chunks`);
};

// Helper function to retrieve chunked data
const getWithChunking = (key: string): string | null => {
  // First check if data was chunked
  const infoStr = localStorage.getItem(`${key}_info`);
  
  if (!infoStr) {
    // Not chunked, retrieve normally
    return localStorage.getItem(key);
  }
  
  try {
    // Get chunking info
    const info = JSON.parse(infoStr);
    const { chunkCount } = info;
    
    // Retrieve all chunks
    let fullData = '';
    for (let i = 0; i < chunkCount; i++) {
      const chunk = localStorage.getItem(`${key}_chunk_${i}`);
      if (chunk === null) {
        console.warn(`[VULCANIC_STORAGE] Missing chunk ${i} of ${chunkCount} for ${key}`);
        return null;
      }
      fullData += chunk;
    }
    
    console.warn(`[VULCANIC_STORAGE] Successfully reassembled ${chunkCount} chunks for ${key}`);
    return fullData;
  } catch (e) {
    console.warn(`[VULCANIC_STORAGE] Error retrieving chunked data:`, e);
    return null;
  }
};

// Store the current grades in localStorage
export const saveGradesToLocalStorage = (grades: Grade[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Check storage availability
    if (!checkStorage()) {
      console.warn('[VULCANIC_STORAGE] Cannot save grades - storage not available');
      return;
    }
    
    // Display storage usage
    logStorageInfo();
    
    // Prepare the data
    const gradesJson = JSON.stringify(grades);
    const timestamp = new Date().toISOString();
    
    console.warn(`[VULCANIC_STORAGE] Attempting to save ${grades.length} grades (${Math.round(gradesJson.length/1024)}KB)`);
    
    // Save with chunking support
    saveWithChunking('vulcanic_grades', gradesJson);
    localStorage.setItem('vulcanic_grades_timestamp', timestamp);
    
    console.warn(`[VULCANIC_STORAGE] Successfully saved ${grades.length} grades to localStorage`);
  } catch (error) {
    console.error('[VULCANIC_STORAGE] Failed to save grades to localStorage:', error);
  }
};

// Get the previously saved grades from localStorage
export const getStoredGrades = (): { grades: Grade[], timestamp: string | null } => {
  if (typeof window === 'undefined') {
    return { grades: [], timestamp: null };
  }
  
  try {
    const storedGradesJson = getWithChunking('vulcanic_grades');
    const timestamp = localStorage.getItem('vulcanic_grades_timestamp');
    
    if (!storedGradesJson) {
      console.warn('[VULCANIC_STORAGE] No stored grades found');
      return { grades: [], timestamp };
    }
    
    const grades = JSON.parse(storedGradesJson) as Grade[];
    console.warn(`[VULCANIC_STORAGE] Retrieved ${grades.length} grades from localStorage`);
    return { grades, timestamp };
  } catch (error) {
    console.error('[VULCANIC_STORAGE] Failed to retrieve grades from localStorage:', error);
    return { grades: [], timestamp: null };
  }
};

// Compare current grades with stored grades to find new ones
export const findNewGrades = (currentGrades: Grade[], storedGrades: Grade[]): Grade[] => {
  if (!currentGrades.length || !storedGrades.length) {
    return [];
  }
  
  console.warn(`[VULCANIC_STORAGE] Comparing ${currentGrades.length} current grades with ${storedGrades.length} stored grades`);
  
  // Create a map of stored grades for faster lookup
  const storedGradeMap = new Map<string, Grade>();
  
  storedGrades.forEach(grade => {
    // Create a unique key based on available identifiers
    const key = createGradeKey(grade);
    storedGradeMap.set(key, grade);
  });
  
  // Find grades that don't exist in the stored grades
  const newGrades = currentGrades.filter(currentGrade => {
    const key = createGradeKey(currentGrade);
    return !storedGradeMap.has(key);
  });
  
  console.warn(`[VULCANIC_STORAGE] Found ${newGrades.length} new grades`);
  
  // For debugging, if new grades were found, show details of the first one
  if (newGrades.length > 0) {
    const firstNew = newGrades[0];
    const key = createGradeKey(firstNew);
    console.warn('[VULCANIC_STORAGE] Sample new grade:', {
      key,
      value: firstNew.Value,
      subject: firstNew.Subject,
      columnSubject: firstNew.Column?.Subject
    });
  }
  
  return newGrades;
};

// Helper function to create a unique key for a grade
const createGradeKey = (grade: Grade): string => {
  // Use multiple fields to create a unique identifier
  // Adjust these fields based on your actual grade structure
  const value = grade.Value?.toString() || '';
  const topic = typeof grade.Topic === 'string' ? grade.Topic : 
               (grade.Topic ? JSON.stringify(grade.Topic) : '');
  const comment = typeof grade.Comment === 'string' ? grade.Comment : 
                 (grade.Comment ? JSON.stringify(grade.Comment) : '');
  const subject = grade.Column?.Subject 
    ? (typeof grade.Column.Subject === 'string' 
       ? grade.Column.Subject 
       : (grade.Column.Subject.Name || JSON.stringify(grade.Column.Subject)))
    : (typeof grade.Subject === 'string' 
       ? grade.Subject 
       : (grade.Subject ? (grade.Subject.Name || JSON.stringify(grade.Subject)) : ''));
  
  return `${subject}|${topic}|${value}|${comment}`;
}; 