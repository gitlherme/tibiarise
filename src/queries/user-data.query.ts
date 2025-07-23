import { useQuery } from "@tanstack/react-query";

interface UserCharacter {
  id: string;
  name: string;
}

export const getUserCharacters = async (email: string) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/user/${email}/characters`
  );

  if (!data.ok) {
    throw new Error("Failed to fetch user characters");
  }

  const characters = await data.json();
  return characters;
};

export const useGetUserCharacters = (email: string) => {
  return useQuery<UserCharacter[]>({
    queryKey: ["user", email, "characters"],
    queryFn: () => getUserCharacters(email),
    gcTime: 1000 * 60 * 60 * 12, // 12 hours
    enabled: !!email,
    retry: false,
  });
};
