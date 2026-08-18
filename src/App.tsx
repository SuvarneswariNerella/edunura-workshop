import React, { useState, useEffect } from 'react';
import { StudentEnrollment } from './types';
import { Header } from './components/Header';
import { EnrollmentForm } from './components/EnrollmentForm';
import { SuccessConfirmation } from './components/SuccessConfirmation';

export default function App() {
  const [submittedEnrollment, setSubmittedEnrollment] = useState<StudentEnrollment | null>(null);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | undefined>();
  const [statsByClass, setStatsByClass] = useState<Record<string, Record<string, number>>>({});

  const fetchPollStats = async () => {
    try {
      const res = await fetch('/api/poll-stats');
      if (res.ok) {
        const data = await res.json();
        setStatsByClass(data.statsByClass || {});
      }
    } catch (e) {
      console.error('Error fetching poll stats:', e);
    }
  };

  useEffect(() => {
    fetchPollStats();
  }, []);

  const handleEnrollmentSuccess = (record: StudentEnrollment, msg?: string) => {
    setSubmittedEnrollment(record);
    setEmailStatusMsg(msg);
    fetchPollStats();
  };

  const handleResetForm = () => {
    setSubmittedEnrollment(null);
    setEmailStatusMsg(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header: Pure Official Edunura Logo */}
      <Header />

      {/* Main Single-View Content: Student Enrollment Form */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {submittedEnrollment ? (
          <SuccessConfirmation
            enrollment={submittedEnrollment}
            emailStatusMsg={emailStatusMsg}
            onReset={handleResetForm}
          />
        ) : (
          <EnrollmentForm
            onSuccess={handleEnrollmentSuccess}
            voteStats={statsByClass}
          />
        )}
      </main>

      {/* Clean Minimal Footer with Logo Only */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center justify-center">
            <img
              src="https://edunura.com/images/edunura-font-02.png"
              alt="Edunura"
              className="h-8 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} Edunura Learning Systems. Concept-First Interactive Masterclasses for Students.
          </p>
        </div>
      </footer>
    </div>
  );
}
