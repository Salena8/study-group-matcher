"use client";

import { getClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { calculateSimilarityScore } from "@/lib/matching";
import Link from "next/link";

interface Profile {
  id: string;
  full_name: string;
  bio: string;
  major: string;
  year_of_study: string;
  study_subjects: string[];
  interests: string[];
}

export default function MatchesPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = getClient();
  const router = useRouter();

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setIsLoading(true);

        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          router.push("/auth/login");
          return;
        }

        // Get current user profile
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        if (profileError || !userProfile) {
          router.push("/profile-setup");
          return;
        }

        setCurrentUser(userProfile);

        // Get all other profiles
        const { data: otherProfiles, error: othersError } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", userData.user.id);

        if (othersError) throw othersError;

        // Get already matched profiles to exclude them
        const { data: matches } = await supabase
          .from("matches")
          .select("*")
          .or(
            `user_id_1.eq.${userData.user.id},user_id_2.eq.${userData.user.id}`
          );

        const matchedIds = new Set(
          matches?.flatMap((m) => [m.user_id_1, m.user_id_2]) || []
        );

        // Filter out already matched and calculate scores
        const availableProfiles = (
          otherProfiles as Profile[]
        ).filter((p) => !matchedIds.has(p.id));

        // Sort by compatibility score
        const sorted = availableProfiles
          .map((p) => ({
            ...p,
            score: calculateSimilarityScore(userProfile, p),
          }))
          .sort((a, b) => b.score - a.score);

        setProfiles(sorted.map(({ score, ...p }) => p));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [supabase, router]);

  const handleConnect = async (profileId: string) => {
    if (!currentUser) return;
    const selectedProfile = profiles[currentIndex];
    setIsLoading(true);

    try {
      const { error } = await supabase.from("matches").insert({
        user_id_1: currentUser.id,
        user_id_2: profileId,
        similarity_score: calculateSimilarityScore(
          currentUser,
          selectedProfile
        ),
        match_status: "pending",
      });

      if (error) throw error;

      // Move to next profile
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create match"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePass = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-svh w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-900">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-svh w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-svh w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-900 mb-4">
            No more profiles!
          </p>
          <p className="text-gray-600 mb-6">
            Check back later for new study buddies
          </p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-svh w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-900 mb-4">
            That's all the profiles!
          </p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  const matchScore = calculateSimilarityScore(currentUser!, currentProfile);

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-8">
        <div>
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-purple-900 mt-2">Find Matches</h1>
          <p className="text-gray-600 mt-1">
            {currentIndex + 1} of {profiles.length}
          </p>
        </div>

        <ProfileCard
          profile={currentProfile}
          matchScore={matchScore}
          onConnect={handleConnect}
          onPass={handlePass}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
