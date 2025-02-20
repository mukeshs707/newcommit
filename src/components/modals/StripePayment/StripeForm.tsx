import React, { useState } from 'react';
import { useStripe, useElements, CardExpiryElement, CardNumberElement, CardCvcElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from "./style/style.module.css";
import { updateStripePayment } from './api';
import useStripeOptions from '../../../lib/hooks/useStripeOptions';
import { StripeCardNumberElement, StripeError } from '@stripe/stripe-js';
import { NIYO_URL } from '../../../config';

interface Props {
    paymentId: string;
    setupIntent: string;
    clientSecret: string;
    siteDomain:string;
    orderId?:string
}

const StripeForm: React.FC<Props> = ({ paymentId, setupIntent, clientSecret, siteDomain, orderId }) => {
    const stripe = useStripe();
    const navigate = useNavigate();
    const stripeElements = useElements();
    const stripeOptions = useStripeOptions();

    const [error, setError] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !stripeElements) {
            return;
        }

        const cardElement = stripeElements.getElement(CardNumberElement);
        if (!cardElement) {
            return;
        }

        try {
            // Assuming `stripe` and `cardElement` are already initialized and available in your context
            const promise: any = stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement as StripeCardNumberElement,
                    },
                },
                {
                    handleActions: true, // Disable the default next action handling.
                }
            );
            const loadingToastId = toast.loading('Processing your payment...');

            promise.then((result: any) => {
                if (result.error) {
                    toast.update(loadingToastId, {
                        render: result.error.message || 'An error occurred.',
                        type: 'error',
                        isLoading: false,
                        autoClose: 5000
                    });
                } else {
                    toast.update(loadingToastId, {
                        render: 'Payment successful!',
                        type: 'success',
                        isLoading: false,
                        autoClose: 5000
                    });
                    if (siteDomain) {
                        window.location.href = `${NIYO_URL}?status=true`;
                    } else {
                        setPaymentSuccess(true);
                    }
                }
            }).catch((err: any) => {
                setError(err.message || 'An unexpected error occurred.');
                toast.update(loadingToastId, {
                    render: err.message || 'An unexpected error occurred.',
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000
                });
            });
        } catch (err) {
            setError((err as StripeError)?.message ?? 'An unexpected error occurred.');
            toast.error( `${err} test`);
        }
    };

    if (paymentSuccess) {
        if(window.localStorage.getItem('niyoToken')) {
            window.localStorage.removeItem("niyoToken")
            window.location.href="http://localhost:3001"
        } else if (window.localStorage.getItem("showDocuments") === "true") {
            navigate(`/document/${orderId}/?document=${true}`)
        } else {
            return <Navigate to="/payment" />;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <span className="error">{error}</span>}
            <div className="mb-2">
                <label className={styles.label}>Card number</label>
                <CardNumberElement options={stripeOptions} className={styles.cardInput} />
            </div>
            <div className="mb-2">
                <label className={styles.label}>Expiration date</label>
                <CardExpiryElement options={stripeOptions} className={styles.cardInput} />
            </div>
            <div className="mb-2">
                <label className={styles.label}>CVC</label>
                <CardCvcElement options={stripeOptions} className={styles.cardInput} />
            </div>
            <button className={styles.pay} type="submit" disabled={!stripe}>Pay</button>
        </form>
    );
};

export default StripeForm;
