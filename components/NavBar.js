import Link from "next/link"
import {useRouter} from "next/router"

const NavBar = () => {
    const router = useRouter()
    // the idea is, if we are in the home route or any details page turn to class active the "Dataset" link. The same for /trees
	return(
		<nav>
			<Link href = '/'><a className={(router.pathname == "/"|| router.pathname == "/[dataset]") ? "active_nav":"inactive_nav"}><span className={router.pathname == "/[dataset]" ? "active_arrow":"inactive_arrow"}>&#8678;</span>Datasets</a></Link>
			<Link href = '/trees'><a  className={router.pathname == "/trees" ? "active_nav":"inactive_nav"}>Trees</a></Link>
		</nav>
		);
}

export default NavBar;