import Link from "next/link";
const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-card">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Page not found
        </p>
        <div className="flex flex-col">
          <Link
            href="/sign-in"
            className="text-primary underline hover:text-primary/90"
          >
            Return to sign in page
          </Link>
          <Link
            href="/dashboard/overview"
            className="text-primary underline hover:text-primary/90"
          >
            Return to Dashboard
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
