import { useState } from "react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

;

export default function LoginForm() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState(false);
  const [validation] = useState("");
  const [isLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // your login logic here...
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side: login form */}
      <div className="flex flex-col justify-center flex-1 bg-[#F4F6FF] p-8 md:p-16">
        <div className="max-w-[400px] w-full mx-auto">
          <h2 className="text-lg text-center mb-6 font-semibold">
            Welcome Back!
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {validation && (
              <div
                className={`rounded-md p-3 text-center text-sm ${
                  error
                    ? "bg-red-50 text-red-500"
                    : "bg-green-50 text-green-800"
                }`}
              >
                {validation}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-900 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center text-sm text-[#333]">
              Forgot Password?{" "}
              <a href="/forgot-password" className="underline text-green-800">
                Click Here
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Right side: green background with logo */}
      <div className="hidden md:flex flex-1 justify-center items-center bg-green-900 relative">
        <img
          src="/assets/logo_da.png"
          alt="Department of Agriculture Logo"
          className="w-80 h-80 object-contain"
        />
      </div>
    </div>
  );
}
