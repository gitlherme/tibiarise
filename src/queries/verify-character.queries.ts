import { useMutation } from "@tanstack/react-query";

interface VerificationCode {
  code: string;
}

interface GetVerificationCodeParams {
  email: string;
  characterName: string;
}

export const getVerificationCode = async ({
  email,
  characterName,
}: GetVerificationCodeParams) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/verify-character`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: email, characterName }),
    }
  );

  if (!data.ok) {
    throw new Error("Failed to create verification code");
  }

  const code = await data.json();
  return code;
};

export const checkVerificationCode = async (code: string) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/verify-character/${code}`,
    {
      method: "PATCH",
    }
  );

  if (!data.ok) {
    throw new Error("Failed to verify code");
  }

  const response = await data.json();
  return response;
};

export const useGetVerificationCode = () => {
  return useMutation<VerificationCode, Error, GetVerificationCodeParams>({
    mutationKey: ["user", "verification"],
    mutationFn: ({ email, characterName }) =>
      getVerificationCode({ email, characterName }),
    retry: false,
  });
};

export const useCheckVerificationCode = () => {
  return useMutation<{ message: string }, Error, string>({
    mutationKey: ["user", "verification"],
    mutationFn: (code: string) => checkVerificationCode(code),
    retry: false,
  });
};
