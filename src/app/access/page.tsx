"use client";

import React from "react";
import { ConnectEmbed, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { getUserEmail, preAuthenticate } from "thirdweb/wallets/in-app";
import { base } from "thirdweb/chains";
import { thirdwebClient } from "../../lib/thirdwebClient";

const wallet = inAppWallet({
  auth: {
    options: ["email", "google", "apple"],
  },
});

export default function Access() {
  const account = useActiveAccount();

  const [status, setStatus] = React.useState<string | null>(null);

  // Email-prefill flow: /access?email=someone@example.com
  const [prefillEmail, setPrefillEmail] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [step, setStep] = React.useState<"idle" | "code">("idle");
  const [code, setCode] = React.useState<string>("");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = new URLSearchParams(window.location.search).get("email") || "";
    const cleaned = String(raw).trim().toLowerCase();
    if (cleaned) {
      setPrefillEmail(cleaned);
      setEmail(cleaned);
    }
  }, []);

  React.useEffect(() => {
    async function sync() {
      if (!account) return;
      try {
        setStatus("Syncing your access...");
        const email = await getUserEmail({ client: thirdwebClient });
        const res = await fetch("/api/users/sync-embedded", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, wallet: account.address }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Could not sync");
        setStatus("Access ready. Head to perks.");
      } catch (e: any) {
        setStatus(e?.message || "Could not sync");
      }
    }
    sync();
  }, [account]);

  async function sendCode() {
    const e = String(email || "").trim().toLowerCase();
    if (!e) return setStatus("Enter an email address.");
    setStatus("Sending code...");
    try {
      await preAuthenticate({ client: thirdwebClient, strategy: "email", email: e });
      setStep("code");
      setStatus("Code sent. Check your email.");
    } catch (err: any) {
      setStatus(err?.message || "Could not send code");
    }
  }

  async function verifyCode() {
    const e = String(email || "").trim().toLowerCase();
    const c = String(code || "").trim();
    if (!e) return setStatus("Missing email.");
    if (!c) return setStatus("Enter the code from your email.");
    setStatus("Verifying...");
    try {
      await wallet.connect({
        client: thirdwebClient,
        chain: base,
        strategy: "email",
        email: e,
        verificationCode: c,
      });
      setStatus("Connected. Syncing...");
    } catch (err: any) {
      setStatus(err?.message || "Could not verify code");
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Get Access (Embedded Wallet)</h2>
      <p className="small">
        This creates your FATW wallet automatically using your email/social login. No wallet app required.
      </p>

      {!account ? (
        <>
          {prefillEmail && (
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Continue with email</div>
              <p className="small" style={{ marginTop: 0 }}>
                Your link prefilled: <strong>{prefillEmail}</strong>
              </p>

              <div className="row" style={{ gap: 8, alignItems: "center" }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                {step === "idle" ? (
                  <button className="btn" onClick={sendCode}>Send code</button>
                ) : (
                  <button className="btn secondary" onClick={sendCode}>Resend</button>
                )}
              </div>

              {step === "code" && (
                <div className="row" style={{ gap: 8, alignItems: "center", marginTop: 10 }}>
                  <input
                    className="input"
                    style={{ flex: 1 }}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                  />
                  <button className="btn" onClick={verifyCode}>Verify</button>
                </div>
              )}

              {status && <p className="small" style={{ marginTop: 10 }}>{status}</p>}
            </div>
          )}

          <ConnectEmbed client={thirdwebClient} wallets={[wallet]} showThirdwebBranding={false} />
          {(!prefillEmail && status) && <p className="small" style={{ marginTop: 10 }}>{status}</p>}
        </>
      ) : (
        <div className="card">
          <div className="small">Wallet</div>
          <div className="small" style={{ wordBreak: "break-all" }}>{account.address}</div>
          {status && <p className="small" style={{ marginTop: 10 }}>{status}</p>}
          <div className="row" style={{ marginTop: 12 }}>
            <a className="btn" href="/perks-embedded">Go to Perks</a>
            <a className="btn secondary" href="/dashboard">Dashboard</a>
          </div>
        </div>
      )}

      <p className="small" style={{ marginTop: 12 }}>
        If you already use Coinbase Wallet / MetaMask, you can still use the regular perks page at <a href="/perks">/perks</a>.
      </p>
    </div>
  );
}
