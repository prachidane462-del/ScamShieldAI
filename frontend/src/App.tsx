import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast, ToastMessage } from './components/Toast';
import { NewScanModal } from './components/NewScanModal';
import { ReportModal } from './components/ReportModal';
import { Dashboard } from './pages/Dashboard';
import { MessageScanner } from './pages/MessageScanner';
import { UrlChecker } from './pages/UrlChecker';
import { ScanHistory } from './pages/ScanHistory';
import { SecurityTips } from './pages/SecurityTips';
import { About } from './pages/About';
import { storageService } from './services/storage';
import { apiService } from './services/api';
import { ScanHistoryItem, MessageAnalysisResponse, UrlAnalysisResponse, SystemHealth } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState<boolean>(false);
  const [activeReportItem, setActiveReportItem] = useState<ScanHistoryItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  
  // Pending input passed when navigating from Quick Search or New Scan Modal
  const [pendingMessageInput, setPendingMessageInput] = useState<string>('');
  const [pendingUrlInput, setPendingUrlInput] = useState<string>('');

  const [stats, setStats] = useState({
    total_scans: 1428,
    scams_detected: 492,
    safe_verified: 936,
    message_scans: 874,
    url_scans: 554
  });

  // Initialize theme & load local storage history
  useEffect(() => {
    const savedTheme = storageService.getTheme();
    setTheme(savedTheme);
    storageService.setTheme(savedTheme);

    const savedHistory = storageService.getHistory();
    setHistory(savedHistory);

    // Initial health check & stats
    apiService.getHealth().then(setSystemHealth).catch(console.error);
    apiService.getStats().then(setStats).catch(console.error);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    storageService.setTheme(nextTheme);
  };

  const handleToast = (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      description
    };
    setToasts(prev => [...prev.slice(-3), newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleNavigate = (tab: string, initialInput?: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (initialInput) {
      if (tab === 'scanner') {
        setPendingMessageInput(initialInput);
      } else if (tab === 'url') {
        setPendingUrlInput(initialInput);
      }
    }
  };

  const handleSelectNewScanOption = (type: 'message' | 'url', initialText?: string) => {
    if (type === 'message') {
      if (initialText) setPendingMessageInput(initialText);
      setCurrentTab('scanner');
    } else {
      if (initialText) setPendingUrlInput(initialText);
      setCurrentTab('url');
    }
  };

  // Called when a message scan completes
  const handleMessageScanComplete = (report: MessageAnalysisResponse, originalText: string) => {
    const title = originalText.length > 36 ? originalText.slice(0, 36) + '...' : originalText;
    const historyItem: ScanHistoryItem = {
      id: report.scan_id,
      type: 'message',
      title: `${report.source_type_detected.toUpperCase()} Scan: ${title}`,
      preview: originalText,
      risk_score: report.risk_score,
      risk_level: report.risk_level,
      timestamp: report.analyzed_at,
      full_report: report
    };
    storageService.saveScan(historyItem);
    setHistory(storageService.getHistory());
    setPendingMessageInput('');
  };

  // Called when a URL scan completes
  const handleUrlScanComplete = (report: UrlAnalysisResponse, originalUrl: string) => {
    const historyItem: ScanHistoryItem = {
      id: report.scan_id,
      type: 'url',
      title: `URL: ${report.domain || report.hostname}`,
      preview: originalUrl,
      risk_score: report.risk_score,
      risk_level: report.risk_level,
      timestamp: report.analyzed_at,
      full_report: report
    };
    storageService.saveScan(historyItem);
    setHistory(storageService.getHistory());
    setPendingUrlInput('');
  };

  const handleClearHistory = () => {
    storageService.clearHistory();
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    storageService.deleteScan(id);
    setHistory(storageService.getHistory());
    handleToast('info', 'Record Deleted', 'Scan audit log removed.');
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 cyber-grid flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenNewScan={() => setIsNewScanModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        systemHealth={systemHealth}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          historyCount={history.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0 flex flex-col justify-between">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            
            {currentTab === 'dashboard' && (
              <Dashboard
                onNavigate={handleNavigate}
                recentScans={history}
                stats={stats}
                onViewReport={(item) => setActiveReportItem(item)}
              />
            )}

            {currentTab === 'scanner' && (
              <MessageScanner
                initialContent={pendingMessageInput}
                onScanComplete={handleMessageScanComplete}
                onToast={handleToast}
              />
            )}

            {currentTab === 'url' && (
              <UrlChecker
                initialUrl={pendingUrlInput}
                onScanComplete={handleUrlScanComplete}
                onToast={handleToast}
              />
            )}

            {currentTab === 'history' && (
              <ScanHistory
                history={history}
                onClearHistory={handleClearHistory}
                onDeleteItem={handleDeleteHistoryItem}
                onViewReport={(item) => setActiveReportItem(item)}
                onToast={handleToast}
              />
            )}

            {currentTab === 'tips' && <SecurityTips />}

            {currentTab === 'about' && <About />}

          </div>

          {/* Footer */}
          <footer className="mt-12 border-t border-slate-800/80 bg-[#0B1020]/90 py-6 px-4 sm:px-8 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white">ScamShield<span className="text-cyan-400">AI</span></span>
                <span>• Smart Scam & Fraud Detector</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <button onClick={() => handleNavigate('tips')} className="hover:text-slate-200">Security Tips</button>
                <button onClick={() => handleNavigate('about')} className="hover:text-slate-200">Privacy Notice</button>
                <span>India Helpline: <strong className="text-rose-400">1930</strong></span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Modals & Toasts */}
      <NewScanModal
        isOpen={isNewScanModalOpen}
        onClose={() => setIsNewScanModalOpen(false)}
        onSelectOption={handleSelectNewScanOption}
      />

      <ReportModal
        item={activeReportItem}
        onClose={() => setActiveReportItem(null)}
        onCopyReport={() => handleToast('success', 'Copied to Clipboard', 'Full audit report copied.')}
      />

      <Toast toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
};

export default App;
