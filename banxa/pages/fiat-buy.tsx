import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios.get("/api/banxa/fiat-buy").then((response) => {
      setData(response.data);
    });
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};

export default Home;
