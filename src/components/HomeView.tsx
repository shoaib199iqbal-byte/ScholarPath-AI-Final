import React from 'react';
import { Sparkles, Compass, ShieldCheck, ArrowRight, Award, GraduationCap, DollarSign, Search } from 'lucide-react';

interface HomeViewProps {
  onStartAdvisor: () => void;
  onExploreDirectory: () => void;
  onBuildProfile: () => void;
}

export default function HomeView({ onStartAdvisor, onExploreDirectory, onBuildProfile }: HomeViewProps) {
  const steps = [
    {
      num: '01',
      title: 'Build Your Profile',
      desc: 'Input your degree level, GPA, field of study, destination, and financial background in under two minutes.',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      num: '02',
      title: 'Generate Matching Matches',
      desc: 'Our intelligent matching matrix sifts through verified global funding databases to align with your profile.',
      icon: Search,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      num: '03',
      title: 'Get AI Advisor Guidance',
      desc: 'Receive specialized feedback explaining why you match, plus real practical guides to streamline your essays.',
      icon: Sparkles,
      color: 'bg-pink-50 text-pink-600 border-pink-100',
    },
  ];

  return (
    <div className="space-y-16 py-4 md:py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white px-6 py-16 md:p-20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative max-w-3xl z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            AI-POWERED SCHOLARSHIP INTELLIGENCE
          </div>
          
          <h1 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.1] text-white">
            Your path to global education, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-100">funded.</span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
            ScholarPath AI helps university students and recent graduates discover fully-funded scholarships, stipends, and academic grants tailored to their academic performance, origin, and field of study.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onStartAdvisor}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 text-base"
            >
              <Sparkles className="h-5 w-5" />
              Try AI Advisor
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <button
              onClick={onExploreDirectory}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-2xl border border-slate-700 transition-all hover:-translate-y-0.5 active:translate-y-0 text-base"
            >
              <Compass className="h-5 w-5 text-indigo-400" />
              Explore Directory
            </button>
          </div>
        </div>
      </div>

      {/* Highlights Bento */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
          <div className="p-3 w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-900">Prestige Programs</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Direct matching for prestigious global programs such as Chevening, Fulbright, DAAD, Erasmus Mundus, and MEXT.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
          <div className="p-3 w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-900">Fully-Funded Filters</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Isolate tuition waivers, monthly stipends, health insurances, and flight allowances in seconds to match your exact financial background.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
          <div className="p-3 w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-900">Personalized AI Rationale</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Our AI advisor analyzes your precise GPA, research experiences, and background, translating dry requirements into a direct matching score.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="font-display font-bold text-3xl tracking-tight text-slate-950">
            How ScholarPath AI Works
          </h2>
          <p className="text-slate-500">
            Get personalized scholarship matching and targeted application guidance in three straightforward steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const clickHandler = idx === 0 ? onBuildProfile : idx === 1 ? onExploreDirectory : onStartAdvisor;
            return (
              <button
                key={idx}
                onClick={clickHandler}
                className="bg-white border border-slate-100 p-8 rounded-2xl relative space-y-4 flex flex-col justify-between cursor-pointer text-left hover:border-indigo-300 hover:shadow-lg transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-slate-300 tracking-widest block uppercase group-hover:text-indigo-500 transition-colors">
                    Step {step.num}
                  </span>
                  <div className="space-y-2 mt-2">
                    <h3 className="font-display font-bold text-lg text-slate-950 group-hover:text-indigo-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-light">{step.desc}</p>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
                    {idx === 0 ? 'Build Profile Now' : idx === 1 ? 'Search Listings' : 'Get Advice'}
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className={`p-2.5 rounded-xl border ${step.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Verification Trust Panel */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-indigo-600 shrink-0">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display font-bold text-xl text-slate-900">
            100% Curated and Verified Directories
          </h3>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            We list only active, officially recognized scholarship funds, government initiatives, and university grants. No spam, no dead links, and no subscription walls.
          </p>
        </div>
        <div className="md:ml-auto w-full md:w-auto">
          <button
            onClick={onExploreDirectory}
            className="w-full md:w-auto px-6 py-3 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl text-sm shadow-sm transition"
          >
            Browse Verified Opportunities
          </button>
        </div>
      </div>
    </div>
  );
}
