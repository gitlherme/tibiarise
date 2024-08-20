"use client";

import {
  HydrationBoundary,
  dehydrate,
  useQueryClient,
} from "@tanstack/react-query";

interface HydrationBoundaryCustomProps {
  children: React.ReactNode;
}

export const HydrationBoundaryCustom = ({
  children,
}: HydrationBoundaryCustomProps) => {
  const queryClient = useQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};
