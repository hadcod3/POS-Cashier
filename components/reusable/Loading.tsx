'use client'

import { HashLoader } from 'react-spinners'

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full ">
      <HashLoader color="#D0D0D0" size={60} />
    </div>
  )
}

export default Loading
