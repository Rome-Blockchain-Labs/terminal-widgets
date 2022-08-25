import { ChevronRightIcon } from '@heroicons/react/solid'

/* This example requires Tailwind CSS v2.0+ */
const people = [
  { trade: 'AUD TO ETH', source: '10000 AUD', target: '12 ETH', status: 'Pending Payment' },
  // More people...
]

export default function Example() {
  return (
    <div className="flex flex-col bg-black h-full w-full px-2 py-3 md:text-4xl">
      <div className="flex w-full md:h-[5%] items-center">
        <img src="/logo.svg" className="h-5 w-auto  md:h-full " alt="banxa_logo" />
        <div className="text-white text-sm  ml-5 md:text-lg ">Leading global Web3 on-and-off ramp solution</div>
      </div>

      <section className="mt-2 grow bg-white rounded-md py-4 overflow-auto flex justify-center">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl w-full">
          <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Trade
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Source
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Target
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Expand</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {people.map((person, id) => (
                  <tr key={id}>
                    <td className="w-2/5 max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                      {person.trade}
                      <dl className="font-normal lg:hidden">
                        <dt className="sr-only">Title</dt>
                        <dd className="mt-1 truncate text-gray-700 sm:hidden">{person.source}</dd>
                        <dt className="sr-only sm:hidden">Email</dt>
                        <dd className="mt-1 truncate text-gray-500 sm:hidden">{person.target}</dd>
                      </dl>
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{person.source}</td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{person.target}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{person.status}</td>
                    <td>
                      <ChevronRightIcon className="w-5 h-5 text-blue-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
