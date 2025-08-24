export const useToken = () => {
  const token = useCookie("token", { maxAge: 60 * 60 * 24 * 365.25 });
  return token;
}
