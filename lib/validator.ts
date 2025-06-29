import * as z from 'zod'

export const itemFormSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  imgUrl: z.string(),

  price: z.number().int().positive(),

  stock: z.boolean(),

  minOrder: z.number()
    .int("Must be a whole number")
    .min(1, "Minimum order must be at least 1")
    .positive(),

  category: z.string()
    .nonempty("Category is required"),

  variants: z
  .array(
    z.object({
      name: z.string().min(1, 'Variant name is required'),
      options: z.array(
        z.object({
          label: z.string().min(1, 'Option label is required'),
          price: z.number().int().positive(),
        })
      ).min(1, 'At least one option is required'),
    })
  )
  .optional()
});

