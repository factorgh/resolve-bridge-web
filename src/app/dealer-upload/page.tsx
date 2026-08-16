export default function DealerUploadIndexPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 24 }}>
      <div style={{ maxWidth: 480, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 40 }}>
        <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#2563eb', textTransform: 'uppercase' }}>
          ResolveBridge dealer intake
        </p>
        <h1 style={{ margin: '0 0 12px', fontSize: 24 }}>You need a unique upload link</h1>
        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>
          Dealers do not log in. ResolveBridge issues a private link from Admin → Vehicle desk. Open that full URL (it includes a token after <code>/dealer-upload/</code>).
        </p>
      </div>
    </main>
  );
}
