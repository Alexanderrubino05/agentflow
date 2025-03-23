import { generateSeededHexColor } from "@/lib/utils";
import nameInitials from "name-initials";

const ProfileImage = ({ name }: { name: string }) => {
  const backgroundColor = generateSeededHexColor(name);

  return (
    <div
      className="rounded-full flex justify-center items-center w-8 h-8 text-white"
      style={{ backgroundColor }}
    >
      {nameInitials(name)}
    </div>
  );
};

export default ProfileImage;
