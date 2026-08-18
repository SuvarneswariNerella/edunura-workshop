import React from 'react';
import { StudentClass, SubjectCategory } from '../types';
import { TOPIC_CATALOG } from '../data/topics';
import { Sparkles, Check, Lightbulb } from 'lucide-react';

interface TopicSelectorProps {
  studentClass: StudentClass | '';
  selectedSubjects: string[];
  selectedTopics: string[];
  onToggleTopic: (topicName: string, subject: SubjectCategory) => void;
  voteStats?: Record<string, number>;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  studentClass,
  selectedSubjects,
  selectedTopics,
  onToggleTopic,
  voteStats = {},
}) => {
  if (!studentClass) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-dashed border-indigo-200 text-center space-y-2">
        <div className="text-3xl">👆</div>
        <h4 className="text-sm font-bold text-slate-800">
          Please Select Your Grade / Class in Step 2 Above
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Once you select your grade (Class 6–10 or Class 11–12), the hardest topics and teachers' suggested masterclass demos will automatically unlock here!
        </p>
      </div>
    );
  }

  const currentCatalog = TOPIC_CATALOG.find((c) => c.classNumber === studentClass);

  if (!currentCatalog) {
    return (
      <div className="p-5 rounded-2xl bg-amber-50 text-amber-800 text-sm border border-amber-200 text-center font-medium">
        👆 Please select your class above to unlock the demo topics!
      </div>
    );
  }

  const isSeniorSecondary = studentClass === '11' || studentClass === '12';

  if (selectedSubjects.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-2 border-dashed border-purple-200 text-center space-y-2">
        <div className="text-3xl">🎯</div>
        <h4 className="text-sm font-bold text-slate-800">
          Please Select At Least One Subject in Step 3 Above
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {isSeniorSecondary
            ? 'Choose Maths, Physics, or Chemistry to filter and vote for your Class ' + studentClass + ' demo topics!'
            : 'Choose Maths or Science to filter and vote for your Class ' + studentClass + ' demo topics!'}
        </p>
      </div>
    );
  }

  // Filter topics by the subjects student is interested in
  const availableTopics = currentCatalog.topics.filter((topic) => {
    return selectedSubjects.includes(topic.subject);
  });

  // Group by Subject
  const subjectsInClass = Array.from(new Set(availableTopics.map((t) => t.subject))) as SubjectCategory[];

  // Track which subjects still need a selection
  const missingSubjects = subjectsInClass.filter((subj) => {
    const subjTopics = availableTopics.filter((t) => t.subject === subj);
    return !subjTopics.some((t) => selectedTopics.includes(t.name));
  });

  return (
    <div className="space-y-6">
      {/* Friendly Motivation Banner */}
      <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50 border-2 border-indigo-100/90 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 text-lg">
            🔥
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Choose 1 Toughest Topic per Subject (Class {studentClass})
              </h4>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Live Student Poll
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Vote for <strong>one core concept per subject</strong> that you find trickiest. Our master educator will address the highest-voted topics in the <strong>live 40-minute interactive masterclass</strong>!
            </p>
            {currentCatalog.suggestedHighlight && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-xl text-xs font-semibold text-amber-900 shadow-sm">
                <span className="text-base">🏆</span>
                <span>
                  Suggested Strongest Demo: <span className="text-orange-700 underline decoration-orange-300">{currentCatalog.suggestedHighlight}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topics by Subject */}
      <div className="space-y-6">
        {subjectsInClass.map((subj) => {
          const subjectTopics = availableTopics.filter((t) => t.subject === subj);
          const selectedForThisSubject = subjectTopics.find((t) => selectedTopics.includes(t.name));

          const getSubjectTheme = (subject: SubjectCategory) => {
            switch (subject) {
              case 'Maths':
                return {
                  headerBadge: 'bg-blue-600 text-white',
                  cardBorderActive: 'border-blue-500 ring-2 ring-blue-400/30 bg-blue-50/60',
                  icon: '📐',
                  colorText: 'text-blue-700',
                  tagBg: 'bg-blue-100 text-blue-800',
                  radioSelectedBg: 'border-blue-600 bg-blue-600',
                };
              case 'Science':
                return {
                  headerBadge: 'bg-emerald-600 text-white',
                  cardBorderActive: 'border-emerald-500 ring-2 ring-emerald-400/30 bg-emerald-50/60',
                  icon: '🔬',
                  colorText: 'text-emerald-700',
                  tagBg: 'bg-emerald-100 text-emerald-800',
                  radioSelectedBg: 'border-emerald-600 bg-emerald-600',
                };
              case 'Physics':
                return {
                  headerBadge: 'bg-violet-600 text-white',
                  cardBorderActive: 'border-violet-500 ring-2 ring-violet-400/30 bg-violet-50/60',
                  icon: '⚡',
                  colorText: 'text-violet-700',
                  tagBg: 'bg-violet-100 text-violet-800',
                  radioSelectedBg: 'border-violet-600 bg-violet-600',
                };
              case 'Chemistry':
                return {
                  headerBadge: 'bg-rose-600 text-white',
                  cardBorderActive: 'border-rose-500 ring-2 ring-rose-400/30 bg-rose-50/60',
                  icon: '🧪',
                  colorText: 'text-rose-700',
                  tagBg: 'bg-rose-100 text-rose-800',
                  radioSelectedBg: 'border-rose-600 bg-rose-600',
                };
            }
          };

          const theme = getSubjectTheme(subj);

          return (
            <div key={subj} className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{theme.icon}</span>
                  <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md ${theme.tagBg}`}>
                    {subj}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    • Choose 1 topic ({subjectTopics.length} available)
                  </span>
                </div>

                {selectedForThisSubject ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                    <span>Selected: {selectedForThisSubject.name}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                    <span>⚠️ Pick 1 {subj} topic</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {subjectTopics.map((topic) => {
                  const isSelected = selectedTopics.includes(topic.name);
                  const votes = Number(voteStats[topic.name] || 0);

                  return (
                    <div
                      key={topic.id}
                      onClick={() => onToggleTopic(topic.name, topic.subject)}
                      className={`relative group rounded-2xl p-4 transition-all duration-200 cursor-pointer border-2 text-left flex flex-col justify-between select-none ${
                        isSelected
                          ? `${theme.cardBorderActive} shadow-md`
                          : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow'
                      }`}
                    >
                      <div>
                        {/* Top Badges & Radio Indicator */}
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {topic.isSuggestedStrongest && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                                <span>⭐</span> Suggested Strongest Demo
                              </span>
                            )}
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              <span>🔥</span> Hard Concept
                            </span>
                          </div>

                          {/* Radio Button Style Indicator (Single Choice per Subject) */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                              isSelected
                                ? `${theme.radioSelectedBg} text-white shadow-sm ring-2 ring-blue-400/30 scale-105`
                                : 'border-2 border-slate-300 group-hover:border-blue-400 bg-white'
                            }`}
                          >
                            {isSelected ? (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            ) : null}
                          </div>
                        </div>

                        {/* Topic Name */}
                        <h5
                          className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
                            isSelected ? 'text-slate-900' : 'text-slate-800'
                          }`}
                        >
                          {topic.name}
                        </h5>

                        {/* Pedagogical Note / Misconception Tip */}
                        {topic.pedagogicalTip && (
                          <div className="mt-2.5 text-xs text-slate-600 flex items-start gap-2 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{topic.pedagogicalTip}</span>
                          </div>
                        )}
                      </div>

                      {/* Vote Count & Action Footer */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                          <span>🗳️</span>
                          {votes > 0 ? (
                            <span className="text-blue-600 font-semibold">{votes} students voted</span>
                          ) : (
                            <span className="text-slate-400">0 votes so far</span>
                          )}
                        </span>
                        <span
                          className={`font-semibold text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 group-hover:text-blue-700 bg-slate-100 group-hover:bg-blue-50'
                          }`}
                        >
                          {isSelected ? `Selected for ${subj} ✓` : `Select for ${subj}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Helper Banner */}
      {missingSubjects.length > 0 ? (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold flex items-center gap-2">
          <span>👉</span>
          <span>
            Please select 1 topic for <strong>{missingSubjects.join(' and ')}</strong> to complete Step 4.
          </span>
        </div>
      ) : (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <span>✅</span>
          <span>
            Awesome! You have selected 1 topic for each chosen subject ({selectedTopics.length} total topic{selectedTopics.length > 1 ? 's' : ''}).
          </span>
        </div>
      )}
    </div>
  );
};
