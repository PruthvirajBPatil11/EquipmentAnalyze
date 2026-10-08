import { useApp } from '../../store/AppStore.jsx';
import { canSee } from '../../config/roles.js';

export default function History() {
  const { user, history } = useApp();
  const rows = history.filter((item) => canSee(user, item.machineId));

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">AUDIT TRAIL</span>
          <h2>History</h2>
          <p className="muted small">
            Defects, decisions and machine actions recorded by the application.
          </p>
        </div>
        <span className="pill">{rows.length} records</span>
      </div>

      {rows.length === 0 ? (
        <div className="panel empty-panel">
          <h3>No records yet</h3>
          <p className="muted">
            Upload an alloy wheel image to create the first inspection record.
          </p>
        </div>
      ) : (
        <div className="history-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Batch</th>
                <th>Machine</th>
                <th>Event</th>
                <th>Detail</th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.ts).toLocaleString()}</td>
                  <td>{item.batchId}</td>
                  <td><b>{item.machineId}</b></td>
                  <td><span className={`pill ${item.type}`}>{item.type}</span></td>
                  <td>{item.text}</td>
                  <td>{item.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
