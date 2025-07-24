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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  UserCheck,
  PlusCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
  useGetVerificationCode,
} from "@/queries/verify-character.queries";

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

// Type for a verified character
interface VerifiedCharacter {
  id: string;
  name: string;
  verifiedDate: string;
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

  const { data: verifiedCharacters } = useGetUserCharacters(
    session.data?.user?.email || ""
  );

  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const handleCharacterNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationState({
      ...verificationState,
      characterName: e.target.value,
      error: null,
    });
  };

  const createVerificationCode = useGetVerificationCode();
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
      isCodeRequesting: true,
      error: null,
    });

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
  };

  const checkVerificationCode = useCheckVerificationCode();
  const verifyCharacter = async () => {
    setVerificationState({
      ...verificationState,
      isVerifying: true,
      error: null,
    });

    checkVerificationCode.mutate(createVerificationCode.data?.code!, {
      onSuccess: (verificationState) => {
        setVerificationState({
          ...verificationState,
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
          error: error.message || "Failed to verify character",
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

      {/* Step indicator */}
      <div className="flex justify-between mb-8">
        <div className="flex flex-col items-center">
          <Badge
            variant={verificationState.currentStep >= 0 ? "default" : "outline"}
            className="mb-2"
          >
            1
          </Badge>
          <span className="text-xs text-muted-foreground">
            {t("stepsLabels.firstStep")}
          </span>
        </div>
        <div className="grow mx-2 flex items-center">
          <Separator
            className={`h-0.5 ${
              verificationState.currentStep >= 1 ? "bg-primary" : "bg-border"
            }`}
          />
        </div>
        <div className="flex flex-col items-center">
          <Badge
            variant={verificationState.currentStep >= 1 ? "default" : "outline"}
            className="mb-2"
          >
            2
          </Badge>
          <span className="text-xs text-muted-foreground">
            {t("stepsLabels.secondStep")}
          </span>
        </div>
        <div className="grow mx-2 flex items-center">
          <Separator
            className={`h-0.5 ${
              verificationState.currentStep >= 2 ? "bg-primary" : "bg-border"
            }`}
          />
        </div>
        <div className="flex flex-col items-center">
          <Badge
            variant={verificationState.currentStep >= 2 ? "default" : "outline"}
            className="mb-2"
          >
            3
          </Badge>
          <span className="text-xs text-muted-foreground">
            {t("stepsLabels.thirdStep")}
          </span>
        </div>
      </div>

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
                        <p className="text-lg font-mono tracking-wider bg-blue-100 p-2 rounded text-center">
                          {verificationState.receivedCode}
                        </p>
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
                  onClick={requestVerificationCode}
                  disabled={verificationState.isCodeRequesting}
                >
                  {verificationState.isCodeRequesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Requesting Code...
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
                      Verifying...
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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">{t("howToVerify.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>{t("howToVerify.instructions.step1")}</li>
            <li>{t("howToVerify.instructions.step2")}</li>
            <li>{t("howToVerify.instructions.step3")}</li>
            <li>{t("howToVerify.instructions.step4")}</li>
            <li>{t("howToVerify.instructions.step5")}</li>
          </ol>
        </CardContent>
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
