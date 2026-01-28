import { useMutation, useQuery } from "@tanstack/react-query";

interface VerificationCode {
  code: string;
}

interface CreateVerificationCodeParams {
  email: string;
  characterName: string;
}

export const createVerificationCode = async ({
  email,
  characterName,
}: CreateVerificationCodeParams) => {
  const data = await fetch(`/api/verify-character`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: email, characterName }),
  });

  if (!data.ok) {
    throw new Error("Failed to create verification code");
  }

  const code = await data.json();
  return code;
};

export const checkVerificationCode = async (characterName: string) => {
  const data = await fetch(`/api/verify-character/${characterName}`, {
    method: "GET",
  });

  const res: VerificationCode = await data.json();

  if (!data.ok) {
    throw new Error("User doesn't have a verification code");
  }

  return res;
};

export const updateVerificationCode = async (code: string) => {
  const data = await fetch(`/api/verify-character/${code}`, {
    method: "PUT",
  });

  if (!data.ok) {
    throw new Error("Failed to verify code");
  }

  const response = await data.json();
  return response;
};

export const useCreateVerificationCode = () => {
  return useMutation<VerificationCode, Error, CreateVerificationCodeParams>({
    mutationKey: ["user", "verification"],
    mutationFn: ({ email, characterName }) =>
      createVerificationCode({ email, characterName }),
    retry: false,
  });
};

export const useCheckVerificationCode = (characterName: string) => {
  return useQuery({
    queryKey: ["user", "verificationCheck", characterName],
    queryFn: () => checkVerificationCode(characterName),
    retry: false,
  });
};

export const useUpdateVerificationCode = () => {
  return useMutation<{ message: string }, Error, string>({
    mutationKey: ["user", "verification"],
    mutationFn: (code: string) => updateVerificationCode(code),
    retry: false,
  });
};
