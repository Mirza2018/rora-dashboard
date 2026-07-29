import ProfileSecurity from "@/components/setting_page/profile_security";

const CallPage = () => {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground ">
            Manage your profile and security preferences
          </p>
        </div>
      </div>

      <ProfileSecurity />
    </main>
  );
};

export default CallPage;
