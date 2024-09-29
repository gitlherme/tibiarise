import { ReactNode } from "react";

type RibbonProps = {
  children: ReactNode;
};

export const Ribbon = ({ children }: RibbonProps) => {
  return <div className="bg-blue-200 w-full p-4 text-center">{children}</div>;
};
