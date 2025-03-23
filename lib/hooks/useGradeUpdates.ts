import { useEffect, useState } from 'react';
import { getStoredGrades, saveGradesToLocalStorage, findNewGrades } from '@/lib/utils/grades-utils';
import { Grade } from '@/types/grades';

// For debugging - forces log regardless of environment
const forceLog = (level: 'log' | 'warn' | 'error', message: string, data?: unknown) => {
  // Create a distinctive prefix for easier identification
  const prefix = '[VULCANIC_GRADES]';
  
  // Ensure we always log this, even in production
  if (level === 'error') {
    console.error(`${prefix} ${message}`, data !== undefined ? data : '');
  } else if (level === 'warn') {
    console.warn(`${prefix} ${message}`, data !== undefined ? data : '');
  } else {
    console.log(`${prefix} ${message}`, data !== undefined ? data : '');
  }
};

// Key for storing grade updates
const GRADE_UPDATES_KEY = 'vulcanic_grade_updates';

export type GradeUpdate = {
  newGrades: Grade[];
  timestamp: string | null;
};

// Hook for handling grade updates detection
export function useGradeUpdates(grades: Grade[]) {
  const [newGrades, setNewGrades] = useState<Grade[]>([]);
  
  // On grades change, detect and process new grades
  useEffect(() => {
    forceLog('log', `Processing ${grades.length} grades to detect updates`);
    
    // Only process when we have grades
    if (!grades || grades.length === 0) {
      forceLog('warn', 'No grades to process, skipping update check');
      return;
    }
    
    try {
      // Save current grades to localStorage
      forceLog('log', 'Saving current grades to localStorage');
      saveGradesToLocalStorage(grades);
      forceLog('log', 'Grades saved to localStorage');
      
      // Compare with previously stored grades to find new ones
      forceLog('log', 'Retrieving previously stored grades');
      const storedGradesResult = getStoredGrades();
      const storedGrades = storedGradesResult.grades || [];
      forceLog('log', `Retrieved ${storedGrades.length} stored grades`);
      
      // Find new grades
      forceLog('log', 'Comparing current grades with stored grades');
      const detected = findNewGrades(grades, storedGrades);
      forceLog('log', `Found ${detected.length} new grades`);
      
      // If we found new grades, save them
      if (detected.length > 0) {
        forceLog('warn', `New grades detected: ${detected.length}`, detected[0]);
        
        try {
          // Save for later retrieval
          const update: GradeUpdate = {
            newGrades: detected,
            timestamp: new Date().toISOString()
          };
          
          // Set to state
          setNewGrades(detected);
          
          // Save to localStorage
          localStorage.setItem(GRADE_UPDATES_KEY, JSON.stringify(update));
          forceLog('warn', 'Saved grade updates to localStorage', { count: detected.length });
        } catch (error) {
          forceLog('error', 'Error saving grade updates to localStorage', error);
        }
      }
    } catch (error) {
      forceLog('error', 'Error in grade update detection', error);
    }
  }, [grades]);
  
  return { newGrades };
}

// Get stored grade updates
export function getStoredGradeUpdate(): GradeUpdate {
  try {
    const storedData = localStorage.getItem(GRADE_UPDATES_KEY);
    
    forceLog('log', 'Retrieved grade updates from localStorage', { 
      hasData: !!storedData, 
      dataLength: storedData?.length || 0
    });
    
    if (!storedData) {
      return { newGrades: [], timestamp: null };
    }
    
    const parsedData = JSON.parse(storedData) as GradeUpdate;
    
    // Make sure we have valid data
    if (!parsedData || !Array.isArray(parsedData.newGrades)) {
      forceLog('warn', 'Invalid grade update data, returning empty array');
      return { newGrades: [], timestamp: null };
    }
    
    forceLog('log', `Retrieved ${parsedData.newGrades.length} grade updates`);
    return parsedData;
  } catch (error) {
    forceLog('error', 'Error retrieving grade updates', error);
    return { newGrades: [], timestamp: null };
  }
}

// Clear grade updates
export function clearGradeUpdate(): void {
  try {
    localStorage.removeItem(GRADE_UPDATES_KEY);
    forceLog('log', 'Cleared grade updates from localStorage');
  } catch (error) {
    forceLog('error', 'Error clearing grade updates', error);
  }
} 