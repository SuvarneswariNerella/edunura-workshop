import React, { useState } from 'react';
import { StudentClass } from '../types';
import { TOPIC_CATALOG } from '../data/topics';
import { BarChart3, Trophy, Flame, CheckCircle2, Sparkles, Filter } from 'lucide-react';

interface LiveTopicPollProps {
  statsByClass: Record<string, Record<string, number>>;
  totalEnrollments: number;
}

export const LiveTopicPoll: React.FC<LiveTopicPollProps> = ({
  statsByClass,
  totalEnrollments,
}) => {
  const [selectedClass, setSelectedClass] = useState<StudentClass>('10');

  const activeCatalog = TOPIC_CATALOG.find((c) => c.classNumber === selectedClass);
  const classVotes: Record<string, number> = statsByClass[selectedClass] || {};

  // Calculate total votes for this class
  const classTotalVotes: number = Object.values(classVotes).reduce((sum: number, v: number) => sum + Number(v), 0);

  // Sort topics by votes desc
  const sortedTopics = [...(activeCatalog?.topics || [])].sort((a, b) => {
    const votesA = Number(classVotes[a.name] || 0);
    const votesB = Number(classVotes[b.name] || 0);
    return votesB - votesA;
  });

  const leadingTopic = sortedTopics[0];
  const maxVotes = sortedTopics.length > 0 ? Number(classVotes[sortedTopics[0].name] || 0) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            Live Poll Analytics
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Democratic Demo Topic Selection
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
            Every registered student’s vote is tallied in real-time. For each class, the topic with the largest consensus will become the core focus of our 40-minute interactive live demo.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">Total Students Registered</span>
              <span className="text-lg font-bold text-white">{totalEnrollments} Students</span>
            </div>
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">Class {selectedClass} Total Votes</span>
              <span className="text-lg font-bold text-blue-400">{classTotalVotes} Votes</span>
            </div>
            {leadingTopic && maxVotes > 0 && (
              <div className="bg-blue-950/80 px-4 py-2 rounded-xl border border-blue-700/60">
                <span className="text-blue-300 block font-medium">Currently Leading Class {selectedClass}:</span>
                <span className="text-sm font-bold text-blue-100">{leadingTopic.name} ({maxVotes} votes)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Class Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Select Class to View Topic Poll Breakdown</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {(['6', '7', '8', '9', '10', '11', '12'] as StudentClass[]).map((cls) => {
            const isSelected = selectedClass === cls;
            const count = Object.values(statsByClass[cls] || {}).reduce((s: number, v: number) => s + Number(v), 0);
            return (
              <button
                key={cls}
                id={`poll-btn-class-${cls}`}
                onClick={() => setSelectedClass(cls)}
                className={`py-2 px-3 rounded-xl text-center font-bold text-xs transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>Class {cls}</div>
                <div className={`text-[10px] font-normal mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {count} votes
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics Ranking */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Class {selectedClass} Hard Topics Poll Leaderboard</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked dynamically by student preference and high-confusion demand
            </p>
          </div>
          {activeCatalog?.suggestedHighlight && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Recommended: {activeCatalog.suggestedHighlight}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {sortedTopics.map((topic, index) => {
            const votes = Number(classVotes[topic.name] || 0);
            const percentage = classTotalVotes > 0 ? Math.round((votes / classTotalVotes) * 100) : 0;
            const isWinner = index === 0 && votes > 0;

            return (
              <div
                key={topic.id}
                className={`p-4 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-gradient-to-r from-blue-50/90 to-indigo-50/50 border-blue-400 ring-1 ring-blue-400/30'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isWinner
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isWinner ? <Trophy className="w-4 h-4" /> : `#${index + 1}`}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            topic.subject === 'Maths'
                              ? 'bg-blue-100 text-blue-800'
                              : topic.subject === 'Science'
                              ? 'bg-emerald-100 text-emerald-800'
                              : topic.subject === 'Physics'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {topic.subject}
                        </span>

                        {isWinner && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                            Majority Choice
                          </span>
                        )}

                        {topic.isSuggestedStrongest && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                            Suggested Strongest Demo
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {topic.name}
                      </h4>
                      {topic.pedagogicalTip && (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          💡 Demo approach: {topic.pedagogicalTip}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base sm:text-lg font-extrabold text-slate-900">
                      {votes} <span className="text-xs font-normal text-slate-500">votes</span>
                    </div>
                    <div className="text-xs font-semibold text-blue-600">
                      {percentage}% of class
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinner ? 'bg-blue-600' : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.max(percentage, votes > 0 ? 5 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
