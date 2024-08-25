"use client";

import { useGetExperienceByWorld } from "@/queries/by-world.query";

function parseData(
  data: string
): { name: string; level: number; expChange: number; vocation: string }[] {
  console.log(data);
  // Split the data into lines
  const lines = data.split("\n");

  // Remove the header lines
  const dataLines = lines.slice(5);

  // Parse each line and create an object
  const parsedData: {
    name: string;
    level: number;
    expChange: number;
    vocation: string;
  }[] = [];

  dataLines.forEach((line) => {
    const [id, name, levelString, expChangeString, time, vocation] =
      line.split(" ");

    const level = parseInt(levelString);
    const expChange = expChangeString
      ? parseInt(expChangeString.replace(/,/g, ""))
      : 0; // Use a global regex to replace all commas

    // Create the object
    parsedData.push({ name, level, expChange, vocation });
  });

  return parsedData;
}

export default function World() {
  const { data } = useGetExperienceByWorld();
  let parsedData;
  if (data) {
    parsedData = parseData(data as string);
  }

  return <div>{JSON.stringify(parsedData, null, 2)}</div>;
}
