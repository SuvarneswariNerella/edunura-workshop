import React from 'react';
import { StudentClass, SubjectCategory } from '../types';
import { TOPIC_CATALOG } from '../data/topics';
import { Sparkles, Check, Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TopicSelectorProps {
  studentClass: StudentClass | '';
  selectedSubjects: string[];
  selectedTopics: string[];
  onToggleTopic: (topicName: string, subject: string) => void;
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
            ? 'Choose your subjects (Maths, Physics, Chemistry, Accountancy, Business Studies, or Economics) to filter and vote for your Class ' + studentClass + ' demo topics!'
            : 'Choose Maths or Science to filter and vote for your Class ' + studentClass + ' demo topics!'}
        </p>
      </div>
    );
  }

  // Filter topics by the subjects student is interested in
  const availableTopics = currentCatalog.topics.filter((topic) => {
    return selectedSubjects.includes(topic.subject);
  });

  // Group by Subject preserving selection order
  const subjectsInClass = selectedSubjects.filter((subj) =>
    availableTopics.some((t) => t.subject === subj)
  ) as SubjectCategory[];

  const getSubjectTheme = (subject: SubjectCategory) => {
    switch (subject) {
      case 'Maths':
        return {
          headerBadge: 'bg-blue-600 text-white',
          cardBorderActive: 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/70',
          radioActive: 'border-blue-600 bg-blue-600 text-white',
          icon: '📐',
          colorText: 'text-blue-700',
          tagBg: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'Science':
        return {
          headerBadge: 'bg-emerald-600 text-white',
          cardBorderActive: 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/70',
          radioActive: 'border-emerald-600 bg-emerald-600 text-white',
          icon: '🔬',
          colorText: 'text-emerald-700',
          tagBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'Physics':
        return {
          headerBadge: 'bg-violet-600 text-white',
          cardBorderActive: 'border-violet-600 ring-2 ring-violet-500/20 bg-violet-50/70',
          radioActive: 'border-violet-600 bg-violet-600 text-white',
          icon: '⚡',
          colorText: 'text-violet-700',
          tagBg: 'bg-violet-100 text-violet-800 border-violet-200',
        };
      case 'Chemistry':
        return {
          headerBadge: 'bg-rose-600 text-white',
          cardBorderActive: 'border-rose-600 ring-2 ring-rose-500/20 bg-rose-50/70',
          radioActive: 'border-rose-600 bg-rose-600 text-white',
          icon: '🧪',
          colorText: 'text-rose-700',
          tagBg: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      case 'Accountancy':
        return {
          headerBadge: 'bg-teal-600 text-white',
          cardBorderActive: 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/70',
          radioActive: 'border-teal-600 bg-teal-600 text-white',
          icon: '📊',
          colorText: 'text-teal-700',
          tagBg: 'bg-teal-100 text-teal-800 border-teal-200',
        };
      case 'Business Studies':
        return {
          headerBadge: 'bg-amber-600 text-white',
          cardBorderActive: 'border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/70',
          radioActive: 'border-amber-600 bg-amber-600 text-white',
          icon: '🏢',
          colorText: 'text-amber-700',
          tagBg: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'Economics':
        return {
          headerBadge: 'bg-cyan-600 text-white',
          cardBorderActive: 'border-cyan-600 ring-2 ring-cyan-500/20 bg-cyan-50/70',
          radioActive: 'border-cyan-600 bg-cyan-600 text-white',
          icon: '📈',
          colorText: 'text-cyan-700',
          tagBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        };
      default:
        return {
          headerBadge: 'bg-indigo-600 text-white',
          cardBorderActive: 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/70',
          radioActive: 'border-indigo-600 bg-indigo-600 text-white',
          icon: '📚',
          colorText: 'text-indigo-700',
          tagBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Friendly Motivation & Rule Guidance Banner */}
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
                1 Choice Per Subject
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Select <strong>one topic from each of your chosen subjects</strong> ({selectedSubjects.join(' & ')}). Our master educator will address your chosen concepts in the live 40-minute interactive masterclass!
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
      <div className="space-y-7">
        {subjectsInClass.map((subj) => {
          const subjectTopics = availableTopics.filter((t) => t.subject === subj);
          const selectedTopicInSubj = subjectTopics.find((t) => selectedTopics.includes(t.name));
          const theme = getSubjectTheme(subj);

          return (
            <div
              key={subj}
              className="bg-white rounded-2xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4"
            >
              {/* Subject Section Header with Single Selection Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{theme.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900">{subj}</h4>
                      <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${theme.tagBg}`}>
                        Single Choice (1 Option)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select exactly 1 concept you want simplified in {subj}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {selectedTopicInSubj ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-xs">
                        1 Selected: {selectedTopicInSubj.name}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-bold text-amber-800 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Select 1 topic for {subj}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Topic Options (Radio Selection - One Option Per Subject) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {subjectTopics.map((topic) => {
                  const isSelected = selectedTopics.includes(topic.name);
                  const votes = Number(voteStats[topic.name] || 0);

                  return (
                    <div
                      key={topic.id}
                      onClick={() => onToggleTopic(topic.name, subj)}
                      className={`relative group rounded-2xl p-4 transition-all duration-200 cursor-pointer border-2 text-left flex flex-col justify-between select-none ${
                        isSelected
                          ? `${theme.cardBorderActive} shadow-md`
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Top Badges & Single-Choice Radio Indicator */}
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {topic.isSuggestedStrongest && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                                <span>⭐</span> Strongest Demo
                              </span>
                            )}
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              <span>🔥</span> Hard Topic
                            </span>
                          </div>

                          {/* Radio Button Pill Indicator */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                              isSelected
                                ? `${theme.radioActive} scale-110 shadow-sm`
                                : 'border-2 border-slate-300 group-hover:border-blue-400 bg-white'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-slate-200 transition-colors" />
                            )}
                          </div>
                        </div>

                        {/* Topic Name */}
                        <h5
                          className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
                            isSelected ? 'text-slate-900 font-extrabold' : 'text-slate-800'
                          }`}
                        >
                          {topic.name}
                        </h5>

                        {/* Pedagogical Note / Misconception Tip */}
                        {topic.pedagogicalTip && (
                          <div className="mt-2.5 text-xs text-slate-600 flex items-start gap-2 bg-slate-50/90 rounded-xl p-2.5 border border-slate-100">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{topic.pedagogicalTip}</span>
                          </div>
                        )}
                      </div>

                      {/* Vote Count & Single Choice Status Footer */}
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
                          className={`font-bold text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 group-hover:text-blue-700 bg-slate-100 group-hover:bg-blue-50 border border-slate-200 group-hover:border-blue-200'
                          }`}
                        >
                          {isSelected ? 'Selected (1 of 1) ✓' : `Select for ${subj}`}
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

      {selectedTopics.length === 0 && (
        <div className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl text-xs text-rose-800 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Please select 1 topic for each of your chosen subjects ({selectedSubjects.join(' and ')}) above.</span>
        </div>
      )}
    </div>
  );
};
