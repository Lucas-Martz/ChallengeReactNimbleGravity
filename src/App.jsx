import { useEffect, useState } from "react";
import { getCandidateByEmail, getJobs } from "./api";
import JobList from "./components/JobList";
import "./App.css";

export default function App() {
  const profile = {
    fullName: "Lucas Martinez",
    email: "martinezdlucas5@gmail.com",
  };

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
    <div className="app-shell">
      <header className="hero">
        <p className="hero-kicker">Challenge React Nimble Gravity</p>
        <p className="hero-profile">
          {profile.fullName} - {profile.email}
        </p>
      </header>

      <section className="panel">
        <h2 className="section-title">Step 2 - Candidato</h2>

        <div className="search-row">
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu.email@ejemplo.com"
          />
          <button className="btn" onClick={onBuscar} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error ? <div className="feedback feedback-error">{error}</div> : null}

        {candidate ? (
          <div className="candidate-grid">
            <div><b>firstName:</b> {candidate.firstName}</div>
            <div><b>lastName:</b> {candidate.lastName}</div>
            <div><b>email:</b> {candidate.email}</div>
            <div><b>uuid:</b> {candidate.uuid}</div>
            <div><b>candidateId:</b> {candidate.candidateId}</div>
            <div><b>applicationId:</b> {candidate.applicationId}</div>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <h2 className="section-title">Step 3 - Posiciones</h2>

        {loadingJobs ? <div className="feedback">Cargando posiciones...</div> : null}
        {errorJobs ? <div className="feedback feedback-error">{errorJobs}</div> : null}

        {!loadingJobs && !errorJobs ? <JobList jobs={jobs} candidate={candidate} /> : null}
      </section>
    </div>
  );
}

