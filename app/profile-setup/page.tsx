import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { ProfileForm } from "@/components/profile-form";

export default async function ProfileSetupPage() {
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

  return (
    <div className="min-h-svh w-full flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-pink-100 via-purple-100 to-mint-100">
      <ProfileForm initialData={profile || undefined} />
    </div>
  );
}
