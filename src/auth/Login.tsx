import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Mobile-only logo (placed above title) */}
      <div className="md:hidden flex justify-center mt-6">
        <img
          src="/assets/logo_da.png"
          alt="Department of Agriculture Logo"
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Desktop logo overlapping */}
          <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <img
              src="/assets/logo_da.png"
              alt="Department of Agriculture Logo"
              className="w-48 h-48 object-contain"
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome Back!
            </h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Username:
              </Label>
              <Input
                id="username"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-full bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password:
              </Label>
              <Input
                id="password"
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-full bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 rounded-full transition-colors"
            >
              Login
            </Button>
          </form>

          {/* Forgot password */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Forgot Password?{" "}
              <a
                href="/forgot-password"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Click Here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Green Background (desktop only) */}
      <div className="hidden md:flex w-1/2 bg-green-700" />
    </div>
  );
}
