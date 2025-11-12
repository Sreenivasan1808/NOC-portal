"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  try {
    const userData = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const response = await axios.post(
      `${process.env.SERVER_URL}/api/auth/login`,
      userData
    );

    const { session }: { session: string } = response.data;

    // Save session cookie
    (await cookies()).set("session", session, {
      httpOnly: true,
      secure: true,
    });

  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      // Backend responded with error (401/400/500)
      const data = err.response?.data as { message?: string } | undefined;
      const message = data?.message ?? "Login failed";
      return { error: message };
    }

    // Network failure, CORS issue, server offline, etc.
    console.error("Unexpected error:", err);
    return { error: "Something went wrong" };
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  try {
    const response = await axios.get(`${process.env.SERVER_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${session}` },
    });
    return response.data.user;
  } catch (err) {
    // session expired or invalid
    console.log(err);
     
    return err;
  }
}

export async function logout() {
  // Destroy the session
  "use server";
  // localStorage.removeItem("user");
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return session;
}
