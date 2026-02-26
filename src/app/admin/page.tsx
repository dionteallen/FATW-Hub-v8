import prisma from "../../lib/prisma";
import { requireAdmin } from "../../lib/adminGuard";

export default async function Admin() {
  await requireAdmin();

  const recentArtists = await prisma.artist.findMany({ take: 10, orderBy: { createdAt: "desc" } });
  const recentOrders = await prisma.eventbriteOrder.findMany({ take: 10, orderBy: { createdAt: "desc" } });
  const sponsors = await prisma.sponsor.findMany({ take: 10, orderBy: { createdAt: "desc" } });

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Admin Console</h2>
      <div className="row" style={{marginTop:12}}>
        <a className="btn secondary" href="/admin/episodes">Episodes</a>
      </div>

      <div className="row">
        <div className="card" style={{flex:"1 1 420px"}}>
          <div style={{fontWeight:800}}>1) Create artist access link + email it</div>
          <p className="small">Creates (or upserts) the artist, generates a one-time portal link, and emails it.</p>
          <form method="post" action="/api/admin/artist/send-link">
            <label>Artist email</label>
            <input name="email" type="email" required placeholder="artist@example.com" />
            <label style={{marginTop:10}}>Stage name (optional)</label>
            <input name="stageName" type="text" placeholder="Stage name" />
            <label style={{marginTop:10}}>Show date (optional, YYYY-MM-DD)</label>
            <input name="showDate" type="text" placeholder="2026-03-15" />
            <label style={{marginTop:10}}>Venue (optional)</label>
            <input name="venue" type="text" placeholder="LightHaus" />
            <label style={{marginTop:10}}>Link expiry (days)</label>
            <input name="expiryDays" type="number" defaultValue={14} min={1} max={60} />
            <div style={{marginTop:12}}>
              <button className="btn" type="submit">Create + Send</button>
            </div>
          </form>
        </div>

        <div className="card" style={{flex:"1 1 420px"}}>
          <div style={{fontWeight:800}}>2) Mint CAU to a wallet (post-purchase)</div>
          <p className="small">Use after verifying the buyer (Eventbrite order exists). Mints CAU using server-side admin key.</p>
          <form method="post" action="/api/admin/cau/mint">
            <label>Buyer email (for audit)</label>
            <input name="email" type="email" required placeholder="buyer@example.com" />
            <label style={{marginTop:10}}>Wallet address</label>
            <input name="wallet" type="text" required placeholder="0x..." />
            <label style={{marginTop:10}}>Amount</label>
            <input name="amount" type="number" required defaultValue={50} min={1} />
            <div style={{marginTop:12}}>
              <button className="btn" type="submit">Mint CAU</button>
            </div>
          </form>
          <p className="small" style={{marginTop:12}}>
            NOTE: Admin private key must stay server-side only. Never expose it to the browser.
          </p>
        </div>
      </div>

      <div className="row" style={{marginTop:14}}>
        <div className="card" style={{flex:"1 1 420px"}}>
          <div style={{fontWeight:800}}>3) Create / link a sponsor to a user</div>
          <p className="small">Creates a sponsor record and links it to a user account (email sign-in).</p>
          <form method="post" action="/api/admin/sponsor/upsert">
            <label>Sponsor business name</label>
            <input name="businessName" type="text" required placeholder="Business LLC" />
            <label style={{marginTop:10}}>Sponsor email (login email)</label>
            <input name="email" type="email" required placeholder="owner@business.com" />
            <label style={{marginTop:10}}>Tier</label>
            <select name="tier" defaultValue="TIER_100">
              <option value="TIER_100">$100</option>
              <option value="TIER_250">$250</option>
              <option value="TIER_500">$500</option>
            </select>
            <label style={{marginTop:10}}>Contact name (optional)</label>
            <input name="contactName" type="text" placeholder="Contact name" />
            <div style={{marginTop:12}}>
              <button className="btn" type="submit">Create/Update + Link</button>
            </div>
          </form>
        </div>

        <div className="card" style={{flex:"1 1 420px"}}>
          <div style={{fontWeight:800}}>Recent snapshots</div>
          <div className="small" style={{marginTop:6}}>Artists</div>
          <ul>
            {recentArtists.map(a => <li key={a.id} className="small">{a.email} — {a.status}</li>)}
          </ul>
          <div className="small" style={{marginTop:10}}>Eventbrite Orders</div>
          <ul>
            {recentOrders.map(o => <li key={o.id} className="small">{o.buyerEmail} — {o.eventbriteOrderId}</li>)}
          </ul>
          <div className="small" style={{marginTop:10}}>Sponsors</div>
          <ul>
            {sponsors.map(s => <li key={s.id} className="small">{s.businessName} — {s.tier}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
