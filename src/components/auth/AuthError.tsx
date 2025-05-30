import { MdOutlineErrorOutline } from "react-icons/md";

export function AuthError({ error }: { error: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      <div className="flex">
        <MdOutlineErrorOutline className="h-5 w-5 text-red-600 mr-2" />
        <div className="ml-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    </div>
  );
}
