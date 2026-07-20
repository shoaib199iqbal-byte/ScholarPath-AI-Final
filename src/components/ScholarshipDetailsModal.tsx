import React from 'react';
import { X, Calendar, Globe, Award, GraduationCap, Link2, BookOpen, CircleDollarSign, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';
import { Scholarship } from '../types';

interface ScholarshipDetailsModalProps {
  scholarship: Scholarship;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function ScholarshipDetailsModal({ scholarship, onClose, isSaved, onToggleSave }: ScholarshipDetailsModalProps) {
  // Prevent propagation to prevent closing on background click
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={handleContainerClick}
        className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
      >
        {/* Header Visual */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-start z-10">
          <div className="space-y-1 pr-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50 rounded-full text-indigo-700 text-xs font-semibold">
              <CircleDollarSign className="h-3 w-3" />
              {scholarship.fundingType}
            </span>
            <h2 className="font-display font-bold text-xl md:text-2xl text-slate-950 tracking-tight">
              {scholarship.name}
            </h2>
            <p className="text-slate-500 text-sm font-medium">{scholarship.provider}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleSave}
              className={`p-2.5 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Scholarship'}
            >
              {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">
                Amount
              </span>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {scholarship.amount.includes('Full') ? 'Fully Funded' : 'Partial / Stipend'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">
                Deadline
              </span>
              <p className="text-xs font-bold text-red-600 leading-tight flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {scholarship.deadline}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">
                Degree Level
              </span>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {scholarship.degreeLevels.join(', ')}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">
                Eligible Origin
              </span>
              <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                {scholarship.eligibleCountries.includes('Global') ? 'All Countries' : scholarship.eligibleCountries.join(', ')}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-slate-400" />
              Program Overview
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              {scholarship.description}
            </p>
          </div>

          {/* Core Eligibility Criteria */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-slate-900 text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-slate-400" />
              Academic & Admission Requirements
            </h3>
            <div className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-100/50 space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Academic Standing</h4>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    {scholarship.academicRequirements}
                  </p>
                </div>
              </div>

              {scholarship.financialRequirements && (
                <div className="flex gap-3 pt-3 border-t border-indigo-100/50">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Financial Conditions</h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      {scholarship.financialRequirements}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Targets and Scopes */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                Fields of Study Supported
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {scholarship.fieldsOfStudy.map((field) => (
                  <span
                    key={field}
                    className="px-2.5 py-1 bg-slate-100 border border-slate-200/50 text-slate-700 text-xs rounded-lg font-medium"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                Preferred Study Destinations
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {scholarship.destinationCountries.map((dest) => (
                  <span
                    key={dest}
                    className="px-2.5 py-1 bg-slate-100 border border-slate-200/50 text-slate-700 text-xs rounded-lg font-medium flex items-center gap-1"
                  >
                    <Globe className="h-3 w-3 text-slate-400" />
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex justify-between items-center z-10">
          <div className="text-slate-400 text-xs flex items-center gap-1">
            <Link2 className="h-3.5 w-3.5" />
            Website source: Official Provider
          </div>
          <a
            href={scholarship.website}
            target="_blank"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/10 transition"
          >
            Visit Official Website
            <Link2 className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
