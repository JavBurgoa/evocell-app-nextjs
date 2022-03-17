import Head from 'next/head'

const Header = () => {
	return(

			<div>
				<Head>
					<title><h1>EvoCell App</h1></title>
					<meta name="viewport" content= "initial-scale=1.0" width="device-width" />
					<link rel="shortcut icon" href="/evocell.ico" />
				</Head>
			</div>
		)
}

export default Header;