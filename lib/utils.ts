import { clsx, type ClassValue } from "clsx"
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0, 
  }).format(price)

  return formattedPrice
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export function handleError(error: unknown) {
  if (error instanceof Error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
