import '../styles/global.css'
import Layout from '../components/Layout';

import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
    
    return (
        <Layout>
        <Component {...pageProps} />
        </Layout>
        )
}