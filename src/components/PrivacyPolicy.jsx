import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFE] py-10 px-4 md:px-16 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#222] mb-3 text-center">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Last updated: [Your Date]
        </p>

        {/* Intro */}
        <p className="text-gray-600 mb-6">
          Welcome to <strong>TrendZone</strong> (“we”, “our”, “us”). Protecting
          your privacy is extremely important to us. This policy explains how
          your information is collected, used, stored, and safeguarded when
          using our services.
        </p>

        {/* 1 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          1. Information We Collect
        </h2>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Shipping and billing address</li>
          <li>Payment information (processed securely)</li>
        </ul>

        {/* 2 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>To create and manage your account</li>
          <li>To verify and process orders and payments</li>
          <li>To deliver products and provide customer support</li>
          <li>To improve website experience and performance</li>
          <li>To communicate with you about updates or offers</li>
          <li>To detect and prevent fraud or security risks</li>
        </ul>

        {/* 3 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          3. Sharing Your Information
        </h2>
        <p className="text-gray-600 mb-6">
          We <strong>do not sell</strong> your personal information. We may
          share limited data with: delivery partners, payment gateways, and
          authorized analytics tools when necessary.
        </p>

        {/* 4 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          4. Data Security
        </h2>
        <p className="text-gray-600 mb-6">
          We use secure technology including HTTPS, encryption, firewalls, and
          authentication systems to keep your information protected at all
          times.
        </p>

        {/* 5 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          5. Your Rights
        </h2>
        <p className="text-gray-600 mb-6">
          You can request to access, modify, or delete your personal data
          anytime by contacting us. We will process such requests according to
          legal requirements.
        </p>

        {/* 6 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          6. Contact Information
        </h2>
        <p className="text-gray-600">
          For privacy-related concerns or questions, contact:
        </p>
        <p className="text-gray-800 font-semibold mb-2">Email: [Your Email]</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
