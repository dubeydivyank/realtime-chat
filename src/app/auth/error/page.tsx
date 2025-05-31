import { AuthError } from "@/components/auth/AuthError";

interface ErrorPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "An unexpected error occurred during authentication.";

  return <AuthError error={error} />;
}
