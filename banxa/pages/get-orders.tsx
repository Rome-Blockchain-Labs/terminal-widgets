import axios from "axios";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { PATH } from "utils/banxa/types";

const oneMonthAgo = dayjs().subtract(1, "week").format("YYYY-MM-DD");
const today = dayjs().add(1, "day").format("YYYY-MM-DD");

const Home: NextPage = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .post(PATH.GET_ORDERS, {
        params: {
          start_date: oneMonthAgo,
          end_date: today,
          per_page: 50,
          // account_reference: "testcustomer001001",
        },
      })
      .then((response) => setData(response.data));
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};

export default Home;
