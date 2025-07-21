"use effect";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner"; // Opcional: Se você usa Sonner para toasts

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

// --- Interfaces (Importe de seu arquivo de tipos, ex: '@/types/index') ---
interface Character {
  id: string;
  name: string;
}

interface CreateProfitEntryDto {
  characterId: string;
  profit: number;
  preyCardsUsed: number;
  boostsUsed: number;
  huntDate?: string; // Opcional, se o usuário puder informar uma data passada
}

// --- Esquema de Validação com Zod ---
const formSchema = z.object({
  characterId: z.string().min(1, { message: "Selecione um personagem." }),
  profit: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, { message: "Lucro não pode ser negativo." })
  ),
  preyCardsUsed: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z
      .number()
      .min(0, { message: "Número de prey cards inválido." })
      .max(999, { message: "Valor muito alto." })
  ),
  boostsUsed: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z
      .number()
      .min(0, { message: "Número de boosts inválido." })
      .max(4, { message: "Máximo de 4 boosts por hunt." })
  ),
  huntDate: z.string().optional(), // Ou z.string().datetime() se for obrigatório
});

// --- Props do Componente de Formulário ---
interface ProfitEntryFormProps {
  characters: Character[]; // Lista de personagens para o Select
  selectedCharacterId: string | null; // Personagem atualmente selecionado
  onCharacterChange: (characterId: string) => void; // Callback para quando o personagem é alterado
}

// --- Componente de Formulário ---
export function ProfitEntryForm({
  characters,
  selectedCharacterId,
  onCharacterChange,
}: ProfitEntryFormProps) {
  const queryClient = useQueryClient();

  // 1. Definição do Formulário com React Hook Form e Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      characterId: selectedCharacterId || "",
      profit: 0,
      preyCardsUsed: 0,
      boostsUsed: 0,
      huntDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (selectedCharacterId) {
      form.setValue("characterId", selectedCharacterId);
    }
  }, [selectedCharacterId, form]);

  const createProfitEntryMutation = useMutation({
    mutationFn: (entryData: CreateProfitEntryDto) =>
      axios.post("/api/profit-entries", entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profitEntries", selectedCharacterId],
      });
      toast.success("Hunt registrada com sucesso!");
      form.reset({
        characterId: selectedCharacterId || "",
        profit: 0,
        preyCardsUsed: 0,
        boostsUsed: 0,
        huntDate: new Date().toISOString().split("T")[0],
      });
    },
    onError: (error: any) => {
      console.error("Erro ao registrar hunt:", error);
      toast.error(
        error.response?.data?.message ||
          "Erro ao registrar hunt. Tente novamente."
      );
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createProfitEntryMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 flex flex-col"
      >
        <FormField
          control={form.control}
          name="characterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personagem</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value); // Atualiza o React Hook Form
                  onCharacterChange(value); // Notifica o componente pai
                }}
                defaultValue={field.value}
                value={field.value} // Garante que o select exibe o valor correto
                disabled={!characters || characters.length === 0} // Desabilita se não houver personagens
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um personagem" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {characters.map((char) => (
                    <SelectItem key={char.id} value={char.id}>
                      {char.name}
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
          name="profit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lucro Bruto (Gold Coins)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preyCardsUsed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prey Cards Utilizadas</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="boostsUsed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor de Boost Nesta Hunt</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="huntDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Hunt</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createProfitEntryMutation.isPending || !selectedCharacterId}
        >
          {createProfitEntryMutation.isPending
            ? "Registrando..."
            : "Registrar Hunt"}
        </Button>
      </form>
    </Form>
  );
}
