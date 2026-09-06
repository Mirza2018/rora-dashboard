
export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL;
};

export const getImageUrl = (key: string | undefined): string | null => {
  if (!key) return null; 
  return process.env.NEXT_PUBLIC_IMAGE_URL + key;
};

export const getSocketUrl = () => {
  return process.env.NEXT_PUBLIC_SOCKET_URL;
};
