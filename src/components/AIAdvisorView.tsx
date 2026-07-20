import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, BrainCircuit, CheckSquare, Clock, GraduationCap, ChevronLeft, HelpCircle, Loader2, Send, RotateCcw, AlertCircle, Eye } from 'lucide-react';
import { StudentProfile, AIAdvisorResponse, Scholarship } from '../types';
import { SCHOLARSHIPS } from '../data/scholarships';

interface AIAdvisorViewProps {
  profile: StudentProfile | null;
  setProfile: (p: StudentProfile | null) => void;
  report: AIAdvisorResponse | null;
  setReport: (r: AIAdvisorResponse | null) => void;
  onViewDetailsById: (id: string) => void;
}

interface ChatMessage {
  sender: 'user' | 'advisor';
  text: string;
}

export default function AIAdvisorView({ profile, setProfile, report, setReport, onViewDetailsById }: AIAdvisorViewProps) {
  // Local Form state
  const [degreeLevel, setDegreeLevel] = useState('Masters');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science');
  const [gpa, setGpa] = useState('3.8/4.0');
  const [homeCountry, setHomeCountry] = useState('Pakistan');
  const [destinationCountry, setDestinationCountry] = useState('United Kingdom');
  const [financialNeed, setFinancialNeed] = useState<'High' | 'Medium' | 'Low'>('High');
  const [extraActivities, setExtraActivities] = useState('2 years of software engineering experience, voluntary teaching for underprivileged kids on weekends, and led a university robotics club.');

  // Loading and Error states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Follow-up Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Checklist of custom action items (derived from report.actionPlan)
  const [completedActions, setCompletedActions] = useState<boolean[]>([]);

  // Initialize form if profile already exists (e.g. from localStorage)
  useEffect(() => {
    if (profile) {
      setDegreeLevel(profile.degreeLevel);
      setFieldOfStudy(profile.fieldOfStudy);
      setGpa(profile.gpa);
      setHomeCountry(profile.homeCountry);
      setDestinationCountry(profile.destinationCountry);
      setFinancialNeed(profile.financialNeed);
      setExtraActivities(profile.extraActivities);
    }
  }, [profile]);

  // Synchronize completed actions array when report loads
  useEffect(() => {
    if (report) {
      setCompletedActions(new Array(report.actionPlan.length).fill(false));
      // Welcome message in chat
      setChatMessages([
        {
          sender: 'advisor',
          text: `Hello! I have completed your ScholarPath AI report. Looking at your profile, you have a solid academic foundation. We've unlocked recommendations like ${report.recommendations.map(r => {
            const found = SCHOLARSHIPS.find(s => s.id === r.scholarshipId);
            return found ? found.name : r.scholarshipId;
          }).slice(0, 2).join(' and ')}. Feel free to ask me follow-up questions about application essays, letters of recommendation, or deadline schedules!`,
        },
      ]);
    }
  }, [report]);

  // Loading messages rotation
  const loadingMessages = [
    'Parsing student academic credentials...',
    'Scrutinizing candidate leadership and research history...',
    'Filtering global database matching criteria...',
    'Executing match probability algorithms...',
    'Formulating tactical application guidelines...',
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle Match Form Submission
  const handleGenerateMatches = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const newProfile: StudentProfile = {
      degreeLevel,
      fieldOfStudy,
      gpa,
      homeCountry,
      destinationCountry,
      financialNeed,
      extraActivities,
    };

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfile),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      const reportData: AIAdvisorResponse = await response.json();
      setProfile(newProfile);
      setReport(reportData);

      // Save to localStorage for persistent state
      localStorage.setItem('scholarpath_profile', JSON.stringify(newProfile));
      localStorage.setItem('scholarpath_report', JSON.stringify(reportData));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Chat Submission Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading || !profile || !report) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // We will define a simple endpoint POST /api/chat in our server.ts
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          report,
          messages: [...chatMessages, { sender: 'user', text: userMsg }],
        }),
      });

      if (!response.ok) {
        throw new Error('Advisor was unable to respond. Please try again.');
      }

      const data = await response.json();
      setChatMessages((prev) => [...prev, { sender: 'advisor', text: data.reply }]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'advisor',
          text: `I'm sorry, I encountered an issue: ${err.message || 'Network failure'}. Can you please rephrase or try again?`,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleActionToggle = (index: number) => {
    const updated = [...completedActions];
    updated[index] = !updated[index];
    setCompletedActions(updated);
  };

  const resetAdvisor = () => {
    if (confirm('Are you sure you want to re-submit your profile? This will let you adjust your inputs.')) {
      setReport(null);
      setChatMessages([]);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* 1. Loading State Screen */}
      {isLoading && (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 md:p-20 text-center shadow-xl space-y-6 flex flex-col items-center justify-center min-h-[500px]">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
            <BrainCircuit className="h-8 w-8 text-pink-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="font-display font-bold text-xl text-slate-900">Consulting ScholarPath AI Advisor</h3>
            <p className="text-slate-500 text-sm animate-pulse">{loadingMessages[loadingStep]}</p>
          </div>
          <div className="w-48 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 2. Error Message */}
      {errorMsg && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Advisor Match Failed:</span>
            <p className="text-red-600">{errorMsg}</p>
            <p className="text-xs text-red-500 mt-2 font-mono">
              Note: Make sure your GEMINI_API_KEY environment secret is configured in the Secrets panel.
            </p>
          </div>
        </div>
      )}

      {/* 3. Form Phase (Build Profile) */}
      {!isLoading && !report && (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Form (8 Columns) */}
          <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                <BrainCircuit className="h-4 w-4" />
                AI CONSULTATION
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
                Academic & Profile Builder
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Provide your academic record, country parameters, and extracurricular achievements. ScholarPath AI will evaluate your profile against major global foundations.
              </p>
            </div>

            <form onSubmit={handleGenerateMatches} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Degree Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-sans">
                    Current / Target Degree Level
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition font-medium"
                  >
                    <option value="Bachelors">Bachelor’s Degree</option>
                    <option value="Masters">Master’s Degree (Postgraduate)</option>
                    <option value="PhD">Doctoral Degree (PhD)</option>
                  </select>
                </div>

                {/* Field of Study */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-sans">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science, Public Health"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition font-medium"
                  />
                </div>

                {/* GPA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-sans">
                    Academic Standing (GPA or Honors)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3.8/4.0, First Class, 92%"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition font-medium"
                  />
                </div>

                {/* Home Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-sans">
                    Country of Citizenship (Origin)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. India, Brazil, Nigeria"
                    value={homeCountry}
                    onChange={(e) => setHomeCountry(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition font-medium"
                  />
                </div>

                {/* Destination Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-sans">
                    Preferred Destination
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Kingdom, USA, Germany"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition font-medium"
                  />
                </div>

                {/* Financial Need */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-sans">
                    Financial Need Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['High', 'Medium', 'Low'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFinancialNeed(level)}
                        className={`py-3.5 px-3 border text-xs font-bold rounded-xl transition ${
                          financialNeed === level
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        {level} Need
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extracurricular Activities */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-sans">
                  Leadership, Research, Volunteerism & Work Experience
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your volunteer projects, leadership roles, research history, publication titles, or work experience in detail. The AI matches you based on these credentials."
                  value={extraActivities}
                  onChange={(e) => setExtraActivities(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl text-slate-800 text-sm outline-none transition leading-relaxed font-light"
                ></textarea>
                <p className="text-[11px] text-slate-400 font-medium">
                  💡 Tip: Government scholarships (e.g. Chevening, Fulbright) heavily reward community service, leadership potential, and professional drive. Include specific hours or impact details.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="h-5 w-5" />
                  Generate AI Analysis & Matches
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Tips (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"></div>
              <h3 className="font-display font-bold text-lg text-white">How the Advisor helps</h3>
              <ul className="space-y-3.5 text-xs text-slate-300 font-light leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold font-mono">1.</span>
                  <span><strong>Eligibility Mapping:</strong> Evaluates GPA and citizenship limitations instantly.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold font-mono">2.</span>
                  <span><strong>Match Scoring:</strong> Scores probability indices dynamically based on provider focus.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold font-mono">3.</span>
                  <span><strong>Strategic Essay Guidance:</strong> Delivers advice for aligning personal statements with foundation goals.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-400 font-bold font-mono">4.</span>
                  <span><strong>Follow-up Consultation:</strong> Use the interactive prompt box to ask follow-up questions in real time.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 text-slate-600 text-xs leading-relaxed space-y-3 font-light">
              <h4 className="font-bold text-slate-800 font-sans uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="h-4 w-4 text-slate-400" />
                Frequently Asked
              </h4>
              <p>
                <strong>Is the evaluation accurate?</strong> Yes, the evaluation is based on real global foundation criteria (e.g., Chevening's 2-year work experience limit, or ETH Zurich's top 10% class rank criteria).
              </p>
              <p>
                <strong>Where is my data stored?</strong> Profile data is stored in your browser's local sandbox storage (`localStorage`) and is fully private.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Results Dashboard Phase */}
      {!isLoading && report && profile && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Return & Reset Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <button
              onClick={resetAdvisor}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Adjust Profile Inputs
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Profile: {profile.degreeLevel} in {profile.fieldOfStudy} ({profile.gpa})
            </span>
          </div>

          {/* Core Analysis Summary Banner */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-850 text-white rounded-3xl p-6 md:p-10 border border-slate-850 shadow-xl relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full">
              <BrainCircuit className="h-3.5 w-3.5" />
              AI ADVISOR REPORT
            </div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight leading-tight text-white">
              Executive Match Analysis
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
              {report.analysisSummary}
            </p>
          </div>

          {/* Interactive Action Plan Timeline (Chronological steps checklist) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-150/80 shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                Chronological Action Roadmap
              </h3>
              <p className="text-slate-500 text-sm mt-0.5">
                Check off milestone tasks as you progress with your applications.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.actionPlan.map((step, idx) => {
                const isCompleted = completedActions[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => handleActionToggle(idx)}
                    className={`flex items-start gap-3 p-4 border rounded-2xl text-left transition-all relative overflow-hidden ${
                      isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200/60 text-slate-600'
                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <CheckSquare
                        className={`h-5 w-5 ${isCompleted ? 'text-emerald-600 fill-emerald-100' : 'text-slate-400'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                        Milestone {idx + 1}
                      </span>
                      <p className="text-xs font-medium leading-relaxed">{step}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Layout: Recommendations (Left 7 Cols) & Chat Panel (Right 5 Cols) */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Recommendations Panel */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                Personalized Scholarship Matches
              </h3>

              <div className="space-y-6">
                {report.recommendations.map((rec) => {
                  // Find the matching scholarship
                  const s = SCHOLARSHIPS.find((item) => item.id === rec.scholarshipId);
                  if (!s) return null;

                  return (
                    <div
                      key={rec.scholarshipId}
                      className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm hover:border-slate-200 transition-all space-y-4"
                    >
                      {/* Top Row: Details & Score */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">
                            {s.fundingType}
                          </span>
                          <h4 className="font-display font-bold text-lg text-slate-900 tracking-tight leading-tight">
                            {s.name}
                          </h4>
                          <p className="text-slate-500 text-xs font-medium">{s.provider}</p>
                        </div>

                        {/* Match Score Gauge */}
                        <div className="shrink-0 flex flex-col items-center gap-0.5 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-2xl">
                          <span className="text-2xl font-black text-indigo-600 font-mono">
                            {rec.matchScore}%
                          </span>
                          <span className="text-[8px] uppercase font-bold text-indigo-500 tracking-wider">
                            Match Index
                          </span>
                        </div>
                      </div>

                      {/* Why Suitable (AI rationale) */}
                      <div className="p-4 bg-indigo-50/20 rounded-2xl border border-indigo-100/30 space-y-1.5">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide block">
                          AI Match Rationale
                        </span>
                        <p className="text-slate-700 text-xs leading-relaxed font-light">
                          {rec.whySuitable}
                        </p>
                      </div>

                      {/* Application guidance */}
                      <div className="p-4 bg-pink-50/10 rounded-2xl border border-pink-100/30 space-y-1.5">
                        <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wide block">
                          Advisor Application Steps
                        </span>
                        <p className="text-slate-700 text-xs leading-relaxed font-light">
                          {rec.applicationGuidance}
                        </p>
                      </div>

                      {/* Action Line */}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-semibold text-slate-400">
                          Deadline: {s.deadline}
                        </span>
                        <button
                          onClick={() => onViewDetailsById(s.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          View Full Spec
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Chat Panel */}
            <div className="lg:col-span-5 bg-white border border-slate-150 rounded-3xl shadow-sm flex flex-col h-[580px] overflow-hidden sticky top-24">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">Live Follow-up Consultation</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Ask specific essay, CV, or timeline advice</p>
                </div>
              </div>

              {/* Chat Messages Panel */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none font-light'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 p-3 rounded-2xl flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                      <span className="text-xs text-slate-400">Advisor is writing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                <input
                  type="text"
                  required
                  disabled={isChatLoading}
                  placeholder="Ask a question about your matches..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 transition-all font-light"
                />
                <button
                  type="submit"
                  disabled={isChatLoading}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white rounded-xl shadow transition"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
