import { nanoid } from "nanoid";
import type { NextPage } from "next";
import { useEffect } from "react";
import useLocalStorage from "../utils/useLocalStorage";
import CreateOrder from "components/CreateOrder";

// as much as possible, add all params for creating a buy or sell order
// https://docs.banxa.com/reference/create-order
// walllet address needs to be verified for each network  BTC, ETH, BNB,
// BNB transactions would require the user to include a MEMO/TAG input

const Home: NextPage = () => {
  const [account_reference, setAccountReference] = useLocalStorage(
    "account_reference",
    nanoid()
  );

  useEffect(() => {
    if (!account_reference) {
      setAccountReference(nanoid());
    }
  }, [account_reference, setAccountReference]);

  return <CreateOrder />;
};

export default Home;
