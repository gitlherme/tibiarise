import { useQuery } from "@tanstack/react-query";

interface UserCharacter {
  id: string;
  name: string;
  world: string;
}

export const getUserCharacters = async (email: string) => {
  const data = await fetch(`/api/user/${email}/characters`);

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
    refetchOnWindowFocus: true,
    enabled: !!email,
    retry: false,
  });
};
