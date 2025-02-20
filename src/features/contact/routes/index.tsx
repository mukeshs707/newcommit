import { useEffect, useState } from 'react';
import styles from '../styles/style.module.css';
import Layout from "../../../components/layout"
import { ContactInfo, ContactUsType, ContactValuesData } from '../api/Checkout';
import MainLoader from '../../../components/mainLoader';
import { Link } from 'react-router-dom';
import call from "../../../assets/images/call.png"
import email from "../../../assets/images/email.png"
import location from "../../../assets/images/location.png"
import { Field, Formik, FormikHelpers } from 'formik';
import Swal from 'sweetalert2';
import PhoneInput from 'react-phone-input-2';
import customIsValidPhoneNumber, { validationSchema } from '../utils/validation';
import 'react-phone-input-2/lib/style.css'


const Contact = () => {
    const [contactData, setContactData] = useState<Array<any>>([]);
    const [loader, setLoader] = useState<boolean>(true);
    const [subjectOptions, setSubjectOptions] = useState<Array<any>>([]);

    const fetchContactInfo = async () => {
        try {
            const response = await ContactInfo()

            const iconarr = [email, call, location]
            const arr = response.data.data.fields.map((item: any, index: number) => {
                return {

                    value: item.value,
                    icon: iconarr[index]
                }
            })
            setLoader(false)
            setContactData(arr)

        } catch (error) {
            console.error('Error fetching contact information:', error);
        }
    }

    const fetchData = async () => {
        try {
            const response = await ContactUsType();

            const types = response?.data?.data.types;
            if (response?.data?.data?.types?.length > 0) {
                const options = types?.map((type: any) => ({
                    name: type?.name,
                    id: type?._id,
                }));
                setSubjectOptions(options);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchContactInfo()
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (
        values: any,
        { setSubmitting, resetForm }: FormikHelpers<any>
    ) => {
        try {
            setLoader(true)
            await ContactValuesData(values);
            // Reset the form after successful submission
            resetForm();

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your request has been submitted. Thank you!',
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoader(false)
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <meta name="description" content="Need assistance? Reach out to Commbitz for 24/7 support on eSIM services and global travel connectivity solutions." />
            <title>Contact Commbitz | Support for Global Travelers</title>
            <div className={styles.contactUS}>
                <div className='container'>
                    <h3>Contact Us</h3>
                    <div className={styles.contactOuter}>
                        {loader &&
                            <MainLoader />
                        }
                        <div className={styles.leftContactLeft}>
                            <h4>Contact Information</h4>
                            <h5>Say something to start a live chat!</h5>
                            {contactData?.length &&
                                <>
                                    <h5 className={styles.addressTitle}>Head Office</h5>
                                    <p className={styles.addressItem}><img src={contactData[0].icon} alt="" /> <a style={{ color: "#000" }} href={`mailto:${contactData[0].value}`}>{contactData[0].value}</a></p>
                                    <p className={styles.addressItem} ><img src={contactData[1].icon} alt="" /> <a style={{ color: "#000" }} href={`tel:${contactData[1].value}`}>{contactData[1].value}</a></p>
                                    <p className={styles.addressItem} ><img src={contactData[2].icon} alt="" />{contactData[2].value}</p>

                                    {/* <h5 className={styles.addressTitle}>Regional  Office</h5>

                                    <p className={styles.addressItem} ><img src={contactData[0].icon} alt="" /> <a style={{ color: "#000" }} href={`mailto:${contactData[3].value}`}>{contactData[3].value}</a></p>
                                    <p className={styles.addressItem} ><img src={contactData[1].icon} alt="" /> <a style={{ color: "#000" }} href={`tel:${contactData[4].value}`}>{contactData[4].value}</a></p>
                                    <p className={styles.addressItem} ><img src={contactData[2].icon} alt="" />{contactData[5].value}</p> */}

                                    <ul>
                                        <li><Link to={contactData[6].value}><i className="fab fa-youtube"></i></Link></li>
                                        <li><Link to={contactData[7].value}><i className="fab fa-facebook-f"></i></Link></li>
                                        <li><Link to={contactData[8].value}><i className="fab fa-instagram"></i> </Link></li>
                                    </ul>
                                </>
                            }
                        </div>
                        <div className={styles.leftContactRight}>
                            <Formik
                                initialValues={{
                                    firstName: "",
                                    lastName: "",
                                    phoneNumber: "",
                                    email: "",

                                    message: "",
                                    countryCode: "",
                                    subject: "",
                                }}
                                onSubmit={handleSubmit}
                                validationSchema={validationSchema}
                            >
                                {({
                                    values,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    isSubmitting,
                                    errors, // Access errors from Formik
                                    touched,
                                    resetForm,
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className={styles.fromGroup}>
                                                    <label>First Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder=""
                                                        name="firstName"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.firstName}
                                                        className={
                                                            touched.firstName && errors.firstName ? "error" : ""
                                                        }
                                                    />
                                                    {touched.firstName && errors.firstName && (
                                                        <div className="error-message">{errors.firstName}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={styles.fromGroup}>
                                                    <label>Last Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder=""
                                                        name="lastName"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.lastName}
                                                        className={
                                                            touched.lastName && errors.lastName ? "error" : ""
                                                        }
                                                    />
                                                    {touched.lastName && errors.lastName && (
                                                        <div className="error-message">{errors.lastName}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={styles.fromGroup}>
                                                    <label>Email</label>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.email}
                                                        className={touched.email && errors.email ? "error" : ""}
                                                    />
                                                    {touched.email && errors.email && (
                                                        <div className="error-message">{errors.email}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={styles.fromGroup}>
                                                    <label htmlFor="phoneNumber">Phone Number</label>

                                                    <PhoneInput
                                                        placeholder=""
                                                        country={"us"}
                                                        onBlur={handleBlur}
                                                        value={values.phoneNumber}
                                                        onChange={(phoneNumber, country) => {
                                                            // Update phoneNumber field
                                                            handleChange({
                                                                target: { name: "phoneNumber", value: phoneNumber },
                                                            });
                                                            // Update countryCode field
                                                            handleChange({
                                                                target: { name: "countryCode", value: `+${country}` },
                                                            });
                                                        }}
                                                    />

                                                    {touched.phoneNumber && errors.phoneNumber && (
                                                        <div className="error-message">{errors.phoneNumber}</div>
                                                    )}
                                                    {touched.phoneNumber &&
                                                        !errors.phoneNumber &&
                                                        !customIsValidPhoneNumber(`+${values.phoneNumber}`) && (
                                                            <div className="error-message">Invalid phone number</div>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className={styles.fromGroup}>
                                                    <h5>Select Subject?</h5>
                                                    <Field as="select" name="subject">
                                                        <option value="">Select Subject</option>
                                                        {subjectOptions.map((option, index) => (
                                                            <option key={index} value={option?.id}>
                                                                {option?.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    {/* <label htmlFor="subject" >Select Subject</label> */}

                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className={styles.fromGroup}>
                                                    <label>Message</label>
                                                    <Field
                                                        as="textarea"
                                                        id="message"
                                                        name="message"
                                                        placeholder="Enter your message"
                                                        rows={1} // Optionally set the number of rows
                                                        cols={40} // Optionally set the number of columns
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.message}
                                                        className={touched.message && errors.message ? "error" : ""}
                                                    />
                                                    {touched.message && errors.message && (
                                                        <div className="error-message">{errors.message}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className={styles.fromGroup}>
                                                    <input
                                                        type="submit"
                                                        value="Send Message"
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {loader ? (
                                            <MainLoader />
                                        ) : null}
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;