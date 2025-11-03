import axios from "axios";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  "use server";
  // Verify credentials && get the user

  const userData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const response = await axios.post(process.env.SERVER_URL || "", userData);

  if(response.status == 400){
    return {error: response.data.message};
  }

  // Create the session
  const { user, session }: { user: object; session: string } = response.data;

  //save user data in localstorage
  localStorage.setItem("user", JSON.stringify(user));

  // Save the session in a cookie
  (await cookies()).set("session", session, { httpOnly: true });
}

export async function logout() {
  // Destroy the session
  localStorage.removeItem("user");
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return session;
}

export const getRole = (): string | null => {
  if (!localStorage.getItem("user")) return null;
  const user = JSON.parse(localStorage.getItem("user") || "");
  return user.role;
};
