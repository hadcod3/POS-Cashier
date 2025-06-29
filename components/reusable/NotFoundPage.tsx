import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const NotFoundPage = () => {
  const router = useRouter()
  return (
    <div className='absolute top-0 left-0 w-screen h-screen max-h-screen flex justify-center bg-zinc-100 dark:bg-zinc-950 z-40 overflow-hidden'>
        <div className='absolute w-full h-full flex-center -z-10'>
          <h1 className='text-9xl md:scale-200 lg:scale-400 font-extrabold text-zinc-800 dark:text-zinc-400'>404</h1>
        </div>
        <Button className="btn-large" onClick={() => router.push('/sign-in')}>Sign In</Button>
        <div className='absolute -bottom-4 w-full flex-col'>
          <div className='relative flex-center w-full h-24 lg:h-28 pb-4'>
            <div className='absolute w-full h-full border-t-0.05 border-zinc-50/40 backdrop-blur-lg bg-gradient-to-b from-transparent dark:from-zinc-200/20 to-zinc-300 dark:to-zinc-900'/>
            <h1 className='text-zinc-950 dark:text-zinc-100 z-30 text-center px-10'>The page you’re looking for is playing hide and seek. Spoiler: It won.</h1>
          </div>
          <div className='relative w-full h-20 lg:h-24'>
            <div className='absolute -top-4 w-full h-full border-t-0.05 border-zinc-50/40 backdrop-blur-lg bg-gradient-to-b from-transparent dark:from-zinc-200/20 to-zinc-300 dark:to-zinc-900'/>
          </div>
          <div className='relative w-full h-20 lg:h-24'>
            <div className='absolute -top-4 w-full h-full border-t-0.05 border-zinc-50/40 backdrop-blur-lg bg-gradient-to-b from-transparent dark:from-zinc-200/20 to-zinc-300 dark:to-zinc-900'/>
          </div>
          <div className='relative w-full h-20 lg:h-24'>
            <div className='absolute -top-4 w-full h-full border-t-0.05 border-zinc-50/40 backdrop-blur-lg bg-gradient-to-b from-transparent dark:from-zinc-200/20 to-zinc-300 dark:to-zinc-900'/>
          </div>
        </div>
    </div>
  )
}

export default NotFoundPage