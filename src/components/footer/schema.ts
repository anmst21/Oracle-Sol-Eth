import { z } from "zod";

export const subscribeFormSchema = z.object({
  email: z.string().email("Invalid email address."),
});

export type SubscribeFormSchema = z.infer<typeof subscribeFormSchema>;
