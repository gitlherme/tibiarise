import { ReactNode } from "react";

type RibbonProps = {
  children: ReactNode;
  enabled?: boolean;
};

export const Ribbon = ({ children, enabled = false }: RibbonProps) => {
  return (
    enabled && (
      <div className="bg-blue-200 w-full p-4 text-center">{children}</div>
    )
  );
};
