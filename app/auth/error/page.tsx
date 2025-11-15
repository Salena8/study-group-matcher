import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-900">
              Oops! Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {params?.error && (
              <p className="text-sm text-red-600">{params.error}</p>
            )}
            <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 underline">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
