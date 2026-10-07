import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CommandCenterProvider, useCommandCenter } from './context/CommandCenterContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ContestantsView } from './components/ContestantsView';
import { Leaderboard } from './components/Leaderboard';
import { TaskManagement } from './components/TaskManagement';
import { DangerZone } from './components/DangerZone';
import { ImmunityVault } from './components/ImmunityVault';
import { CaptaincySection } from './components/CaptaincySection';
import { TaskTimer } from './components/TaskTimer';
import { AnnouncementsView } from './components/AnnouncementsView';
import { EvictionSection } from './components/EvictionSection';
import { ActivityLogView } from './components/ActivityLogView';
import { AnalyticsView } from './components/AnalyticsView';
import { AllModals } from './components/Modals/AllModals';
import { ToastContainer } from './components/ToastContainer';

const AppContent: React.FC = () => {
  const { activeTab, error, currentUser } = useCommandCenter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top Header */}
      <Header onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Navigation Sidebar */}
        <Sidebar
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        {/* Dynamic Active Tab Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center justify-between">
              <span>{error}</span>
            </div>
          )}

          {/* Role status banner for Contestants and Viewers */}
          {currentUser.role === 'contestant' && (
            <div className="mb-6 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between font-medium">
              <span>👤 <strong>Contestant Portal Active:</strong> Logged in as <strong>{currentUser.name}</strong>. You can view your status, complete assigned challenges, and track live house statistics.</span>
            </div>
          )}

          {currentUser.role === 'viewer' && (
            <div className="mb-6 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs flex items-center justify-between font-medium">
              <span>👁️ <strong>Spectator Mode Active:</strong> Live public broadcast and surveillance feed. All data modifications are restricted to executive Big Boss command.</span>
            </div>
          )}

          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'contestants' && <ContestantsView />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'activity' && <ActivityLogView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'tasks' && <TaskManagement />}
          {activeTab === 'dangerzone' && <DangerZone />}
          {activeTab === 'immunity' && <ImmunityVault />}
          {activeTab === 'captain' && <CaptaincySection />}
          {activeTab === 'timer' && <TaskTimer />}
          {activeTab === 'announcements' && <AnnouncementsView />}
          {activeTab === 'evictions' && <EvictionSection />}
        </main>
      </div>

      {/* Modals & Toasts */}
      <AllModals />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CommandCenterProvider>
        <AppContent />
      </CommandCenterProvider>
    </ThemeProvider>
  );
}
