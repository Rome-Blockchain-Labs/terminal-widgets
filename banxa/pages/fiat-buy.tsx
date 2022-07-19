import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { PATH } from "utils/banxa/types";

const Home: NextPage = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios.get(PATH.GET_FIAT_BUY).then((response) => {
      setData(response.data);
    });
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};

export default Home;
