"use client";

import { getClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from 'next/navigation';

interface Profile {
  full_name: string;
  bio: string;
  major: string;
  year_of_study: string;
  study_subjects: string[];
  timezone: string;
  interests: string[];
}

interface ProfileFormProps {
  initialData?: Partial<Profile>;
  onSuccess?: () => void;
}

export function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const [profile, setProfile] = useState<Profile>({
    full_name: initialData?.full_name || "",
    bio: initialData?.bio || "",
    major: initialData?.major || "",
    year_of_study: initialData?.year_of_study || "",
    study_subjects: initialData?.study_subjects || [],
    timezone: initialData?.timezone || "UTC",
    interests: initialData?.interests || [],
  });

  const [subjectInput, setSubjectInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Not authenticated");

      const { error: dbError } = await supabase
        .from("profiles")
        .upsert({
          id: userData.user.id,
          ...profile,
        });

      if (dbError) throw dbError;
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const addSubject = () => {
    if (subjectInput.trim()) {
      setProfile({
        ...profile,
        study_subjects: [...profile.study_subjects, subjectInput.trim()],
      });
      setSubjectInput("");
    }
  };

  const removeSubject = (index: number) => {
    setProfile({
      ...profile,
      study_subjects: profile.study_subjects.filter((_, i) => i !== index),
    });
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      setProfile({
        ...profile,
        interests: [...profile.interests, interestInput.trim()],
      });
      setInterestInput("");
    }
  };

  const removeInterest = (index: number) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className="w-full max-w-2xl bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardHeader>
        <CardTitle className="text-purple-900">Create Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="full_name" className="text-purple-900">
                Full Name
              </Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                required
                className="mt-2 bg-white border-pink-200"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-purple-900">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="Tell other students about yourself..."
                className="mt-2 bg-white border-pink-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="major" className="text-purple-900">
                  Major
                </Label>
                <Input
                  id="major"
                  value={profile.major}
                  onChange={(e) =>
                    setProfile({ ...profile, major: e.target.value })
                  }
                  placeholder="e.g., Computer Science"
                  className="mt-2 bg-white border-pink-200"
                />
              </div>

              <div>
                <Label htmlFor="year_of_study" className="text-purple-900">
                  Year of Study
                </Label>
                <Input
                  id="year_of_study"
                  value={profile.year_of_study}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      year_of_study: e.target.value,
                    })
                  }
                  placeholder="e.g., 2nd Year"
                  className="mt-2 bg-white border-pink-200"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="timezone" className="text-purple-900">
                Timezone
              </Label>
              <Input
                id="timezone"
                value={profile.timezone}
                onChange={(e) =>
                  setProfile({ ...profile, timezone: e.target.value })
                }
                className="mt-2 bg-white border-pink-200"
              />
            </div>

            <div>
              <Label className="text-purple-900">Study Subjects</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Add a subject..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubject();
                    }
                  }}
                  className="bg-white border-pink-200"
                />
                <Button
                  type="button"
                  onClick={addSubject}
                  className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.study_subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="hover:text-purple-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-purple-900">Interests</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="Add an interest..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                  className="bg-white border-pink-200"
                />
                <Button
                  type="button"
                  onClick={addInterest}
                  className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.interests.map((interest, index) => (
                  <div
                    key={index}
                    className="bg-mint-200 text-green-900 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(index)}
                      className="hover:text-green-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
