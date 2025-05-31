# Real-time Chat Application

A modern, real-time chat application built with Next.js 15, React 19, TypeScript, and Supabase.

## 🚀 Features

### Core Functionality

- **Real-time Messaging**: Instant message delivery using Supabase real-time subscriptions
- **User Authentication**: Secure login/signup with Supabase Auth
- **Direct Messaging**: One-on-one conversations between users
- **User Search**: Find and start conversations with other users

### Additional Features

- **Unread Message Counts**: Track unread messages per conversation
- **Message Status**: Read receipts and message delivery indicators
- **Message Read Status**: Mark messages as read when viewed
- **Real-time Chat List Updates**: Live updates when new messages arrive

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Icons** - Icon library for UI elements

### Backend & Database

- **Supabase** - Backend-as-a-Service providing:
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security (RLS)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── layout.tsx           # Dashboard layout with auth check
│   │   └── page.tsx             # Main dashboard page
│   ├── auth/                    # Authentication pages
│   │   ├── login/               # Login page
│   │   ├── signup/              # Registration page
│   │   ├── error/               # Auth error handling
│   │   └── layout.tsx           # Auth layout
│   ├── types/                   # TypeScript type definitions
│   │   └── database.ts          # Database schema types
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── favicon.ico              # App icon
├── components/                   # React components
│   ├── auth/                    # Authentication components
│   │   ├── LoginForm.tsx        # Login form with validation
│   │   ├── SignupForm.tsx       # Registration form
│   │   └── AuthError.tsx        # Error display component
│   └── dashboard/               # Chat interface components
│       ├── ChatInterface.tsx    # Main chat interface
│       ├── ChatContainer.tsx    # Chat container with state management
│       ├── ChatList.tsx         # List of conversations
│       ├── ChatItem.tsx         # Individual chat item
│       ├── Sidebar.tsx          # Main sidebar
│       ├── ChatSidebar.tsx      # Chat-specific sidebar
│       ├── ChatHeader.tsx       # Chat header component
│       ├── UserInfo.tsx         # User information display
│       ├── UserSearchModal.tsx  # User search functionality
│       └── UnauthenticatedMessage.tsx
├── lib/                         # Utility libraries
│   ├── auth/                    # Authentication logic
│   │   ├── index.ts             # Auth exports
│   │   ├── login.ts             # Login server action
│   │   ├── signup.ts            # Signup server action
│   │   └── logout.ts            # Logout functionality
│   ├── chat/                    # Chat functionality
│   │   ├── index.ts             # Chat exports
│   │   ├── chats.ts             # Chat management
│   │   ├── messages.ts          # Message operations
│   │   ├── subscriptions.ts     # Real-time subscriptions
│   │   └── users.ts             # User operations
│   └── supabase/                # Supabase configuration
│       ├── client.ts            # Browser client
│       ├── server.ts            # Server client
│       └── middleware.ts        # Auth middleware
└── middleware.ts                # Next.js middleware for auth
```

## 🗄 Database Schema

The application uses the following Supabase database tables:

### `profile`

```sql
- id: string (Primary Key, references auth.users)
- user_name: string
- phone_no: string
- profile_picture: string (nullable)
```

### `chats`

```sql
- id: string (Primary Key)
- name: string (nullable)
- is_group: boolean
- created_at: timestamp
- updated_at: timestamp
```

### `chat_members`

```sql
- id: string (Primary Key)
- chat_id: string (Foreign Key → chats.id)
- user_id: string (Foreign Key → profile.id)
- joined_at: timestamp
- role: string (nullable)
```

### `messages`

```sql
- id: string (Primary Key)
- chat_id: string (Foreign Key → chats.id)
- sender_id: string (Foreign Key → profile.id)
- content: string
- created_at: timestamp
- is_edited: boolean
```

### `message_read_status`

```sql
- id: string (Primary Key)
- message_id: string (Foreign Key → messages.id)
- user_id: string (Foreign Key → profile.id)
- read_at: timestamp
```

## 🏗 Architecture

### Authentication Flow

1. Users register/login through Supabase Auth
2. Middleware checks authentication status on protected routes
3. User profiles are created/updated in the `profile` table
4. Session management handled by Supabase with secure cookies

### Real-time Messaging

1. Messages are stored in the `messages` table
2. Real-time subscriptions listen for new messages
3. UI updates automatically when new messages arrive
4. Read status is tracked and updated in real-time

### State Management

- React state for UI components
- Supabase real-time subscriptions for live data
- Server-side rendering for initial data loading
- Client-side state updates for real-time features

## 🔒 Security Features

### Authentication Security

- Secure session management with Supabase Auth
- Protected routes with middleware
- Automatic token refresh

### Data Security

- Row Level Security (RLS) on all database tables
- Users can only access their own conversations
- Secure API endpoints with authentication checks

### Input Validation

- Client-side form validation
- Server-side data validation

## 🧪 Testing

### Manual Testing Checklist

- [x] User registration and login
- [x] Creating new conversations
- [x] Sending and receiving messages
- [x] Real-time message updates
- [x] Read receipt functionality
- [x] Error handling scenarios

---

---

---

# 🔮 Future Enhancements

- **Group Chats**: Multi-user conversations
- **File Sharing**: Image and document sharing
- **Conversation tags**: Add tags to chats
- **Message Search**: Search within conversations
- **Chat filter**: Filter the chat list

## 📋 Group Chat Implementation Strategy

The application is already well-architected for group chat functionality! The database schema and most backend logic already support groups. Here's the detailed implementation strategy:

### Current Architecture Assessment ✅

**Already Group-Ready:**

- Database schema supports groups (`is_group` field, `chat_members` junction table)
- Backend functions work with multiple participants
- Real-time subscriptions work for any number of users
- Message sending/receiving handles multiple participants

### Implementation Phases

#### Phase 1: Basic Group Creation

1. **Modify User Selection Modal** (`UserSearchModal.tsx`)

   ```typescript
   // Add multi-user selection
   const [selectedUsers, setSelectedUsers] = useState<Profile[]>([]);
   const [isGroupMode, setIsGroupMode] = useState(false);
   const [groupName, setGroupName] = useState("");
   ```

2. **Add Group Creation Function** (`src/lib/chat/chats.ts`)

   ```typescript
   export async function createGroupChat(
     currentUserId: string,
     participants: string[],
     groupName: string
   ): Promise<string> {
     // Create chat with is_group: true
     // Add all participants to chat_members
     // Set creator as admin role
   }
   ```

3. **Update Chat Creation Flow** (`ChatList.tsx`)
   - Add group/individual chat selection
   - Handle group name input
   - Integrate with new group creation function

#### Phase 2: Group UI Polish

1. **Group Chat Header** (`ChatHeader.tsx`)

   - Display group name instead of individual user name
   - Show participant count (e.g., "5 members")
   - Add group settings/info button

2. **Chat List Indicators** (`ChatItem.tsx`)

   - Group icon for group chats
   - Different styling for group vs individual chats
   - Group name display in chat list

3. **Message Display Enhancements** (`ChatInterface.tsx`)
   - Show sender names in group messages
   - Different message styling for groups

#### Phase 3: Group Management

1. **Group Settings Modal**

   - Change group name
   - View member list

2. **Member Management**

   - Add new members to existing groups
   - Remove members (admin only)
   - Leave group functionality
   - Transfer admin rights

3. **Permission System**
   - Admin vs member roles
   - Admin-only actions (add/remove members, change name)
   - Role indicators in member list

### Key Files to Modify

| Component               | Changes Required                       |
| ----------------------- | -------------------------------------- |
| `UserSearchModal.tsx`   | Multi-user selection, group name input |
| `src/lib/chat/chats.ts` | Add `createGroupChat()` function       |
| `ChatList.tsx`          | Group creation flow integration        |
| `ChatHeader.tsx`        | Group-specific header display          |
| `ChatItem.tsx`          | Group indicators and styling           |
| `ChatInterface.tsx`     | Group message display                  |

### Database Considerations

No database schema changes required! Current structure already supports:

- Multiple users per chat (`chat_members` table)
- Group identification (`is_group` boolean)
- Role-based permissions (`role` field)
- All existing queries work with groups

### UI/UX Design Decisions

1. **Group Creation Flow**

   - Toggle between "New Chat" and "New Group"
   - Multi-select user interface
   - Required group name for groups

2. **Visual Indicators**

   - Group icon (👥) vs person icon (👤)
   - Member count in group headers
   - Sender names in group messages

3. **Group Management**
   - Settings accessible from chat header
   - Clear admin vs member distinction
   - Intuitive add/remove member flow

## 📁 File Sharing Implementation Strategy

Enable users to share images and documents within chats.

### Database Changes Required

```sql
-- Add file attachments table
CREATE TABLE file_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Implementation Steps

