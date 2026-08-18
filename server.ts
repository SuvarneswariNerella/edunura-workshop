import express from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store with optional file backup
interface EnrollmentRecord {
  id: string;
  studentName: string;
  studentClass: string;
  board: string;
  schoolName: string;
  subjectsInterested: string[];
  demoTopics: string[];
  parentName: string;
  mobileNumber: string;
  email: string;
  preferredSlot?: string;
  notes?: string;
  submittedAt: string;
  emailDeliveryStatus?: {
    attempted: boolean;
    success: boolean;
    adminSent?: boolean;
    studentSent?: boolean;
    error?: string;
    messageId?: string;
  };
}

const STORAGE_FILE = path.join(process.cwd(), '.enrollments_store.json');

function loadStoredEnrollments(): EnrollmentRecord[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading stored enrollments:', err);
  }
  return [
    {
      id: 'EDN-6001',
      studentName: 'Aarav Patel',
      studentClass: '10',
      board: 'CBSE',
      schoolName: 'Delhi Public School',
      subjectsInterested: ['Maths', 'Science'],
      demoTopics: ['Trigonometric identities', 'Electricity: series & parallel resistors'],
      parentName: 'Suresh Patel',
      mobileNumber: '+91 98765 43210',
      email: 'vidhathrisharma.d@gmail.com',
      preferredSlot: 'Weekday Evening (6:30 PM – 7:30 PM)',
      notes: 'Wants deep practice on trigonometric proofs.',
      submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      emailDeliveryStatus: { attempted: true, success: true, adminSent: true, studentSent: true },
    },
    {
      id: 'EDN-6002',
      studentName: 'Ananya Sharma',
      studentClass: '9',
      board: 'ICSE',
      schoolName: 'St. Joseph High School',
      subjectsInterested: ['Science'],
      demoTopics: ['Distance vs displacement'],
      parentName: 'Deepa Sharma',
      mobileNumber: '+91 98111 22334',
      email: 'vidhathrisharma.d@gmail.com',
      preferredSlot: 'Saturday Morning (10:30 AM – 11:30 AM)',
      notes: 'Needs clarity on kinematics graphs.',
      submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      emailDeliveryStatus: { attempted: true, success: true, adminSent: true, studentSent: true },
    },
    {
      id: 'EDN-6003',
      studentName: 'Rohan Verma',
      studentClass: '11',
      board: 'CBSE',
      schoolName: 'Kendriya Vidyalaya',
      subjectsInterested: ['Physics', 'Chemistry'],
      demoTopics: ['Newton’s laws + free-body diagrams', 'Mole concept'],
      parentName: 'Vikram Verma',
      mobileNumber: '+91 99887 76655',
      email: 'vidhathrisharma.d@gmail.com',
      preferredSlot: 'Sunday Evening (6:00 PM – 7:00 PM)',
      notes: 'Preparing for JEE Foundation.',
      submittedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      emailDeliveryStatus: { attempted: true, success: true, adminSent: true, studentSent: true },
    },
  ];
}

function saveStoredEnrollments(records: EnrollmentRecord[]) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving enrollments:', err);
  }
}

let enrollments: EnrollmentRecord[] = loadStoredEnrollments();

// SMTP Transporter Helper
function createSmtpTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

// SMTP Status
app.get('/api/smtp/status', (req, res) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const adminEmail = process.env.ADMIN_EMAIL || 'vidhathrisharma.d@gmail.com';
  const fromAddress = process.env.SMTP_FROM || 'Edunura Enrollment <noreply@edunura.com>';
  const isConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

  res.json({
    isConfigured,
    host,
    port,
    userConfigured: Boolean(user),
    adminEmail,
    fromAddress,
    helpMessage: isConfigured
      ? 'SMTP email service is active and ready to deliver real emails to Edunura coordinators and registering students.'
      : 'SMTP credentials are not yet configured in environment variables. Form submissions will be logged and stored securely in the app, and ready to send via SMTP once user provides credentials.',
  });
});

