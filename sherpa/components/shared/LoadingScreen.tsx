import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'
const LoadingScreen = () => {
  return (
    <div className="w-[522px] h-full absolute block top-0 left-0 bg-white opacity-75 z-50">
      <span className="relative block w-0 h-0 mx-auto my-0 text-green-500 opacity-75 top-1/3">
        <LoadingSpinner />
      </span>
    </div>
  )
}

export default LoadingScreen
