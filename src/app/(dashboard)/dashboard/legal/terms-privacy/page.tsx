"use client";
import RichTextEditor from "@/components/legal_page/RichTextEditor";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TermsAndPrivacyPage = () => {
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard/legal");
    }
  };
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-start">
        <div>
          <h1 className="text-title text-3xl font-bold flex items-center justify-start">
            {" "}
            <ChevronLeft
              onClick={handleBack}
              size={40}
              className="cursor-pointer"
            />{" "}
            Trems and Privacy Preview
          </h1>
        </div>
      </div>
      <div
        className="container mx-auto max-w-xl"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </main>
  );
};

export default TermsAndPrivacyPage;

const html = `
<h1>Terms & Conditions</h1>

<p>Last Updated: July 26, 2026</p>

<h2>1. Acceptance of Terms</h2>
<p>
By accessing and using our platform, you agree to comply with these
Terms and Conditions. If you do not agree, please do not use our services.
</p>

<h2>2. User Accounts</h2>
<ul>
  <li>You must provide accurate information.</li>
  <li>You are responsible for keeping your account secure.</li>
  <li>You are responsible for all activities under your account.</li>
</ul>

<h2>3. Prohibited Activities</h2>
<ul>
  <li>Uploading malicious content.</li>
  <li>Violating applicable laws.</li>
  <li>Attempting unauthorized access.</li>
</ul>

<h2>4. Privacy Policy</h2>
<p>
We collect only the information necessary to provide our services.
Your data is processed securely and is never sold to third parties.
</p>

<h3>Information We Collect</h3>
<ul>
  <li>Name</li>
  <li>Email Address</li>
  <li>Phone Number</li>
  <li>Usage Data</li>
</ul>

<h2>5. Cookies</h2>
<p>
We use cookies to improve user experience and analyze website traffic.
</p>

<h2>6. Data Security</h2>
<p>
We implement industry-standard security measures to protect your
personal information.
</p>

<h2>7. Changes</h2>
<p>
We reserve the right to modify these Terms and Privacy Policy at any time.
Changes become effective immediately after publication.
</p>

<h2>8. Contact</h2>
<p>
If you have questions, contact us at support@example.com.
</p>
  `;
