import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const page = () => {

  const { user } = useUser();
  // const fecthSavedJobs = async () => {
  //   try {
  // }
  // // useEffect(() => {

  // // }, [])
  return (
    <div className='w-full h-full p-2'>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 ">

      </div>
    </div>
  )
}

export default page