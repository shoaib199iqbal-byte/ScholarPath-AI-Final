import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Calendar, Award, Globe, CircleDollarSign, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { SCHOLARSHIPS } from '../data/scholarships';
import { Scholarship, DegreeLevel } from '../types';

interface ScholarshipDirectoryProps {
  onViewDetails: (scholarship: Scholarship) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export default function ScholarshipDirectory({ onViewDetails, savedIds, onToggleSave }: ScholarshipDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegree, setSelectedDegree] = useState<string>('All');
  const [selectedDestination, setSelectedDestination] = useState<string>('All');
  const [selectedFunding, setSelectedFunding] = useState<string>('All');
  const [selectedField, setSelectedField] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Derive filter categories dynamically from the database
  const destinationsList = useMemo(() => {
    const list = new Set<string>();
    SCHOLARSHIPS.forEach(s => s.destinationCountries.forEach(d => list.add(d)));
    return Array.from(list).sort();
  }, []);

  const fieldsList = useMemo(() => {
    const list = new Set<string>();
    SCHOLARSHIPS.forEach(s => s.fieldsOfStudy.forEach(f => {
      if (f !== 'Any') list.add(f);
    }));
    return Array.from(list).sort();
  }, []);

  // Filtering Logic
  const filteredScholarships = useMemo(() => {
    return SCHOLARSHIPS.filter((sch) => {
      // Search matching
      const matchesSearch =
        sch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Degree matching
      const matchesDegree =
        selectedDegree === 'All' ||
        sch.degreeLevels.some(d => d === 'Any' || d === selectedDegree);

      // Destination matching
      const matchesDestination =
        selectedDestination === 'All' ||
        sch.destinationCountries.some(d => d === 'Global' || d === selectedDestination);

      // Funding matching
      const matchesFunding =
        selectedFunding === 'All' ||
        sch.fundingType === selectedFunding;

      // Field of study matching
      const matchesField =
        selectedField === 'All' ||
        sch.fieldsOfStudy.some(f => f === 'Any' || f === selectedField);

      return matchesSearch && matchesDegree && matchesDestination && matchesFunding && matchesField;
    });
  }, [searchQuery, selectedDegree, selectedDestination, selectedFunding, selectedField]);

  return (
    <div className="space-y-8 py-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
            Explore Scholarship Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse through {SCHOLARSHIPS.length} fully verified global fellowships, academic waivers, and stipends.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, provider, description, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all placeholder:text-slate-400 font-light"
            />
          </div>

          {/* Toggle Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3.5 border rounded-xl text-sm font-semibold transition ${
              showFilters || selectedDegree !== 'All' || selectedDestination !== 'All' || selectedFunding !== 'All' || selectedField !== 'All'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(selectedDegree !== 'All' || selectedDestination !== 'All' || selectedFunding !== 'All' || selectedField !== 'All') && (
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            )}
          </button>
        </div>

        {/* Extended Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-4 duration-200">
            {/* Degree Level Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">
                Degree Level
              </label>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium"
              >
                <option value="All">All Degrees</option>
                <option value="Bachelors">Bachelor's</option>
                <option value="Masters">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            {/* Fields Of Study Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">
                Field of Study
              </label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium"
              >
                <option value="All">All Fields</option>
                {fieldsList.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">
                Study Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium"
              >
                <option value="All">All Destinations</option>
                {destinationsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Funding Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">
                Funding Scope
              </label>
              <select
                value={selectedFunding}
                onChange={(e) => setSelectedFunding(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium"
              >
                <option value="All">All Funding Types</option>
                <option value="Fully Funded">Fully Funded</option>
                <option value="Tuition + Stipend">Tuition + Stipend</option>
                <option value="Partial Tuition">Partial Tuition</option>
                <option value="Stipend Only">Stipend Only</option>
              </select>
            </div>
          </div>
        )}

        {/* Active Filter Badges */}
        {(selectedDegree !== 'All' || selectedDestination !== 'All' || selectedFunding !== 'All' || selectedField !== 'All') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium">Active Filters:</span>
            {selectedDegree !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium">
                Degree: {selectedDegree}
                <button onClick={() => setSelectedDegree('All')} className="hover:text-indigo-900 font-bold ml-1">×</button>
              </span>
            )}
            {selectedField !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium">
                Field: {selectedField}
                <button onClick={() => setSelectedField('All')} className="hover:text-indigo-900 font-bold ml-1">×</button>
              </span>
            )}
            {selectedDestination !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium">
                Destination: {selectedDestination}
                <button onClick={() => setSelectedDestination('All')} className="hover:text-indigo-900 font-bold ml-1">×</button>
              </span>
            )}
            {selectedFunding !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium">
                Funding: {selectedFunding}
                <button onClick={() => setSelectedFunding('All')} className="hover:text-indigo-900 font-bold ml-1">×</button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedDegree('All');
                setSelectedDestination('All');
                setSelectedFunding('All');
                setSelectedField('All');
              }}
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold ml-auto"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* List / Grid of Results */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScholarships.map((sch) => {
            const isSaved = savedIds.includes(sch.id);
            return (
              <div
                key={sch.id}
                className="bg-white border border-slate-150/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between group relative"
              >
                {/* Save Toggle on top corner */}
                <button
                  onClick={() => onToggleSave(sch.id)}
                  className={`absolute top-5 right-5 p-2 rounded-xl border transition-all ${
                    isSaved
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="h-4.5 w-4.5" /> : <Bookmark className="h-4.5 w-4.5" />}
                </button>

                <div className="space-y-4">
                  {/* Top line details */}
                  <div className="space-y-1 pr-8">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                      <CircleDollarSign className="h-3.5 w-3.5" />
                      {sch.fundingType}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight group-hover:text-indigo-600 transition">
                      {sch.name}
                    </h3>
                    <p className="text-slate-500 text-xs truncate font-medium">{sch.provider}</p>
                  </div>

                  {/* Core Tags / Metadata pills */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-200/50 text-slate-600 text-[10px] rounded-md font-mono flex items-center gap-1">
                      <Award className="h-2.5 w-2.5" />
                      {sch.degreeLevels.join(', ')}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-200/50 text-slate-600 text-[10px] rounded-md font-mono flex items-center gap-1">
                      <Globe className="h-2.5 w-2.5" />
                      {sch.destinationCountries.join(', ')}
                    </span>
                  </div>

                  {/* Snippet */}
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-light">
                    {sch.description}
                  </p>
                </div>

                {/* Footer details & Action */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-300" />
                    Deadline: {sch.deadline}
                  </span>

                  <button
                    onClick={() => onViewDetails(sch)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center max-w-xl mx-auto space-y-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Search className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-slate-900">No Scholarships Found</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We couldn't find any scholarship matching "{searchQuery}" under the selected filters. Try broadening your criteria or reset filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDegree('All');
              setSelectedDestination('All');
              setSelectedFunding('All');
              setSelectedField('All');
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
