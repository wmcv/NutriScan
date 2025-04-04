// src/components/GoogleAuth.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Avatar, IconButton } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";

export const isUserSignedIn = async (): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
};

const GoogleAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error logging in:", error.message);
  };

  return (
    <>
      {!user ? (
        <IconButton
          aria-label="Login with Google"
          icon={<FaUserCircle />}
          onClick={handleLogin}
          variant="ghost"
        />
      ) : (
        <IconButton
          aria-label="User Profile"
          icon={<Avatar src={user.user_metadata?.avatar_url} size="sm" />}
          variant="ghost"
          borderRadius="full"
          size="sm"
        />
      )}
    </>
  );
};

export default GoogleAuth;
