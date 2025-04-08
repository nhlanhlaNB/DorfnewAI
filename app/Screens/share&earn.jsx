import React, { useState, useEffect } from 'react';
import './ShareAndEarn.css'; // Import your external CSS file

const ShareAndEarn = () => {
    const [userId] = useState('12345'); // Example user ID, dynamically loaded in real scenario
    const [referralLink, setReferralLink] = useState('');
    const [earnedRewards, setEarnedRewards] = useState(0);
    const [message, setMessage] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');

    // Generate referral link when the component loads
    useEffect(() => {
        const generateReferralLink = (userId) => {
            const baseUrl = 'https://yourgoosebumpapp.com/referral';
            const link = `${baseUrl}?ref=${userId}`;
            setReferralLink(link);
        };

        generateReferralLink(userId);
        fetchEarnedRewards(userId);
    }, [userId]);

    // Copy referral link to clipboard
    const copyReferralLink = () => {
        navigator.clipboard.writeText(referralLink)
            .then(() => setMessage('Referral link copied to clipboard!'))
            .catch((err) => setMessage(`Failed to copy the link: ${err}`));
    };

    // Function to share on social media
    const shareOnSocialMedia = (platform) => {
        let shareUrl = '';
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20platform%20on%20Goosebump!&url=${referralLink}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=Check%20out%20Goosebump%20here:%20${referralLink}`;
                break;
            default:
                setMessage('Unknown platform');
                return;
        }
        window.open(shareUrl, '_blank');
    };

    // Function to fetch earned rewards
    const fetchEarnedRewards = (userId) => {
        // Simulated fetch from backend (replace with your actual API call)
        fetch(`/api/getRewards?userId=${userId}`)
            .then((response) => response.json())
            .then((data) => {
                setEarnedRewards(data.rewards || 0);
            })
            .catch((error) => console.error('Error fetching rewards:', error));
    };

    // Submit banking details (simulated API call)
    const handleBankDetailsSubmit = (e) => {
        e.preventDefault();
        // Simulated API request (replace with actual implementation)
        console.log('Banking details submitted:', { bankName, accountNumber, routingNumber });
        setMessage('Banking details saved successfully!');
    };

    return (
        <div className="share-earn-page">
            <h1>Share & Earn</h1>

            {/* Referral Link Section */}
            <div className="section referral-section">
                <h2>Your Referral Link</h2>
                <div className="input-group">
                    <input type="text" value={referralLink} readOnly className="referral-input" />
                    <button className="btn-copy" onClick={copyReferralLink}>Copy Link</button>
                </div>
                {message && <p className="message">{message}</p>}
            </div>

            {/* Social Sharing Section */}
            <div className="section social-section">
                <h2>Share on Social Media</h2>
                <div className="social-buttons">
                    <button className="btn-social twitter" onClick={() => shareOnSocialMedia('twitter')}>Twitter</button>
                    <button className="btn-social facebook" onClick={() => shareOnSocialMedia('facebook')}>Facebook</button>
                    <button className="btn-social whatsapp" onClick={() => shareOnSocialMedia('whatsapp')}>WhatsApp</button>
                </div>
            </div>

            {/* Earned Rewards Section */}
            <div className="section rewards-section">
                <h2>Your Rewards</h2>
                <p className="rewards-amount">${earnedRewards}</p>
            </div>

            {/* Banking Details for Creators */}
            <div className="section banking-section">
                <h2>Upload Banking Details</h2>
                <form onSubmit={handleBankDetailsSubmit} className="banking-form">
                    <div className="input-group">
                        <label htmlFor="bankName">Bank Name:</label>
                        <input
                            type="text"
                            id="bankName"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="accountNumber">Account Number:</label>
                        <input
                            type="text"
                            id="accountNumber"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="routingNumber">Routing Number:</label>
                        <input
                            type="text"
                            id="routingNumber"
                            value={routingNumber}
                            onChange={(e) => setRoutingNumber(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit">Save Banking Details</button>
                </form>
            </div>
        </div>
    );
};

export default ShareAndEarn;



