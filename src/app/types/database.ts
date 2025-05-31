export interface Profile {
  id: string;
  user_name: string;
  phone_no: string;
  profile_picture: string | null;
}

export interface Chat {
  id: string;
  name: string | null;
  is_group: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_edited: boolean;
}

export interface ChatMember {
  id: string;
  chat_id: string;
  user_id: string;
  joined_at: string;
  role: string | null;
}

export interface MessageReadStatus {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}
