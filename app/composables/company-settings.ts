export const useCompanySettings = () => {
  const companySettings = useState<Record<string, string>>("companySettings");
  const getCompanySettings = (key: string) => {
    return companySettings.value[key] || key;
  };
  return { companySettings, getCompanySettings };
}
