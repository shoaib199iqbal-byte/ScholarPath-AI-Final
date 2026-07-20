import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ScholarshipDirectory from './components/ScholarshipDirectory';
import AIAdvisorView from './components/AIAdvisorView';
import DashboardView from './components/DashboardView';
import ScholarshipDetailsModal from './components/ScholarshipDetailsModal';
import { StudentProfile, AIAdvisorResponse, Scholarship } from './types';
import { SCHOLARSHIPS } from './data/scholarships';
import { GraduationCap, ArrowUpRight, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [report, setReport] = useState<AIAdvisorResponse | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const cachedProfile = localStorage.getItem('scholarpath_profile');
      if (cachedProfile) setProfile(JSON.parse(cachedProfile));

      const cachedReport = localStorage.getItem('scholarpath_report');
      if (cachedReport) setReport(JSON.parse(cachedReport));

      const cachedSaved = localStorage.getItem('scholarpath_saved_ids');
      if (cachedSaved) setSavedIds(JSON.parse(cachedSaved));
    } catch (e) {
      console.error('Failed to load cached states from local storage:', e);
    }
  }, []);

  // Save bookmarked IDs to localStorage whenever they change
  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('scholarpath_saved_ids', JSON.stringify(updated));
      return updated;
    });
  };

  const handleViewDetails = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
  };

  const handleViewDetailsById = (id: string) => {
    const found = SCHOLARSHIPS.find((s) => s.id === id);
    if (found) {
      setSelectedScholarship(found);
    }
  };

  const handleUpdateProfile = (newProfile: StudentProfile | null) => {
    setProfile(newProfile);
    if (!newProfile) {
      localStorage.removeItem('scholarpath_profile');
    }
  };

  const handleUpdateReport = (newReport: AIAdvisorResponse | null) => {
    setReport(newReport);
    if (!newReport) {
      localStorage.removeItem('scholarpath_report');
    }
  };

  const handleStartProfileForm = () => {
    // Clear the current report to force showing the form, but keep existing profile data for pre-filling
    handleUpdateReport(null);
    setCurrentTab('advisor');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        hasProfile={!!profile}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'home' && (
          <HomeView
            onStartAdvisor={() => setCurrentTab('advisor')}
            onExploreDirectory={() => setCurrentTab('directory')}
            onBuildProfile={handleStartProfileForm}
          />
        )}

        {currentTab === 'directory' && (
          <ScholarshipDirectory
            onViewDetails={handleViewDetails}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {currentTab === 'advisor' && (
          <AIAdvisorView
            profile={profile}
            setProfile={handleUpdateProfile}
            report={report}
            setReport={handleUpdateReport}
            onViewDetailsById={handleViewDetailsById}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            report={report}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
            onNavigateToAdvisor={handleStartProfileForm}
            onNavigateToDirectory={() => setCurrentTab('directory')}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-display font-semibold text-sm text-slate-800">
              ScholarPath <span className="text-indigo-600">AI</span>
            </span>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed max-w-md font-light">
            ScholarPath AI represents an academic initiative built on curation matrices and Gemini-powered advisor models. Registered scholarship titles, trademarks, and logos remain intellectual properties of their respective foundations.
          </p>

          <span className="text-[10px] font-mono text-slate-400">
            v1.0.0 • UTC 2026
          </span>
        </div>
      </footer>

      {/* Scholarship Detailed Specifications Overlay */}
      {selectedScholarship && (
        <ScholarshipDetailsModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
          isSaved={savedIds.includes(selectedScholarship.id)}
          onToggleSave={() => handleToggleSave(selectedScholarship.id)}
        />
      )}
    </div>
  );
}
