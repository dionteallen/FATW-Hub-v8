export default function Unauthorized() {
  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Not authorized</h2>
      <p className="small">You’re signed in, but your account is not marked as ADMIN in the database.</p>
      <p className="small">Set your user role to ADMIN (Prisma Studio or DB) to unlock admin tools.</p>
    </div>
  );
}
