import Link from "next/link"

const NavBar = () => {
	return(
		<nav>
			<Link href = '/'><a>Datasets</a></Link>
			<Link href = '/trees'><a>Trees</a></Link>
		</nav>
		);
        <Script src = "/static/indexScript.js"/>
}

export default NavBar;