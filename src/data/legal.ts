// Copy for the legal pages. A block is a paragraph (string) or a bulleted list
// (string[]). Written against what the site actually does: no analytics, no
// advertising trackers and no cookies; the contact form is emailed to the team
// through Resend and saved in the Supabase database. If any of that changes —
// say, Google Analytics is added — the privacy policy has to change with it.

export type LegalBlock = string | string[];

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  updated: string;
  intro: LegalBlock[];
  sections: LegalSection[];
}

const CONTACT_LINE =
  "Fibispace, Swayambhu Marg, 17-Dhalko, Kathmandu, Nepal · fibispace@gmail.com · +977 974-1661719";

export const LEGAL: Record<string, LegalDoc> = {
  "Privacy Policy": {
    updated: "October 18, 2026",
    intro: [
      "This Privacy Policy explains what personal information Fibispace (“Fibispace”, “we”, “us”) collects when you visit fibispace.com or contact us, how we use it, and the choices you have. We handle personal information in line with the Individual Privacy Act, 2075 (2018) of Nepal.",
    ],
    sections: [
      {
        heading: "Information we collect",
        blocks: [
          "Information you give us. When you send an enquiry through our contact form, we collect:",
          [
            "your name and, if you provide it, your organisation’s name;",
            "your phone number and email address;",
            "the service you are interested in; and",
            "the message you write to us.",
          ],
          "We also receive whatever you choose to share when you email, call or message us on social media.",
          "Information collected automatically. Like most websites, our hosting provider records basic technical details for each request, such as your IP address, browser type, the page requested and the time of the request. These logs are used to keep the site secure and working, including an automatic check that filters out malicious bots.",
          "What we do not collect. You do not need an account to use this website. We do not use analytics tools, advertising trackers or tracking cookies. The site stores one temporary value in your browser’s session storage, which is cleared when you close the tab, so it can recover from the security check without reloading repeatedly.",
        ],
      },
      {
        heading: "How we use your information",
        blocks: [
          "We use the information you send us to:",
          [
            "reply to your enquiry and discuss your project;",
            "prepare quotations and proposals you ask for;",
            "deliver and manage the services we agree to provide; and",
            "keep basic records of our communications with you.",
          ],
          "We do not sell your personal information, and we do not use it for unrelated marketing without your consent.",
        ],
      },
      {
        heading: "Who we share it with",
        blocks: [
          "We share personal information only with the service providers we need to run this website and reply to you, and only for that purpose:",
          [
            "our web hosting provider, which hosts the site and its server logs;",
            "Supabase, which hosts the database where contact form enquiries are stored;",
            "Resend, which delivers contact form enquiries to our inbox by email; and",
            "Google Fonts, which serves the typefaces used on the site. Your browser requests the fonts directly from Google, which receives your IP address.",
          ],
          "We may also disclose information if Nepali law, a court or a government authority requires it, or where it is needed to protect our rights or the safety of others.",
          "Some of these providers store data on servers outside Nepal. Where that happens, we rely on their security measures and contractual commitments to keep your information protected.",
        ],
      },
      {
        heading: "Links to other websites",
        blocks: [
          "Our website links to our social media pages, such as Instagram, Facebook and LinkedIn, and may link to client websites in our portfolio. Those sites have their own privacy policies, and we are not responsible for how they handle your information.",
        ],
      },
      {
        heading: "How long we keep it",
        blocks: [
          "We keep enquiries for as long as we need them to respond to you and, if we work together, for the length of the project and a reasonable period afterwards for our business, accounting and legal records. Enquiries that do not lead to a project are deleted within two years of our last contact. Server logs are kept by our hosting provider for a short period, typically a few weeks.",
        ],
      },
      {
        heading: "How we protect it",
        blocks: [
          "The site is served over an encrypted (HTTPS) connection, access to stored enquiries is limited to authorised Fibispace staff through a password-protected admin panel, and we use reputable providers for hosting, storage and email. No method of transmission or storage is completely secure, but we take reasonable steps to protect your information.",
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          "You may ask us to:",
          [
            "tell you what personal information we hold about you and give you a copy;",
            "correct information that is inaccurate or incomplete;",
            "delete your information, where we are not required to keep it; and",
            "stop contacting you.",
          ],
          "To make a request, email us at fibispace@gmail.com. We will respond within a reasonable time and may ask you to confirm your identity first.",
        ],
      },
      {
        heading: "Children",
        blocks: [
          "Our website and services are intended for businesses and adults. We do not knowingly collect personal information from children under 16. If you believe a child has sent us their information, please contact us and we will delete it.",
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          "We may update this policy from time to time, for example if we change how the website works. The date at the top of this page shows when it was last revised.",
        ],
      },
      {
        heading: "Contact us",
        blocks: [
          "If you have questions about this policy or how we handle your information, contact us:",
          CONTACT_LINE,
        ],
      },
    ],
  },

  "Terms and Conditions": {
    updated: "October 18, 2026",
    intro: [
      "These Terms and Conditions govern your use of fibispace.com (the “website”), operated by Fibispace (“Fibispace”, “we”, “us”), a creative and digital marketing agency based in Kathmandu, Nepal. By using the website, you agree to these terms. If you do not agree, please do not use the website.",
    ],
    sections: [
      {
        heading: "About our services",
        blocks: [
          "The website describes the services we offer, including social media marketing, UI/UX and website design, graphic design, website development, search engine optimization, advertisement and commercial production, event management and product photography. Descriptions on the website are for general information and do not form an offer or a contract.",
        ],
      },
      {
        heading: "Enquiries, quotations and projects",
        blocks: [
          "Sending an enquiry through the website does not create a contract between you and Fibispace. Any work we carry out for you will be governed by a separate written quotation, proposal or agreement that sets out the scope, timeline, fees and payment terms. If anything in that agreement conflicts with these terms, the agreement applies.",
          "Unless your agreement says otherwise, quotations are valid for 30 days from the date they are issued.",
        ],
      },
      {
        heading: "Using the website",
        blocks: [
          "You agree to use the website lawfully and not to:",
          [
            "submit false, misleading or offensive information through the contact form;",
            "send spam, malware or automated requests to the website;",
            "attempt to gain unauthorised access to the website, its admin panel or its servers; or",
            "interfere with the website’s operation or security.",
          ],
          "We may block access to the website for anyone who breaks these rules.",
        ],
      },
      {
        heading: "Intellectual property",
        blocks: [
          "The content of this website, including its text, design, graphics, animations, logos and code, belongs to Fibispace or is used with permission, and is protected by copyright and other intellectual property laws. You may view it and share links to it, but you may not copy, reproduce or reuse it for commercial purposes without our written permission.",
          "Projects shown in our portfolio were created by Fibispace for our clients. Client names, logos and brands belong to their respective owners and appear with their permission. Ownership of the work we create for a client is set out in that client’s project agreement.",
        ],
      },
      {
        heading: "Portfolio use",
        blocks: [
          "Unless agreed otherwise in writing, we may display work we have completed for clients in our portfolio, on our social media and in pitches to show the kind of work we do. We never publish confidential information. If you are a client and would like a project removed, contact us and we will take it down.",
        ],
      },
      {
        heading: "Third-party links",
        blocks: [
          "The website links to third-party websites, including our social media pages and client websites. We do not control those websites and are not responsible for their content, availability or privacy practices.",
        ],
      },
      {
        heading: "No guarantee of results",
        blocks: [
          "We work hard for every client, but outcomes such as search rankings, follower growth, engagement, traffic or sales depend on factors outside our control, including platform algorithms, competition and market conditions. Unless your written agreement says otherwise, we do not guarantee specific results.",
        ],
      },
      {
        heading: "Disclaimer",
        blocks: [
          "The website is provided “as is” and “as available”. We aim to keep its information accurate and the site running smoothly, but we do not promise that it will always be complete, current, uninterrupted or free of errors.",
        ],
      },
      {
        heading: "Limitation of liability",
        blocks: [
          "To the extent permitted by law, Fibispace is not liable for any indirect or consequential loss, or for any loss of profit, revenue, data or business opportunity, arising from your use of, or inability to use, the website. Nothing in these terms limits liability that cannot be limited under Nepali law.",
        ],
      },
      {
        heading: "Privacy",
        blocks: [
          "Our Privacy Policy explains how we collect and use personal information you share through the website. By using the website, you also agree to that policy.",
        ],
      },
      {
        heading: "Governing law",
        blocks: [
          "These terms are governed by the laws of Nepal. Any dispute arising from them or from your use of the website will be subject to the jurisdiction of the courts of Kathmandu, Nepal. We will always try to resolve a concern informally first, so please contact us before taking any formal step.",
        ],
      },
      {
        heading: "Changes to these terms",
        blocks: [
          "We may update these terms from time to time. The date at the top of this page shows when they were last revised. Continuing to use the website after a change means you accept the updated terms.",
        ],
      },
      {
        heading: "Contact us",
        blocks: ["Questions about these terms? Contact us:", CONTACT_LINE],
      },
    ],
  },
};
