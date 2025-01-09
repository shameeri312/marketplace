// sign in schema
import { z } from 'zod';

export const loginInSchema = z.object({
  email: z.string(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});
