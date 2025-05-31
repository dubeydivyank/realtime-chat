import { User } from "@supabase/supabase-js";

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps) {
  console.log(user);
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Welcome back! 🎉</h2>
        <p className="text-green-700">You are successfully authenticated with Supabase.</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-md font-semibold text-gray-800 mb-2">User Information:</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {user.id}
          </p>
          <p>
            <span className="font-medium">Last Sign In:</span>{" "}
            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A"}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-md font-semibold text-blue-800 mb-2">What&apos;s Next?</h3>
        <p className="text-blue-700 text-sm">
          Your server-side authentication is now set up! You can start building your chat application features with
          secure user sessions.
        </p>
      </div>
    </div>
  );
}
