// This file is required for the Pages Router to work properly
// It's used by both 404.js and 500.js error pages
import '@/app/globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
