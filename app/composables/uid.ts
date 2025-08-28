export const useUid = () => {
  const uid = useCookie("R2k8fYqL", { maxAge: 60 * 60 * 24 * 365.25 });
  return uid;
}
