import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required").matches(/^[A-Za-z\s]+$/, 'First Name contains only alphabetic characters')
    .max(25)
    .test('no-whitespace', 'Last name should not start or end with whitespace', value => {
        if (value) {
            return value === value.trim();
        }
        return true;
    }),
    lastName: Yup.string().required("Last Name is required").matches(/^[A-Za-z\s]+$/, 'Last Name contains only alphabetic characters')
    .max(25)
    .test('no-whitespace', 'Last name should not start or end with whitespace', value => {
        if (value) {
            return value === value.trim();
        }
        return true;
    }),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    message: Yup.string().required("Meassage is required"),
    phoneNumber: Yup.string().required("Phone number is required"),

});

export default function customIsValidPhoneNumber(value: string | undefined): boolean {
    if (!value) {
        return false;
    }

    try {
        const phoneNumber = parsePhoneNumber(value);
        return phoneNumber ? isValidPhoneNumber(phoneNumber.number) : false;
    } catch (error) {
        console.error('Error validating phone number:', error);
        return false;
    }
}
