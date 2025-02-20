import { useEffect, useState } from "react";
import useSWR from "swr";

async function fetchAPI(url) {
  const response = await fetch(url);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  const [database, setDatabase] = useState({});

  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  useEffect(() => {
    setDatabase(data?.dependencies?.database ?? {});
  }, [data]);

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt timestamp={data?.updated_at} />
      <DatabaseStatus
        isLoading={isLoading}
        version={database?.version}
        maxConnections={database?.max_connections}
        openedConnections={database?.opened_connections}
      />
    </>
  );
}

function DatabaseStatus({
  isLoading,
  version,
  maxConnections,
  openedConnections,
}) {
  return (
    <>
      <h2>Database</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>Version: {version}</div>
          <div>Opened connections: {openedConnections}</div>
          <div>Maximum connections: {maxConnections}</div>
        </>
      )}
    </>
  );
}

function UpdatedAt({ timestamp }) {
  const [updatedAtText, setUpdatedAtText] = useState("Loading...");

  useEffect(() => {
    if (timestamp) {
      setUpdatedAtText(new Date(timestamp).toLocaleString("en-US"));
    }
  }, [timestamp]);

  return <div>Last Update: {updatedAtText}</div>;
}
