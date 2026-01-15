import { SignInButton } from "@clerk/clerk-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to SmartCare Flow
        </h1>

        <SignInButton>
          <button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition">
            Sign In
          </button>
        </SignInButton>
      </div>
    </div>
  );
};

export default LandingPage;
