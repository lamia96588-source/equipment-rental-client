import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const heading = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "RentRig | Rent equipment from verified owners",
    template: "%s | RentRig",
  },
  description:
    "RentRig is an equipment rental marketplace. Browse construction, photography, vehicle, agriculture, electronics and event equipment, book for the days you need and pay securely.",
};

// Applies the saved theme before the first paint so the page never flashes the wrong colours.
const themeScript = `(function(){try{var t=localStorage.getItem('rentrig-theme');if(t!=='rentrig'&&t!=='rentrig-dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'rentrig-dark':'rentrig';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="rentrig"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-base-100 text-base-content">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--color-neutral)",
              color: "var(--color-neutral-content)",
              borderRadius: "0.75rem",
            },
          }}
        />
      </body>
    </html>
  );
}
