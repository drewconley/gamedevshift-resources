import "./_app.scss";
import { AppProps } from "next/dist/shared/lib/router/router";
import { Header } from "src/components/Header/Header";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
