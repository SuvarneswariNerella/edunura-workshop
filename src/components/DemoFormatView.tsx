import React from 'react';
import { DEMO_FORMAT_STEPS, TOPIC_CATALOG } from '../data/topics';
import {
  Sparkles,
  CheckCircle2,
  Layers,
  BrainCircuit,
  AlertTriangle,
  Trophy,
  BookmarkCheck,
  Clock,
  Lightbulb,
  Award,
  BookOpen,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  CheckCircle2: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
  Layers: <Layers className="w-5 h-5 text-indigo-500" />,
  BrainCircuit: <BrainCircuit className="w-5 h-5 text-emerald-500" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-rose-500" />,
  Trophy: <Trophy className="w-5 h-5 text-amber-500" />,
  BookmarkCheck: <BookmarkCheck className="w-5 h-5 text-teal-500" />,
};

export const DemoFormatView: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Edunura Masterclass Methodology
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          The 40-Minute Interactive Demo Blueprint
        </h2>
        <p className="text-sm sm:text-base text-blue-100/90 max-w-3xl mt-2 leading-relaxed">
          Engineered specifically for difficult & high-confusion topics in Maths and Science across Classes 6 to 12. Designed to demonstrate conceptual clarity, questioning, real-life connection, error correction, and independent problem-solving.
        </p>
      </div>

      {/* 40-Minute Step-by-Step Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">40-Minute Masterclass Timeline</h3>
            <p className="text-xs text-slate-500">How our masterclass instructors structure every single minute</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_FORMAT_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm bg-slate-50/50 transition-all flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                {ICON_MAP[step.icon]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                    {step.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Demo Highlights by Class */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Curated Demo Topics & Concept Insights</h3>
            <p className="text-xs text-slate-500">
              Selected difficult / high-confusion topics proven to create immediate &ldquo;Aha!&rdquo; moments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPIC_CATALOG.map((item) => {
            const strongestTopics = item.topics.filter((t) => t.isSuggestedStrongest);
            return (
              <div
                key={item.classNumber}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    Class {item.classNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {item.subjects.join(', ')}
                  </span>
                </div>

                <div className="space-y-2">
                  {strongestTopics.map((topic) => (
                    <div key={topic.id} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>{topic.name}</span>
                      </div>
                      {topic.pedagogicalTip && (
                        <div className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                          <span>{topic.pedagogicalTip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
