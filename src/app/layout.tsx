import "./globals.css";
import { Providers } from "./providers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FATW Hub",
  description: "Family Along the Way — access & operations",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "FATW Hub",
    statusBarStyle: "black-translucent",
  },
  themeColor: "#0b0b0b",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="container">
            <header className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <div style={{fontWeight:800}}>FATW Hub</div>
                <div className="small">Family Along the Way — access & operations</div>
              </div>
              <nav className="row">
                <a className="btn secondary" href="/perks">Perks</a>
                <a className="btn secondary" href="/redeem">Redeem</a>
                <a className="btn secondary" href="/tree">Tree</a>
                <a className="btn secondary" href="/dashboard">Dashboard</a>
                <a className="btn secondary" href="/staff/fulfill">Staff</a>
                <a className="btn secondary" href="/sponsor">Sponsor</a>
                <a className="btn secondary" href="/artist">Artist</a>
                <a className="btn secondary" href="/admin">Admin</a>
              </nav>
            </header>
            <main style={{marginTop:18}}>{children}</main>
            <footer className="small" style={{marginTop:40}}>
              FATW is not a payment processor or wallet custodian. Eventbrite remains cashier; USD remains register.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
