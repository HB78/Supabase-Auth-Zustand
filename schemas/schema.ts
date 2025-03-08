import { z } from "zod";

// Définition des schémas de validation avec Zod
export const loginSchema = z.object({
  email: z
    .string()
    .email("Format d'email invalide")
    .min(1, "L'email est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const signupSchema = z.object({
  email: z
    .string()
    .email("Format d'email invalide")
    .min(1, "L'email est requis"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /[a-z]/,
      "Le mot de passe doit contenir au moins une lettre minuscule"
    )
    .regex(
      /[A-Z]/,
      "Le mot de passe doit contenir au moins une lettre majuscule"
    )
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Format d'email invalide")
    .min(1, "L'email est requis"),
});

//on fait l'infer ici pour ne pas avoir a le faire dans le component Auth dans Zod
// Types inférés à partir des schémas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
