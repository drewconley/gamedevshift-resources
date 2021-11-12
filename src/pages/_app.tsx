import { AppProps } from "next/dist/shared/lib/router/router";
import "./_app.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
