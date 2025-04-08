import React, { useState } from 'react';

// PaymentDetail Component for uploading banking details
const PaymentDetail = () => {
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [message, setMessage] = useState('');

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulated API call to upload payment details (replace with actual API call)
        fetch('/api/payment-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bankName,
                accountNumber,
                routingNumber,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setMessage('Payment details saved successfully!');
            } else {
                setMessage('Failed to save payment details.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setMessage('An error occurred while saving payment details.');
        });
    };

    return (
        <div className="payment-details-container">
            <h2>Upload Payment Details</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="bankName">Bank Name:</label>
                    <input
                        type="text"
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="accountNumber">Account Number:</label>
                    <input
                        type="text"
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="routingNumber">Routing Number:</label>
                    <input
                        type="text"
                        id="routingNumber"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Save Payment Details</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default PaymentDetail;
