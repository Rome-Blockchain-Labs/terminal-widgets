import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [data, setData] = useState();
  useEffect(() => {
    axios
      .post("/api/banxa/price", {
        params: {
          source_amount: "200",
          source: "AUD",
          target: "BTC",
        },
      })
      .then((response) => setData(response.data));
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};

export default Home;
