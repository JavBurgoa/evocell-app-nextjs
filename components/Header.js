import Head from 'next/head'

const Header = () => {
	return(

			<div>
				<Head>
					<title><h1>EvoCell App</h1></title>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
					<link rel="shortcut icon" href="/evocell.ico" />
                    <meta charset="UTF-8"></meta>
				</Head>
			</div>
		)
}

export default Header;