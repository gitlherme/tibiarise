"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { getCookie, setCookie } from "cookies-next/client";
import { US, BR } from "country-flag-icons/react/3x2";
import { GlobeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const LanguageSelector = () => {
  const locale = getCookie("NEXT_LOCALE") || "en";
  const router = useRouter();
  const onClick = (value: string) => {
    setCookie("NEXT_LOCALE", value);
    router.push(`/${value}`);
  };
  return (
    <Select onValueChange={onClick} defaultValue={locale}>
      <SelectTrigger>
        <GlobeIcon />
      </SelectTrigger>
      <SelectContent className="min-w-0">
        <SelectGroup>
          <SelectLabel className="pl-2 pr-2">Language</SelectLabel>
          <SelectItem value="en">
            <US title="United States" className="h-4" />
          </SelectItem>
          <SelectItem value="pt">
            <BR title="Brazil" className="h-4" />
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
