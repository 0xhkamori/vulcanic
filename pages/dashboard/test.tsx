import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { generateTestGrades, clearAllGradeData, logGradeStorage } from '@/lib/utils/test-utils';
import { saveGradesToLocalStorage, getStoredGrades } from '@/lib/utils/grades-utils';
import { getStoredGradeUpdate, clearGradeUpdate } from '@/lib/hooks/useGradeUpdates';
import { GraduationCap, Trash, ClockClockwise, Database } from '@phosphor-icons/react';
import withAuth from '@/lib/utils/withAuth';

function TestPage() {
  const [storageData, setStorageData] = useState<Record<string, any>>({});
  const [message, setMessage] = useState<string | null>(null);
  
  // Function to refresh storage data
  const refreshStorageData = () => {
    try {
      const data: Record<string, any> = {};
      
      // Find all vulcanic_ keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('vulcanic_')) {
          try {
            const value = localStorage.getItem(key);
            if (value && value.length < 100) {
              data[key] = JSON.parse(value);
            } else {
              data[key] = `${value?.substring(0, 50)}... (${value?.length} chars)`;
            }
          } catch (e) {
            data[key] = '[Error parsing]';
          }
        }
      }
      
      setStorageData(data);
      console.log('[TEST] Current storage data:', data);
    } catch (error) {
      console.error('[TEST] Error refreshing storage data:', error);
      setMessage('Error refreshing storage data');
    }
  };
  
  // Generate and save test grades
  const handleGenerateGrades = () => {
    try {
      const testGrades = generateTestGrades(3);
      saveGradesToLocalStorage(testGrades);
      setMessage(`Generated and saved ${testGrades.length} test grades`);
      refreshStorageData();
    } catch (error) {
      console.error('[TEST] Error generating grades:', error);
      setMessage('Error generating grades');
    }
  };
  
  // Generate a grade update notification
  const handleCreateUpdate = () => {
    try {
      const { grades } = getStoredGrades();
      
      if (grades.length === 0) {
        setMessage('No grades found. Generate grades first.');
        return;
      }
      
      // Create an update with the first 2 grades
      const update = {
        newGrades: grades.slice(0, 2),
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('vulcanic_grade_updates', JSON.stringify(update));
      setMessage(`Created update notification with ${update.newGrades.length} grades`);
      refreshStorageData();
    } catch (error) {
      console.error('[TEST] Error creating update:', error);
      setMessage('Error creating update');
    }
  };
  
  // Clear grade updates
  const handleClearUpdates = () => {
    try {
      clearGradeUpdate();
      setMessage('Cleared grade updates');
      refreshStorageData();
    } catch (error) {
      console.error('[TEST] Error clearing updates:', error);
      setMessage('Error clearing updates');
    }
  };
  
  // Clear all grade data
  const handleClearAll = () => {
    try {
      clearAllGradeData();
      setMessage('Cleared all grade data');
      refreshStorageData();
    } catch (error) {
      console.error('[TEST] Error clearing all data:', error);
      setMessage('Error clearing all data');
    }
  };
  
  // Load initial storage data
  useEffect(() => {
    refreshStorageData();
    
    // Log the contents to console for debugging
    logGradeStorage();
  }, []);
  
  return (
    <DashboardLayout title="Grade Updates Test">
      <div className="mb-6">
        <Card className="p-4">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <GraduationCap className="mr-2" size={24} />
            Grade Updates Test
          </h2>
          
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 text-primary p-3 rounded-md mb-4"
            >
              {message}
            </motion.div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleGenerateGrades}
              className="bg-primary text-white p-3 rounded-md hover:bg-primary-dark transition-colors"
            >
              Generate Test Grades
            </button>
            
            <button
              onClick={handleCreateUpdate}
              className="bg-secondary text-white p-3 rounded-md hover:bg-secondary-dark transition-colors"
            >
              Create Grade Update
            </button>
            
            <button
              onClick={handleClearUpdates}
              className="bg-warning text-white p-3 rounded-md hover:bg-warning-dark transition-colors flex items-center justify-center"
            >
              <ClockClockwise className="mr-2" size={20} />
              Clear Updates Only
            </button>
            
            <button
              onClick={handleClearAll}
              className="bg-error text-white p-3 rounded-md hover:bg-error-dark transition-colors flex items-center justify-center"
            >
              <Trash className="mr-2" size={20} />
              Clear All Grade Data
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Database className="mr-2" size={20} />
              Current Storage Data
            </h3>
            
            <button
              onClick={refreshStorageData}
              className="mb-3 bg-surface p-2 rounded-md hover:bg-overlay transition-colors text-sm"
            >
              Refresh Data
            </button>
            
            <div className="bg-surface p-4 rounded-md max-h-96 overflow-auto">
              {Object.keys(storageData).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(storageData).map(([key, value]) => (
                    <div key={key} className="border-b border-overlay pb-2">
                      <p className="font-medium">{key}</p>
                      <pre className="text-xs overflow-x-auto text-text-secondary bg-background p-2 rounded-md mt-1">
                        {typeof value === 'string' 
                          ? value 
                          : JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary">No grade data in localStorage</p>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-3">Instructions</h3>
        <div className="space-y-2 text-text-secondary">
          <p>1. Click "Generate Test Grades" to create sample grades.</p>
          <p>2. Click "Create Grade Update" to simulate new grades being detected.</p>
          <p>3. Refresh the page to see the grade update notification.</p>
          <p>4. Click "Clear Updates Only" to dismiss the notification.</p>
          <p>5. Click "Clear All Grade Data" to reset everything.</p>
        </div>
      </Card>
    </DashboardLayout>
  );
}

export default withAuth(TestPage); 