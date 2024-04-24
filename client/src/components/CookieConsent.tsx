// client/src/components/CookieConsentBanner.tsx

import React from "react";

const CookieConsentBanner = ({ onConsent }: { onConsent: () => void }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
    onConsent();
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent-banner">
      <p>We use cookies to enhance your experience...</p>
      <button onClick={handleAccept}>Accept</button>
    </div>
  );
};

export default CookieConsentBanner;
