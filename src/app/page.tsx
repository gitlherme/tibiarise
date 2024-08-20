"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { searchBarSchema } from "./schemas/search-bar";

const formSchema = searchBarSchema;

export default function Home() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: any) => {
    router.push(`/character/${data.name}`);
  };

  return (
    <div className="w-full h-[80vh] flex flex-col justify-center items-center gap-12">
      <h2 className="text-3xl md:text-5xl font-black text-center">
        Track your Tibia Character
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-3/6 flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Character name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your character name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Search</Button>
        </form>
      </Form>
    </div>
  );
}
