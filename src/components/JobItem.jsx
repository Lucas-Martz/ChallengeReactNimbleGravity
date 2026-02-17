import { useState } from "react";

export default function JobItem({ job }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");

  function onSubmitDummy() {
    setError("");

    if (!repoUrl.trim()) {
      setError("Ingresá la URL del repositorio.");
      return;
    }

    alert(`Step 4 OK. Job: ${job.id} Repo: ${repoUrl.trim()}`);
  }

  return (
    <li
      style={{
        border: "1px solid #333",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
      }}
    >
      <div style={{ fontWeight: 700 }}>{job.title}</div>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
        ID: {job.id}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/tu-usuario/tu-repo"
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #666",
            minWidth: 320,
          }}
        />
        <button
          onClick={onSubmitDummy}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #666",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>

      {error ? <div style={{ marginTop: 8, color: "crimson" }}>{error}</div> : null}
    </li>
  );
}
