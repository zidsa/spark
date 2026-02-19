import { z } from 'zod/v4';

//
//

export const createExampleSchema = z.object({
  title: z.string().min(3, 'validation:min').max(100, 'validation:max'),
  description: z.string().min(10, 'validation:min').max(500, 'validation:max'),
  email: z.string().email('validation:email'),
});

export type CreateExampleFormData = z.infer<typeof createExampleSchema>;
