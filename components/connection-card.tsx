"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

interface ConnectionCardProps {
  profile: Profile;
  matchScore: number;
  status: "pending" | "accepted" | "rejected";
  onAccept?: (profileId: string) => void;
  onReject?: (profileId: string) => void;
  isLoading?: boolean;
}

export function ConnectionCard({
  profile,
  matchScore,
  status,
  onAccept,
  onReject,
  isLoading,
}: ConnectionCardProps) {
  return (
    <Card className="w-full bg-white border-pink-200 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-purple-900">
              {profile.full_name}
            </h3>
            <p className="text-sm text-purple-700">{profile.major}</p>
            <p className="text-xs text-purple-600 mb-2">{profile.year_of_study}</p>
            {profile.bio && (
              <p className="text-sm text-gray-600 line-clamp-2">{profile.bio}</p>
            )}
          </div>
          <div className="ml-4 text-right">
            <p className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {matchScore}%
            </p>
            <p className="text-xs text-gray-600">Match</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {profile.study_subjects.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-purple-900 mb-1">
              Subjects
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.study_subjects.slice(0, 3).map((subject, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                >
                  {subject}
                </span>
              ))}
              {profile.study_subjects.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{profile.study_subjects.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {profile.interests.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-purple-900 mb-1">
              Interests
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {status === "pending" && (onAccept || onReject) && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onReject?.(profile.id)}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Decline
            </Button>
            <Button
              onClick={() => onAccept?.(profile.id)}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
            >
              Accept
            </Button>
          </div>
        )}

        {status === "accepted" && (
          <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-center">
            <p className="text-sm font-semibold text-green-700">
              Connection Accepted
            </p>
          </div>
        )}

        {status === "rejected" && (
          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-center">
            <p className="text-sm text-gray-600">Connection Declined</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
