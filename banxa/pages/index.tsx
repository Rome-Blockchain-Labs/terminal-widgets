import type { NextPage } from 'next'
const Home: NextPage = () => {
  // const [data, setData] = useState();

  // useEffect(() => {
  //   axios.get("/api/banxa/crypto-buy").then((response) => {
  //     setData(response.data);
  //   });
  // }, []);

  // return <div>{JSON.stringify(data)}</div>;
  return (
    <div className="h-full w-full bg-gradient-to-br from-[#12162e] via-[#3d5d6e] to-[#12162e] flex flex-col items-center justify-center text-white text-sm md:text-lg">
      <img src="/logo.svg" className="h-[52px] w-auto mt-[50px] md:h-[10%]" alt="banxa_logo" />

      <div className="mt-[21px] mb-[10px] w-full h-[1px]  bg-gradient-to-r from-[#d9d9d9]/0 via-[#d9d9d9] to-[#d9d9d9]/0" />
      <div className="flex flex-col justify-center">
        <div className="text-center">Please enter your e-mail to use the Banxa app </div>
        <div className="mt-[8%] flex flex-col w-[346px] ">
          <label htmlFor="email" className="block text-sm font-medium ">
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              className="h-[47px]  w-full rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <button className="font-bold mt-[11px] h-[47px] w-full rounded-md bg-gradient-to-r from-[#0472c0] to-[#00d1c0] ">
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
