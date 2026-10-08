import { useState } from 'react';
import { useApp } from '../../store/AppStore.jsx';
import { ROLES, canSee } from '../../config/roles.js';

export default function Suggestions() {
  const { user, suggestions, decide, apply } = useApp();
  const permissions = ROLES[user.role].can;
  const [confirm, setConfirm] = useState(null);

  const list = suggestions.filter(
    (suggestion) =>
      canSee(user, suggestion.machineId) &&
      (
        permissions.review ||
        suggestion.status === 'accepted' ||
        suggestion.status === 'applied'
      ),
  );

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">RECOMMENDATION WORKFLOW</span>
          <h2>Suggestions</h2>
          <p className="muted small">
            {permissions.review
              ? 'Review the generated recommendation before it reaches the machine controller.'
              : 'Review approved recommendations assigned to your machines.'}
          </p>
        </div>
        <span className="pill">{list.length} visible</span>
      </div>

      <div className="suggestion-grid">
        {list.length === 0 && (
          <div className="panel empty-panel">
            <h3>{permissions.review ? 'Nothing to review' : 'No approved changes'}</h3>
            <p className="muted">
              {permissions.review
                ? 'A new inspection result will appear here when an analysis is submitted.'
                : 'Approved recommendations for your machines will appear here.'}
            </p>
          </div>
        )}

        {list.map((suggestion) => (
          <article className="card sug" key={suggestion.id}>
            <div className="suggestion-top">
              <div>
                <span className="eyebrow">DEFECT REVIEW</span>
                <h3>{suggestion.machineId} · Batch {suggestion.batchId}</h3>
              </div>
              <span className={`pill ${suggestion.status}`}>{suggestion.status}</span>
            </div>

            <div className="suggestion-meta">
              <span className="meta-chip">Defect · {suggestion.label}</span>
              <span className="meta-chip">Severity · {suggestion.severity}</span>
              <span className="meta-chip">Source · {suggestion.source}</span>
            </div>

            <div className="cause-box">
              <strong>{suggestion.cause.title}</strong>
              <span className="muted small">{suggestion.cause.text}</span>
            </div>

            <p className="action">{suggestion.action.text}</p>

            {permissions.review && suggestion.status === 'pending' && (
              <div className="actions">
                <button className="btn primary" onClick={() => decide(suggestion.id, true)}>
                  Accept recommendation
                </button>
                <button className="btn" onClick={() => decide(suggestion.id, false)}>
                  Reject
                </button>
              </div>
            )}

            {permissions.apply && suggestion.status === 'accepted' && (
              confirm === suggestion.id ? (
                <div className="actions">
                  <button
                    className="btn primary"
                    onClick={() => {
                      apply(suggestion.id);
                      setConfirm(null);
                    }}
                  >
                    Confirm and apply
                  </button>
                  <button className="btn" onClick={() => setConfirm(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="btn primary" onClick={() => setConfirm(suggestion.id)}>
                  Apply approved change
                </button>
              )
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
