import { useMemo, useState } from "react";
import { applyToJob } from "../api";

export default function JobItem({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      Boolean(candidate?.uuid) &&
      Boolean(candidate?.candidateId) &&
      Boolean(candidate?.applicationId) &&
      Boolean(job?.id) &&
      repoUrl.trim().length > 0 &&
      !loading
    );
  }, [candidate, job?.id, repoUrl, loading]);

  async function onSubmit() {
    setError("");
    setOk(false);

    if (!candidate?.uuid || !candidate?.candidateId || !candidate?.applicationId || !job?.id) {
      setError("Faltan datos obligatorios para postular.");
      return;
    }

    const cleanRepoUrl = repoUrl.trim();
    if (!cleanRepoUrl) {
      setError("Ingresá la URL del repositorio.");
      return;
    }

    const normalizedRepoUrl = cleanRepoUrl.replace(/\.git$/i, "").replace(/\/+$/, "");

    let parsedUrl;
    try {
      parsedUrl = new URL(normalizedRepoUrl);
    } catch {
      setError("La URL del repositorio no es válida.");
      return;
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      setError("La URL del repositorio debe comenzar con http:// o https://");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        uuid: String(candidate.uuid).trim(),
        jobId: String(job.id).trim(),
        candidateId: String(candidate.candidateId).trim(),
        applicationId: String(candidate.applicationId).trim(),
        repoUrl: normalizedRepoUrl,
      };

      const result = await applyToJob(payload);

      if (result && result.ok === true) setOk(true);
      else setOk(false);
    } catch (e) {
      setError(e?.message || "Error enviando postulación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className="job-card">
      <div className="job-title">{job.title}</div>
      <div className="job-id">
        ID: {job.id}
      </div>

      <div className="job-form-row">
        <input
          className="input"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/tu-usuario/tu-repo"
        />

        <button className="btn" onClick={onSubmit} disabled={!canSubmit}>
          {loading ? "Enviando..." : "Submit"}
        </button>
      </div>

      {error ? <div className="feedback feedback-error">{error}</div> : null}
      {ok ? <div className="feedback feedback-ok">Enviado ✔</div> : null}
    </li>
  );
}
