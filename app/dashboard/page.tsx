import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (!profile) {
    redirect("/profile-setup");
  }

  async function handleLogout() {
    const client = await createClient();
    await client.auth.signOut();
    redirect("/auth/login");
  }

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-pink-100 via-purple-100 to-mint-100">
      <nav className="bg-white border-b border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            StudyMatch
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-purple-600 hover:text-purple-700"
            >
              My Profile
            </Link>
            <form action={handleLogout}>
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-pink-200">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              Your Profile
            </h2>
            <p className="text-gray-600">{profile.full_name}</p>
            <p className="text-sm text-gray-500">{profile.major}</p>
            <Link
              href="/profile"
              className="text-purple-600 hover:text-purple-700 text-sm mt-4 inline-block"
            >
              Edit Profile →
            </Link>
          </div>

          <Link
            href="/matches"
            className="bg-gradient-to-br from-pink-200 to-pink-100 rounded-lg shadow-md p-6 border border-pink-300 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              Find Matches
            </h2>
            <p className="text-gray-600">Discover study buddies</p>
            <div className="text-purple-600 text-sm mt-4">Start Matching →</div>
          </Link>

          <Link
            href="/connections"
            className="bg-gradient-to-br from-purple-200 to-purple-100 rounded-lg shadow-md p-6 border border-purple-300 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              My Connections
            </h2>
            <p className="text-gray-600">View your study buddies</p>
            <div className="text-purple-600 text-sm mt-4">View Connections →</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
