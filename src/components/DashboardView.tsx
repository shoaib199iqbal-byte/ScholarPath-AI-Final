import React from 'react';
import { User, Bookmark, Sparkles, MapPin, Award, ArrowRight, CircleDollarSign, Calendar, Eye, BookmarkX } from 'lucide-react';
import { StudentProfile, AIAdvisorResponse, Scholarship } from '../types';
import { SCHOLARSHIPS } from '../data/scholarships';

interface DashboardViewProps {
  profile: StudentProfile | null;
  report: AIAdvisorResponse | null;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (scholarship: Scholarship) => void;
  onNavigateToAdvisor: () => void;
  onNavigateToDirectory: () => void;
}

export default function DashboardView({
  profile,
  report,
  savedIds,
  onToggleSave,
  onViewDetails,
  onNavigateToAdvisor,
  onNavigateToDirectory,
}: DashboardViewProps) {
  // Resolve actual scholarship structures for saved IDs
  const savedScholarships = SCHOLARSHIPS.filter((s) => savedIds.includes(s.id));

  return (
    <div className="space-y-8 py-4">
      {/* 1. Header Row */}
      <div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          My ScholarPath Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor your application progress, saved listings, and custom AI advisor recommendations.
        </p>
      </div>

      {/* 2. Main content grids */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Snapshot & Saved Bookmarks (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Profile Snapshot Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" />
              Student Profile Snapshot
            </h2>

            {profile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      Target Degree
                    </span>
                    <span className="text-sm font-bold text-slate-800 block mt-1">
                      {profile.degreeLevel}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      Field of Study
                    </span>
                    <span className="text-sm font-bold text-slate-800 block mt-1 truncate">
                      {profile.fieldOfStudy}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      GPA / Grades
                    </span>
                    <span className="text-sm font-bold text-slate-800 block mt-1">
                      {profile.gpa}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      Home Country
                    </span>
                    <span className="text-sm font-bold text-slate-800 block mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {profile.homeCountry}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      Target Destination
                    </span>
                    <span className="text-sm font-bold text-slate-800 block mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-indigo-500" />
                      {profile.destinationCountry}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      Financial Need
                    </span>
                    <span className="text-sm font-bold text-slate-800 block mt-1">
                      {profile.financialNeed} Need
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/20 border border-indigo-100/30 rounded-2xl">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide block mb-1">
                    Leadership & Experience Snippet
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-light italic">
                    "{profile.extraActivities}"
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={onNavigateToAdvisor}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                  >
                    Edit Profile Details & Recalculate
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-4">
                <p className="text-slate-500 text-sm">
                  You haven’t constructed your student profile yet. Build it in the AI Advisor panel to fetch tailored opportunities.
                </p>
                <button
                  onClick={onNavigateToAdvisor}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  <Sparkles className="h-4 w-4" />
                  Build My Profile
                </button>
              </div>
            )}
          </div>

          {/* Bookmarked/Saved Scholarships List */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-indigo-500" />
                Saved Scholarships ({savedScholarships.length})
              </h2>
              {savedScholarships.length > 0 && (
                <button
                  onClick={onNavigateToDirectory}
                  className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
                >
                  Browse More
                </button>
              )}
            </div>

            {savedScholarships.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {savedScholarships.map((sch) => (
                  <div key={sch.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-display font-bold text-sm text-slate-900 truncate">{sch.name}</h4>
                      <p className="text-slate-500 text-xs truncate">{sch.provider}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-0.5 font-semibold text-indigo-600">
                          <CircleDollarSign className="h-3 w-3" />
                          {sch.fundingType}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-3 w-3" />
                          Deadline: {sch.deadline}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onViewDetails(sch)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                        title="View specifications"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => onToggleSave(sch.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Remove bookmark"
                      >
                        <BookmarkX className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-4">
                <div className="w-12 h-12 bg-slate-50 border border-slate-200/55 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Bookmark className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-sm">No saved opportunities yet.</p>
                  <p className="text-slate-400 text-xs">Bookmark scholarships in the directory to track them here.</p>
                </div>
                <button
                  onClick={onNavigateToDirectory}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Search Scholarship Database
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Advice Recap (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* AI Advisor Report Overview Card */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-500/30 text-indigo-300 text-[10px] font-bold rounded-full">
                <Sparkles className="h-3 w-3" />
                ACTIVE ADVISEMENTS
              </div>
              <h3 className="font-display font-bold text-xl text-white">Advisor Match Stats</h3>
            </div>

            {report ? (
              <div className="space-y-6">
                <p className="text-slate-300 text-xs leading-relaxed font-light line-clamp-4">
                  {report.analysisSummary}
                </p>

                {/* Match scores progress block */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recommended Opportunities
                  </h4>
                  <div className="space-y-2.5">
                    {report.recommendations.map((rec) => {
                      const s = SCHOLARSHIPS.find((item) => item.id === rec.scholarshipId);
                      if (!s) return null;
                      return (
                        <div key={rec.scholarshipId} className="flex items-center justify-between gap-4 text-xs">
                          <span className="font-medium text-slate-200 truncate flex-1">{s.name}</span>
                          <span className="font-mono font-bold text-indigo-300">{rec.matchScore}% match</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onNavigateToAdvisor}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition"
                  >
                    View Complete Report & Consultation Chat
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-300 text-xs leading-relaxed font-light">
                  Unlock personalized AI recommendations and specific application guides by completing the profile match.
                </p>
                <button
                  onClick={onNavigateToAdvisor}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Consult AI Advisor
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Guide to Success */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 text-xs space-y-3 shadow-sm font-light text-slate-600">
            <h4 className="font-bold text-slate-800 font-sans uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-indigo-600" />
              Scholarship Prep Guidelines
            </h4>
            <ul className="space-y-2.5">
              <li className="flex gap-2">
                <span className="text-indigo-600">•</span>
                <span><strong>IELTS/TOEFL Prep:</strong> Government grants require scores of 6.5+ or 90+ respectively. Start 6 months before.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600">•</span>
                <span><strong>Recommendation Letters:</strong> Secure two academic referees early (academic professors or work managers).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600">•</span>
                <span><strong>Personal Statements:</strong> Do not just list skills. Tell a narrative of leadership and community contribution.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
