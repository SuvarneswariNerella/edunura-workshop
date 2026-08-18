import React, { useState, useEffect } from 'react';
import { SmtpStatusResponse } from '../types';
import {
  Mail,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Key,
  Server,
  HelpCircle,
} from 'lucide-react';

export const SmtpConfigView: React.FC = () => {
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState('vidhathrisharma.d@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/smtp/status');
      const data = await res.json();
      setSmtpStatus(data);
      if (data.adminEmail) {
        setTestEmail(data.adminEmail);
      }
    } catch (e) {
      console.error('Failed to load SMTP status', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to dispatch test email',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const sampleEnvConfig = `# SMTP Credentials for Edunura Automatic Email Dispatch
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-digit-app-password"
SMTP_FROM="Edunura Admissions <admissions@edunura.com>"
ADMIN_EMAIL="${smtpStatus?.adminEmail || 'vidhathrisharma.d@gmail.com'}"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleEnvConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5" />
              SMTP Email Delivery Gateway
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">SMTP Email Dispatch Settings</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Configure SMTP so that every time a student submits the enrollment form, both the demo coordinator and the student instantly receive automated confirmation emails.
            </p>
          </div>

          <div className="shrink-0">
            <div
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-2.5 ${
                smtpStatus?.isConfigured
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-300'
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  smtpStatus?.isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <div className="text-xs font-bold">
                {smtpStatus?.isConfigured ? 'SMTP Connected & Active' : 'SMTP Credentials Pending'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SMTP Diagnostic & Test Email Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Test Connection */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Live SMTP Dispatch Test</h3>
              <p className="text-xs text-slate-500">Send a test email to verify your SMTP delivery</p>
            </div>
          </div>

          <form onSubmit={handleSendTest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="input-test-email"
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{testResult.success ? 'Success' : 'Error'}</p>
                  <p className="mt-0.5">{testResult.message}</p>
                </div>
              </div>
            )}

            <button
              id="btn-send-smtp-test"
              type="submit"
              disabled={isSendingTest}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Test Email...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Test Email Now</span>
                </>
              )}
            </button>
          </form>

          {/* Current Parameters summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Current Runtime Configuration</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">SMTP Host</span>
                <span className="font-mono font-medium">{smtpStatus?.host || 'smtp.gmail.com'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Port</span>
                <span className="font-mono font-medium">{smtpStatus?.port || '587'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">User Configured</span>
                <span className="font-medium">{smtpStatus?.userConfigured ? 'Yes (Detected)' : 'No'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Admin Target Email</span>
                <span className="font-mono truncate block">{smtpStatus?.adminEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: How to provide SMTP credentials */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">How to Setup SMTP in AI Studio</h3>
              <p className="text-xs text-slate-500">Provide your SMTP parameters in Settings / Secrets</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <p>
              When a student registers, our server uses your SMTP account to send automated emails. For <strong>Gmail</strong>:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-700 font-medium">
              <li>Enable 2-Step Verification on your Google Account.</li>
              <li>Go to <em>Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords</em>.</li>
              <li>Generate a 16-character App Password for &quot;Mail&quot;.</li>
              <li>Set <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">SMTP_USER</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">SMTP_PASS</code> in your settings.</li>
            </ol>
          </div>

          {/* Code snippet block */}
          <div className="relative rounded-xl bg-slate-900 text-slate-200 p-3.5 font-mono text-[11px] overflow-x-auto border border-slate-800">
            <button
              onClick={copyToClipboard}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[10px]"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <pre className="pr-16">{sampleEnvConfig}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
