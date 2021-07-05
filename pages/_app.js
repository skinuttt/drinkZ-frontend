import "../styles/globals.css";
import client from "../apollo-client";
import Router from "next/router";
import Loader from "../components/Loader";
import { useState } from "react";
import { ApolloProvider } from "@apollo/client";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  Router.onRouteChangeStart = (url) => {
    setLoading(true);
    console.log("Change started");
  };
  Router.onRouteChangeComplete = (url) => {
    setLoading(false);
    console.log("Change complete");
  };
  Router.onRouteChangeError = (err, url) => {
    console.log("Change error");
  };

  if (loading) return <Loader />;

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
