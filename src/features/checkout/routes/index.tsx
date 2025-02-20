import { useEffect, useState } from "react";
import { useParams } from "react-router";

import styles from "../styles/style.module.css";
import Spinner from "react-bootstrap/Spinner";
import {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
} from "../../../redux/slices/userSlice";
import MainLoader from "../../../components/mainLoader";
// Components
import Layout from "../../../components/layout";
import chip from "../../../assets/images/chip.svg";
import StripePaymentModal from "../../../components/modals/StripePayment";

//API
import {
  gapplyOfferForYou,
  getOfferForYou,
  getOrderDetails,
  getPromos,
  purchaseOrder,
  razorpayAddOrder,
  stripePaymentIntent,
  updateOrder,
} from "../api";

// Images
import { ApplePayIcon, CheckoutIcon } from "../../../assets/images";
import CreditCardPayIcon from "../../../assets/images/CreditCardPayIcon.svg";
import Gpay from "../../../assets/images/Gpay.png";
import moment from "moment";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../../redux/api";
import { useLocation, useNavigate } from "react-router-dom";
import { DATAAMOUNT, PAYMENT_METHOD, PLANDAYS } from "../../../utils/constants";
import useAuth from "../../../lib/hooks/useAuth";
import { decodeBase64 } from "../../../utils/secureToken";
import { NIYO_URL } from "../../../config";
import Swal from "sweetalert2";

