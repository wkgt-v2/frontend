export const useToken = () => {
  const token = useCookie("x7Qm9PZa", { maxAge: 60 * 60 * 24 * 365.25 });
  const bearer = { Authorization: `Bearer ${token.value}` };
  return { bearer, token };
}
