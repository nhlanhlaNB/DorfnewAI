"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./PageContent.module.css";

const PageContent = () => {
  const pathname = usePathname();

  const contentMap = {
    "/about": {
      title: "About Us",
      body: (
        <div>
          <p>
            DorfNewAI is a fully AI-driven creative platform designed to help content
            creators generate <strong>videos, images, music, and voices</strong> effortlessly.
          </p>
          <p>
            Our mission is to empower creators worldwide by giving them access to
            cutting-edge AI tools that save time and unlock creativity.
          </p>
          <p>
            <strong>Co-Founders:</strong>
            <br />• Nhlanhla – <a href="mailto:nhlanhla@dorfnew.com">nhlanhla@dorfnew.com</a>
            <br />• Junior – <a href="mailto:junior@dorfnew.com">junior@dorfnew.com</a>
          </p>
        </div>
      ),
      backLink: { href: "/", label: "← Back to Home" },
    },
    "/contact": {
      title: "Contact Us",
      body: (
        <div>
          <p>We&apos;d love to hear from you! Reach out to our team anytime via email:</p>
          <ul>
            <li>
              General Inquiries: <a href="mailto:team@dorfnew.com">team@dorfnew.com</a>
            </li>
            <li>
              Nhlanhla (Co-Founder):{" "}
              <a href="mailto:nhlanhla@dorfnew.com">nhlanhla@dorfnew.com</a>
            </li>
            <li>
              Junior (Co-Founder):{" "}
              <a href="mailto:junior@dorfnew.com">junior@dorfnew.com</a>
            </li>
          </ul>
        </div>
      ),
      backLink: { href: "/", label: "← Back to Home" },
    },
    "/privacy": {
      title: "Privacy Policy",
      body: (
        <div>
          <p>
            At DorfNewAI, we respect your privacy. Any data shared with us will
            only be used to improve your experience and will never be sold to
            third parties.
          </p>
          <p>
            We may collect usage information to improve our services, but your
            content and creations remain fully yours.
          </p>
        </div>
      ),
      backLink: { href: "/", label: "← Back to Home" },
    },
    "/support": {
      title: "Support",
      body: (
        <div>
          <p>
            Need help? Our support team is ready to assist you with technical
            issues, billing, or account questions.
          </p>
          <p>
            Contact us at <a href="mailto:team@dorfnew.com">team@dorfnew.com</a> and we&apos;ll
            get back to you quickly.
          </p>
          <p>
            You can also check our <Link href="/faq">FAQ section</Link>.
          </p>
        </div>
      ),
      backLink: { href: "/faq", label: "→ Go to FAQ" },
    },
    "/faq": {
      title: "Frequently Asked Questions",
      body: (
        <div>
          <p>Here you&apos;ll find answers to the most common questions about DorfNewAI.</p>
        </div>
      ),
      backLink: { href: "/support", label: "← Back to Support" },
    },
  };

  const pageData = contentMap[pathname as keyof typeof contentMap] || {
    title: "Page Not Found",
    body: <p>Sorry, this page does not exist.</p>,
    backLink: { href: "/", label: "← Back to Home" },
  };

  return (
    <div className={styles.container}>
      <main className={styles.pageMain}>
        <h1 className={styles.pageTitle}>{pageData.title}</h1>
        <div className={styles.pageBody}>{pageData.body}</div>
        {pageData.backLink && (
          <Link href={pageData.backLink.href} className={styles.backLink}>
            {pageData.backLink.label}
          </Link>
        )}
      </main>
    </div>
  );
};

export default PageContent;