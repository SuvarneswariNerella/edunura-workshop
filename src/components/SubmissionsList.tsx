import React, { useState } from 'react';
import { StudentEnrollment } from '../types';
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  School,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Filter,
  X,
} from 'lucide-react';

interface SubmissionsListProps {
  enrollments: StudentEnrollment[];
  onRefresh: () => void;
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({
  enrollments,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState<StudentEnrollment | null>(null);

  // Filtered entries
  const filtered = enrollments.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.demoTopics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass =
      selectedClassFilter === 'all' || item.studentClass === selectedClassFilter;

    return matchesSearch && matchesClass;
  });

  // Export CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    const headers = [
      'ID',
      'Student Name',
      'Class',
      'Board',
      'School',
      'Interested Subjects',
      'Voted Demo Topics',
      'Parent Name',
      'Mobile Number',
      'Email ID',
      'Preferred Slot',
      'Submitted At',
    ];

    const rows = filtered.map((e) => [
      `"${e.id}"`,
      `"${e.studentName.replace(/"/g, '""')}"`,
      `"Class ${e.studentClass}"`,
      `"${e.board}"`,
      `"${e.schoolName.replace(/"/g, '""')}"`,
      `"${e.subjectsInterested.join('; ')}"`,
      `"${e.demoTopics.join('; ')}"`,
      `"${e.parentName.replace(/"/g, '""')}"`,
      `"${e.mobileNumber}"`,
      `"${e.email}"`,
      `"${e.preferredSlot || ''}"`,
      `"${new Date(e.submittedAt).toLocaleString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edunura_enrollments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              Enrollment Management
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Registered Students & Demo Votes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              View student submissions, contact info, and demo topic preferences in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              Refresh
            </button>
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              disabled={filtered.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV ({filtered.length})</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="input-search-enrollments"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student, parent, school, email, or topic..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              id="select-filter-class"
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="all">All Classes (6–12)</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No matching student registrations found</p>
            <p className="text-xs text-slate-400">Try adjusting your search filters or submit a new form.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Student & School</th>
                  <th className="py-3.5 px-3">Class & Board</th>
                  <th className="py-3.5 px-3">Demo Topic Choice</th>
                  <th className="py-3.5 px-3">Parent Contact</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.studentName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <School className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[180px]">{item.schoolName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                        {item.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900">Class {item.studentClass}</div>
                      <div className="text-xs text-slate-500">{item.board}</div>
                      <div className="text-[11px] text-indigo-600 font-medium mt-0.5">
                        {item.subjectsInterested.join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="space-y-1">
                        {item.demoTopics.map((topic, i) => (
                          <span
                            key={i}
                            className="inline-block text-[11px] font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200 mr-1 mb-1"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-900">{item.parentName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <a href={`tel:${item.mobileNumber}`} className="hover:text-blue-600">
                          {item.mobileNumber}
                        </a>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[140px]">{item.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      {item.emailDeliveryStatus?.success ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Email Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          Recorded
                        </span>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedEnrollment(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        View Full Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedEnrollment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 font-mono">{selectedEnrollment.id}</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedEnrollment.studentName}</h3>
              </div>
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-xs">Class & Board</span>
                  <span className="font-bold text-slate-800">
                    Class {selectedEnrollment.studentClass} ({selectedEnrollment.board})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">School</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {selectedEnrollment.schoolName}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider mb-1">
                  Demo Topic Poll Selection
                </span>
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
                  {selectedEnrollment.demoTopics.map((t, idx) => (
                    <div key={idx} className="font-bold text-blue-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-xs">Parent Name</span>
                  <span className="font-medium text-slate-800">{selectedEnrollment.parentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Mobile Number</span>
                  <a
                    href={`tel:${selectedEnrollment.mobileNumber}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {selectedEnrollment.mobileNumber}
                  </a>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-xs">Email Address</span>
                  <a
                    href={`mailto:${selectedEnrollment.email}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {selectedEnrollment.email}
                  </a>
                </div>
                {selectedEnrollment.preferredSlot && (
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-xs">Preferred Slot</span>
                    <span className="font-medium text-slate-800">{selectedEnrollment.preferredSlot}</span>
                  </div>
                )}
                {selectedEnrollment.notes && (
                  <div className="col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-xs font-semibold">Student Goals / Query:</span>
                    <span className="text-slate-700 italic">{selectedEnrollment.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
