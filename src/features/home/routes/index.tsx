import Slider from "react-slick";
import { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
// Components
import Layout from "../../../components/layout";
import HomeBanner from "./HomeBanner";
import EsimDestination from "./EsimDestination";
import { PartnerSection } from "../../../components";
import BlogSections from "./BlogSections";
import scone from "../../../assets/images/scone.png";
import sctwo from "../../../assets/images/sctwo.png";
import scthree from "../../../assets/images/scthree.png";
import appstore from "../../../assets/images/appstore.svg";
import googleplay from "../../../assets/images/googleplay.svg";
import appscntwo from "../../../assets/images/appscntwo.png";
import star from "../../../assets/images/stars.svg";
import fbone from "../../../assets/images/fbone.svg";
import fbtwo from "../../../assets/images/fbtwo.svg";
import fbthree from "../../../assets/images/fbthree.svg";
import fbfour from "../../../assets/images/fbfour.svg";
import news from "../../../assets/images/news.png";
import newsone from "../../../assets/images/newsone.png";
import newstwo from "../../../assets/images/newstwo.png";
import newsthree from "../../../assets/images/newsthree.png";
// Styles
import styles from "../styles/home.module.css";

// Images
import { getFAQS } from "../../faq/api";
import { FAQ } from "../../faq/interfaces";
import { featureNewsList, getbundles } from "../api";
import { GetGeoLoactions } from "../../../utils/GetGeoLocation";
import MapComponent from "./MapComponent";
import CountryCoordinates from "./getCood";
import GeoChart from "./geoChart";
import { useSelector } from "react-redux";
import { getCompatibleDevice } from "../../packageOption/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Home = () => {
  const currency = useSelector((state: any) => state?.getCurrency?.currency);
  const [nav1, setNav1] = useState<any>();
  const [nav2, setNav2] = useState<any>();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeFAQ, setActiveFAQ] = useState<string>("");
  const [bannerEsim, setBannerEsim] = useState<any>();
  const [loader, setLoader] = useState(true);
  const [showSomeDropdown, setShowSomeDropdown] = useState<any>({
    installation: false,
    deviceCompatibility: false,
  });

  const [deviceName, setDeviceName] = useState("");
  const [deviceNameMsg, setDeviceNameMsg] = useState({
    error: "",
    success: "",
  });
  const [featurNewsListData, setFeaturNewsListData] = useState<any>();
  const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  useEffect(() => {
    getFAQS({ page: 1, limit: 3 })
      .then((res) => {
        const faqs = res.data.faqs.slice(0, 3);
        setFaqs(faqs);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false)
      });
    featureNewsList({ page: 1, limit: 10 })
      .then((res) => {
        setFeaturNewsListData(res?.data);
      })
      .catch((error) => {
        setLoader(false)
        console.log(error);
      });
  }, [currency]);

  const handelCompatibleDevice = () => {
    if (!deviceName) return toast.error("Please enter device name");
    getCompatibleDevice({ deviceName })
      .then((res) => {
        res?.statusCode === 200
          ? toast.success(res?.data?.deviceMessage)
          : toast.error("Something went wrong!!!");
      })
      .catch((error) => {
        setLoader(false)
        toast.error("Something went wrong!!!");
      });
  };
  var settings = {
    dots: false,
    infinite: true,
    speed: 2500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  return (
    <Layout>
      <meta
        name="description"
        content="Stay connected globally with Commbitz's international eSIM solutions. Enjoy high-speed, affordable data in 190+ countries with seamless travel and 24/7 support."
      />
      <meta
        name="keywords"
        content="international sim card, buy international sim card, best international travel sim card, global sim card, prepaid esim, sim card for international travel, international roaming sim card, international travel sim, international sim card recharge, best international sim"
      />
      <title>Commbitz | Global eSIM Solutions for Travel Connectivity</title>
      <HomeBanner bannerEsim={bannerEsim} />

      <PartnerSection />

      {/* <GeoChart /> */}
      <EsimDestination />
      {/* <CountryCoordinates /> */}

      <div className={styles.wounderingEsim}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className={styles.WonderingLeft}>
                <h3>Wondering how to install your eSIM?</h3>
                <h6>We've got you covered!</h6>
              </div>
            </div>
            <div className="col-md-8">
              <div className={styles.WonderingRight}>
                <span>
                  <label
                    onClick={() =>
                      setShowSomeDropdown({
                        installation: !showSomeDropdown?.installation,
                        deviceCompatibility:
                          showSomeDropdown?.deviceCompatibility &&
                          !showSomeDropdown?.deviceCompatibility,
                      })
                    }
                  >
                    Installation Guide{" "}
                    <i className="fas fa-angle-double-right"></i>
                  </label>
                  {showSomeDropdown?.installation && (
                    <ul>
                      <li>
                        <a
                          href="https://www.youtube.com/shorts/voW6qD5mQKE"
                          target="_blank"
                        >
                          <i className="fab fa-youtube"></i> Guidelines for
                          Andriod{" "}
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/shorts/yJk3lSCnF2Y"
                          target="_blank"
                        >
                          <i className="fab fa-youtube"></i> Guidelines for IOS{" "}
                        </a>
                      </li>
                    </ul>
                  )}
                </span>
                <Link className={styles.anchorSupport} to="/contact">
                  Customer Support <i className="fas fa-angle-double-right"></i>
                </Link>
                <span>
                  <label
                    onClick={() =>
                      setShowSomeDropdown({
                        installation:
                          showSomeDropdown?.installation &&
                          !showSomeDropdown?.installation,
                        deviceCompatibility:
                          !showSomeDropdown?.deviceCompatibility,
                      })
                    }
                  >
                    Check your device Compatibility{" "}
                    <i className="fas fa-angle-double-right"></i>
                  </label>
                  {showSomeDropdown?.deviceCompatibility && (
                    <ul>
                      <div className={styles.formGroup}>
                        <input
                          type="text"
                          placeholder="Enter your Phone Model"
                          onChange={(e) => {
                            setDeviceName(e.target.value);
                          }}
                          value={deviceName}
                        />
                        <button onClick={handelCompatibleDevice}>Apply</button>
                      </div>
                    </ul>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.reviewOuter}>
        <div className="container">
          <h6>Reviews</h6>
          <h3>
            Discover the Commbitz Experience
            <br /> Through Reviews
          </h3>
          <div className="row">
            <div className="col-md-3">
              <div className={styles.ReviewInner}>
                <img className="starsSvg" src={star} alt="" />
                <p>
                I’ve been using the eSIM service for a few months now and I’m extremely satisfied with the 
                performance. Switching to the eSIM was hassle-free, and I never have to worry about changing
                 physical SIM cards when I travel. Connectivity is fast and reliable, even in remote areas. 
                 Highly recommend!{" "}
                </p>
                <h5>John Wilson, Melbourne</h5>
                <span>
                  {" "}
                  <img className="starsSvg" src={fbone} alt="" /> Google
                </span>
              </div>
            </div>
            <div className="col-md-3">
              <div className={styles.ReviewInner}>
                <img className="starsSvg" src={star} alt="" />
                <p>
                  I love traveling, but I hate dealing with SIM cards and
                  roaming charges. That's why I use Commbitz to get an eSIM
                  whenever I go abroad. It's fast, easy, and secure. I can pay
                  in my local currency and get connected in no time.{" "}
                </p>
                <h5>Emily Jackson, Berlin</h5>
                <span>
                  {" "}
                  <img className="starsSvg" src={fbtwo} alt="" /> Facebook
                </span>
              </div>
            </div>
            <div className="col-md-3">
              <div className={styles.ReviewInner}>
                <img className="starsSvg" src={star} alt="" />
                <p>
                The eSIM service has made my international travel so much easier. I simply activated the eSIM on my
                 phone, and I was ready to go in minutes. No need for roaming charges or finding local SIM cards.
                  I’ve had great service in multiple countries, and the data speeds have been consistently excellent.{" "}
                </p>
                <h5>Jack Rogers, Sydney</h5>
                <span>
                  {" "}
                  <img className="starsSvg" src={fbthree} alt="" /> Twitter
                </span>
              </div>
            </div>
            <div className="col-md-3">
              <div className={styles.ReviewInner}>
                <img className="starsSvg" src={star} alt="" />
                <p>
                As someone who travels frequently, the eSIM has been a game-changer. I no longer have to hunt for
                 local SIM cards or worry about compatibility issues. The eSIM worked seamlessly in every country
                  I visited, and the data speeds were impressive. I’m a loyal customer now!{" "}
                </p>
                <h5>Brandon Lee, Vancouver</h5>
                <span>
                  {" "}
                  <img className="starsSvg" src={fbfour} alt="" /> Google
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.combitStep}>
        <div className="container">
          <div className="conitSlider">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12">
                <Slider
                  speed={700}
                  fade={true}
                  asNavFor={nav2}
                  ref={(slider1) => setNav1(slider1)}
                >
                  <div className={styles.Leftslider}>
                    <h3>Get started with Commbitz</h3>
                    <span>Step 1</span>
                    <ul>
                      <li>
                        <b>Download:</b> Install the Commbitz app from your
                        device's app store.
                      </li>
                      <li>
                        <b>Select your eSIM plan:</b> Browse through available
                        eSIM plans within the app and choose the one that best
                        fits your needs, whether for data, calls, or both.
                      </li>
                      <li>
                        <b>Activate it anywhere, hassle-free: </b>Follow the
                        prompts within the app to activate your chosen eSIM
                        plan. Enjoy seamless connectivity without the need for
                        physical SIM cards, wherever you are in the world.
                      </li>
                    </ul>
                  </div>
                  <div className={styles.Leftslider}>
                    <h3>Get started with Commbitz</h3>
                    <span>Step 2</span>
                    <ul>
                      <li>
                        <b>Download:</b> Install the Commbitz app from your
                        device's app store.
                      </li>
                      <li>
                        <b>Select your eSIM plan:</b> Browse through available
                        eSIM plans within the app and choose the one that best
                        fits your needs, whether for data, calls, or both.
                      </li>
                      <li>
                        <b>Activate it anywhere, hassle-free: </b>Follow the
                        prompts within the app to activate your chosen eSIM
                        plan. Enjoy seamless connectivity without the need for
                        physical SIM cards, wherever you are in the world.
                      </li>
                    </ul>
                  </div>
                  <div className={styles.Leftslider}>
                    <h3>Get started with Commbitz</h3>
                    <span>Step 3</span>
                    <ul>
                      <li>
                        <b>Download:</b> Install the Commbitz app from your
                        device's app store.
                      </li>
                      <li>
                        <b>Select your eSIM plan:</b> Browse through available
                        eSIM plans within the app and choose the one that best
                        fits your needs, whether for data, calls, or both.
                      </li>
                      <li>
                        <b>Activate it anywhere, hassle-free: </b>Follow the
                        prompts within the app to activate your chosen eSIM
                        plan. Enjoy seamless connectivity without the need for
                        physical SIM cards, wherever you are in the world.
                      </li>
                    </ul>
                  </div>
                  <div className={styles.Leftslider}>
                    <h3>Get started with Commbitz</h3>
                    <span>Step 1</span>
                    <ul>
                      <li>
                        <b>Download:</b> Install the Commbitz app from your
                        device's app store.
                      </li>
                      <li>
                        <b>Select your eSIM plan:</b> Browse through available
                        eSIM plans within the app and choose the one that best
                        fits your needs, whether for data, calls, or both.
                      </li>
                      <li>
                        <b>Activate it anywhere, hassle-free: </b>Follow the
                        prompts within the app to activate your chosen eSIM
                        plan. Enjoy seamless connectivity without the need for
                        physical SIM cards, wherever you are in the world.
                      </li>
                    </ul>
                  </div>
                  <div className={styles.Leftslider}>
                    <h3>Get started with Commbitz</h3>
                    <span>Step 2</span>
                    <ul>
                      <li>
                        <b>Download:</b> Install the Commbitz app from your
                        device's app store.
                      </li>
                      <li>
                        <b>Select your eSIM plan:</b> Browse through available
                        eSIM plans within the app and choose the one that best
                        fits your needs, whether for data, calls, or both.
                      </li>
                      <li>
                        <b>Activate it anywhere, hassle-free: </b>Follow the
                        prompts within the app to activate your chosen eSIM
                        plan. Enjoy seamless connectivity without the need for
                        physical SIM cards, wherever you are in the world.
                      </li>
                    </ul>
                  </div>
                  <div className={styles.Leftslider}>
                    <h3>Get started with Commbitz</h3>
                    <span>Step 3</span>
                    <ul>
                      <li>
                        <b>Download:</b> Install the Commbitz app from your
                        device's app store.
                      </li>
                      <li>
                        <b>Select your eSIM plan:</b> Browse through available
                        eSIM plans within the app and choose the one that best
                        fits your needs, whether for data, calls, or both.
                      </li>
                      <li>
                        <b>Activate it anywhere, hassle-free: </b>Follow the
                        prompts within the app to activate your chosen eSIM
                        plan. Enjoy seamless connectivity without the need for
                        physical SIM cards, wherever you are in the world.
                      </li>
                    </ul>
                  </div>
                </Slider>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="NavSlide">
                  <Slider
                    asNavFor={nav1}
                    ref={(slider2) => setNav2(slider2)}
                    slidesToShow={3}
                    autoplay={true}
                    cssEase={"linear"}
                    speed={700}
                    infinite={true}
                    dots={true}
                    swipeToSlide={true}
                    centerMode={true}
                    focusOnSelect={false}
                  >
                    <div className={styles.Rightslider}>
                      <img src={scone} alt="Buy international eSim online" />
                    </div>
                    <div className={styles.Rightslider}>
                      <img src={sctwo} alt="Buy international eSim online" />
                    </div>
                    <div className={styles.Rightslider}>
                      <img src={scthree} alt="Buy international eSim online" />
                    </div>
                    <div className={styles.Rightslider}>
                      <img src={scone} alt="Buy international eSim online" />
                    </div>
                    <div className={styles.Rightslider}>
                      <img src={sctwo} alt="Buy international eSim online" />
                    </div>
                    <div className={styles.Rightslider}>
                      <img src={scthree} alt="Buy international eSim online" />
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <BlogSections /> */}
      <div className={styles.appFinder}>
        <div className="container">
          <div className={styles.appDownOuter}>
            <div className={styles.appFinderInner}>
              <h3>Download the Commbitz app</h3>
              <div className={styles.appIc}>
                <span>
                  <a
                    href="https://apps.apple.com/in/app/commbitz-e-sim/id6572300745"
                    target="_blank"
                  >
                    <img src={appstore} alt="app store apk" />
                  </a>
                </span>
                <span>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.commbitz"
                    target="_blank"
                  >
                    <img src={googleplay} alt="play store apk" />
                  </a>
                </span>
              </div>
              <p>
                Or scan the code with your phone to
                <br /> download Commbitz.
              </p>
            </div>
            <div className={styles.AppScanner}>
              <img src={appscntwo} alt="download commbitz apk" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.newsService}>
        <div className="container">
          <h6>News</h6>
          <h3>Feature Listing</h3>
          <div className="row fesrureSlider">
            <Slider {...settings}>
              {featurNewsListData &&
                featurNewsListData?.map((item: any, index: number) => (
                  <div className={styles.newInner}>
                    <img src={item?.featureImageUrl} alt="" />
                    <div className={styles.newText}>
                      <a href={item?.featureUrlLink} target="_blank">
                        Learn More <i className="fas fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
