export const useCompanySettings = () => {
  const companySettings = useState<undefined | Record<string, string>>("companySettings");
  const getCompanySettings = (key: string) => {
    if (!companySettings.value) return key;
    return companySettings.value[key] || key;
  };
  return { companySettings, getCompanySettings };
}
