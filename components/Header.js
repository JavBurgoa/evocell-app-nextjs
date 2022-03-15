import Head from 'next/head'
import Script from 'next/script'

const Header = () => {
	return(

			<div>
				<Head>
					<title>EvoCell App</title>
					<meta name="viewport" content= "initial-scale=1.0" width="device-width" />
					<link rel="shortcut icon" href="/evocell.ico" />
                    <Script src = "/static/indexScript.js" strategy="lazyOnload" />
				</Head>
			</div>
		)
}

export default Header;