// Test SMTP connection
app.post('/api/smtp/test', async (req, res) => {
  const adminEmail = req.body.email || process.env.ADMIN_EMAIL || 'vidhathrisharma.d@gmail.com';
  const transporter = createSmtpTransporter();

  if (!transporter) {
    return res.status(400).json({
      success: false,
      message: 'SMTP credentials (SMTP_USER & SMTP_PASS) are missing in environment variables. Please provide SMTP credentials.',
    });
  }

  try {
    await transporter.verify();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Edunura Demo Coordinator" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: '✅ Edunura SMTP Integration Test: Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Edunura Masterclass Portal</h1>
            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 14px;">SMTP Email Dispatch Test</p>
          </div>
          <div style="padding: 24px; color: #334155; line-height: 1.6;">
            <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">SMTP Test Succeeded!</h2>
            <p>Your SMTP mail configuration is correctly configured and working. When students submit the Edunura registration form, both the student confirmation and the demo coordinator notification will be delivered seamlessly.</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #3b82f6; margin: 16px 0;">
              <strong>Host:</strong> ${process.env.SMTP_HOST || 'smtp.gmail.com'}<br/>
              <strong>Port:</strong> ${process.env.SMTP_PORT || '587'}<br/>
              <strong>User:</strong> ${process.env.SMTP_USER}<br/>
              <strong>Sent at:</strong> ${new Date().toLocaleString()}
            </div>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">Edunura — Transforming Education with Conceptual Clarity.</p>
          </div>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: `Test email successfully dispatched to ${adminEmail}`,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error('SMTP test error:', error);
    return res.status(500).json({
      success: false,
      message: `SMTP test failed: ${error.message}`,
    });
  }
});

// Poll Statistics API
app.get('/api/poll-stats', (req, res) => {
  const statsByClass: Record<string, Record<string, number>> = {};

  enrollments.forEach((record) => {
    const cls = record.studentClass;
    if (!statsByClass[cls]) {
      statsByClass[cls] = {};
    }
    record.demoTopics.forEach((topic) => {
      statsByClass[cls][topic] = (statsByClass[cls][topic] || 0) + 1;
    });
  });

  res.json({
    totalEnrollments: enrollments.length,
    statsByClass,
  });
});

// Get All Enrollments
app.get('/api/enrollments', (req, res) => {
  res.json({
    total: enrollments.length,
    enrollments: [...enrollments].reverse(),
  });
});

