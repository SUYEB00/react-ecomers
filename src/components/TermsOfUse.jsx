import React from "react";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFE] py-10 px-4 md:px-16 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#222] mb-3 text-center">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Last updated: [Your Date]
        </p>

        {/* Intro */}
        <p className="text-gray-600 mb-6">
          Welcome to <strong>TrendZone</strong>. By accessing or purchasing from
          our platform, you agree to the Terms & Conditions outlined below.
          Please read them carefully.
        </p>

        {/* 1 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          1. Use of Platform
        </h2>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>You must use the website legally.</li>
          <li>No hacking, exploitation, or misuse of our services.</li>
          <li>You are responsible for activities under your account.</li>
        </ul>

        {/* 2 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          2. Products & Pricing
        </h2>
        <p className="text-gray-600 mb-6">
          Prices may change without prior notice. Product colors, sizes, or
          descriptions may slightly vary due to photography or screen
          resolution.
        </p>

        {/* 3 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          3. Orders & Payments
        </h2>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>All provided information must be accurate.</li>
          <li>
            Orders may be cancelled due to stock issues or incorrect details.
          </li>
          <li>
            COD, card, and mobile banking payments are accepted (if active).
          </li>
        </ul>

        {/* 4 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          4. Shipping & Delivery
        </h2>
        <p className="text-gray-600 mb-6">
          Delivery times vary by location. Any delay caused by courier service
          is beyond our control, but we assist in resolving issues.
        </p>

        {/* 5 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          5. Returns & Refunds
        </h2>
        <p className="text-gray-600 mb-2">Returns are only accepted for:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>Manufacturing defects</li>
          <li>Wrong product received</li>
          <li>Damaged item on arrival</li>
        </ul>
        <p className="text-gray-600 mb-6">
          Refund request must be submitted within{" "}
          <strong>[Your Return Time]</strong>. Items must remain unused with
          original packaging.
        </p>

        {/* 6 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          6. Account Responsibilities
        </h2>
        <p className="text-gray-600 mb-6">
          Keep your login details secure. We may suspend accounts involved in
          suspicious activity, fraud, or policy violations.
        </p>

        {/* 7 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          7. Limitation of Liability
        </h2>
        <p className="text-gray-600 mb-6">
          TrendZone is not responsible for courier delays, misuse of products,
          technical errors, or unauthorized account access.
        </p>

        {/* 8 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          8. Intellectual Property
        </h2>
        <p className="text-gray-600 mb-6">
          All images, branding, logos, and content belong to TrendZone. Reuse
          without written permission is prohibited.
        </p>

        {/* 9 */}
        <h2 className="text-xl font-semibold text-[#222] mb-2">
          9. Contact Information
        </h2>
        <p className="text-gray-600 mb-1">
          For any questions or help, reach us:
        </p>
        <p className="text-gray-700 font-semibold">Email: [Your Email]</p>
      </div>
    </div>
  );
};

export default TermsOfUse;
