"use server";

import { login } from "@/lib/auth";

export async function loginAction(prevState: { success: boolean; error?: string },formData: FormData) {
  const res = await login(formData);
  const error = res?.error;

  if (error) {
    return { success: false, error };
  }

  // success → return flag
  return { success: true };
}
