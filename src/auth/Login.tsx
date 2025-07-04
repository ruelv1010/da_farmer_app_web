import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  return (
    <div className="h-screen w-screen flex relative overflow-hidden">
      {/* Left side - Login Form */}
      <div className="flex-2 flex items-center justify-center">
        <div className="mr-20 w-1/2">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Welcome Back!
            </h1>
          </div>

          <form className="space-y-6">
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

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 rounded-full transition-colors"
            >
              Login
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
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

      {/* Right side - Green Background */}
      <div className="flex-1 bg-green-700 ">{/* Empty green section */}</div>

      {/* Centered Logo - Positioned absolutely to overlap both sections */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <img
          src="/assets/logo_da.png"
          alt="Department of Agriculture Logo"
          className="w-120 h-120 object-contain ml-100"
        />
      </div>
    </div>
  );
}
