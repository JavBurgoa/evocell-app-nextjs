import style from "../styles/License.module.css"

const Help = () => {

    return(
        <embed className={style.pdf} src="./License_agreement_EvoCellDB.pdf" type="application/pdf"></embed>
    )
}
export default Help