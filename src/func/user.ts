export const getAvatarInitials = (profileData) => {
  if (profileData?.name) {
    return profileData.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  }
  return "U";
};
