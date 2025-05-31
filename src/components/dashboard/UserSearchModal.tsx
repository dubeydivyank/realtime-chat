"use client";

import { useState, useEffect } from "react";
import { Profile } from "../../app/types/database";
import { searchUsers } from "../../lib/chat";
import { FaUser } from "react-icons/fa";

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onUserSelect: (user: Profile) => void;
}

export default function UserSearchModal({ isOpen, onClose, currentUserId, onUserSelect }: UserSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchUsers(query, currentUserId);
      setUsers(data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg text-gray-500 font-bold">Start New Chat</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-green-600"
        />

        <div className="max-h-48 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4">Searching...</div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => onUserSelect(user)}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded"
              >
                {user.profile_picture ? (
                  <img src={user.profile_picture} alt={user.user_name} className="w-10 h-10 rounded-full mr-3" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <FaUser className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{user.user_name}</div>
                  <div className="text-sm text-gray-500">{user.phone_no}</div>
                </div>
              </div>
            ))
          ) : searchQuery && !loading ? (
            <div className="text-center py-4 text-gray-500">No users found</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
