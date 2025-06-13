
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import NotesTab from '@/components/dashboard/NotesTab';
import CalendarTab from '@/components/dashboard/CalendarTab';
import ToDoTab from '@/components/dashboard/ToDoTab';
import { useState } from 'react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AppLayout showHeader={true}>
      <div className="flex flex-col h-full">
        <DashboardPageHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-hidden">
          {activeTab === 'overview' && (
            <div className="p-3">
              <DashboardContent />
            </div>
          )}
          {activeTab === 'tasks' && <ToDoTab />}
          {activeTab === 'notes' && <NotesTab />}
          {activeTab === 'calendar' && <CalendarTab />}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
