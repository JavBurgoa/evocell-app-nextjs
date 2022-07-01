import {useRouter} from "next/router"
import Link from "next/link"

const Footer = () => {
	return(
            <div className="footer">
                <hr></hr>
                <p>©2022 EMBL / <a href="mailto:burgoacardasjavier@gmail.com">Contact</a> / <Link href="/license" target="_blank" rel="noreferrer">License Agreement</Link></p>
                <p>In case of commercial use please contact <a href = "https://embl-em.de/company/contact/"  target="_blank" rel="noreferrer">EMBLEM</a></p>
            </div>
		)
}

export default Footer;