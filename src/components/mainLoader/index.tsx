import { mainLoader, niyoLoader } from "../../assets/images"
import  Styles from "./style.module.css"

const MainLoader = () => {
  return (
    <div className={Styles.mainLoader}> 
        <div className="innerLoader">
            <img src={niyoLoader} alt="filter" />
        </div>        
    </div>
  )
}

export default MainLoader