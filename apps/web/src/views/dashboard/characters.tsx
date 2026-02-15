"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HowToVerify } from "@/components/verify-characters/how-to-verify";
import { StepIndicator } from "@/components/verify-characters/step-indicator";
import { useGetCharacterDataByName } from "@/queries/character-data.queries";
import { useGetUserCharacters } from "@/queries/user-data.query";
import {
  useCheckVerificationCode,
  useCreateVerificationCode,
  useUpdateVerificationCode,
} from "@/queries/verify-character.queries";
import { Dialog } from "@radix-ui/react-dialog";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ClipboardIcon,
  Loader2,
  PlusCircle,
  UserCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "sonner";

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

  const { data: verifiedCharacters, isLoading: loadingCharacters } =
    useGetUserCharacters(session.data?.user?.email || "");

  const handleCharacterNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVerificationState({
      ...verificationState,
      characterName: e.target.value,
      error: null,
    });
  };

  const createVerificationCode = useCreateVerificationCode();
  const characterHasOldVerificationCode = useCheckVerificationCode(
    verificationState.characterName || "",
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
          },
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
      },
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
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center mb-8 text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("description")}</p>
      </div>

      <HowToVerify />
      <div className="w-full my-8">
        <StepIndicator verificationState={verificationState} />
      </div>

      {characterExistsModal && (
        <Dialog
          open={characterExistsModal}
          onOpenChange={setCharacterExistsModal}
        >
          <DialogContent className="sm:rounded-[2rem]">
            <DialogTitle>{t("confirmCharacterDialog.title")}</DialogTitle>
            <div className="py-4">
              <p className="text-muted-foreground mb-4">
                {t("confirmCharacterDialog.description")}
              </p>
              {characterData && (
                <div className="bg-muted/50 p-4 rounded-xl border border-border/50 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{characterData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vocation:</span>
                    <span className="font-medium">
                      {characterData.vocation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium">{characterData.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">World:</span>
                    <span className="font-medium">{characterData.world}</span>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={confirmAndRequestCode}
              disabled={createVerificationCode.isPending}
              className="w-full rounded-xl h-12"
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

      <Card className="w-full border-border/50 bg-card/60 backdrop-blur-md shadow-soft rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border/50">
          <CardTitle className="text-xl">
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

        <CardContent className="p-6 md:p-8">
          {verificationState.error && (
            <Alert variant="destructive" className="mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{verificationState.error}</AlertDescription>
            </Alert>
          )}

          {verificationState.isVerified ? (
            <div className="flex flex-col items-center py-6">
              <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <p className="text-center text-xl font-medium text-foreground">
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
                      className="text-sm font-medium ml-1"
                    >
                      {t("steps.firstStep.inputLabel")}
                    </label>
                    <Input
                      id="characterName"
                      placeholder={t("steps.firstStep.inputPlaceholder")}
                      value={verificationState.characterName}
                      onChange={handleCharacterNameChange}
                      disabled={verificationState.isCodeRequesting}
                      className="h-12 rounded-xl bg-background/50 border-border/50"
                    />
                  </div>
                </div>
              )}

              {verificationState.currentStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">
                        {t("steps.secondStep.verificationCodeLabel")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("steps.secondStep.verificationCodeDetails")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-background border border-border rounded-xl p-4 text-center font-mono text-xl tracking-widest select-all">
                        {verificationState.receivedCode}
                      </div>
                      <Button
                        size="icon"
                        className="h-14 w-14 rounded-xl shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            verificationState.receivedCode || "",
                          );
                          toast.info(
                            t("steps.secondStep.verificationCopiedMessage"),
                          );
                        }}
                      >
                        <ClipboardIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter
          className={`bg-muted/20 border-t border-border/50 p-6 flex ${
            verificationState.currentStep === 1
              ? "justify-between"
              : "justify-end"
          }`}
        >
          {verificationState.currentStep === 1 && (
            <Button
              variant="ghost"
              onClick={() =>
                setVerificationState({ ...verificationState, currentStep: 0 })
              }
              disabled={verificationState.isVerifying}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("steps.secondStep.backButton")}
            </Button>
          )}

          {verificationState.isVerified ? (
            <Button
              onClick={resetVerification}
              className="rounded-xl h-12 px-8"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Verify Another Character
            </Button>
          ) : (
            <>
              {verificationState.currentStep === 0 && (
                <Button
                  onClick={requestVerificationCode}
                  disabled={
                    verificationState.isCodeRequesting ||
                    !verificationState.characterName
                  }
                  className="rounded-xl h-12 px-8 shadow-soft-primary hover:glow-primary transition-all duration-300"
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
                  className="rounded-xl h-12 px-8 shadow-soft-primary hover:glow-primary transition-all duration-300"
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
    </div>
  );

  const renderVerifiedCharactersTable = () => (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
          {t("list.title")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("list.description")}</p>
      </div>

      <Card className="w-full border-border/50 bg-card/60 backdrop-blur-md shadow-soft rounded-[2rem] overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20 border-b border-border/50">
          <div>
            <h3 className="text-xl font-bold">{t("list.subtitle")}</h3>
            <p className="text-sm text-muted-foreground">
              Manage your verified characters
            </p>
          </div>
          <Button
            onClick={resetVerification}
            className="rounded-full shadow-soft-primary hover:glow-primary transition-all duration-300"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("list.buttonLabel")}
          </Button>
        </div>

        <div className="p-1">
          {loadingCharacters ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">
                {t("loading") || "Loading characters..."}
              </p>
            </div>
          ) : verifiedCharacters && verifiedCharacters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="pl-6 h-12">
                    {t("list.characterName")}
                  </TableHead>
                  <TableHead className="h-12">
                    {t("list.verifiedDate")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifiedCharacters.map((character) => (
                  <TableRow
                    key={character.name}
                    className="hover:bg-primary/5 border-b border-border/50 transition-colors"
                  >
                    <TableCell className="pl-6 font-medium py-4 text-base">
                      {character.name}
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground">
                      {new Date().toISOString().slice(0, 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center">
                <UserCheck className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-lg font-medium">{t("list.noCharacters")}</p>
                <p className="text-sm text-muted-foreground">
                  Verify a character to see it here
                </p>
              </div>
              <Button
                onClick={resetVerification}
                variant="outline"
                className="mt-4 rounded-xl"
              >
                Verify First Character
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4 min-h-[70vh]">
      {showVerificationForm ||
      (verifiedCharacters && verifiedCharacters.length === 0)
        ? renderVerificationForm()
        : renderVerifiedCharactersTable()}
    </div>
  );
};
