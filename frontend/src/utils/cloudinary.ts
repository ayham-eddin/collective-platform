export const getOptimizedCloudinaryUrl = (
  imageUrl: string | undefined,
  width = 1200,
) => {
  if (!imageUrl || !imageUrl.includes("/upload/")) {
    return imageUrl || "";
  }

  return imageUrl.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_limit/`,
  );
};
