import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentClass,
  SubjectCategory,
  EducationalBoard,
  StudentEnrollment,
} from '../types';
import { TOPIC_CATALOG } from '../data/topics';
import { TopicSelector } from './TopicSelector';
import {
  User,
  School,
  Mail,
  Phone,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface EnrollmentFormProps {
  onSuccess: (record: StudentEnrollment, emailStatusMsg?: string) => void;
  voteStats?: Record<string, Record<string, number>>;
}

const CLASS_OPTIONS: { value: StudentClass; label: string; emoji: string; badge: string }[] = [
  { value: '6', label: 'Class 6', emoji: '🚀', badge: 'Explorer' },
  { value: '7', label: 'Class 7', emoji: '⚡', badge: 'Challenger' },
  { value: '8', label: 'Class 8', emoji: '🧠', badge: 'Thinker' },
  { value: '9', label: 'Class 9', emoji: '🎯', badge: 'Hero' },
  { value: '10', label: 'Class 10', emoji: '🏆', badge: 'Board Star' },
  { value: '11', label: 'Class 11', emoji: '🔬', badge: 'Senior Secondary' },
  { value: '12', label: 'Class 12', emoji: '🎓', badge: 'Board & Entrance' },
];

const BOARD_OPTIONS: EducationalBoard[] = [
  'CBSE',
  'ICSE',
  'State Board',
  'IB (International Baccalaureate)',
  'IGCSE / Cambridge',
  'Other',
];

interface SubjectOption {
  name: SubjectCategory;
  icon: string;
  desc: string;
  activeRing: string;
}

const SUBJECT_OPTIONS_JUNIOR: SubjectOption[] = [
  {
    name: 'Maths',
    icon: '📐',
    desc: 'Geometry, Algebra, Arithmetic & Visual Proofs',
    activeRing: 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20',
  },
  {
    name: 'Science',
    icon: '🔬',
    desc: 'Physics concepts, Chemistry, Biology & Practical Laws',
    activeRing: 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20',
  },
];

const SUBJECT_OPTIONS_SENIOR: SubjectOption[] = [
  {
    name: 'Maths',
    icon: '📐',
    desc: 'Calculus, Trigonometry, Vectors & Advanced Algebra',
    activeRing: 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20',
  },
  {
    name: 'Physics',
    icon: '⚡',
    desc: 'Newtonian Mechanics, Electricity, Magnetism & Optics',
    activeRing: 'border-violet-600 bg-violet-50/80 ring-2 ring-violet-500/20',
  },
  {
    name: 'Chemistry',
    icon: '🧪',
    desc: 'Mole Concept, Thermodynamics, Chemical Bonding & Reactions',
    activeRing: 'border-rose-600 bg-rose-50/80 ring-2 ring-rose-500/20',
  },
  {
    name: 'Accountancy',
    icon: '📊',
    desc: 'Journal Entries, BRS, Depreciation, Partner Accounts & Shares',
    activeRing: 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20',
  },
  {
    name: 'Business Studies',
    icon: '🏢',
    desc: 'Business Organisation, Finance, Management & Staffing',
    activeRing: 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/20',
  },
  {
    name: 'Economics',
    icon: '📈',
    desc: 'Demand Theory, Consumer Equilibrium, National Income & Macroeconomics',
    activeRing: 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-500/20',
  },
];

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onSuccess, voteStats = {} }) => {
  // All fields unselected by default for student to choose
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState<StudentClass | ''>('');
  const [board, setBoard] = useState<EducationalBoard | ''>('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSeniorSecondary = studentClass === '11' || studentClass === '12';
  const availableSubjectOptions = isSeniorSecondary ? SUBJECT_OPTIONS_SENIOR : SUBJECT_OPTIONS_JUNIOR;

  // Subject toggle handler with automatic cleanup of topics when subject is deselected
  const handleToggleSubject = (subjectName: string) => {
    setSelectedSubjects((prev) => {
      const isCurrentlySelected = prev.includes(subjectName);
      const updated = isCurrentlySelected
        ? prev.filter((s) => s !== subjectName)
        : [...prev, subjectName];

      // Remove topics associated with the deselected subject
      if (isCurrentlySelected && studentClass) {
        const currentCatalog = TOPIC_CATALOG.find((c) => c.classNumber === studentClass);
        if (currentCatalog) {
          const deselectedSubjectTopicNames = currentCatalog.topics
            .filter((t) => t.subject === subjectName)
            .map((t) => t.name);
          setSelectedTopics((tPrev) =>
            tPrev.filter((topic) => !deselectedSubjectTopicNames.includes(topic))
          );
        }
      }
      return updated;
    });
  };

  // Topic selection handler: enforces exactly 1 topic per subject (e.g. 1 in Maths and 1 in Science)
  const handleToggleTopic = (topicName: string, subjectName?: string) => {
    if (!studentClass) return;
    const currentCatalog = TOPIC_CATALOG.find((c) => c.classNumber === studentClass);
    if (!currentCatalog) return;

    // Identify which subject this topic belongs to
    const targetSubject =
      subjectName || currentCatalog.topics.find((t) => t.name === topicName)?.subject;

    if (!targetSubject) return;

    const subjectTopicNames = currentCatalog.topics
      .filter((t) => t.subject === targetSubject)
      .map((t) => t.name);

    setSelectedTopics((prev) => {
      // Remove any previously selected topic for this subject
      const otherSubjectsTopics = prev.filter((t) => !subjectTopicNames.includes(t));

      // If clicked topic is already selected, deselect it; otherwise select it (replaces previous topic in this subject)
      if (prev.includes(topicName)) {
        return otherSubjectsTopics;
      } else {
        return [...otherSubjectsTopics, topicName];
      }
    });
  };

  // Class change resets topic selection and trims incompatible subjects
  const handleClassChange = (newClass: StudentClass) => {
    setStudentClass(newClass);
    setSelectedTopics([]);
    const isNewSenior = newClass === '11' || newClass === '12';
    const validSubjectNames = isNewSenior
      ? ['Maths', 'Physics', 'Chemistry', 'Accountancy', 'Business Studies', 'Economics']
      : ['Maths', 'Science'];
    setSelectedSubjects((prev) => prev.filter((s) => validSubjectNames.includes(s)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!studentName.trim()) {
      setErrorMessage('Please enter the student\'s full name.');
      return;
    }
    if (!schoolName.trim()) {
      setErrorMessage('Please enter the school name.');
      return;
    }
    if (!studentClass) {
      setErrorMessage('Please select the student\'s Grade / Class (Class 6 to 12).');
      return;
    }
    if (!board) {
      setErrorMessage('Please select the Educational Board (e.g. CBSE, ICSE, State Board).');
      return;
    }
    if (selectedSubjects.length === 0) {
      if (isSeniorSecondary) {
        setErrorMessage('Please select at least one interested subject (Maths, Physics, Chemistry, Accountancy, Business Studies, or Economics).');
      } else {
        setErrorMessage('Please select at least one interested subject (Maths or Science).');
      }
      return;
    }
    if (selectedTopics.length === 0) {
      setErrorMessage(`Please select 1 topic for each of your selected subject(s) (${selectedSubjects.join(', ')}).`);
      return;
    }

    const currentCatalog = studentClass ? TOPIC_CATALOG.find((c) => c.classNumber === studentClass) : null;
    const missingSubjects = selectedSubjects.filter((subj) => {
      const subjTopicNames = currentCatalog?.topics.filter((t) => t.subject === subj).map((t) => t.name) || [];
      return !selectedTopics.some((t) => subjTopicNames.includes(t));
    });

    if (missingSubjects.length > 0) {
      setErrorMessage(
        `Please select 1 topic for each of your selected subjects. Missing topic selection for: ${missingSubjects.join(', ')}.`
      );
      return;
    }

    if (!parentName.trim()) {
      setErrorMessage('Please enter the parent/guardian\'s name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please provide a valid 10-digit mobile / WhatsApp number.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address so we can deliver your Zoom access details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        studentName: studentName.trim(),
        studentClass,
        board,
        schoolName: schoolName.trim(),
        subjects: selectedSubjects,
        topicsVoted: selectedTopics,
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        notes: notes.trim(),
      };

      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit enrollment');
      }

      // Trigger Confetti Celebration for the student!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#4f46e5', '#f59e0b', '#10b981', '#ec4899'],
        });
      } catch (err) {
        // Safe fallback if canvas-confetti fails
      }

      onSuccess(data.enrollment || data.record, data.emailStatus || data.emailStatusMsg);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const classVoteStats = studentClass ? (voteStats[studentClass] || {}) : {};

  // Step completion calculation for progress indicator
  const isStep1Done = Boolean(studentName.trim() && schoolName.trim());
  const isStep2Done = Boolean(studentClass && board);
  const isStep3Done = Boolean(selectedSubjects.length > 0);
  
  const currentCatalog = studentClass ? TOPIC_CATALOG.find((c) => c.classNumber === studentClass) : null;
  const isAllSubjectsTopicSelected =
    selectedSubjects.length > 0 &&
    selectedSubjects.every((subj) => {
      const subjTopicNames = currentCatalog?.topics.filter((t) => t.subject === subj).map((t) => t.name) || [];
      return selectedTopics.some((t) => subjTopicNames.includes(t));
    });
  const isStep4Done = Boolean(selectedTopics.length > 0 && isAllSubjectsTopicSelected);

  const isStep5Done = Boolean(
    parentName.trim() &&
    phone.replace(/\D/g, '').length >= 10 &&
    email.includes('@') &&
    email.includes('.')
  );

  const steps = [
    { id: 1, label: 'Profile', isDone: isStep1Done },
    { id: 2, label: 'Grade & Board', isDone: isStep2Done },
    { id: 3, label: 'Subjects', isDone: isStep3Done },
    { id: 4, label: 'Topic Vote', isDone: isStep4Done },
    { id: 5, label: 'Contact', isDone: isStep5Done },
  ];

  const completedCount = steps.filter((s) => s.isDone).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Friendly Hero Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200 text-indigo-900 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-bounce" />
          <span>Free 40-Minute Interactive Concept Masterclass 🚀</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Supercharge Your Learning with Edunura!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Pick your class, select the toughest topic that confuses you, and watch our master educator break it down visually in an interactive 40-minute live session!
        </p>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-2xl shadow-slate-300/40 overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3.5">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm flex items-center justify-center">
              <img
                src="https://edunura.com/images/edunura-font-02.png"
                alt="Edunura"
                className="h-7 sm:h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white tracking-wide">
                Live Interactive Demo Enrollment
              </p>
              <p className="text-xs text-indigo-200">
                Classes 6 to 12 • CBSE, ICSE, State & IB Boards
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-500/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free Demo Seat</span>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-6 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Registration Progress
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition-all ${
                  progressPercent === 100
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {progressPercent}% Complete ({completedCount} of 5 Steps)
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
              {progressPercent === 100 ? '🎉 All 5 steps ready to submit!' : `${5 - completedCount} steps remaining`}
            </span>
          </div>

          {/* Progress Bar Fill */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step Badges */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                  step.isDone
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                    : 'bg-white text-slate-500 border border-slate-200/80'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-extrabold ${
                    step.isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step.isDone ? '✓' : step.id}
                </div>
                <span className="truncate hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="m-6 mb-0 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Please complete the required details:</p>
              <p className="text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-9">
          {/* SECTION 1: Student Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                1
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Student Profile 🌟
                </h3>
                <p className="text-xs text-slate-500">
                  Tell us who will be attending the masterclass
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Student's Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <School className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi Public School / National Academy"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Grade & Board */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                2
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Select Grade & Educational Board 🎓
                </h3>
                <p className="text-xs text-slate-500">
                  Tap to select your grade and curriculum board
                </p>
              </div>
            </div>

            {/* Class Cards */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Which Grade Are You In? <span className="text-rose-500">*</span>
                </label>
                {studentClass && (
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Class {studentClass} {isSeniorSecondary ? '(Maths, Physics & Chemistry)' : '(Maths & Science)'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {CLASS_OPTIONS.map((cls) => {
                  const isSelected = studentClass === cls.value;
                  return (
                    <button
                      key={cls.value}
                      type="button"
                      onClick={() => handleClassChange(cls.value)}
                      className={`relative p-3 rounded-2xl border-2 text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 select-none cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-gradient-to-b from-blue-50 to-indigo-50 shadow-md ring-2 ring-blue-500/20 scale-[1.03]'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{cls.emoji}</span>
                      <span className={`text-sm font-extrabold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                        {cls.label}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cls.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
              {!studentClass && (
                <p className="text-[11px] text-amber-700 mt-1.5 font-medium">
                  👉 Tap one of the grade cards above to proceed.
                </p>
              )}
            </div>

            {/* Board Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Educational Board <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {BOARD_OPTIONS.map((b) => {
                  const isSelected = board === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBoard(b)}
                      className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
              {!board && (
                <p className="text-[11px] text-amber-700 mt-1.5 font-medium">
                  👉 Tap your curriculum board (e.g. CBSE, ICSE, State Board).
                </p>
              )}
            </div>
          </div>

          {/* SECTION 3: Interested Subjects */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                3
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isSeniorSecondary
                    ? 'Senior Secondary Subjects (Science & Commerce) ⚡'
                    : 'Subjects You Want to Conquer ⚡'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isSeniorSecondary
                    ? 'Select the subjects you want covered in your demo masterclass'
                    : 'Select Maths or Science to unlock demo topic voting'}
                </p>
              </div>
            </div>

            {!studentClass ? (
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-3">
                <span className="text-2xl">👆</span>
                <div>
                  <p className="font-bold text-amber-950">Please select your Grade / Class in Step 2 above first!</p>
                  <p className="text-amber-800 font-normal mt-0.5">
                    Classes 6 to 10 feature <strong>Maths & Science</strong>. Classes 11 & 12 feature <strong>Maths, Physics, Chemistry, Accountancy, Business Studies & Economics</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-3.5 ${
                  isSeniorSecondary ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {availableSubjectOptions.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub.name);
                  return (
                    <div
                      key={sub.name}
                      onClick={() => handleToggleSubject(sub.name)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isSelected
                          ? sub.activeRing
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{sub.icon}</span>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                              isSelected ? 'bg-blue-600 text-white' : 'border-2 border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                          </div>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900">{sub.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{sub.desc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-semibold text-right">
                        {isSelected ? (
                          <span className="text-blue-600 font-bold">Selected ✓</span>
                        ) : (
                          <span className="text-slate-400">+ Add Subject</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {studentClass && selectedSubjects.length === 0 && (
              <p className="text-[11px] text-amber-700 font-medium">
                👉 Tap at least one subject above ({isSeniorSecondary ? 'Maths, Physics, or Chemistry' : 'Maths or Science'}) to unlock the topic voting list.
              </p>
            )}
          </div>

          {/* SECTION 4: Toughest Topic Battle */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                4
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Pick the Toughest Topic! 🔥
                </h3>
                <p className="text-xs text-slate-500">
                  Vote for the concept you want our master educator to crack live in the demo
                </p>
              </div>
            </div>

            <TopicSelector
              studentClass={studentClass}
              selectedSubjects={selectedSubjects}
              selectedTopics={selectedTopics}
              onToggleTopic={handleToggleTopic}
              voteStats={classVoteStats}
            />
          </div>

          {/* SECTION 5: Parent Contact Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                5
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Parent / Guardian Contact Details 📲
                </h3>
                <p className="text-xs text-slate-500">
                  We will send the interactive masterclass joining link and confirmation receipt here
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Parent / Guardian Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  WhatsApp Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="e.g. parent.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                📧 The Zoom access link, reminder, and enrollment receipt will be emailed immediately.
              </p>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Any specific question or doubt you want addressed in the demo? (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. I struggle with Free Body Diagrams in Physics or Coordination Isomerism in Chemistry..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Submission Button & Trust Badges */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Reserving Your Seat & Sending Email...</span>
                </>
              ) : (
                <>
                  <span className="text-xl group-hover:scale-125 transition-transform">🚀</span>
                  <span>Reserve Free 40-Min Masterclass Seat!</span>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </>
              )}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Free Live Session</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Zero Spam Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-purple-500" />
                <span>Instant Zoom Details by Email</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
