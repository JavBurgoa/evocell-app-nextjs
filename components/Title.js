
import Image from 'next/image';
import evoLogo from "/public/EvoCell_logo_tagline2.png"

const Title = () => {
	return(

			<div className="title">
                <div id = "evologo">
                    <Image src = {evoLogo} alt={"EvoCELL logo"} width="420" height = "100"/>
                </div>
				
				<h1 position = "relative">EvoCELL App</h1>
			</div>
		)
}

export default Title;