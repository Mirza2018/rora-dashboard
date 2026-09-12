import LegalContent from "@/components/legal_page/legal_content";

const CallPage = () => {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Legal Contents</h1>
          <p className="text-muted-foreground ">
            Update legal contents of your application from here.
          </p>
        </div>
      </div>

      <LegalContent />
    </main>
  );
};

export default CallPage;