// Submit Enrollment API
const handleEnrollment = async (req: express.Request, res: express.Response) => {
  try {
    const studentName = req.body.studentName;
    const studentClass = req.body.studentClass;
    const board = req.body.board;
    const schoolName = req.body.schoolName;
    const subjectsInterested = req.body.subjectsInterested || req.body.subjects || [];
    const demoTopics = req.body.demoTopics || req.body.topicsVoted || [];
    const parentName = req.body.parentName;
    const mobileNumber = req.body.mobileNumber || req.body.phone;
    const email = req.body.email;
    const preferredSlot = req.body.preferredSlot;
    const notes = req.body.notes;

    if (!studentName || !studentClass || !board || !schoolName || !parentName || !mobileNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required student or parent enrollment details.',
      });
    }

    if (!Array.isArray(demoTopics) || demoTopics.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one topic for the demo poll.',
      });
    }

    const enrollmentId = `EDN-${Math.floor(1000 + Math.random() * 9000)}`;
    const submittedAt = new Date().toISOString();

    const record: EnrollmentRecord = {
      id: enrollmentId,
      studentName: String(studentName).trim(),
      studentClass: String(studentClass).trim(),
      board: String(board).trim(),
      schoolName: String(schoolName).trim(),
      subjectsInterested: Array.isArray(subjectsInterested) ? subjectsInterested : [subjectsInterested],
      demoTopics: Array.isArray(demoTopics) ? demoTopics : [demoTopics],
      parentName: String(parentName).trim(),
      mobileNumber: String(mobileNumber).trim(),
      email: String(email).trim(),
      preferredSlot: preferredSlot ? String(preferredSlot).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      submittedAt,
      emailDeliveryStatus: {
        attempted: false,
        success: false,
      },
    };

    // Attempt SMTP Email Sending
    const transporter = createSmtpTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || 'vidhathrisharma.d@gmail.com';
    const fromAddress = process.env.SMTP_FROM || `"Edunura Masterclass" <${process.env.SMTP_USER || 'admissions@edunura.com'}>`;

    let emailDelivered = false;
    let emailStatusMsg = '';

    if (transporter) {
      record.emailDeliveryStatus!.attempted = true;
      try {
        // 1. Email to Demo Coordinator / Admin
        const adminMailPromise = transporter.sendMail({
          from: fromAddress,
          to: adminEmail,
          subject: `🎓 New Edunura Enrollment: ${record.studentName} (Class ${record.studentClass} - ${record.board})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
              <div style="background: #0f172a; padding: 20px 24px; color: #ffffff;">
                <div style="background-color: #ffffff; display: inline-block; padding: 6px 12px; border-radius: 6px; margin-bottom: 12px;">
                  <img src="https://edunura.com/images/edunura-font-02.png" alt="Edunura" height="28" style="display: block; height: 28px; border: 0;" />
                </div>
                <span style="background: #2563eb; color: #fff; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; margin-left: 8px; vertical-align: middle;">New Enrollment</span>
                <h1 style="margin: 8px 0 0 0; font-size: 20px; color: #ffffff;">Student Enrollment & Demo Topic Vote</h1>
                <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Ref ID: ${record.id} • Registered: ${new Date(record.submittedAt).toLocaleString()}</p>
              </div>

              <div style="padding: 24px; color: #334155; line-height: 1.6;">
                <h2 style="font-size: 16px; color: #0f172a; margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">1. Student & Academic Profile</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; width: 140px;">Student Name:</td>
                    <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${record.studentName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Class:</td>
                    <td style="padding: 6px 0; font-weight: bold; color: #2563eb;">Class ${record.studentClass}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Board:</td>
                    <td style="padding: 6px 0;">${record.board}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">School Name:</td>
                    <td style="padding: 6px 0;">${record.schoolName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Interested Subject(s):</td>
                    <td style="padding: 6px 0;">${record.subjectsInterested.join(', ')}</td>
                  </tr>
                </table>

                <h2 style="font-size: 16px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">2. Demo Topic Poll Choice</h2>
                <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 14px; margin-bottom: 20px;">
                  <p style="margin: 0 0 6px 0; font-weight: bold; color: #1e40af; font-size: 14px;">Voted Topic for 40-Minute Masterclass Demo:</p>
                  <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
                    ${record.demoTopics.map((t) => `<li style="margin: 4px 0; font-weight: 600;">${t}</li>`).join('')}
                  </ul>
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #3b82f6;"><em>*Majority voted topic across Class ${record.studentClass} will be selected for the live session.</em></p>
                </div>

                <h2 style="font-size: 16px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">3. Parent & Contact Details</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; width: 140px;">Parent Name:</td>
                    <td style="padding: 6px 0; font-weight: bold;">${record.parentName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Mobile Number:</td>
                    <td style="padding: 6px 0;"><a href="tel:${record.mobileNumber}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${record.mobileNumber}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Email ID:</td>
                    <td style="padding: 6px 0;"><a href="mailto:${record.email}" style="color: #2563eb; text-decoration: none;">${record.email}</a></td>
                  </tr>
                  ${record.preferredSlot ? `<tr><td style="padding: 6px 0; color: #64748b;">Preferred Slot:</td><td style="padding: 6px 0;">${record.preferredSlot}</td></tr>` : ''}
                  ${record.notes ? `<tr><td style="padding: 6px 0; color: #64748b;">Student Queries / Notes:</td><td style="padding: 6px 0; font-style: italic;">${record.notes}</td></tr>` : ''}
                </table>

                <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; font-size: 12px; color: #64748b; text-align: center;">
                  Edunura Masterclass Enrollment Dispatcher • Auto-generated on registration
                </div>
              </div>
            </div>
          `,
        });

        // 2. Confirmation Email to Student / Parent
        const studentMailPromise = transporter.sendMail({
          from: fromAddress,
          to: record.email,
          subject: `🎉 Registration Confirmed: Edunura 40-Minute Demo Masterclass (ID: ${record.id})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
              <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
                <div style="background-color: #ffffff; display: inline-block; padding: 6px 14px; border-radius: 6px; margin-bottom: 12px;">
                  <img src="https://edunura.com/images/edunura-font-02.png" alt="Edunura" height="30" style="display: block; height: 30px; border: 0;" />
                </div>
                <h1 style="margin: 0; font-size: 22px; color: #ffffff;">Welcome to Edunura!</h1>
                <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">Interactive 40-Minute Conceptual Demo Masterclass</p>
              </div>

              <div style="padding: 24px; color: #334155; line-height: 1.6;">
                <p>Dear <strong>${record.parentName}</strong> and <strong>${record.studentName}</strong>,</p>
                <p>Thank you for registering with Edunura! We have successfully recorded your enrollment and your topic preference for the upcoming demo session.</p>

                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="margin: 0 0 8px 0; color: #166534; font-weight: bold; font-size: 15px;">Your Registration Summary</p>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                      <td style="padding: 4px 0; color: #475569;">Registration ID:</td>
                      <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">${record.id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #475569;">Class & Board:</td>
                      <td style="padding: 4px 0; font-weight: 600;">Class ${record.studentClass} (${record.board})</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #475569;">School:</td>
                      <td style="padding: 4px 0;">${record.schoolName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #475569;">Your Topic Vote:</td>
                      <td style="padding: 4px 0; font-weight: bold; color: #0284c7;">${record.demoTopics.join(', ')}</td>
                    </tr>
                  </table>
                </div>

                <h3 style="color: #0f172a; margin-top: 24px; font-size: 16px;">What makes our 40-Minute Demo unique?</h3>
                <p style="font-size: 14px; color: #475569;">Our masterclass is engineered around deep conceptual clarity rather than rote memorization:</p>
                <ul style="font-size: 13px; color: #334155; padding-left: 20px;">
                  <li><strong>0–5 min Hook:</strong> Engaging puzzles & real-life questions.</li>
                  <li><strong>10–20 min Visual Concept:</strong> Building core logic step-by-step with zero jargon.</li>
                  <li><strong>30–35 min Error Analysis:</strong> Uncovering common trap mistakes students make.</li>
                  <li><strong>35–40 min Mastery:</strong> Independent challenge problem and crystal-clear recap.</li>
                </ul>

                <p style="font-size: 14px; color: #475569; margin-top: 20px;">
                  Our academic coordinator will reach out shortly via WhatsApp/Phone at <strong>${record.mobileNumber}</strong> with the direct masterclass joining link and schedule.
                </p>

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
                  Edunura Learning Systems • Need assistance? Reply directly to this email.
                </p>
              </div>
            </div>
          `,
        });

        await Promise.all([adminMailPromise, studentMailPromise]);
        record.emailDeliveryStatus.success = true;
        record.emailDeliveryStatus.adminSent = true;
        record.emailDeliveryStatus.studentSent = true;
        emailDelivered = true;
        emailStatusMsg = 'Emails successfully dispatched to admin and student via SMTP.';
      } catch (mailErr: any) {
        console.error('SMTP Mail send failed:', mailErr);
        record.emailDeliveryStatus.error = mailErr.message;
        emailStatusMsg = `SMTP send error: ${mailErr.message}`;
      }
    } else {
      emailStatusMsg = 'SMTP not configured in environment variables; submission recorded locally.';
    }

    enrollments.push(record);
    saveStoredEnrollments(enrollments);

    return res.json({
      success: true,
      id: record.id,
      emailDelivered,
      emailStatusMsg,
      record,
      enrollment: record,
    });
  } catch (error: any) {
    console.error('Enrollment submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process enrollment submission. ' + (error.message || ''),
    });
  }
};

app.post('/api/enroll', handleEnrollment);
app.post('/api/enrollment', handleEnrollment);

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Edunura Enrollment Server running on port ${PORT}`);
  });
}

startServer();
