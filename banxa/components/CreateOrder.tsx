// import axios from 'axios'
import { useState } from 'react'
import { classNames } from '../utils/style'
import React from 'react'
import { useForm } from 'react-hook-form'
import CurrencySelect from './CurrencySelect'

interface FormValues {
  source: number
  target: number
  address: string
}

export default function Example() {
  const [order, setOrder] = useState('BUY')
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>()
  const onSubmit = (data) => console.log(data)
  console.log(errors)

  return (
    <>
      <CurrencySelect />
      <div className="flex flex-col bg-black h-full w-full px-2 py-3 md:text-4xl">
        <div className="flex w-full md:h-[5%] items-end">
          <img src="/logo.svg" className="h-5 w-auto  md:h-full " alt="banxa_logo" />
          <div className="text-white text-sm  ml-5 md:text-lg ">Leading global Web3 on-and-off ramp solution</div>
        </div>
        <section className="mt-2 grow bg-white rounded-md p-4">
          <div className="flex text-[#1D3E52] ">
            <div className="h-8 w-3/5 rounded-lg border-[#0CF5F1] border  mx-auto flex max-w-lg md:text-4xl md:h-11">
              <button className={classNames(order === 'BUY' ? 'bg-gray-200 rounded-lg' : '', 'grow')}>BUY</button>
              <button className={classNames(order === 'SELL' ? 'bg-gray-200 rounded-lg' : '', 'grow')}>SELL</button>
            </div>
            <button className="bg-gray-200 rounded-lg px-3 md:text-3xl">History</button>
          </div>

          <form className="flex flex-col mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="source" className="block  font-medium text-black ">
                You Pay
              </label>
              <div className="mt-1 flex">
                <input
                  className="text-sm shadow-sm block w-full border-b border-t-0 border-x-0 border-gray-300 rounded-md"
                  type="number"
                  placeholder="Enter amount"
                  {...register('source', { required: true, maxLength: 80 })}
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="source" className="block  font-medium text-black  ">
                You Receive
              </label>
              <div className="mt-1">
                <input
                  className="text-sm shadow-sm block w-full border-b border-t-0 border-x-0 border-gray-300 rounded-md"
                  type="number"
                  placeholder="Enter amount"
                  {...register('target', { required: true, maxLength: 100 })}
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="source" className="block  font-medium text-gray-400  ">
                Selected Address
              </label>
              <div className="mt-1">
                <input
                  className="text-sm shadow-sm block w-full border-b border-t-0 border-x-0 border-gray-300 rounded-md"
                  type="text"
                  placeholder="Click the connect wallet button below"
                  {...register('address', { required: true, maxLength: 100 })}
                />
              </div>
            </div>

            <div className="flex h-8 justify-center gap-x-2 mt-2">
              <button className="rounded-full h-full px-2 w-1/3 text-white bg-gradient-to-r from-[#0573C1]  to-[#01C2C1]">
                Connect Wallet
              </button>

              <button type="submit" className=" rounded-full border-gray-300 border  h-full px-2 w-1/3">
                Create Order
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
