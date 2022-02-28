import React from 'react'
import { LoadingSpinner } from './icons/LoadingSpinner'

const LoadingScreen = () => {
  return (
    <div tw="w-[522px] h-full absolute block top-0 left-0 bg-white opacity-75 z-50">
      <span tw="text-green-500 opacity-75 top-1/3 my-0 mx-auto block relative w-0 h-0">
        <LoadingSpinner />
      </span>
    </div>
  )
}

export default LoadingScreen
