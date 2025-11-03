export const getRole = (): string | null => {
  if (!localStorage.getItem("user")) return null;
  const user = JSON.parse(localStorage.getItem("user") || "");
  return user.role;
};
