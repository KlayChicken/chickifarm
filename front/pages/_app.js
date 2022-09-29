import '../styles/globals.css';
import '../styles/mobile.css';
import Layout from '../components/base/Layout';
import Head from 'next/head';
import { wrapper } from '../store';

import { DefaultSeo } from "next-seo";

const DEFAULT_SEO = {
  title: "ChickiFarm :: 치키농장",
  description: "내 NFT와 함께할 수 있는 소셜 플랫폼, 치키농장에서 만나요!",
  //canonical: "https://chickifarm.com",
  openGraph: {
    type: "website",
    //url: "https://chickifarm.com",
    title: "치키농장",
    site_name: "치키농장",
    images: [
      {
        url: "https://chickifarm.com/image/mobileBanner.png",
        alt: "치키농장배너"
      }
    ]
  },
  //twitter: {
  //  handle: '@handle',
  //  site: '@site',
  //  cardType: 'summary_large_image',
  //},
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link
          rel="shortcut icon"
          href="image/favicon/favicon_120.png"
          type="image/png"
          sizes="120×120"
        />
        <link
          href="image/favicon/favicon_120.png"
          rel="apple-touch-icon"
          sizes="120×120"
        />
        <link
          href="image/favicon/favicon_152.png"
          rel="apple-touch-icon"
          sizes="152×152"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default wrapper.withRedux(MyApp);
