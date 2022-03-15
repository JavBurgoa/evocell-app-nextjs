import Link from "next/link"

const NavBar = () => {
	return(
		<nav>
			<Link href = '/'><a>Datasets</a></Link>
			<Link href = '/trees'><a>Trees</a></Link>
		</nav>
		);
}

export default NavBar;