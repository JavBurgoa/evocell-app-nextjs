import Footer from '../components/Footer';
import Title from '../components/Title';
import Header from '../components/Header';
const Layout = ({children}) =>{
	return(
		<>
		<div className="content">
			<Header />
			<Title />
			{children}
			<Footer />
		</div>
		</>
		);
}

export default Layout