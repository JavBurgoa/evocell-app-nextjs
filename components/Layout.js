import Footer from '../components/Footer';
import Title from '../components/Title';
import Header from '../components/Header';
import NavBar from "../components/NavBar"
const Layout = ({children}) =>{
	return(
		<>
		<div className="content">
			<NavBar />
			<Header />
			<Title />
			{children}
			<Footer />
		</div>
		</>
		);
}

export default Layout