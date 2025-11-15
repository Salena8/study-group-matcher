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
}

interface ProfileCardProps {
  profile: Profile;
  matchScore: number;
  onConnect: (profileId: string) => void;
  onPass: (profileId: string) => void;
  isLoading?: boolean;
}

export function ProfileCard({
  profile,
  matchScore,
  onConnect,
  onPass,
  isLoading,
}: ProfileCardProps) {
  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-pink-200 to-purple-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-purple-900">
              {profile.full_name}
            </h3>
            <p className="text-sm text-purple-700">{profile.major}</p>
            <p className="text-xs text-purple-600">{profile.year_of_study}</p>
          </div>
          <div className="bg-white rounded-full px-3 py-1 text-center">
            <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {matchScore}%
            </p>
            <p className="text-xs text-gray-600">Match</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {profile.bio && (
          <div>
            <p className="text-sm font-semibold text-purple-900 mb-1">About</p>
            <p className="text-sm text-gray-700 line-clamp-3">{profile.bio}</p>
          </div>
        )}

        {profile.study_subjects.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-purple-900 mb-2">
              Study Subjects
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.study_subjects.map((subject, index) => (
                <span
                  key={index}
                  className="bg-purple-200 text-purple-900 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.interests.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-purple-900 mb-2">
              Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-green-200 text-green-900 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => onPass(profile.id)}
            disabled={isLoading}
            variant="outline"
            className="flex-1 border-pink-300 text-purple-900 hover:bg-pink-100"
          >
            Pass
          </Button>
          <Button
            onClick={() => onConnect(profile.id)}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
          >
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
