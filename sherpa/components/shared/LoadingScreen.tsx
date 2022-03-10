import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'
const LoadingScreen = () => {
  return (
    <div className="absolute top-0 left-0 z-50 grid w-full h-full bg-white opacity-75 place-items-center">
      <span className="relative block w-0 h-0 mx-auto my-0 text-green-500 opacity-75 ">
        <LoadingSpinner />
      </span>
    </div>
  )
}

export default LoadingScreen
