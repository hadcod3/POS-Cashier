"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from 'zod'
import { itemDefaultValues } from "@/constants"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IItem } from "@/lib/database/models/item.model"
import { useUploadThing } from "@/lib/uploadthing"
import VariantManager from "./MenuVariantManager"
import { itemFormSchema } from "@/lib/validator"
import { Label } from "@radix-ui/react-label"
import { Switch } from "../ui/switch"
import { IItemCategory } from "@/lib/database/models/category.model"
import { FormVariant } from "@/types"
import Image from "next/image"

export function MenuForm({ typeForm, data }: { typeForm: "Create" | "Update"; data?: IItem }) {
  const [files, setFiles] = useState<File[]>([])
  const [variants, setVariants] = useState<FormVariant[]>(
    data?.variants?.map(v => ({
      name: v.name,
      options: v.options
    })) || []
  )
  const [categories, setCategories] = useState<IItemCategory[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchData();
  }, []);

  const initialValues = typeForm === 'Update' && data 
    ? {
        ...data,
        category: data.category?._id || ''
      }
    : itemDefaultValues;

  const { startUpload } = useUploadThing('imageUploader')

  const form = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: initialValues
  })

  useEffect(() => {
    if (typeForm === 'Update' && data) {
      form.reset({
        ...data,
        category: data.category?._id || '',
        variants: undefined
      })
    }
  }, [data, typeForm, form])

  async function onSubmit(values: z.infer<typeof itemFormSchema>) {
    let uploadedImageUrl = values.imgUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);
      if (uploadedImages && uploadedImages[0]?.url) {
        uploadedImageUrl = uploadedImages[0].url;
      } else {
        console.error("Image upload failed");
        return;
      }
    }

    const itemData = {
      ...values,
      imgUrl: uploadedImageUrl,
      variants
    };

    try {
      const res = await fetch(
        typeForm === 'Create' ? '/api/items' : `/api/items/${data?._id}`,
        {
          method: typeForm === 'Create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            typeForm === "Create"
              ? itemData
              : { _id: data?._id, ...itemData }
          )
        }
      );

      const resultItem = await res.json();
      if (res.ok) {
        console.log("✅ Submitting data:", itemData);
        form.reset();
        router.push(`/dashboard/menu/${data?._id}`);
      } else {
        console.error(resultItem.message || 'Action failed');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.log("❌ Validation errors:", errors);
      })} 
      className="flex flex-col gap-5"
      >

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input placeholder="Something magical name" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select {...field} className="input-field">
                    <option value="">Select category</option>
                    {categories
                    .filter(cat => cat._id !== "685281b814dee1ddd0b40072")
                    .map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="minOrder"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Minimum Order</FormLabel>
                <FormControl>
                  <div>
                    <Input 
                      type="number" 
                      placeholder="Min. Order"
                      min={1}
                      value={field.value || ''}
                      onChange={e => field.onChange(Number(e.target.value))} 
                     />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price (Rp)</FormLabel>
                <FormControl>
                  <div>
                    <Input 
                      type="number" 
                      placeholder="Price" 
                      min={0}
                      value={field.value || ''}
                      onChange={e => field.onChange(Number(e.target.value))} 
                      className="" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col items-start gap-5 md:flex-row">
          <div className="w-full space-y-2">
            <FormLabel>Item Variants</FormLabel>
            <VariantManager variants={variants} setVariants={setVariants} />
          </div>

          <FormItem className="w-full">
            <FormLabel>Item Image</FormLabel>
            <FormControl>
              <div>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files) setFiles([e.target.files[0]])
                  }} 
                />
                {files.length > 0 && (
                  <Image
                    width={500}
                    height={500} 
                    src={URL.createObjectURL(files[0])} 
                    alt="preview" 
                    className="w-32 h-32 object-cover mt-2 rounded-xl" 
                  />
                )}
              </div>
            </FormControl>
          </FormItem>
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <div className="">
                    <div className="flex items-center space-x-2">
                      <Switch id="stock-toggle" checked={field.value} onCheckedChange={field.onChange} />
                      <Label htmlFor="stock-toggle">
                        {field.value ? "Available" : "Out of Stock"}
                      </Label>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-5 flex-row">
          <div className="w-full">
            <Button 
              type="submit"
              size="lg"
              variant={'destructive'}
              className="w-full"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
          <div className="w-full">
            <Button 
              type="submit"
              size="lg"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? 'Submitting...' : `${typeForm} Menu Item`}
            </Button>
          </div>
        </div>

      </form>
    </Form>
  );
}
