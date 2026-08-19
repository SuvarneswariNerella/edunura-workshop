export type StudentClass = '6' | '7' | '8' | '9' | '10' | '11' | '12';

export type EducationalBoard =
  | 'CBSE'
  | 'ICSE'
  | 'State Board'
  | 'IB (International Baccalaureate)'
  | 'IGCSE / Cambridge'
  | 'Other';

export type SubjectCategory =
  | 'Maths'
  | 'Science'
  | 'Physics'
  | 'Chemistry'
  | 'Accountancy'
  | 'Business Studies'
  | 'Economics';

export interface TopicItem {
  id: string;
  name: string;
  subject: SubjectCategory;
  classNumber: StudentClass;
  isSuggestedStrongest?: boolean;
  pedagogicalTip?: string;
}

export interface StudentEnrollment {
  id: string;
  studentName: string;
  studentClass: StudentClass;
  board: EducationalBoard;
  schoolName: string;
  subjectsInterested: string[];
  demoTopics: string[]; // selected topics for demo poll
  parentName: string;
  mobileNumber: string;
  email: string;
  preferredSlot?: string;
  notes?: string;
  submittedAt: string;
  emailDeliveryStatus?: {
    attempted: boolean;
    success: boolean;
    error?: string;
    details?: string;
  };
}

export interface PollCount {
  topicName: string;
  subject: string;
  classNumber: string;
  votes: number;
  isStrongest?: boolean;
}

export interface SmtpStatusResponse {
  isConfigured: boolean;
  host: string;
  port: number;
  userConfigured: boolean;
  adminEmail: string;
  fromAddress: string;
  helpMessage?: string;
}
