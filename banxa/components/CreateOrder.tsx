import axios from "axios";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { PATH } from "utils/banxa/types";
import useLocalStorage from "utils/useLocalStorage";
export default function Example() {
  const [data, setData] = useState();
  const [account_reference, setAccountReference] = useLocalStorage(
    "account_refrence",
    nanoid()
  );

  useEffect(() => {
    if (!account_reference) {
      setAccountReference(nanoid());
    }
  }, [account_reference, setAccountReference]);

  return (
    <form
      className="space-y-8 divide-y divide-gray-200"
      onSubmit={(event) => {
        event.preventDefault();
        const { email, source, target, wallet_address, return_url_on_success } =
          //@ts-ignore
          event.target.elements;

        axios
          .post(PATH.CREATE_ORDER, {
            params: {
              email: email.value,
              account_reference,
              source: source.value,
              target: target.value,
              blockchain: "ETH",
              wallet_address: wallet_address.value,
              return_url_on_success: return_url_on_success.value,
            },
          })
          .then((response) => {
            setData(response.data);
          })
          .catch((err) => setData(err.response.data.data.errors));
      }}
    >
      <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
        <div>{JSON.stringify(data)}</div>
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Order Form
          </h3>
        </div>

        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Email
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                defaultValue="ian@romeblockchain.com"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Source
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="text"
                name="source"
                id="source"
                autoComplete="source"
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                defaultValue="AUD"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="target"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              target
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="text"
                name="target"
                id="target"
                autoComplete="target"
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                defaultValue="ETH"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Wallet Address
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                id="wallet-address"
                name="wallet_address"
                type="text"
                autoComplete="wallet_address"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                defaultValue="0xb1eb136efab647b2c99e9c08ac21f2bd7d79794e"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="return_url_on_success"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Return URL on Success
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                id="return_url_on_success"
                name="return_url_on_success"
                type="text"
                autoComplete="return_url_on_success"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                defaultValue="https://app.rometerminal.io"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
