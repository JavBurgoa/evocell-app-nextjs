import {useRouter} from "next/router"
import Link from "next/link"

const Footer = () => {
	return(
            <div className="footer">
                <hr></hr>
                <p>©2022 EvoCELL / Contact / <Link href="/license" target="_blank">License Agreement</Link></p>
            </div>
		)
}

export default Footer;