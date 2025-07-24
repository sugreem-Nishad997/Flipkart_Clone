import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Button } from "@mui/material";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function PaymentButton({totals}) {

    const { createOrder, verifyPayment } = useContext(AuthContext);
    const [amount, setAmount] = useState(1);
    const [message, setMessage] = useState("");
    const handlePayment = async () => {
        setAmount(1)
        setMessage("");
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            setMessage("❌ Razorpay SDK failed to load");
            return;
        }

        const order = await createOrder(amount);
        if (!order) {
            setMessage("❌ Could not create payment order.");
            return;
        }
        const options = {
            key: "rzp_test_fisvl8f5kqWIHL", // Public Key
            amount: order.amount,
            currency: order.currency,
            name: "My Shop",
            description: "Test Payment",
            order_id: order.id,
            method: "upi",
            handler: async function (response) {
                const success = await verifyPayment(
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature,
                    amount
                );

                setMessage(success ? "✅ Payment successful!" : "❌ Payment failed to verify");
            },
            theme: { color: "#3399cc" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div>
            <div className="placeOrder2">
                <span className='fw-bold fs-3'>₹{Math.round(totals && totals.totalPayable + 166)}</span>
                <Button variant="contained" sx={{ backgroundColor: '#fb641b', padding: '0.5rem' }} onClick={handlePayment}>place order</Button>
            </div>
            {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
        </div>
    );
};

