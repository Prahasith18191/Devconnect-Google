/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_EVENT, 
  INITIAL_AGENDA, 
  INITIAL_ATTENDEES, 
  INITIAL_MESSAGES, 
  INITIAL_ROOM_MESSAGES, 
  INITIAL_POSTS 
} from './data/mockData';
import { supabase } from './lib/supabase';
import { 
  getEventDetails, 
  saveEventDetails,
  getAttendees, 
  getCommunityPosts, 
  getLoungeMessages, 
  getDirectMessages, 
  getConnectionRequests,
  createCommunityPost,
  reactToPost,
  sendLoungeMessage,
  sendDirectMessage,
  createConnectionRequest,
  updateConnectionRequestStatus,
  updateAttendeeConnectionStatus,
  saveAttendeeProfile,
  toggleSuspendAttendee
} from './lib/dataService';
import { AntigravityCanvas } from './components/AntigravityCanvas';
import { Navbar, AppView } from './components/Navbar';
import { LandingView } from './components/views/LandingView';
import { NetworkingView } from './components/views/NetworkingView';
import { FeedView } from './components/views/FeedView';
import { LoungeView } from './components/views/LoungeView';
import { MessagesView } from './components/views/MessagesView';
import { AdminView } from './components/views/AdminView';
import { ProfileModal } from './components/modals/ProfileModal';
import { ConnectModal } from './components/modals/ConnectModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { AuthModal } from './components/modals/AuthModal';
import { 
  AttendeeProfile, 
  EventDetails, 
  ChatMessage, 
  CommunityPost, 
  ConnectionRequest 
} from './types';
import { Check } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [event, setEvent] = useState<EventDetails>(INITIAL_EVENT);
  const [agenda, setAgenda] = useState(INITIAL_AGENDA);
  const [attendees, setAttendees] = useState<AttendeeProfile[]>(INITIAL_ATTENDEES);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>(INITIAL_ROOM_MESSAGES);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  // Active User Authentication State - Persisted to localStorage or starts null (Visitor mode)
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    fullName: string;
    headline: string;
    email: string;
    company: string;
    avatarUrl?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('devconnect_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Direct message peer selection target
  const [selectedChatPeerId, setSelectedChatPeerId] = useState<string | null>(null);

  // Modals state
  const [selectedProfile, setSelectedProfile] = useState<AttendeeProfile | null>(null);
  const [connectTargetAttendee, setConnectTargetAttendee] = useState<AttendeeProfile | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Incoming connection requests
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([]);

  // Dynamic Data Hydration from Supabase
  useEffect(() => {
    async function hydrateData() {
      try {
        const [
          loadedEvent,
          loadedAttendees, 
          loadedPosts, 
          loadedLounge, 
          loadedMessages, 
          loadedRequests
        ] = await Promise.all([
          getEventDetails(),
          getAttendees(),
          getCommunityPosts(),
          getLoungeMessages(),
          getDirectMessages(),
          getConnectionRequests(),
        ]);
        if (loadedEvent) setEvent(loadedEvent);
        if (loadedAttendees && loadedAttendees.length > 0) setAttendees(loadedAttendees);
        if (loadedPosts && loadedPosts.length > 0) setPosts(loadedPosts);
        if (loadedLounge && loadedLounge.length > 0) setRoomMessages(loadedLounge);
        if (loadedMessages && loadedMessages.length > 0) setMessages(loadedMessages);
        if (loadedRequests) setIncomingRequests(loadedRequests);
      } catch (err) {
        console.warn('Data hydration fallback:', err);
      }
    }
    hydrateData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    localStorage.removeItem('devconnect_user');
    setCurrentUser(null);
    showToast('Signed out. Click "Sign In" to choose or create an attendee.');
  };

  // 1. Connection Request Action
  const handleSendConnectionRequest = (attendeeId: string, note: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please sign in or select an attendee persona to send connection requests.');
      return;
    }

    const target = attendees.find((a) => a.id === attendeeId);
    if (!target) return;

    const newReq: ConnectionRequest = {
      id: `req-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: attendeeId,
      senderName: currentUser.fullName,
      senderHeadline: currentUser.headline,
      senderAvatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      note,
      timestamp: 'Just now',
      status: 'pending',
    };

    createConnectionRequest(newReq);

    setAttendees((prev) =>
      prev.map((a) => {
        if (a.id === attendeeId) {
          return {
            ...a,
            connectionStatus: a.connectionStatus === 'pending_received' ? 'connected' : 'pending_sent',
          };
        }
        return a;
      })
    );
    showToast(`Connection request sent to ${target.fullName}!`);
  };

  // 2. Accept Incoming or Pending Request (Live in DB and UI)
  const handleAcceptRequest = async (requestIdOrAttendeeId: string) => {
    const currentUserId = currentUser?.id || 'usr-1';

    // Check if matching an existing incoming request
    const req = incomingRequests.find(
      (r) => r.id === requestIdOrAttendeeId || r.senderId === requestIdOrAttendeeId
    );

    const targetAttendeeId = req ? req.senderId : requestIdOrAttendeeId;
    const targetAttendee = attendees.find((a) => a.id === targetAttendeeId);
    const targetName = targetAttendee ? targetAttendee.fullName : (req?.senderName || 'Peer');

    if (req) {
      await updateConnectionRequestStatus(req.id, 'accepted', req.senderId, currentUserId);
      setIncomingRequests((prev) => prev.filter((r) => r.id !== req.id));
    } else {
      await updateAttendeeConnectionStatus(targetAttendeeId, 'connected');
    }

    setAttendees((prev) =>
      prev.map((a) => (a.id === targetAttendeeId ? { ...a, connectionStatus: 'connected' } : a))
    );

    showToast(`Connected with ${targetName}! Direct messaging is now unlocked.`);
  };

  const handleRejectRequest = async (requestId: string) => {
    await updateConnectionRequestStatus(requestId, 'rejected');
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast('Request dismissed.');
  };

  // 3. Direct 1-on-1 Message Sending (Persisted to Supabase)
  const handleSendMessage = (receiverId: string, content: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please sign in or select an attendee persona to chat.');
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${receiverId}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderAvatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };
    sendDirectMessage(newMsg);
    setMessages((prev) => [...prev, newMsg]);
  };

  // 4. Communal Event Lounge Broadcast (Persisted to Supabase)
  const handleSendRoomMessage = (content: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please sign in or select an attendee persona to post in the Lounge.');
      return;
    }

    const newRoomMsg: ChatMessage = {
      id: `room-${Date.now()}`,
      conversationId: 'lounge-hyd',
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderAvatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };
    sendLoungeMessage(newRoomMsg);
    setRoomMessages((prev) => [...prev, newRoomMsg]);
    showToast('Message sent to Event Lounge');
  };

  // 5. Post Creation (Persisted to Supabase)
  const handleCreatePost = (content: string, codeSnippet?: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please sign in or select an attendee persona to post in the Feed.');
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorHeadline: currentUser.headline,
      authorAvatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      content,
      codeSnippet,
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      userReaction: null,
      comments: [],
      timestamp: 'Just now',
    };
    createCommunityPost(newPost);
    setPosts((prev) => [newPost, ...prev]);
    showToast('Post shared to Community Feed');
  };

  // 6. Single-Reaction Invariant (Likes & Dislikes)
  const handleReactPost = (postId: string, reaction: 'like' | 'dislike') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        let nextReaction: 'like' | 'dislike' | null = reaction;
        let newLikes = p.likesCount;
        let newDislikes = p.dislikesCount;

        if (p.userReaction === reaction) {
          nextReaction = null;
          if (reaction === 'like') newLikes = Math.max(0, newLikes - 1);
          if (reaction === 'dislike') newDislikes = Math.max(0, newDislikes - 1);
        } else {
          if (p.userReaction === 'like') newLikes = Math.max(0, newLikes - 1);
          if (p.userReaction === 'dislike') newDislikes = Math.max(0, newDislikes - 1);

          if (reaction === 'like') newLikes += 1;
          if (reaction === 'dislike') newDislikes += 1;
        }

        reactToPost(postId, newLikes, newDislikes);

        return {
          ...p,
          likesCount: newLikes,
          dislikesCount: newDislikes,
          userReaction: nextReaction,
        };
      })
    );
  };

  // 7. Post Comments
  const handleAddComment = (postId: string, commentText: string) => {
    const commenterId = currentUser ? currentUser.id : 'usr-guest';
    const commenterName = currentUser ? currentUser.fullName : 'Guest Builder';
    const commenterAvatar = currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80';
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newComments = [
          ...(p.comments || []),
          {
            id: `c-${Date.now()}`,
            postId,
            authorId: commenterId,
            authorName: commenterName,
            authorAvatar: commenterAvatar,
            content: commentText,
            timestamp: 'Just now',
          },
        ];
        return {
          ...p,
          commentsCount: newComments.length,
          comments: newComments,
        };
      })
    );
    showToast('Comment added!');
  };

  // Dynamic metrics derived directly from database state
  const totalRegistered = attendees.length;
  const connectedCount = currentUser
    ? attendees.filter((a) => a.connectionStatus === 'connected' && a.id !== currentUser.id).length
    : 0;
  const discussionsCount = posts.length + roomMessages.length;

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-white selection:text-black relative">
      {/* Antigravity Zero-Gravity Floating Background */}
      <AntigravityCanvas />

      {/* Clean Glassmorphic Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        unreadNotificationsCount={incomingRequests.length}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        connectedCount={connectedCount}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            event={event}
            agenda={agenda}
            onExploreNetworking={() => setCurrentView('directory')}
            onJoinLounge={() => setCurrentView('lounge')}
            totalAttendees={totalRegistered}
          />
        )}

        {currentView === 'directory' && (
          <NetworkingView
            attendees={attendees}
            currentUserId={currentUser?.id}
            onOpenProfile={(p) => setSelectedProfile(p)}
            onOpenConnectModal={(a) => setConnectTargetAttendee(a)}
            onAcceptConnection={(id) => handleAcceptRequest(id)}
            onNavigateToChat={(id) => {
              setSelectedChatPeerId(id);
              setCurrentView('messages');
            }}
          />
        )}

        {currentView === 'feed' && (
          <FeedView
            posts={posts}
            onCreatePost={handleCreatePost}
            onReactPost={handleReactPost}
            onAddComment={handleAddComment}
          />
        )}

        {currentView === 'lounge' && (
          <LoungeView
            event={event}
            messages={roomMessages}
            onSendMessage={handleSendRoomMessage}
          />
        )}

        {currentView === 'messages' && (
          <MessagesView
            attendees={attendees}
            messages={messages}
            currentUserId={currentUser?.id || 'guest'}
            initialSelectedPeerId={selectedChatPeerId}
            onSendMessage={handleSendMessage}
            onExploreNetworking={() => setCurrentView('directory')}
            onAcceptConnection={(id) => handleAcceptRequest(id)}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            event={event}
            attendees={attendees}
            onUpdateEvent={(updated) => {
              setEvent(updated);
              saveEventDetails(updated);
              showToast('Event details updated and persisted to database!');
            }}
            onToggleSuspendUser={(userId) => {
              const target = attendees.find((a) => a.id === userId);
              const newSuspendedState = target ? !target.isVerified : false;
              toggleSuspendAttendee(userId, newSuspendedState);
              setAttendees((prev) =>
                prev.map((a) => (a.id === userId ? { ...a, isVerified: !newSuspendedState } : a))
              );
              showToast(`Attendee status updated in database.`);
            }}
            totalAttendees={totalRegistered}
            connectionsCount={connectedCount}
            discussionsCount={discussionsCount}
          />
        )}
      </main>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onOpenConnectModal={(a) => {
            setSelectedProfile(null);
            setConnectTargetAttendee(a);
          }}
          onNavigateToChat={(id) => {
            setSelectedProfile(null);
            setSelectedChatPeerId(id);
            setCurrentView('messages');
          }}
        />
      )}

      {/* High-Context Connection Request Modal */}
      {connectTargetAttendee && (
        <ConnectModal
          attendee={connectTargetAttendee}
          onClose={() => setConnectTargetAttendee(null)}
          onSend={handleSendConnectionRequest}
        />
      )}

      {/* In-App Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        incomingRequests={incomingRequests}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
      />

      {/* Auth Modal (Login, Register & Multi-Persona selection with Supabase) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        attendees={attendees}
        onAuthSuccess={async (profile) => {
          setCurrentUser(profile);
          try {
            localStorage.setItem('devconnect_user', JSON.stringify(profile));
          } catch (e) {}

          // Check if this attendee already exists; if not, add them to live attendees state and persist!
          const exists = attendees.some((a) => a.id === profile.id || a.fullName.toLowerCase() === profile.fullName.toLowerCase());
          if (!exists) {
            const newAttendee: AttendeeProfile = {
              id: profile.id,
              fullName: profile.fullName,
              headline: profile.headline,
              company: profile.company,
              jobTitle: 'Developer & Builder',
              avatarUrl: profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
              bio: `Registered attendee at ${event.title}. Building with Cloud Agentic AI and Antigravity.`,
              skills: ['Cloud Agents', 'Python', 'Antigravity'],
              interests: ['Agentic Workflows', 'Developer Platforms'],
              learning: ['Google Gemini 2.5'],
              experienceYears: 3,
              experienceLevel: 'Mid',
              connectionStatus: 'none',
              isVerified: true,
            };
            setAttendees((prev) => [newAttendee, ...prev]);
            await saveAttendeeProfile(newAttendee);
            showToast(`Welcome ${profile.fullName}! You are registered in Supabase and live in the directory.`);
          } else {
            showToast(`Signed in as ${profile.fullName}`);
          }
        }}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel bg-black/90 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-medium border-white/20 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
