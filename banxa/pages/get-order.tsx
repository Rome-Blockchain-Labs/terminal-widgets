import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .post("/api/banxa/get-order", {
        orderID: "b5d628a4d3350c4cb017d662f35be017",
      })
      .then((response) => setData(response.data));
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};

export default Home;
