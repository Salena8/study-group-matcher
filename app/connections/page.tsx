"use client";

import { getClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ConnectionCard } from "@/components/connection-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Profile {
  id: string;
  full_name: string;
  bio: string;
  major: string;
  year_of_study: string;
  study_subjects: string[];
  interests: string[];
  timezone: string;
}

interface Match {
  id: string;
  user_id_1: string;
  user_id_2: string;
  similarity_score: number;
  match_status: string;
}

export default function ConnectionsPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connections, setConnections] = useState<
    Array<{ profile: Profile; match: Match; status: "pending" | "accepted" }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = getClient();
  const router = useRouter();

  useEffect(() => {
    const loadConnections = async () => {
      try {
        setIsLoading(true);

        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          router.push("/auth/login");
          return;
        }

        setCurrentUserId(userData.user.id);

        // Get all matches for current user
        const { data: matches, error: matchesError } = await supabase
          .from("matches")
          .select("*")
          .or(
            `user_id_1.eq.${userData.user.id},user_id_2.eq.${userData.user.id}`
          );

        if (matchesError) throw matchesError;

        // Get profiles for all matched users
        const matchedUserIds = matches
          ?.flatMap((m) => [m.user_id_1, m.user_id_2])
          .filter((id) => id !== userData.user.id) || [];

        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", matchedUserIds);

        if (profilesError) throw profilesError;

        // Combine matches with profiles
        const connectionsData = matches
          ?.map((match) => {
            const matchedUserId =
              match.user_id_1 === userData.user.id
                ? match.user_id_2
                : match.user_id_1;
            const profile = profiles?.find((p) => p.id === matchedUserId);

            if (!profile) return null;

            return {
              profile: {
                id: profile.id,
                full_name: profile.full_name,
                bio: profile.bio,
                major: profile.major,
                year_of_study: profile.year_of_study,
                study_subjects: profile.study_subjects || [],
                interests: profile.interests || [],
                timezone: profile.timezone,
              },
              match,
              status: match.match_status as "pending" | "accepted",
            };
          })
          .filter((c) => c !== null) as Array<{
          profile: Profile;
          match: Match;
          status: "pending" | "accepted";
        }>;

        setConnections(connectionsData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadConnections();
  }, [supabase, router]);

  const handleAccept = async (profileId: string) => {
    if (!currentUserId) return;
    setIsLoading(true);

    try {
      const connection = connections.find((c) => c.profile.id === profileId);
      if (!connection) throw new Error("Connection not found");

      const { error } = await supabase
        .from("matches")
        .update({ match_status: "accepted" })
        .eq("id", connection.match.id);

      if (error) throw error;

      // Update local state
      setConnections((prev) =>
        prev.map((c) =>
          c.profile.id === profileId ? { ...c, status: "accepted" } : c
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to accept connection"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (profileId: string) => {
    if (!currentUserId) return;
    setIsLoading(true);

    try {
      const connection = connections.find((c) => c.profile.id === profileId);
      if (!connection) throw new Error("Connection not found");

      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", connection.match.id);

      if (error) throw error;

      // Remove from local state
      setConnections((prev) =>
        prev.filter((c) => c.profile.id !== profileId)
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to reject connection"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-svh w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-900">Loading connections...</p>
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

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-purple-900 mt-2">
            My Connections
          </h1>
          <p className="text-gray-600 mt-1">
            {connections.length}{" "}
            {connections.length === 1 ? "connection" : "connections"}
          </p>
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-purple-900 mb-4">
              No connections yet
            </p>
            <p className="text-gray-600 mb-6">
              Start finding matches to connect with study buddies
            </p>
            <Link href="/matches">
              <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white">
                Find Matches
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <ConnectionCard
                key={connection.profile.id}
                profile={connection.profile}
                matchScore={Math.round(connection.match.similarity_score)}
                status={connection.status}
                onAccept={
                  connection.status === "pending" ? handleAccept : undefined
                }
                onReject={
                  connection.status === "pending" ? handleReject : undefined
                }
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
