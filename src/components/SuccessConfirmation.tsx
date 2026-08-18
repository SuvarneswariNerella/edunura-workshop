import React from 'react';
import { StudentEnrollment } from '../types';
import {
  CheckCircle,
  Calendar,
  Clock,
  Mail,
  User,
  School,
  Sparkles,
  BookOpen,
  ArrowRight,
  Printer,
  ShieldCheck,
  Trophy,
} from 'lucide-react';

interface SuccessConfirmationProps {
  enrollment: StudentEnrollment;
  emailStatusMsg?: string;
  onReset: () => void;
  onViewPoll?: () => void;
}

export const SuccessConfirmation: React.FC<SuccessConfirmationProps> = ({
  enrollment,
  emailStatusMsg,
  onReset,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Celebratory Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 text-3xl">
          🎉
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Congratulations, {enrollment.studentName}!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Your seat for the <strong>Edunura 40-Minute Interactive Masterclass Demo</strong> has been reserved. We're excited to learn with you!
        </p>
      </div>

      {/* Confirmation Card / Ticket */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden print:border-none print:shadow-none">
        {/* Ticket Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm">
              <img
                src="https://edunura.com/images/edunura-font-02.png"
                alt="Edunura Logo"
                className="h-7 sm:h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Official Demo Pass
              </div>
              <div className="text-lg sm:text-xl font-black text-white">
                Live Masterclass Registration Receipt
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-left sm:text-right">
            <span className="text-[10px] text-indigo-200 uppercase tracking-wider block font-bold">
              Registration ID
            </span>
            <span className="text-base font-extrabold font-mono text-white">
              {enrollment.id}
            </span>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Email Notification Alert */}
          {emailStatusMsg ? (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs sm:text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Confirmation Email Dispatched!</p>
                <p className="text-emerald-700 text-xs mt-0.5">{emailStatusMsg}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center gap-3 text-blue-900 text-xs sm:text-sm">
              <Mail className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">Check Your Inbox</p>
                <p className="text-blue-700 text-xs mt-0.5">
                  Zoom access links and prep notes have been sent to <strong>{enrollment.email}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Student Name
              </span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                {enrollment.studentName}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Grade & Board
              </span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                Class {enrollment.studentClass} • {enrollment.board} Board
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                School
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {enrollment.schoolName}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Parent / Guardian
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {enrollment.parentName} ({enrollment.mobileNumber || (enrollment as any).phone || ''})
              </p>
            </div>

            {enrollment.preferredSlot ? (
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Chosen Time Slot
                </span>
                <p className="text-sm font-semibold text-indigo-700">
                  {enrollment.preferredSlot}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Masterclass Format
                </span>
                <p className="text-sm font-semibold text-indigo-700">
                  40-Min Live Interactive Demo
                </p>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Interested Subjects
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {(enrollment.subjectsInterested || (enrollment as any).subjects || []).map((sub: string) => (
                  <span
                    key={sub}
                    className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Voted Topics Box */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <span>🔥</span>
              <span>Topics You Voted to Conquer in Live Demo:</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {enrollment.topicsVoted.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-950 shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>

          {/* What Happens Next? */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              What Happens Next? 🚀
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-lg">📩</span>
                <p className="font-bold text-slate-800 mt-1">1. Email Sent</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Check your inbox for the official welcome confirmation and Zoom login details.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-lg">💬</span>
                <p className="font-bold text-slate-800 mt-1">2. WhatsApp Reminder</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Our coordinator will send a calendar reminder 1 hour before your demo starts.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-lg">✨</span>
                <p className="font-bold text-slate-800 mt-1">3. Live Masterclass</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Join the 40-minute interactive live class and crack difficult concepts visually!
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Receipt</span>
            </button>

            <button
              onClick={onReset}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enroll Another Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
