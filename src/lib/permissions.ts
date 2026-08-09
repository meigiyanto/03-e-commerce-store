export function isAdmin(
  role?: string
) {
  return role === "ADMIN";
}

export function isUser(
  role?: string
) {
  return role === "USER";
}