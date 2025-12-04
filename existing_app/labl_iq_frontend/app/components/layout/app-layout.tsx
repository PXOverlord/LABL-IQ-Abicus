'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { AIAssistant } from '../AIAssistant';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header onMenuToggle={toggleSidebar} onAssistantOpen={() => setAssistantOpen(true)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <AIAssistant isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}
