export default function Loading() {
  return (
    <main className="coach-loading-screen is-visible">
      <div className="coach-loading-card">
        <div className="coach-loading-orbit">*</div>
        <p>Preparing your AI tutor</p>
        <span>Connecting to the voice workspace...</span>
        <div className="coach-loading-bar"><i /></div>
      </div>
    </main>
  );
}
