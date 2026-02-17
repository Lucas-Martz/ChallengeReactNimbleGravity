import { useEffect, useState } from "react";
import { getCandidateByEmail, getJobs } from "./api";

export default function App() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidate, setCandidate] = useState(null);
  
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [errorJobs, setErrorJobs] = useState("");

  useEffect(() => {
  async function cargarJobs() {
    setErrorJobs("");
    setLoadingJobs(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (e) {
      setErrorJobs(e?.message || "Error cargando posiciones");
    } finally {
      setLoadingJobs(false);
    }
  }

  cargarJobs();
  }, []);

  async function onBuscar() {
    setError("");
    setCandidate(null);

    const strEmail = email.trim();
    if (!strEmail) {
      setError("Ingresá tu email.");
      return;
    }

    setLoading(true);
    try {
      const data = await getCandidateByEmail(strEmail);
      setCandidate(data);
    } catch (e) {
      setError(e?.message || "Error consultando candidato");
    } finally {
      setLoading(false);
    }
  }

  

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginTop: 0 }}>Bot Filter — Step 2</h1>

      <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu.email@ejemplo.com"
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", minWidth: 320 }}
          />
          <button
            onClick={onBuscar}
            disabled={loading}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #333", cursor: "pointer" }}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error ? <div style={{ marginTop: 10, color: "crimson" }}>{error}</div> : null}

        {candidate ? (
          <div style={{ marginTop: 12, fontSize: 14 }}>
            <div><b>firstName:</b> {candidate.firstName}</div>
            <div><b>lastName:</b> {candidate.lastName}</div>
            <div><b>email:</b> {candidate.email}</div>
            <div><b>uuid:</b> {candidate.uuid}</div>
            <div><b>candidateId:</b> {candidate.candidateId}</div>
            <div><b>applicationId:</b> {candidate.applicationId}</div>
          </div>
        ) : null}
      </div>

      <hr style={{ margin: "16px 0", borderColor: "#333" }} />

      <h2 style={{ margin: "0 0 10px" }}>Step 3 — Posiciones</h2>

      {loadingJobs ? <div>Cargando posiciones...</div> : null}
      {errorJobs ? <div style={{ marginTop: 8, color: "crimson" }}>{errorJobs}</div> : null}

      {!loadingJobs && !errorJobs ? (
        <ul style={{ marginTop: 10 }}>
          {jobs.map((job) => (
            <li key={job.id}>
              <b>{job.title}</b> <span style={{ color: "#aaa" }}>({job.id})</span>
            </li>
          ))}
        </ul>
      ) : null}

    </div>

  );

}

