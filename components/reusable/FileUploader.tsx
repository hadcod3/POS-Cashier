'use client'

import { useCallback, Dispatch, SetStateAction } from 'react'
import type { FileWithPath } from 'react-dropzone'
import { useDropzone } from 'uploadthing/react'
import { generateClientDropzoneAccept } from 'uploadthing/client'
import { Button } from '@/components/ui/button'
import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'

type FileUploaderProps = {
  onFieldChange: (url: string) => void
  imageUrl: string
  setFiles: Dispatch<SetStateAction<File[]>>
  setHeightImg: string
  setWidthImg: string
}

export function FileUploader({ 
  imageUrl, 
  onFieldChange, 
  setFiles, 
  setHeightImg, 
  setWidthImg 
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles)
    onFieldChange(convertFileToUrl(acceptedFiles[0]))
  }, [setFiles, onFieldChange]) 


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/*']),
  })

  return (
    <div
      {...getRootProps()}
      className={`flex-center bg-dark-3 flex ${setWidthImg} ${setHeightImg} cursor-pointer flex-col overflow-hidden border border-gray-200 bg-gray-50 rounded-2xl shadow-sm`}
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center">
          <Image
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <Image src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  )
}