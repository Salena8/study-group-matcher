import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
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

  return (
    <div className="min-h-svh w-full flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-pink-100 via-purple-100 to-mint-100">
      <div className="w-full">
        <ProfileForm
          initialData={{
            full_name: profile.full_name,
            bio: profile.bio,
            major: profile.major,
            year_of_study: profile.year_of_study,
            study_subjects: profile.study_subjects || [],
            timezone: profile.timezone,
            interests: profile.interests || [],
          }}
          onSuccess={() => {
            // Redirect handled by component
          }}
        />
      </div>
    </div>
  );
}
