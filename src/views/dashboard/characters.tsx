"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  UserCheck,
  PlusCircle,
  ClipboardIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUserCharacters } from "@/queries/user-data.query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  useCheckVerificationCode,
  useCreateVerificationCode,
  useUpdateVerificationCode,
} from "@/queries/verify-character.queries";
import { toast } from "sonner";
import { StepIndicator } from "@/components/verify-characters/step-indicator";
import { HowToVerify } from "@/components/verify-characters/how-to-verify";
import { useGetCharacterDataByName } from "@/queries/character-data.queries";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";

// Types for the character verification process
interface CharacterVerificationState {
  characterName?: string;
  verificationCode?: string;
  receivedCode?: string | null;
  isVerifying: boolean;
  isCodeRequesting: boolean;
  isVerified: boolean;
  error: string | null;
  currentStep: number;
}

export const CharactersView: React.FC = () => {
  const t = useTranslations("Dashboard.VerifyCharacterPage");
  const session = useSession();
  const [verificationState, setVerificationState] =
    useState<CharacterVerificationState>({
      characterName: "",
      verificationCode: "",
      receivedCode: null,
      isVerifying: false,
      isCodeRequesting: false,
      isVerified: false,
      error: null,
      currentStep: 0,
    });

  const [characterExistsModal, setCharacterExistsModal] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const { data: verifiedCharacters } = useGetUserCharacters(
    session.data?.user?.email || ""
  );

  const handleCharacterNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationState({
      ...verificationState,
      characterName: e.target.value,
      error: null,
    });
  };

  const createVerificationCode = useCreateVerificationCode();
  const characterHasOldVerificationCode = useCheckVerificationCode(
    verificationState.characterName || ""
  );

  const { data: characterData, refetch: characterDataRefetch } =
    useGetCharacterDataByName(verificationState.characterName || "");

  const requestVerificationCode = async () => {
    if (!verificationState.characterName?.trim()) {
      setVerificationState({
        ...verificationState,
        error: "Please enter a character name",
      });
      return;
    }

    setVerificationState({
      ...verificationState,
      isCodeRequesting: true, // Começa a requestar o código (inclui a busca de dados do char)
      error: null,
    });

    try {
      const { data: fetchedCharacterData } = await characterDataRefetch();
      if (fetchedCharacterData) {
        setCharacterExistsModal(true);
        setVerificationState((prevState) => ({
          ...prevState,
          isCodeRequesting: false,
        }));
      } else {
        const { data: oldCodeData } =
          await characterHasOldVerificationCode.refetch();

        if (oldCodeData?.code) {
          setVerificationState({
            ...verificationState,
            receivedCode: oldCodeData.code,
            isCodeRequesting: false,
            currentStep: 1,
          });
          setShowVerificationForm(true);
          return;
        }

        createVerificationCode.mutate(
          {
            email: session.data?.user?.email || "",
            characterName: verificationState.characterName.trim(),
          },
          {
            onSuccess: (data) => {
              setVerificationState({
                ...verificationState,
                verificationCode: "",
                receivedCode: data.code,
                isCodeRequesting: false,
                currentStep: 1,
              });
              setShowVerificationForm(true);
            },
            onError: (error) => {
              setVerificationState({
                ...verificationState,
                error: error.message || "Failed to get verification code",
                isCodeRequesting: false,
              });
            },
          }
        );
      }
    } catch (error: any) {
      setVerificationState({
        ...verificationState,
        error: error.message || "Failed to fetch character data",
        isCodeRequesting: false,
      });
    }
  };

  const confirmAndRequestCode = async () => {
    setCharacterExistsModal(false);
    setVerificationState((prevState) => ({
      ...prevState,
      isCodeRequesting: true,
    }));

    const { data: oldCodeData } =
      await characterHasOldVerificationCode.refetch();

    if (oldCodeData?.code) {
      setVerificationState({
        ...verificationState,
        receivedCode: oldCodeData.code,
        isCodeRequesting: false,
        currentStep: 1,
      });
      setShowVerificationForm(true);
      return;
    }

    createVerificationCode.mutate(
      {
        email: session.data?.user?.email || "",
        characterName: verificationState.characterName?.trim() || "",
      },
      {
        onSuccess: (data) => {
          setVerificationState({
            ...verificationState,
            verificationCode: "",
            receivedCode: data.code,
            isCodeRequesting: false,
            currentStep: 1,
          });
          setShowVerificationForm(true);
        },
        onError: (error) => {
          setVerificationState({
            ...verificationState,
            error: error.message || "Failed to get verification code",
            isCodeRequesting: false,
          });
        },
      }
    );
  };

  const updateVerificationCode = useUpdateVerificationCode();
  const verifyCharacter = async () => {
    setVerificationState({
      ...verificationState,
      isVerifying: true,
      error: null,
    });

    updateVerificationCode.mutate(verificationState.receivedCode!, {
      onSuccess: (data) => {
        setVerificationState({
          ...verificationState, // Keep existing state, but update specific fields
          verificationCode: "",
          isVerified: true,
          isVerifying: false,
          error: null,
          currentStep: 2,
          isCodeRequesting: false,
        });
        setShowVerificationForm(false); // Hide the form after successful verification
      },
      onError: (error) => {
        setVerificationState({
          ...verificationState,
          isVerifying: false,
          error: t("errors.verificationFailed"),
        });
      },
    });
  };

  const resetVerification = () => {
    setVerificationState({
      characterName: "",
      verificationCode: "",
      receivedCode: null,
      isVerifying: false,
      isCodeRequesting: false,
      isVerified: false,
      error: null,
      currentStep: 0,
    });
    setShowVerificationForm(true); // Show the form when resetting to add another
  };

  const renderVerificationForm = () => (
    <>
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-2 text-center">
          {t("description")}
        </p>
      </div>

      <HowToVerify />
      <StepIndicator verificationState={verificationState} />

      {characterExistsModal && (
        <Dialog
          open={characterExistsModal}
          onOpenChange={setCharacterExistsModal}
        >
          <DialogContent>
            <DialogTitle>{t("confirmCharacterDialog.title")}</DialogTitle>
            <div>
              {t("confirmCharacterDialog.description")}
              {characterData && (
                <div className="flex flex-col my-4 text-foreground">
                  <span>Name: {characterData.name}</span>
                  <span>Vocation: {characterData.vocation}</span>
                  <span>Level: {characterData.level}</span>
                  <span>World: {characterData.world}</span>
                </div>
              )}
            </div>
            <Button
              onClick={confirmAndRequestCode}
              disabled={createVerificationCode.isPending}
            >
              {createVerificationCode.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("buttons.requestingCode")}
                </>
              ) : (
                t("confirmCharacterDialog.confirm")
              )}
            </Button>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {verificationState.currentStep === 0 && t("steps.firstStep.title")}
            {verificationState.currentStep === 1 && t("steps.secondStep.title")}
            {verificationState.currentStep === 2 && t("steps.thirdStep.title")}
          </CardTitle>
          <CardDescription>
            {verificationState.currentStep === 0 &&
              t("steps.firstStep.description")}
            {verificationState.currentStep === 1 &&
              t("steps.secondStep.description")}
            {verificationState.currentStep === 2 &&
              t("steps.thirdStep.description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {verificationState.error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{verificationState.error}</AlertDescription>
            </Alert>
          )}

          {verificationState.isVerified ? (
            <div className="flex flex-col items-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-center text-lg font-medium">
                {t("steps.thirdStep.successMessage")}
              </p>
            </div>
          ) : (
            <>
              {verificationState.currentStep === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="characterName"
                      className="text-sm font-medium"
                    >
                      {t("steps.firstStep.inputLabel")}
                    </label>
                    <Input
                      id="characterName"
                      placeholder={t("steps.firstStep.inputPlaceholder")}
                      value={verificationState.characterName}
                      onChange={handleCharacterNameChange}
                      disabled={verificationState.isCodeRequesting}
                    />
                  </div>
                </div>
              )}

              {verificationState.currentStep === 1 && (
                <div className="space-y-4">
                  <Alert
                    variant="default"
                    className="bg-blue-50 text-blue-800 border-blue-200 space-y-2"
                  >
                    <AlertTitle>
                      {t("steps.secondStep.verificationCodeLabel")}
                    </AlertTitle>
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-lg w-7/8 font-mono tracking-wider bg-blue-100 p-2 rounded text-center">
                            {verificationState.receivedCode}
                          </p>
                          <Button
                            className="w-1/8 py-6"
                            variant="default"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                verificationState.receivedCode || ""
                              );

                              toast.info(
                                t("steps.secondStep.verificationCopiedMessage")
                              );
                            }}
                          >
                            <ClipboardIcon size={24} />
                          </Button>
                        </div>
                        <p className="text-sm">
                          {t("steps.secondStep.verificationCodeDetails")}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter
          className={`flex ${
            verificationState.currentStep === 1
              ? "justify-between"
              : "justify-end"
          }`}
        >
          {verificationState.currentStep === 1 && (
            <Button
              variant="outline"
              onClick={() =>
                setVerificationState({ ...verificationState, currentStep: 0 })
              }
              disabled={verificationState.isVerifying}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("steps.secondStep.backButton")}
            </Button>
          )}

          {verificationState.isVerified ? (
            <Button onClick={resetVerification}>
              <UserCheck className="mr-2 h-4 w-4" />
              Verify Another Character
            </Button>
          ) : (
            <>
              {verificationState.currentStep === 0 && (
                <Button
                  onClick={requestVerificationCode} // Chama a função que gerencia a busca e o modal
                  disabled={
                    verificationState.isCodeRequesting ||
                    !verificationState.characterName
                  }
                >
                  {verificationState.isCodeRequesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("buttons.requestingCode")}
                    </>
                  ) : (
                    t("steps.firstStep.buttonLabel")
                  )}
                </Button>
              )}

              {verificationState.currentStep === 1 && (
                <Button
                  onClick={verifyCharacter}
                  disabled={verificationState.isVerifying}
                >
                  {verificationState.isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("buttons.verifyingButtonLabel")}
                    </>
                  ) : (
                    t("steps.secondStep.buttonLabel")
                  )}
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );

  const renderVerifiedCharactersTable = () => (
    <div className="flex flex-col items-center mb-8 w-fullp">
      <h1 className="text-3xl font-bold tracking-tight">{t("list.title")}</h1>
      <p className="text-muted-foreground mt-2">{t("list.description")}</p>

      <Card className="w-full mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg">{t("list.subtitle")}</CardTitle>
          <Button onClick={resetVerification}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("list.buttonLabel")}
          </Button>
        </CardHeader>
        <CardContent>
          {verifiedCharacters && verifiedCharacters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("list.characterName")}</TableHead>
                  <TableHead>{t("list.verifiedDate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifiedCharacters.map((character) => (
                  <TableRow key={character.name}>
                    <TableCell className="font-medium">
                      {character.name}
                    </TableCell>
                    <TableCell>
                      {new Date().toISOString().slice(0, 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {t("list.noCharacters")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      {showVerificationForm ||
      (verifiedCharacters && verifiedCharacters.length === 0)
        ? renderVerificationForm()
        : renderVerifiedCharactersTable()}
    </div>
  );
};
