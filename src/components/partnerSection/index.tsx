import styles from './style.module.css';
import {
    PartnerSectionFive,
    PartnerSectionFour,
    PartnerSectionOne,
    PartnerSectionSeven,
    PartnerSectionSix,
    PartnerSectionThree,
    PartnerSectionTwo
} from "../../assets/images";
import Sdivder from "react-slick";


const PartnerSection = () => {
    var partner = {
        dots: false,
        arrow: false,
        infinite: true,
        loop: true,
        // centerMode: true,
        // centerPadding: '60px',
        speed: 500,
        // fade: true,
        autoplay: true,
        slidesToShow: 6,
        slidesToScroll: 1
    };
    return (
        <section className={styles.partners}>
            <div className='container'>
                {/* <p>Partner with us</p>
                <h3>Collaborate for Success: Become a<br /> Commbitz Partner</h3> */}
                <ul>
                    <Sdivder {...partner}>
                        <div className='partner-logo'><span><img src={PartnerSectionOne} alt="" /></span></div>
                        <div className='partner-logo'><span><img src={PartnerSectionTwo} alt="" /></span></div>
                        <div className='partner-logo'><span><img src={PartnerSectionThree} alt="" /></span></div>
                        <div className='partner-logo'><span><img src={PartnerSectionFour} alt="" /></span></div>
                        <div className='partner-logo'><span><img src={PartnerSectionFive} alt="" /></span></div>
                        <div className='partner-logo'><span><img src={PartnerSectionSix} alt="" /></span></div>
                        <div className='partner-logo'><span><img src={PartnerSectionSeven} alt="" /></span></div>
                    </Sdivder>
                </ul>
            </div>
        </section>
    )
}

export default PartnerSection;