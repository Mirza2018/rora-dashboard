"use client";
import RichTextEditor from "@/components/legal_page/RichTextEditor";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const HelpCenterPage = () => {
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
            Help Center Preview
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

export default HelpCenterPage;

const html = `<h1>Help & Support</h1>

<p>
Welcome to our Help Center. Here you can find answers to common questions and
learn how to use our platform effectively.
</p>

<h2>Getting Started</h2>

<p>
To begin using our platform, create an account and complete your profile.
Once your account is set up, you can access all available features from your dashboard.
</p>

<h2>Frequently Asked Questions</h2>

<h3>How do I create an account?</h3>
<p>
Click the <strong>Sign Up</strong> button on the homepage, provide the required
information, and verify your email address.
</p>

<h3>How do I reset my password?</h3>
<p>
Go to the login page and click <strong>Forgot Password</strong>. Follow the
instructions sent to your registered email address.
</p>

<h3>How do I update my profile?</h3>
<p>
Navigate to <strong>Profile Settings</strong> from your dashboard and edit your
personal information. Don't forget to save your changes.
</p>

<h3>How can I change my email address?</h3>
<p>
Open your account settings, update your email address, and complete the
verification process if required.
</p>

<h2>Account Issues</h2>

<ul>
  <li>Unable to log in to your account.</li>
  <li>Forgotten password.</li>
  <li>Account locked or suspended.</li>
  <li>Problems updating profile information.</li>
</ul>

<h2>Payments & Billing</h2>

<ul>
  <li>View payment history.</li>
  <li>Download invoices.</li>
  <li>Update payment method.</li>
  <li>Request a refund (where applicable).</li>
</ul>

<h2>Technical Support</h2>

<p>
If you experience technical issues, try the following:
</p>

<ol>
  <li>Refresh the page.</li>
  <li>Clear your browser cache.</li>
  <li>Try a different browser.</li>
  <li>Ensure you have a stable internet connection.</li>
</ol>

<h2>Contact Support</h2>

<p>
If you need additional assistance, our support team is ready to help.
</p>

<ul>
  <li>Email: support@example.com</li>
  <li>Phone: +1 (000) 000-0000</li>
  <li>Support Hours: Monday – Friday, 9:00 AM – 6:00 PM</li>
</ul>

<h2>Report a Problem</h2>

<p>
When reporting an issue, please include:
</p>

<ul>
  <li>A detailed description of the problem.</li>
  <li>Screenshots (if available).</li>
  <li>The device and browser you are using.</li>
  <li>The approximate time the issue occurred.</li>
</ul>

<h2>Need More Help?</h2>

<p>
If you cannot find the information you are looking for, please contact our
support team. We will do our best to respond as quickly as possible.
</p>`;
