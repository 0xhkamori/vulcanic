/**
 * Test utilities for debugging and testing purposes
 * These functions can be accessed from the browser console
 */

import { Grade } from '@/types/grades';
import { getStoredGrades, saveGradesToLocalStorage, findNewGrades } from './grades-utils';
import { getStoredGradeUpdate, clearGradeUpdate } from '@/lib/hooks/useGradeUpdates';

/**
 * Generate test grades
 */
export const generateTestGrades = (count = 5): Grade[] => {
  const subjects = ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'History', 'Literature'];
  const values = ['5', '4+', '4', '3+', '3', '2'];
  
  return Array.from({ length: count }, (_, i) => ({
    Id: `test-${Date.now()}-${i}`,
    Value: values[Math.floor(Math.random() * values.length)],
    Topic: `Test Topic ${i + 1}`,
    Subject: subjects[Math.floor(Math.random() * subjects.length)],
    Column: {
      Subject: subjects[Math.floor(Math.random() * subjects.length)],
      Name: `Test Column ${i + 1}`,
      Weight: Math.floor(Math.random() * 3) + 1
    },
    Comment: `This is a test grade ${i + 1}`,
    isTestData: true
  }));
};

/**
 * Clear all grade-related data from localStorage
 */
export const clearAllGradeData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear all vulcanic grades data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('vulcanic_')) {
        localStorage.removeItem(key);
      }
    }
    console.log('[TEST_UTILS] Cleared all grade data from localStorage');
  } catch (error) {
    console.error('[TEST_UTILS] Error clearing grade data:', error);
  }
};

/**
 * Test the grade update detection
 */
export const testGradeUpdateDetection = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Get current stored grades
    const { grades: storedGrades } = getStoredGrades();
    
    // Generate some new test grades
    const newTestGrades = generateTestGrades(2);
    
    // Merge with existing grades if any
    const allGrades = storedGrades.length > 0
      ? [...storedGrades, ...newTestGrades]
      : newTestGrades;
    
    // Save to localStorage
    saveGradesToLocalStorage(allGrades);
    
    // Create an update notification for the new grades
    const update = {
      newGrades: newTestGrades,
      timestamp: new Date().toISOString()
    };
    
    // Save the update to localStorage
    localStorage.setItem('vulcanic_grade_updates', JSON.stringify(update));
    
    console.log('[TEST_UTILS] Added test grades and created update notification');
    console.log('[TEST_UTILS] Refresh the page to see the notification');
  } catch (error) {
    console.error('[TEST_UTILS] Error testing grade updates:', error);
  }
};

/**
 * Debug function to log all grade-related localStorage items
 */
export const logGradeStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const gradeData: Record<string, unknown> = {};
    
    // Find all vulcanic_ keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('vulcanic_')) {
        try {
          const value = localStorage.getItem(key);
          if (value && value.length < 1000) {
            gradeData[key] = JSON.parse(value);
          } else {
            gradeData[key] = `${value?.substring(0, 100)}... (${value?.length} chars)`;
          }
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          gradeData[key] = `[Error parsing]: ${errorMessage}`;
        }
      }
    }
    
    console.log('[TEST_UTILS] Grade storage contents:', gradeData);
    
    // Log specifically the updates
    const updates = getStoredGradeUpdate();
    console.log('[TEST_UTILS] Grade updates:', updates);
  } catch (error) {
    console.error('[TEST_UTILS] Error logging grade storage:', error);
  }
};

// Add the test functions to the window object for console access
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.vulcanicTest = {
    generateTestGrades,
    clearAllGradeData,
    testGradeUpdateDetection,
    logGradeStorage,
    getStoredGradeUpdate,
    clearGradeUpdate
  };
} 