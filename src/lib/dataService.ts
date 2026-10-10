import { supabase } from './supabase';
import { 
  AttendeeProfile, 
  CommunityPost, 
  ChatMessage, 
  ConnectionRequest,
  EventDetails 
} from '../types';
import { 
  INITIAL_ATTENDEES, 
  INITIAL_POSTS, 
  INITIAL_MESSAGES, 
  INITIAL_ROOM_MESSAGES,
  INITIAL_EVENT 
} from '../data/mockData';

const STORAGE_KEYS = {
  ATTENDEES: 'devconnect_attendees',
  POSTS: 'devconnect_posts',
  MESSAGES: 'devconnect_messages',
  LOUNGE: 'devconnect_lounge',
  REQUESTS: 'devconnect_requests',
  EVENT: 'devconnect_event',
};

// ========================================================
// 1. EVENT CONFIGURATION
// ========================================================
export async function getEventDetails(): Promise<EventDetails> {
  try {
    const { data, error } = await supabase.from('events').select('*').limit(1);
    if (!error && data && data.length > 0) {
      const d = data[0];
      return {
        id: d.id,
        title: d.title || INITIAL_EVENT.title,
        tagline: d.tagline || INITIAL_EVENT.tagline,
        description: d.description || INITIAL_EVENT.description,
        dates: d.dates || INITIAL_EVENT.dates,
        venueName: d.venue_name || INITIAL_EVENT.venueName,
        venueCity: d.venue_city || INITIAL_EVENT.venueCity,
        organizer: d.organizer || INITIAL_EVENT.organizer,
        attendeeCount: d.attendee_count ?? INITIAL_EVENT.attendeeCount,
        sessionsCount: d.sessions_count ?? INITIAL_EVENT.sessionsCount,
        tracksCount: d.tracks_count ?? INITIAL_EVENT.tracksCount,
        communityGuidelines: INITIAL_EVENT.communityGuidelines,
      };
    }
  } catch (err) {
    console.warn('Supabase getEventDetails error, falling back:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.EVENT);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_EVENT;
}

export async function saveEventDetails(event: EventDetails): Promise<void> {
  try {
    await supabase.from('events').upsert({
      id: event.id,
      title: event.title,
      tagline: event.tagline,
      description: event.description,
      dates: event.dates,
      venue_name: event.venueName,
      venue_city: event.venueCity,
      organizer: event.organizer,
      attendee_count: event.attendeeCount,
      sessions_count: event.sessionsCount,
      tracks_count: event.tracksCount,
    });
  } catch (err) {
    console.warn('Supabase saveEventDetails error:', err);
  }
  localStorage.setItem(STORAGE_KEYS.EVENT, JSON.stringify(event));
}

// ========================================================
// 2. ATTENDEES & PROFILES
// ========================================================
export async function getAttendees(): Promise<AttendeeProfile[]> {
  try {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
    if (!error && data && data.length > 0) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        fullName: d.full_name || d.fullName || 'Anonymous Builder',
        headline: d.headline || 'Developer & Builder',
        company: d.company || 'Tech Innovator',
        jobTitle: d.job_title || d.jobTitle || 'Software Engineer',
        avatarUrl: d.avatar_url || d.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        bio: d.bio || '',
        skills: Array.isArray(d.skills) && d.skills.length > 0 ? d.skills : ['Python', 'FastAPI', 'Cloud Agents'],
        interests: Array.isArray(d.interests) && d.interests.length > 0 ? d.interests : ['Antigravity', 'Agentic AI'],
        learning: Array.isArray(d.learning) && d.learning.length > 0 ? d.learning : ['Google Gemini', 'Vector Search'],
        experienceYears: d.experience_years ?? d.experienceYears ?? 4,
        experienceLevel: (d.experience_level || d.experienceLevel || 'Mid') as 'Junior' | 'Mid' | 'Senior' | 'Lead',
        githubUrl: d.github_url || d.githubUrl,
        linkedinUrl: d.linkedin_url || d.linkedinUrl,
        connectionStatus: (d.connection_status || d.connectionStatus || 'none') as 'none' | 'pending_sent' | 'pending_received' | 'connected',
        isVerified: d.is_verified ?? true,
        status: (d.status === 'suspended' ? 'suspended' : 'active') as 'active' | 'suspended',
        role: (d.role === 'admin' ? 'admin' : 'attendee') as 'attendee' | 'admin',
        email: d.email || undefined,
      }));
      localStorage.setItem(STORAGE_KEYS.ATTENDEES, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase query profiles fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ATTENDEES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_ATTENDEES;
}

export async function saveAttendeeProfile(profile: AttendeeProfile): Promise<void> {
  try {
    await supabase.from('profiles').upsert({
      id: profile.id,
      full_name: profile.fullName,
      headline: profile.headline,
      company: profile.company,
      job_title: profile.jobTitle,
      avatar_url: profile.avatarUrl,
      bio: profile.bio,
      skills: profile.skills,
      interests: profile.interests,
      learning: profile.learning,
      experience_years: profile.experienceYears,
      experience_level: profile.experienceLevel,
      github_url: profile.githubUrl,
      linkedin_url: profile.linkedinUrl,
      connection_status: profile.connectionStatus,
      is_verified: profile.isVerified,
    });
  } catch (err) {
    console.warn('Supabase upsert profile fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ATTENDEES);
  let list: AttendeeProfile[] = cached ? JSON.parse(cached) : [...INITIAL_ATTENDEES];
  const idx = list.findIndex((a) => a.id === profile.id);
  if (idx >= 0) list[idx] = profile;
  else list.unshift(profile);
  localStorage.setItem(STORAGE_KEYS.ATTENDEES, JSON.stringify(list));
}

export async function updateAttendeeConnectionStatus(attendeeId: string, status: string): Promise<void> {
  try {
    await supabase.from('profiles').update({ connection_status: status }).eq('id', attendeeId);
  } catch (err) {
    console.warn('Supabase update status fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ATTENDEES);
  if (cached) {
    try {
      const list: AttendeeProfile[] = JSON.parse(cached);
      const updated = list.map((a) => a.id === attendeeId ? { ...a, connectionStatus: status as any } : a);
      localStorage.setItem(STORAGE_KEYS.ATTENDEES, JSON.stringify(updated));
    } catch {}
  }
}

export async function toggleSuspendAttendee(attendeeId: string, isSuspended: boolean): Promise<void> {
  try {
    await supabase.from('profiles')
      .update({ status: isSuspended ? 'suspended' : 'active', is_verified: !isSuspended })
      .eq('id', attendeeId);
  } catch (err) {
    console.warn('Supabase toggleSuspendAttendee error:', err);
  }
}

// ========================================================
// 2b. EVENT RECAP PHOTOS (admin-managed carousel)
// ========================================================
export interface EventPhoto { id: string; url: string; caption: string; }

export async function getEventPhotos(): Promise<EventPhoto[]> {
  try {
    const { data, error } = await supabase
      .from('event_photos').select('*').order('sort_order', { ascending: true });
    if (!error && Array.isArray(data)) {
      return data.map((d: any) => ({ id: d.id, url: d.url, caption: d.caption || '' }));
    }
  } catch (err) {
    console.warn('Supabase getEventPhotos fallback:', err);
  }
  return [];
}

/** Uploads an image to the public `post-media` bucket and records it in event_photos. */
export async function addEventPhoto(file: File, caption = ''): Promise<EventPhoto | null> {
  try {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `event/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage.from('post-media').upload(path, file, { upsert: true });
    if (upErr) { console.warn('event photo upload', upErr.message); return null; }
    const url = supabase.storage.from('post-media').getPublicUrl(path).data.publicUrl;
    const { data, error } = await supabase
      .from('event_photos').insert({ url, caption, sort_order: Date.now() % 100000 }).select('*').single();
    if (error || !data) return null;
    return { id: data.id, url: data.url, caption: data.caption || '' };
  } catch (err) {
    console.warn('addEventPhoto error:', err);
    return null;
  }
}

export async function deleteEventPhoto(id: string): Promise<void> {
  try {
    await supabase.from('event_photos').delete().eq('id', id);
  } catch (err) {
    console.warn('deleteEventPhoto error:', err);
  }
}

// ========================================================
// 3. COMMUNITY FEED POSTS
// ========================================================
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        authorId: d.author_id,
        authorName: d.author_name,
        authorHeadline: d.author_headline || 'Developer',
        authorAvatar: d.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        content: d.content,
        codeSnippet: d.code_snippet,
        likesCount: d.likes_count || 0,
        dislikesCount: d.dislikes_count || 0,
        commentsCount: d.comments_count || 0,
        userReaction: null,
        comments: Array.isArray(d.comments) ? d.comments : [],
        timestamp: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      }));
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase query posts fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.POSTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_POSTS;
}

export async function createCommunityPost(post: CommunityPost): Promise<void> {
  try {
    await supabase.from('posts').insert({
      id: post.id,
      author_id: post.authorId,
      author_name: post.authorName,
      author_headline: post.authorHeadline,
      author_avatar: post.authorAvatar,
      content: post.content,
      code_snippet: post.codeSnippet,
      likes_count: 0,
      dislikes_count: 0,
      comments_count: 0,
    });
  } catch (err) {
    console.warn('Supabase insert post fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.POSTS);
  const posts: CommunityPost[] = cached ? JSON.parse(cached) : [...INITIAL_POSTS];
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([post, ...posts]));
}

export async function updatePostReactions(postId: string, likes: number, dislikes: number): Promise<void> {
  try {
    await supabase.from('posts').update({
      likes_count: likes,
      dislikes_count: dislikes,
    }).eq('id', postId);
  } catch (err) {
    console.warn('Supabase update reactions fallback:', err);
  }
}
export const reactToPost = updatePostReactions;

// ========================================================
// 4. LOUNGE MESSAGES (COMMUNAL EVENT ROOM)
// ========================================================
export async function getLoungeMessages(): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase.from('lounge_messages').select('*').order('created_at', { ascending: true });
    if (!error && data && data.length > 0) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        conversationId: 'lounge-hyd',
        senderId: d.sender_id,
        senderName: d.sender_name,
        senderAvatar: d.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        content: d.content,
        timestamp: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
        isSelf: d.sender_id === 'usr-1',
      }));
      localStorage.setItem(STORAGE_KEYS.LOUNGE, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase query lounge fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.LOUNGE);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_ROOM_MESSAGES;
}

export async function sendLoungeMessage(msg: ChatMessage): Promise<void> {
  try {
    await supabase.from('lounge_messages').insert({
      id: msg.id,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      sender_avatar: msg.senderAvatar,
      content: msg.content,
    });
  } catch (err) {
    console.warn('Supabase insert lounge message fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.LOUNGE);
  const messages: ChatMessage[] = cached ? JSON.parse(cached) : [...INITIAL_ROOM_MESSAGES];
  localStorage.setItem(STORAGE_KEYS.LOUNGE, JSON.stringify([...messages, msg]));
}

// ========================================================
// 5. DIRECT 1-ON-1 MESSAGES
// ========================================================
export async function getDirectMessages(): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (!error && data && data.length > 0) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        conversationId: d.conversation_id,
        senderId: d.sender_id,
        senderName: d.sender_name || 'Attendee',
        senderAvatar: d.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        content: d.content,
        timestamp: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:05 AM',
        isSelf: d.sender_id === 'usr-1',
      }));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase query direct messages fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_MESSAGES;
}

export async function sendDirectMessage(msg: ChatMessage): Promise<void> {
  try {
    await supabase.from('messages').insert({
      id: msg.id,
      conversation_id: msg.conversationId,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      sender_avatar: msg.senderAvatar,
      content: msg.content,
    });
  } catch (err) {
    console.warn('Supabase insert direct message fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  const messages: ChatMessage[] = cached ? JSON.parse(cached) : [...INITIAL_MESSAGES];
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([...messages, msg]));
}

// ========================================================
// 6. CONNECTION REQUESTS
// ========================================================
export async function getConnectionRequests(): Promise<ConnectionRequest[]> {
  try {
    const { data, error } = await supabase.from('connection_requests').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        senderId: d.sender_id,
        receiverId: d.receiver_id,
        senderName: d.sender_name || 'Attendee',
        senderHeadline: d.sender_headline || 'Engineer',
        senderAvatar: d.sender_avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
        note: d.note || '',
        timestamp: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        status: (d.status || 'pending') as 'pending' | 'accepted' | 'rejected',
      }));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase query connection_requests fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return [];
}

export async function createConnectionRequest(req: ConnectionRequest): Promise<void> {
  try {
    await supabase.from('connection_requests').insert({
      id: req.id,
      sender_id: req.senderId,
      receiver_id: req.receiverId,
      sender_name: req.senderName,
      sender_headline: req.senderHeadline,
      sender_avatar: req.senderAvatar,
      note: req.note,
      status: 'pending',
    });
    // Also update target's status in profiles
    await supabase.from('profiles').update({ connection_status: 'pending_sent' }).eq('id', req.receiverId);
  } catch (err) {
    console.warn('Supabase insert connection request fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  const list: ConnectionRequest[] = cached ? JSON.parse(cached) : [];
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([req, ...list]));
}

export async function updateConnectionRequestStatus(requestId: string, status: 'accepted' | 'rejected', senderId?: string, receiverId?: string): Promise<void> {
  try {
    await supabase.from('connection_requests').update({ status }).eq('id', requestId);
    if (status === 'accepted') {
      if (senderId) await supabase.from('profiles').update({ connection_status: 'connected' }).eq('id', senderId);
      if (receiverId) await supabase.from('profiles').update({ connection_status: 'connected' }).eq('id', receiverId);
    }
  } catch (err) {
    console.warn('Supabase update request status error:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  if (cached) {
    try {
      const list: ConnectionRequest[] = JSON.parse(cached);
      const updated = list.map((r) => r.id === requestId ? { ...r, status } : r);
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
    } catch {}
  }
}
