import JobItem from "./JobItem";

export default function JobList({ jobs }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </ul>
  );
}
