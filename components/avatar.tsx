type AvatarProps = {
  name: string;
};

export function Avatar({ name }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="w-8 h-8 rounded bg-[#126F4C] text-white flex items-center justify-center font-semibold text-sm">
      {initial}
    </div>
  );
}
