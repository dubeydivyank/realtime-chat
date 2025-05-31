export function UnauthenticatedMessage() {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-4">You are not signed in.</p>
      <a
        href="/auth/login"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
        Sign In
      </a>
    </div>
  );
}
