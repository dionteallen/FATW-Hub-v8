import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export default async function AdminEpisodes() {
  await requireAdmin();

  const episodes = await prisma.episode.findMany({ orderBy: { showDate: "desc" }, take: 25 });
  const live = await prisma.appSetting.findUnique({ where: { key: "LIVE_EPISODE_ID" } });

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Episodes</h2>
      <p className="small">Create episodes and set the “live” episode to attribute orders, redemptions, and ticket codes.</p>

      <form method="post" action="/api/admin/episodes/create" className="card">
        <label>Title</label>
        <input name="title" required placeholder="Episode 1 — Before the Laughs" />
        <label style={{marginTop:10}}>Show date (YYYY-MM-DD)</label>
        <input name="showDate" required placeholder="2026-03-01" />
        <label style={{marginTop:10}}>Theme (optional)</label>
        <input name="theme" placeholder="Before the Laughs" />
        <label style={{marginTop:10}}>Venue name (optional)</label>
        <input name="venueName" placeholder="LightHaus" />
        <label style={{marginTop:10}}>City/State (optional)</label>
        <div className="row">
          <input name="city" placeholder="Dayton" />
          <input name="state" placeholder="OH" />
        </div>
        <label style={{marginTop:10}}>Artist name/email (optional)</label>
        <div className="row">
          <input name="artistName" placeholder="Guest artist" />
          <input name="artistEmail" type="email" placeholder="guest@email.com" />
        </div>
        <div style={{marginTop:12}}><button className="btn" type="submit">Create Episode</button></div>
      </form>

      <form method="post" action="/api/admin/episodes/set-live" className="card" style={{marginTop:12}}>
        <label>Set LIVE episode</label>
        <select name="episodeId" defaultValue={live?.value || ""}>
          <option value="">(none)</option>
          {episodes.map(e => (
            <option key={e.id} value={e.id}>
              {new Date(e.showDate).toLocaleDateString()} — {e.title}
            </option>
          ))}
        </select>
        <div style={{marginTop:12}}><button className="btn" type="submit">Set Live</button></div>
      </form>

      <div className="card" style={{marginTop:12}}>
        <div style={{fontWeight:800}}>Current LIVE Episode</div>
        <div className="small">{live?.value || "(none set)"}</div>
      </div>

      <div style={{marginTop:14}}>
        <div style={{fontWeight:800}}>Recent episodes</div>
        <ul>
          {episodes.map(e => (
            <li key={e.id} className="small">
              {new Date(e.showDate).toLocaleDateString()} — {e.title} {live?.value === e.id ? " (LIVE)" : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
