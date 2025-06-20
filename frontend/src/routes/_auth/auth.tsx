import { createFileRoute } from "@tanstack/react-router";

import { CLIENT_ID, REDIRECT_URI } from "@/config";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export const Route = createFileRoute("/_auth/auth")({
  component: AuthComponent,
});

function AuthComponent() {
  const handleSignIn = () => {
    const scope = [
      "email",
      "profile",
      "https://www.googleapis.com/auth/gmail.modify",
    ].join(" ");

    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

    window.location.href = url;
  };

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-md shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Unlock Smarter Email</CardTitle>
          <CardDescription>
            Connect with Google and experience a new level of intelligent, effortless email management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            className="w-full cursor-pointer"
            onClick={handleSignIn}
          >
            <FaGoogle className="size-4" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
};
