"use client";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetWorlds } from "@/queries/worlds.query";
import { useRouter, useSearchParams } from "next/navigation";
import { ByWorldFilter } from "@/models/experience-by-world.model";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  filter: z.enum(["DAY", "WEEK", "MONTH"]),
});

export const SearchBarExperienceByWorld = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: searchParams.get("world") || "",
      filter: "DAY",
    },
  });

  const onSubmit = (data: any) => {
    router.push(
      `/world?world=${data.name}&filter=${ByWorldFilter[data.filter]}`
    );
  };

  const { data, isLoading: worldsIsLoading } = useGetWorlds();

  return worldsIsLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={`flex flex-col justify-center items-center`}>
      <h1 className="text-4xl bold mb-4">Experience By World</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-3/6 flex items-end gap-4"
        >
          <div className="flex gap-4 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-3/4">
                  <FormLabel>World</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="World" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.worlds.map((world) => (
                        <SelectItem key={world} value={world}>
                          {world}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filter"
              render={({ field }) => (
                <FormItem className="w-1/4">
                  <FormLabel>Filter</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Yesterday" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DAY">Yesterday</SelectItem>
                      <SelectItem value="WEEK">Last week</SelectItem>
                      <SelectItem value="MONTH">Last month</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">
            <SearchIcon aria-label="Search" />
          </Button>
        </form>
      </Form>
    </div>
  );
};
