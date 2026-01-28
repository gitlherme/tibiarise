import { useQuery } from "@tanstack/react-query";
import { getCharacterData } from "./character-data.queries";
import { CompareCharacters } from "@/models/compare-characters.model";

interface UseCompareCharactersProps {
  firstCharacter: string;
  secondCharacter: string;
}

const getCompareCharactersData = async (
  firstCharacter: string,
  secondCharacter: string
) => {
  const firstCharacterData = await getCharacterData(firstCharacter);
  const secondCharacterData = await getCharacterData(secondCharacter);

  return {
    firstCharacter: firstCharacterData,
    secondCharacter: secondCharacterData,
  };
};

export const useCompareCharacters = ({
  firstCharacter,
  secondCharacter,
}: UseCompareCharactersProps) => {
  return useQuery<CompareCharacters>({
    queryKey: [
      "compareCharacters",
      firstCharacter?.toLowerCase(),
      secondCharacter?.toLowerCase(),
    ],
    queryFn: () =>
      getCompareCharactersData(
        String(firstCharacter).toLowerCase(),
        String(secondCharacter).toLowerCase()
      ),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!firstCharacter && !!secondCharacter,
    retry: false,
  });
};
