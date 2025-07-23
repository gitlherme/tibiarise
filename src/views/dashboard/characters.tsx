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

// Types for the character verification process
interface CharacterVerificationState {
  characterName: string;
  verificationCode: string;
  receivedCode: string | null;
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
  // State for the character verification process
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

  // State to hold verified characters.
  // We'll initialize with some mock data to demonstrate the table view.
  // In a real application, this would come from an API call.
  const { data: verifiedCharacters } = useGetUserCharacters(
    session.data?.user?.email || ""
  );

  // State to control whether to show the form or the table
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  // Handler for character name input change
  const handleCharacterNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationState({
      ...verificationState,
      characterName: e.target.value,
      error: null,
    });
  };

  // Handler for verification code input change
  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationState({
      ...verificationState,
      verificationCode: e.target.value,
      error: null,
    });
  };

  // Request verification code from server
  const requestVerificationCode = async () => {
    if (!verificationState.characterName.trim()) {
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

    try {
      // Replace this with your actual API call
      // const response = await api.requestVerificationCode(verificationState.characterName);

      // Simulating API response for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockCode =
        "TIBIA-" + Math.random().toString(36).substring(2, 8).toUpperCase();

      setVerificationState({
        ...verificationState,
        receivedCode: mockCode,
        isCodeRequesting: false,
        currentStep: 1,
      });
    } catch (error) {
      setVerificationState({
        ...verificationState,
        error: "Failed to get verification code. Please try again.",
        isCodeRequesting: false,
      });
    }
  };

  // Submit verification code
  const verifyCharacter = async () => {
    if (!verificationState.verificationCode.trim()) {
      setVerificationState({
        ...verificationState,
        error: "Please enter the verification code",
      });
      return;
    }

    setVerificationState({
      ...verificationState,
      isVerifying: true,
      error: null,
    });

    try {
      // Replace this with your actual API call
      // const response = await api.verifyCharacter(verificationState.characterName, verificationState.verificationCode);

      // Simulating API response for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const isSuccess =
        verificationState.verificationCode === verificationState.receivedCode;

      setVerificationState({
        ...verificationState,
        isVerified: isSuccess,
        isVerifying: false,
        error: isSuccess
          ? null
          : "Invalid verification code. Please try again.",
        currentStep: isSuccess ? 2 : 1,
      });
    } catch (error) {
      setVerificationState({
        ...verificationState,
        error: "Failed to verify character. Please try again.",
        isVerifying: false,
      });
    }
  };

  // Reset the verification process
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

  // Function to render the character verification form
  const renderVerificationForm = () => (
    <>
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Character Verification
        </h1>
        <p className="text-muted-foreground mt-2">
          Link your Tibia character to your account
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
          <span className="text-xs text-muted-foreground">Enter Name</span>
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
          <span className="text-xs text-muted-foreground">Get Code</span>
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
          <span className="text-xs text-muted-foreground">Verify</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {verificationState.currentStep === 0 && "Enter Character Details"}
            {verificationState.currentStep === 1 &&
              "Verify Character Ownership"}
            {verificationState.currentStep === 2 && "Character Verified"}
          </CardTitle>
          <CardDescription>
            {verificationState.currentStep === 0 &&
              "Enter your character name to begin verification"}
            {verificationState.currentStep === 1 &&
              "Enter the verification code to complete verification"}
            {verificationState.currentStep === 2 &&
              `Character ${verificationState.characterName} has been verified`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {verificationState.error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{verificationState.error}</AlertDescription>
            </Alert>
          )}

          {verificationState.isVerified ? (
            <div className="flex flex-col items-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-center text-lg font-medium">
                Character {verificationState.characterName} has been
                successfully verified!
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
                      Character Name
                    </label>
                    <Input
                      id="characterName"
                      placeholder="Enter your character name"
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
                    className="bg-blue-50 text-blue-800 border-blue-200"
                  >
                    <div className="flex flex-col space-y-2">
                      <p className="font-bold">Your verification code:</p>
                      <p className="text-lg font-mono tracking-wider bg-blue-100 p-2 rounded text-center">
                        {verificationState.receivedCode}
                      </p>
                      <p className="text-sm">
                        Log into your Tibia account on Tibia Site and put this
                        code on your character comment to verify ownership.
                      </p>
                    </div>
                  </Alert>

                  <div className="space-y-2 mt-4">
                    <label
                      htmlFor="verificationCode"
                      className="text-sm font-medium"
                    >
                      Verification Code
                    </label>
                    <Input
                      id="verificationCode"
                      placeholder="Enter the verification code"
                      value={verificationState.verificationCode}
                      onChange={handleVerificationCodeChange}
                      disabled={verificationState.isVerifying}
                    />
                  </div>
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
              Back
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
                    "Get Verification Code"
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
                    "Verify Character"
                  )}
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">
            How to verify your character
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Enter your character name and get a verification code</li>
            <li>Log into your Tibia account on site</li>
            <li>Put the verification code inside character comment section</li>
            <li>Click the verify button to complete verification</li>
          </ol>
        </CardContent>
      </Card>
    </>
  );

  // Function to render the table of verified characters
  const renderVerifiedCharactersTable = () => (
    <div className="flex flex-col items-center mb-8 w-fullp">
      <h1 className="text-3xl font-bold tracking-tight">Your Characters</h1>
      <p className="text-muted-foreground mt-2">
        Manage your linked Tibia characters
      </p>

      <Card className="w-full mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg">Verified Characters</CardTitle>
          <Button onClick={resetVerification}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Character
          </Button>
        </CardHeader>
        <CardContent>
          {verifiedCharacters && verifiedCharacters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Character Name</TableHead>
                  <TableHead>Verified On</TableHead>
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
              You haven&apos;t verified any characters yet.
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
