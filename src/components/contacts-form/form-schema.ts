import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name field is required."),
  email: z.string().email("Invalid email address."),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[1-9]\d{1,14}$/.test(val),
      "Phone number must be valid (e.g., +1234567890)"
    ),
  subject: z.string().optional(),
  message: z.string().min(1, "Message field is required."),
  consent: z.boolean().refine((val) => val, "You must agree to proceed"),
});

export type FormSchema = z.infer<typeof formSchema>;
