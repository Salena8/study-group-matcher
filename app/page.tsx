import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (userData?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-pink-100 via-purple-100 to-mint-100 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-mint-400 bg-clip-text text-transparent mb-4">
          StudyMatch
        </h1>
        <p className="text-xl text-gray-700 mb-2">
          Find your perfect study buddy
        </p>
        <p className="text-gray-600 mb-8">
          Connect with fellow students, share knowledge, and ace your exams together
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/login">
            <Button className="px-8 py-6 text-lg bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 border border-pink-200 shadow-md">
            <div className="text-3xl mb-2">🎓</div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Find Matches
            </h3>
            <p className="text-sm text-gray-600">
              Discover study partners based on your major, subjects, and interests
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-pink-200 shadow-md">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Connect
            </h3>
            <p className="text-sm text-gray-600">
              Send and receive study group requests from compatible buddies
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-pink-200 shadow-md">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Learn Together
            </h3>
            <p className="text-sm text-gray-600">
              Collaborate with your study group to master your courses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
