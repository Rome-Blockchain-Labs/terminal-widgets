// import axios from 'axios'
import { useState } from 'react'
import { classNames } from '../utils/style'
import React from 'react'
import { useForm } from 'react-hook-form'

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
    // <form
    //   className="space-y-8 divide-y divide-gray-200"
    //   onSubmit={(event) => {
    //     event.preventDefault();
    //     const { email, source, target, wallet_address, return_url_on_success } =
    //       //@ts-ignore
    //       event.target.elements;

    //     axios
    //       .post("/api/banxa/create-order", {
    //         params: {
    //           email: email.value,
    //           account_reference,
    //           source: source.value,
    //           target: target.value,
    //           blockchain: "ETH",
    //           wallet_address: wallet_address.value,
    //           return_url_on_success: return_url_on_success.value,
    //         },
    //       })
    //       .then((response) => {
    //         setData(response.data);
    //       })
    //       .catch((err) => setData(err.response.data.data.errors));
    //   }}
    // >
    //   <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
    //     <div>{JSON.stringify(data)}</div>
    //     <div>
    //       <h3 className="text-lg leading-6 font-medium text-gray-900">
    //         Order Form
    //       </h3>
    //     </div>

    //     <div className="space-y-6 sm:space-y-5">
    //       <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
    //         <label
    //           htmlFor="email"
    //           className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    //         >
    //           Email
    //         </label>
    //         <div className="mt-1 sm:mt-0 sm:col-span-2">
    //           <input
    //             type="email"
    //             name="email"
    //             id="email"
    //             autoComplete="email"
    //             className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
    //             defaultValue="ian@romeblockchain.com"
    //           />
    //         </div>
    //       </div>

    //       <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
    //         <label
    //           htmlFor="first-name"
    //           className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    //         >
    //           Source
    //         </label>
    //         <div className="mt-1 sm:mt-0 sm:col-span-2">
    //           <input
    //             type="text"
    //             name="source"
    //             id="source"
    //             autoComplete="source"
    //             className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
    //             defaultValue="AUD"
    //           />
    //         </div>
    //       </div>

    //       <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
    //         <label
    //           htmlFor="target"
    //           className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    //         >
    //           target
    //         </label>
    //         <div className="mt-1 sm:mt-0 sm:col-span-2">
    //           <input
    //             type="text"
    //             name="target"
    //             id="target"
    //             autoComplete="target"
    //             className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
    //             defaultValue="ETH"
    //           />
    //         </div>
    //       </div>

    //       <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
    //         <label
    //           htmlFor="text"
    //           className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    //         >
    //           Wallet Address
    //         </label>
    //         <div className="mt-1 sm:mt-0 sm:col-span-2">
    //           <input
    //             id="wallet-address"
    //             name="wallet_address"
    //             type="text"
    //             autoComplete="wallet_address"
    //             className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
    //             defaultValue="0xb1eb136efab647b2c99e9c08ac21f2bd7d79794e"
    //           />
    //         </div>
    //       </div>

    //       <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
    //         <label
    //           htmlFor="return_url_on_success"
    //           className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    //         >
    //           Return URL on Success
    //         </label>
    //         <div className="mt-1 sm:mt-0 sm:col-span-2">
    //           <input
    //             id="return_url_on_success"
    //             name="return_url_on_success"
    //             type="text"
    //             autoComplete="return_url_on_success"
    //             className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
    //             defaultValue="https://app.rometerminal.io"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="pt-5">
    //     <div className="flex justify-end">
    //       <button
    //         type="button"
    //         className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    //       >
    //         Cancel
    //       </button>
    //       <button
    //         type="submit"
    //         className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    //       >
    //         Save
    //       </button>
    //     </div>
    //   </div>
    // </form>
  )
}
