export default async (url: string, fileName: string, fileType?: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], fileName, { type: fileType || blob.type });
}