import { getbundles } from "../../home/api";
import { getBundleFilterData } from "../../esim/api";
import { getCompatibleDevice } from "../../packageOption/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  let params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentGateway: any = queryParams.get("paymentGateway");
  const urlToken: any = queryParams.get("token");
  const dispatch = useDispatch();
  const [deviceDropDown, setDeviceDropDown] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [airlineDropDown, setAirlineDropDown] = useState<boolean>(false);
  const { data } = useSelector((state: any) => state.getUserData);
  const [order, setOrderDetails] = useState<any>({});
  const [promoCode, setPromoCode] = useState<string>("");
  const [promos, setPromos] = useState<any>({});
  const [show, setShow] = useState<boolean>(false);
  const [promoError, setPromoError] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState({
    clientSecret: "",
    paymentId: "",
    setupIntent: "",
    currency: "",
    label: "Total",
    amount: 0,
  });
  const [selectedPaymentMethod, setPaymentMethod] =
    useState<number>(paymentGateway);
  const [minimumSpend, setMinimumSpend] = useState<any>(0);
  const [paymentMethodError, setPaymentMethodError] = useState<any>("");
  const [loader, setLoader] = useState<boolean>(true);
  const [finalPrice, setFinalPrice] = useState(0);
  const [walletAmShow, setWalletAmShow] = useState(false);
  // const [walletAmError, setWalletAmError] = useState('');
  const [walletMethod, setWalletMethod] = useState(0);
  const [walletInput, setWalletInput] = useState(false);
  const [pageError, setPageError] = useState("");
  const currency = useSelector((state: any) => state?.getCurrency?.currency);
  const current_url: any = window.localStorage.getItem("current_url");
  const [showPackageOption, setShowPackageOption] = useState<boolean>(false);
  const [bundleDetails, setBundleDetails] = useState<any>({});
  const [bundleId, setBundleId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>(params?.id as string);
  const [bundleAmount, setBundleAmount] = useState<number>(0);
  const [bundlePlans, setBundlePlans] = useState<number>(0);
  const secureToken: any = decodeBase64(urlToken);
  const [bundleQty, setBundleQty] = useState<number>(1);
  const [esimFilterData, setEsimFilterData] = useState<any>();
  const [offersForYou, setOffersForYou] = useState<any>();
  const [airlineSelect, setAirlineSelect] = useState<boolean>(false);
  const [deviceNameMsg, setDeviceNameMsg] = useState({
    error: "",
    success: "",
  });
  const [deviceName, setDeviceName] = useState("");

  useEffect(() => {
    getOfferForYou({ page: 1, limit: 10 })
      .then((res) => {
        setOffersForYou(res?.data);
      })
      .catch((error) => {
        console.log(error, " getOfferForYou ");
        setLoader(false);
      });

    getOrderDetails(params.id as string)
      .then((res: any) => {
        setBundleId(res?.data?.bundleId);
        setBundleAmount(res?.data?.dataAmount);
        setBundlePlans(res?.data?.duration);
        setBundleDetails(res?.data);

        getBundleFilterData({ search: res?.data?.name })
          .then((res: any) => {
            setEsimFilterData(res?.data[0]);
          })
          .catch((error) => {
            toast.error(error?.data?.message || "Something went wrong!");
            setLoader(false);
          });

        if (res?.data?.finalPrice <= 0) {
          setPaymentMethod(0);
        }

        setFinalPrice(res?.data?.finalPrice);
        if (urlToken && secureToken != null) setPromoCode(res?.data?.promoCode);
        // If everything is fine, set the order details
        setOrderDetails(res?.data);
      })
      .catch((error) => {
        if (error?.data?.statusCode === 400) {
          setPageError("Plans is not found!");
        }
        setLoader(false);
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    if (urlToken && secureToken?.error) {
      window.localStorage.removeItem("niyoToken");
      if (secureToken?.error) toast.error("Token not exist");

      setTimeout(() => {
        window.location.href = NIYO_URL;
      }, 5000);
    }
    if (urlToken && !secureToken?.error)
      window.localStorage.setItem("niyoToken", secureToken);

    paymentGateway == PAYMENT_METHOD.RAZORPAY
      ? setPaymentMethod(2)
      : setPaymentMethod(1);

    if (current_url) {
      const payload: any = {
        orderId: params.id as string,
      };

      updateOrder(payload).then((res) => {
        window.localStorage.removeItem("current_url");
        setLoader(false);
      });
    }

    if (isAuthenticated && !urlToken)
      getPromos().then((res) => {
        setPromos(res?.data);
        setLoader(false);
      }).catch((error)=>{
        console.log(error, "promos")
      });
    window.scrollTo(0, 0);

    // if(!loader) {
    //     getOrderDetails(params.id as string)
    //       .then((res: any) => {
    //         setBundleId(res?.data?.bundleId);
    //         setBundleAmount(res?.data?.dataAmount);
    //         setBundlePlans(res?.data?.duration);
    //         setBundleDetails(res?.data);

    //         if (res?.data?.finalPrice <= 0) {
    //           setPaymentMethod(0);
    //         }

    //         setFinalPrice(res?.data?.finalPrice);
    //         if (urlToken && secureToken != null) setPromoCode(res?.data?.promoCode);
    //         // If everything is fine, set the order details
    //         setOrderDetails(res?.data);
    //       })
    //       .catch((error) => {
    //         if (error?.data?.statusCode === 400) {
    //           setPageError("Plans is not found!");
    //         }
    //         setLoader(false);
    //       })
    //       .finally(() => {
    //         setLoader(false);
    //       });
    //     }
  }, [params, currency, isAuthenticated, loader]);

  const increaseQuantity = async () => {
    setLoader(true);
    const payload = {
      orderId: params.id as string,
      quantity: order.quantity + 1,
      promoCode,
    };

    updateOrder(payload).then((res) => {
      setFinalPrice(res?.data?.finalPrice);
      if (res?.data?.finalPrice <= 0) {
        setPaymentMethod(0);
      } else {
        setPaymentMethod(selectedPaymentMethod);
      }
      setOrderDetails(res.data);
      setLoader(false);
    });
  };

  const decreaseQuantity = async () => {
    setLoader(true);
    if (order.quantity > 1) {
      const qty = order.quantity - 1;
      const payload: any = {
        orderId: params.id as string,
        quantity: qty,
        promoCode: promoCode, // Assuming order.promoCode is defined somewhere
      };

      if (minimumSpend >= order.planPrice / qty) {
        delete payload.promoCode;
      }
      updateOrder(payload).then((res) => {
        setFinalPrice(res?.data?.finalPrice);
        if (res?.data?.finalPrice <= 0) {
          setPaymentMethod(0);
        } else {
          setPaymentMethod(selectedPaymentMethod);
        }
        setOrderDetails(res.data);
        setLoader(false);
      });
    } else {
      setLoader(false);
    }
  };

  const handleCheckout = async () => {
    setLoader(true);
    const payload = { orderId: params.id as string };

    if (selectedPaymentMethod === 1 || selectedPaymentMethod === 4) {
      stripePaymentIntent(payload)
        .then((res: any) => {
          setPaymentDetails({
            clientSecret: res.data.paymentIntentSecretKey,
            paymentId: res.data.paymentId,
            setupIntent: res.data.setupIntent,
            currency: res.data.currency.toLowerCase(),
            label: "Total",
            amount: res.data.amount,
          });
          setLoader(false);
          setShow(true);
        })
        .catch((error: any) => {
          setLoader(false);
          toast.error(error?.data?.message || "Something went wrong!");
        });
    } else if (selectedPaymentMethod === 2) {
      razorpayAddOrder(payload).then((res) => {
        var options = {
          key: res.data.razorPayKeyId,
          order_id: res.data.razorPayOrderId,
          handler: function (response: any) {
            if (
              !response?.razorpay_order_id ||
              !response?.razorpay_payment_id ||
              !response?.razorpay_signature
            ) {
              Swal.fire(
                "Your payment is currently in pending status. Please check your order history after 15 minutes for an update."
              );
            } else {
              window.location.href = "/payment";
            }
          },
          prefill: {
            name: data?.fullName,
            email: data?.email,
            contact: data?.phoneNumber,
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      });
      setLoader(false);
    } else {
      setLoader(true);
      const payload: any = {
        orderId: params.id as string,
        status: 2 as number,
      };
      purchaseOrder(payload)
        .then((res) => {
          window.location.href = `${NIYO_URL}?status=true`;
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
          toast.error(error?.data?.message || "Something went wrong!");
        });
      setPaymentMethodError("Please select payment method");
    }
  };

  const handleAddPromo = ({ promo, minimumSpend }: any) => {
    setPromoError("");
    setLoader(true);
    const payload = {
      orderId: params.id as string,
      quantity: order?.quantity,
      promoCode:
        order?.promoApplied === false || order?.promoId !== promo?._id
          ? promo?.promoCode
          : undefined,
    };
    setMinimumSpend(minimumSpend);
    // if (minimumSpend >= order?.planPrice) {
    //   setPromoError(`Please expand minimum spend amount to ${minimumSpend}`)
    //   setLoader(false)
    //   return null
    // }

    setPromoCode(promo?.promoCode);
    toast.promise(updateOrder(payload), {
      pending: {
        render() {
          return "Updating Order";
        },
      },
      success: {
        render({ data }) {
          setOrderDetails(data.data);
          setLoader(false);
          if (data?.data?.promoApplied) {
            return "Promo applied successfully";
          } else {
            setPromoCode("");
            return "Promo removed successfully";
          }
        },
      },
      error: {
        render({ data }: any) {
          setLoader(false);
          return data.data.message;
        },
      },
    });
  };

  const userData = async () => {
    dispatch(fetchDataStart());
    try {
      const userData = await getUserData();
      dispatch(fetchDataSuccess(userData?.data));
      setLoader(false);
    } catch (error: any) {
      dispatch(fetchDataFailure(error.message));
    }
  };

  const handlePaymentMethod = (methodId: number) => {
    // setLoader(true)
    // userData()
    setPaymentMethod(methodId);
    setWalletAmShow(false);
    setWalletInput(false);
    setWalletMethod(0);
  };
  const handleSearchSubmit = (event: any) => {
    event.preventDefault();
    if (event.type === "change") {
      setPromoCode(event.target.value);
    } else if (event.type === "submit") {
      event.preventDefault();
      if (!promoCode) return toast.error("Please enter promo code!!!");
      const payload: any = {
        quantity: order.quantity,
        orderId: params.id as string,
        promoCode: promoCode,
      };
      toast.promise(updateOrder(payload), {
        pending: {
          render() {
            return "Updating Order";
          },
        },
        success: {
          render({ data }) {
            setOrderDetails(data.data);
            setLoader(false);
            return "Promo applied successfully";
          },
        },
        error: {
          render({ data }: any) {
            setLoader(false);
            return data.data.message;
          },
        },
      });
    }
  };

  const handleBundleDetails = (params: any) => {
    setLoader(true);
    setBundleAmount(params?.dataAmount);
    setBundlePlans(params?.duration);
    const query: any = {
      dataAmount: params?.dataAmount,
      duration: params?.duration,
      search: params?.search,
    };

    getbundles(query)
      .then(async (res: any) => {
        setBundleId(res?.data?.bundles[0]?._id);
        setBundleDetails(res?.data?.bundles[0]);
        if (res?.data?.bundles?.length > 0) {
          const payload = {
            orderId,
            bundleId: res?.data?.bundles[0]?._id,
            quantity: 1,
          };
          updateOrder(payload).then((res) => {
            setFinalPrice(res?.data?.finalPrice);
            setOrderDetails(res?.data);
            setLoader(false);
          });
        } else {
          setLoader(false);
        }
      })
      .catch((erro) => {
        setOrderDetails([]);
      });
  };

  const handleFilterOrderUpdate = () => {
    if (bundleId) {
      setLoader(true);
      const payload = {
        orderId: params.id as string,
        bundleId,
        quantity: bundleQty,
      };
      updateOrder(payload).then((res) => {
        setFinalPrice(res?.data?.finalPrice);
        setShowPackageOption(!showPackageOption);
        setOrderDetails(res.data);
        setLoader(false);
      });
    }
  };

  const handleOffersForyou = (id: string, offerType: number) => {
    setLoader(true);
    const payload = {
      orderId: params.id as string,
      offerId: id,
      offerType,
    };
    gapplyOfferForYou(payload).then((res) => {
      setLoader(false);
    });
  };
  const isAndroidOrIOS =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const handelCompatibleDevice = () => {
    if (!deviceName)
      return setDeviceNameMsg({
        error: "Please enter device name.",
        success: "",
      });
    getCompatibleDevice({ deviceName })
      .then((res) => {
        res?.statusCode === 200
          ? setDeviceNameMsg({ error: "", success: res?.data?.deviceMessage })
          : setDeviceNameMsg({
              error: res?.data?.deviceMessage || "Something went wrong!!!",
              success: "",
            });
      })
      .catch((error) => {
        setLoader(false);
        setDeviceNameMsg({ error: "Something went wrong!!!", success: "" });
      });
  };

  return (
    <Layout>
      {loader && <MainLoader />}
      <div className={styles.checkoutpage}>
        <div className="container">
          <h3>Secure Checkout</h3>
          {pageError ? (
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-8" style={{ color: "#fff" }}>
                {pageError}
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-8">
                <div className={styles.PacageOptioOuter}>
                  <div className={styles.SelectSim}>
                    <h6>SIM card validity</h6>
                    <ul>
                      {esimFilterData &&
                        esimFilterData?.validityDays?.map(
                          (item: number, index: number) => (
                            <li
                              className={
                                item === bundlePlans ? styles.active : ""
                              }
                              onClick={() =>
                                handleBundleDetails({
                                  duration: item,
                                  dataAmount: bundleAmount,
                                  search: order?.name,
                                })
                              }
                            >
                              <span>
                                {item > 1 ? item + ` Days` : item + ` Day`}
                              </span>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                  <div className={styles.SelectSim}>
                    <h6>Data package</h6>
                    <ul>
                      {esimFilterData &&
                        esimFilterData?.dataAmount?.map(
                          (item: number, index: number) => (
                            <li
                              className={
                                item === bundleAmount ? styles.active : ""
                              }
                              onClick={() =>
                                handleBundleDetails({
                                  dataAmount: item,
                                  duration: bundlePlans,
                                  search: order?.name,
                                })
                              }
                            >
                              <span>
                              {item == -1
                              ? "Unlimited"
                              : item / 1000 >= 1
                                ? item / 1000 + " GB"
                                : item / 1000 + " MB"}
                              </span>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                  {/* <div className={styles.Quantity}>
                    <h6>Quantity</h6>
                    {bundleDetails ? (
                      <div className={styles.quaOuter}>
                        <label>
                          <img src={chip} alt="" />
                          {bundleDetails?.name}
                        </label>
                        <div className={styles.count}>
                          <h5>
                            {bundleDetails?.priceSymbol}{" "}
                            {(bundleDetails?.price)}
                          </h5>
                          <div className={styles.inputCount}>
                            <span
                              onClick={() =>
                                bundleQty > 1 ? setBundleQty(bundleQty - 1) : 1
                              }
                            >
                              -
                            </span>
                            <input
                              type="text"
                              placeholder="0"
                              value={bundleQty}
                            />
                            <span onClick={() => setBundleQty(bundleQty + 1)}>
                              +
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center" style={{ color: "#fff" }}>
                        Sorry, we couldn't find any plans matching your
                        selection.
                      </div>
                    )}
                  </div> */}
                </div>
                <div className={styles.leftcheckoutable}>
                  <div className={styles.scrollTable}>
                    {bundleDetails ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Products</th>
                            <th>Pack</th>
                            <th>Quantity</th>
                            <th>Sub-Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className={styles.itmenImage}>
                                <span>
                                  <img src={CheckoutIcon} alt="" />
                                </span>
                                <div>
                                  <h5>{order?.name}</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              {order.priceSymbol}{" "}
                              {(order?.planPrice / order?.quantity).toFixed(2)}
                            </td>
                            <td>
                              <div className={styles.pliceselect}>
                                <div className={styles.gormGroup}>
                                  <span
                                    className={styles.decrement}
                                    onClick={decreaseQuantity}
                                  >
                                    -
                                  </span>
                                  <p className="mb-0">{order.quantity}</p>
                                  <span
                                    className={styles.increment}
                                    onClick={increaseQuantity}
                                  >
                                    +
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              {order.priceSymbol}{" "}
                              {order.planPrice && order?.planPrice.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center" style={{ color: "#fff" }}>
                        Sorry, we couldn't find any plans matching your
                        selection.
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.coverCountryOuter}>
                  <h4>
                    Coverage Countries (
                    {esimFilterData?.coverageCountries?.length})
                  </h4>
                  <div className={styles.coverageCountry}>
                    <ul>
                      {esimFilterData &&
                        esimFilterData?.coverageCountries?.map(
                          (item: any, index: number) => (
                            <li>
                              <span>
                                <img src={item?.flagImageUrl} alt="" />
                                {item?.name}
                              </span>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                </div>
                <div className={styles.EnterDevice}>
                  <p>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onClick={(e: any) => {
                        setDeviceDropDown(e.target.checked);
                      }}
                      id="flexCheckDefault"
                    />{" "}
                    Before completing this order please confirm your device is
                    eSIM compatible and network - unlocked.{" "}
                    <span data-bs-toggle="modal" data-bs-target="#supportModal">
                      {" "}
                      Learn More
                    </span>
                  </p>
                  {deviceDropDown && (
                    <>
                      <div className={styles.FromGroup}>
                        <input
                          type="text"
                          placeholder="Kindly provide the device name to continue"
                          onChange={(e) => {
                            setDeviceName(e.target.value);
                          }}
                          value={deviceName}
                          style={{ color: "#fff" }}
                        />
                        <button onClick={handelCompatibleDevice}>Apply</button>
                      </div>
                      {(deviceNameMsg?.error || deviceNameMsg?.success) && (
                        <div
                          style={{
                            color: deviceNameMsg?.error ? "red" : "green",
                          }}
                        >
                          {deviceNameMsg?.error || deviceNameMsg?.success}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="checoutPay">
                  {finalPrice > 0 && (
                    <div className={styles.chosepayment}>
                      <h6>Choose Payment Method</h6>
                      {paymentMethodError && selectedPaymentMethod === 0 && (
                        <span className="error">{paymentMethodError}</span>
                      )}
                      <ul>
                        {paymentGateway == PAYMENT_METHOD.STRIPEPAY && (
                          <li onClick={() => handlePaymentMethod(1)}>
                            <span>
                              <img src={CreditCardPayIcon} alt="creditCard" />
                              <div className={styles.visass}>
                                Credit / Debit Card{" "}
                                <p>Visa, Mastercard, AMEX, CUP, JCB</p>
                              </div>
                            </span>
                            <label>
                              {" "}
                              {selectedPaymentMethod === 1 && (
                                <button className={styles.selected}>
                                  Selected
                                </button>
                              )}
                              {/* <i className="fas fa-chevron-right"></i> */}
                            </label>
                          </li>
                        )}
                        {paymentGateway == PAYMENT_METHOD.RAZORPAY && (
                          <li onClick={() => handlePaymentMethod(2)}>
                            <span>
                              <img src={CreditCardPayIcon} alt="creditCard" />
                              <div className={styles.visass}>
                                Credit / Debit Card{" "}
                                <p>Visa, Mastercard, AMEX, CUP, JCB Razorpay</p>
                              </div>
                            </span>
                            <label>
                              {" "}
                              {selectedPaymentMethod === 2 && (
                                <button className={styles.selected}>
                                  Selected
                                </button>
                              )}
                              {/* <i className="fas fa-chevron-right"></i> */}
                            </label>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={styles.EnterDevice}>
                  <h1>Coming Soon</h1>
                  <div className={styles.blurContainer}>
                    <p>
                      <input
                        checked
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        // onClick={(e: any) => {
                        //   setAirlineDropDown(e.target.checked);
                        // }}
                        id="flexCheckDefault"
                      />{" "}
                      <b>Airline Membership</b>
                    </p>
                    {/* {airlineDropDown && ( */}
                    {true && (
                      <div className={styles.AirlineMember}>
                        <div className="row">
                          <div className="col-md-6">
                            <div className={styles.leftAir}>
                              <label>Frequent Flyer Airline</label>
                              <div className={styles.selectCus}>
                                <span
                                // onClick={() => setAirlineSelect(!airlineSelect)}
                                >
                                  Frequent Flyer Airline
                                </span>
                                {airlineSelect && (
                                  <ul>
                                    <li className={styles.active}>
                                      Amirates Airline
                                    </li>
                                    <li>Air Mauritius Airline</li>
                                    <li>Air Mauritius Airline </li>
                                    <li>Air India Airline</li>
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className={styles.leftAir}>
                              <label>Number</label>
                              <input
                                disabled
                                type="number"
                                placeholder="Enter Number"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {offersForYou?.length > 0 && (
                  <div className={styles.offerWeProvide}>
                    <h4>Offers for you</h4>
                    {offersForYou.map((item: any, index: number) => (
                      <div className={styles.oferOuter}>
                        <div className={styles.offerHead}>
                          <span>{item?.benefit}</span>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!order?.offerApplied)
                                handleOffersForyou(item?._id, item?.offerType);
                            }}
                          >
                            {order?.offerApplied ? "Appllied" : "Apply"}
                          </a>
                        </div>
                        <h5>{item?.detailText}</h5>
                        <p>{item?.description}</p>
                        <h6>
                          Expires {moment(item?.endDate).format("MMM DD, YYYY")}
                        </h6>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <div className={styles.rightCheckout}>
                  {bundleDetails && (
                    <div className={styles.payemntSummery}>
                      <h6>Plan Details</h6>
                      <ul>
                        <li>
                          <span>Data</span>{" "}
                          <label>
                            {order?.dataAmount == -1
                              ? "Unlimited"
                              : order?.dataAmount / 1000 < 1
                              ? order?.dataAmount?.toFixed(3) + " MB"
                              : order?.dataAmount / 1000 + " GB"}
                          </label>
                        </li>
                        <li>
                          <span>Validity</span>{" "}
                          <label>
                            {order?.duration <= 1
                              ? order?.duration + " Day"
                              : order?.duration + " Days"}
                          </label>
                        </li>
                      </ul>

                      <h6>Payment Summary</h6>
                      <ul>
                        <li>
                          <span>Sub-total</span>{" "}
                          <label>
                            {order.priceSymbol}{" "}
                            {order?.planPrice && order.planPrice.toFixed(2)}
                          </label>
                        </li>
                        {/* <li>
                                            <span>Shipping</span> <label>$Free</label>
                                        </li> */}
                        {order.discountPrice ? (
                          <li>
                            <span>Discount</span>{" "}
                            <label>
                              {order?.priceSymbol} {order.discountPrice}
                            </label>
                          </li>
                        ) : null}
                        {/* <li>
                                            <span>Tax</span> <label>$00</label>
                                        </li> */}
                        <li className={styles.Total}>
                          <span>Total</span>
                          <label>
                            {order?.priceSymbol}{" "}
                            {order.finalPrice && order.finalPrice.toFixed(2)}
                          </label>
                        </li>
                      </ul>
                      <div className={styles.applyPromo}>
                        <h5>Apply Promo Code</h5>
                        <span style={{ color: "green" }}>
                          {order?.promoApplied && "Promo code apllied"}
                        </span>
                        <form onSubmit={handleSearchSubmit}>
                          <div className={styles.formGroup}>
                            <input
                              type="text"
                              placeholder="Enter Promo Code"
                              value={promoCode}
                              onChange={handleSearchSubmit}
                              style={{ color: "#ffffff" }}
                            />
                            <button type="submit">Apply</button>
                          </div>
                        </form>
                        {/* <input type="text" placeholder="Enter Promo Code" onChange={(e) => setPromoCode(e.target.value)} />
                        <button>Apply</button> */}

                        <p>
                          You can apply your discount / referral code or use
                          airmoney with your purchase
                        </p>
                      </div>
                      <button
                        onClick={
                          isAuthenticated
                            ? () => handleCheckout()
                            : () => {
                                const niyoToken =
                                  window.localStorage.getItem("niyoToken");
                                if (!niyoToken) {
                                  window.localStorage.setItem(
                                    "current_url",
                                    `/checkout/${params.id}/?paymentGateway=${paymentGateway}`
                                  );
                                  navigate(`/login`);
                                } else {
                                  handleCheckout();
                                }
                              }
                        }
                        disabled={urlToken && secureToken?.error ? true : false}
                      >
                        Proceed to Checkout{" "}
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  )}

                  <div className={styles.packageDetailsPoint}>
                    <h4>
                      Package Details{" "}
                      {/* <span>
                      <img src={arui} alt="" />
                    </span> */}
                    </h4>
                    <ul>
                      <li>
                        <span>Free cancellation befor redemption</span>
                      </li>
                      <li>
                        <span>Instant Configuration</span>
                      </li>
                      <li>
                        <span>Valid 180 Days</span>
                      </li>
                    </ul>
                    <div className={styles.usageOncept}>
                      <div className={styles.usagedetailOuter}>
                        <div className={styles.usagebox}>
                          Usage validity
                          {/* <i className="fas fa-chevron-down"></i> */}
                        </div>
                        <div className={styles.usageBody}>
                          <p>
                            The voucher is valid for 180 day(s) from the booking
                            confirmation date. It expires at the same booking
                            confirmation time on the last day. (I.e. If the
                            booking confirmation time is at 13:00, it will
                            expire at 13:00 180 day(s) later).
                          </p>
                        </div>
                      </div>

                      <div className={styles.usagedetailOuter}>
                        <div className={styles.usagebox}>
                          Additional information{" "}
                          {/* <i className="fas fa-chevron-down"></i> */}
                        </div>
                        <div className={styles.usageBody}>
                          <p>
                            The voucher is valid for 180 day(s) from the booking
                            confirmation date. It expires at the same booking
                            confirmation time on the last day. (I.e. If the
                            booking confirmation time is at 13:00, it will
                            expire at 13:00 180 day(s) later).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {
          // selectedPaymentMethod === 2 || selectedPaymentMethod === 1 &&
          show && (
            <StripePaymentModal
              show={show}
              {...paymentDetails}
              orderId={params.id as string}
              closeModal={() => setShow(false)}
              paymentMethod={selectedPaymentMethod}
              siteDomain={window.localStorage.getItem("niyoToken") as string}
              
            />
          )
        }
      </div>

      <div
        className="modal fade show"
        id="changeplan"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: showPackageOption ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header p-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowPackageOption(!showPackageOption)}
              ></button>
            </div>
            <div className="modal-body p-0 b-0">
              <div className={styles.PacageOptioOuter}>
                <h4>
                  Package options
                  <a href="#">Clear All</a>
                </h4>
                <div className={styles.SelectSim}>
                  <h6>SIM card validity</h6>
                  <ul>
                    {esimFilterData &&
                      esimFilterData?.validityDays?.map(
                        (item: number, index: number) => (
                          <li
                            className={
                              item === bundlePlans ? styles.active : ""
                            }
                            onClick={() =>
                              handleBundleDetails({
                                duration: item,
                                dataAmount: bundleAmount,
                                search: order?.name,
                              })
                            }
                          >
                            <span>
                              {item > 1 ? item + ` Days` : item + ` Day`}
                            </span>
                          </li>
                        )
                      )}
                  </ul>
                </div>
                <div className={styles.SelectSim}>
                  <h6>Data package</h6>
                  <ul>
                    {esimFilterData &&
                      esimFilterData?.dataAmount?.map(
                        (item: number, index: number) => (
                          <li
                            className={
                              item === bundleAmount ? styles.active : ""
                            }
                            onClick={() =>
                              handleBundleDetails({
                                dataAmount: item,
                                duration: bundlePlans,
                                search: order?.name,
                              })
                            }
                          >
                            <span>
                              {item === -1 ? ` Unlimited` : item / 1000 + ` GB`}
                            </span>
                          </li>
                        )
                      )}
                  </ul>
                </div>
                <div className={styles.Quantity}>
                  <h6>Quantity</h6>
                  {bundleDetails ? (
                    <div className={styles.quaOuter}>
                      <label>
                        <img src={chip} alt="" />
                        {bundleDetails?.name}
                      </label>
                      <div className={styles.count}>
                        <h5>
                          {bundleDetails?.priceSymbol}{" "}
                          {(
                            (bundleDetails?.price
                              ? bundleDetails?.price
                              : bundleDetails?.planPrice) * bundleQty
                          ).toFixed(2)}
                        </h5>
                        <div className={styles.inputCount}>
                          <span
                            onClick={() =>
                              bundleQty > 1 ? setBundleQty(bundleQty - 1) : 1
                            }
                          >
                            -
                          </span>
                          <input
                            type="text"
                            placeholder="0"
                            value={bundleQty}
                          />
                          <span onClick={() => setBundleQty(bundleQty + 1)}>
                            +
                          </span>
                        </div>

                        <button
                          className={styles.inputCount}
                          onClick={handleFilterOrderUpdate}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center" style={{ color: "#fff" }}>
                      Plans not found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
