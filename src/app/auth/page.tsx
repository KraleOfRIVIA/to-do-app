import SignInButton from "@/lib/auth/signIn-button";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import Image from 'next/image'
import { ModeToggle } from "@/components/theme/theme-toggle";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background p-10 box-border">
      <ModeToggle />
      <div
        className="max-w-[900px] mx-auto mt-10 mb-10 bg-card rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.2)] flex items-center p-12"
      >
        <div className="flex-1 ">
          <h2 className="font-bold mb-8 text-foreground">Sign In</h2>
          <form>
            <div className="mb-4">
              <div className="flex items-center border border-border rounded-md p-2 mb-3 bg-background">
                <span className="mr-2 text-text">
                  <FaUser />
                </span>
                <input
                  type="text"
                  placeholder="Enter Username"
                  className="border-none outline-none flex-1 text-base bg-transparent text-foreground placeholder-muted"
                />
              </div>
              <div className="flex items-center border border-border rounded-md p-2 mb-3 bg-background">
                <span className="mr-2 text-text">
                  <FaLock />
                </span>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="border-none outline-none flex-1 text-base bg-transparent text-foreground placeholder-muted"
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="remember" className="mr-2 accent-primary" />
              <label htmlFor="remember" className="text-sm text-text">Remember Me</label>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-foreground text-foreground hover:text-background border-none rounded-md px-8 py-2 text-base font-medium cursor-pointer mb-2"
            >
              Login
            </button>
          </form>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-muted">Or, Login with</span>
            <SignInButton provider="google" />
            <SignInButton provider="github" />
          </div>
          <div className="text-sm text-muted">
            Don&apos;t have an account? <a href="#" className="text-sidebar-primary no-underline">Create One</a>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/auth.png"
            alt="Sign In Illustration"
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}