1. **File Upload Component** - Drag & drop or click to upload interface
2. **Supabase Storage Integration** - Store files in Supabase Storage buckets
3. **Message Schema Update** - Link attachments to messages
4. **File Preview** - Image thumbnails, document icons with download links
5. **File Size Limits** - Client and server-side validation

### Key Components

- `FileUpload.tsx` - File selection and upload UI
- `FileAttachment.tsx` - Display uploaded files in messages
- `src/lib/storage/` - File upload/download utilities

## 🏷️ Conversation Tags Implementation Strategy

Allow users to organize chats with custom tags for better organization.

### Database Changes Required

```sql
-- Add tags table
CREATE TABLE chat_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    color TEXT DEFAULT '#6B7280',
    created_by UUID REFERENCES profile(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Implementation Steps

1. **Tag Management UI** - Add/remove tags from chat header
2. **Tag Creation Modal** - Custom tag names and colors
3. **Tag Display** - Show tags in chat list items
4. **Tag Filtering** - Filter chats by selected tags

### Key Components

- `TagManager.tsx` - Tag creation and management
- `TagBadge.tsx` - Visual tag display component
- `src/lib/chat/tags.ts` - Tag CRUD operations

## 🎛️ Chat Filter Implementation Strategy

Provide filtering options to organize and find chats quickly.

### Current Architecture Assessment ✅

### Database Considerations

No schema changes required - uses existing chat data for filtering.

### Implementation Steps

1. **Filter UI** - Dropdown/sidebar with filter options
2. **Filter Logic** - Client-side and server-side filtering
3. **Filter Persistence** - Remember user's filter preferences
4. **Advanced Filters** - Combine multiple filter criteria

### Filter Options

- **By Type**: Groups vs Direct messages
- **By Status**: Unread messages, Active chats
- **By Tags**: Filter by assigned tags
- **By Date**: Recent activity, Date ranges
- **By Participants**: Filter by specific users

### Key Components

- `ChatFilter.tsx` - Filter controls interface
- `FilterDropdown.tsx` - Individual filter option
- `src/lib/chat/filters.ts` - Filter logic implementation
