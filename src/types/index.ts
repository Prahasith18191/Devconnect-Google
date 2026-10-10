export type UserRole = 'attendee' | 'admin';

export interface AttendeeProfile {
  id: string;
  fullName: string;
  headline: string;
  company: string;
  jobTitle: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  interests: string[];
  learning: string[];
  experienceYears: number;
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Architect';
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  projects?: { title: string; desc: string; url?: string }[];
  connectionStatus: 'none' | 'pending_sent' | 'pending_received' | 'connected';
  mutualInterestsCount?: number;
  matchScore?: number;
  matchReasons?: string[];
  isVerified?: boolean;
  status?: 'active' | 'suspended';
  role?: UserRole;
  email?: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  speaker: string;
  speakerRole: string;
  track: string;
  room: string;
}

export interface EventDetails {
  id: string;
  slug?: string;
  title: string;
  tagline: string;
  dates: string;
  venueName: string;
  venueCity: string;
  description: string;
  attendeeCount: number;
  sessionsCount: number;
  tracksCount: number;
  organizer: string;
  communityGuidelines: string[];
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderHeadline: string;
  senderAvatar: string;
  note: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isSelf: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  content: string;
  codeSnippet?: string;
  mediaUrl?: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  userReaction: 'like' | 'dislike' | null;
  comments: PostComment[];
  timestamp: string;
}

export interface StitchFrameSpec {
  id: string;
  frameCode: string;
  name: string;
  purpose: string;
  desktopDimensions: string;
  mobileDimensions: string;
  targetComponents: string[];
  designTokens: {
    background: string;
    surfaces: string;
    accents: string;
    typography: string;
  };
  keyInteractions: string[];
  stitchPrompt: string;
}
