import { useState } from 'react';
import { useApp } from '../store/AppStore.jsx';
import { ROLES, canSee } from '../config/roles.js';

const TABS = [
  ['upload', 'Upload Image'],
  ['history', 'History'],
  ['suggestions', 'Suggestions'],
];

export default function Navbar({ view, setView }) {
  const {
    user,
    setUser,
    suggestions,
    notes,
    markRead,
  } = useApp();

  const [open, setOpen] = useState(false);

  const can = ROLES[user.role].can;

  const todo = suggestions.filter(
    (suggestion) =>
      canSee(user, suggestion.machineId) &&
      suggestion.status ===
        (can.review ? 'pending' : 'accepted'),
  ).length;

  const unread = notes.filter(
    (note) => !note.readBy.includes(user.id),
  ).length;

  return (
    <header className="nav">
      <button
        className="nav-brand"
        type="button"
        onClick={() => setView('twin')}
      >
        <span className="brand-mark">
          ◈
        </span>

        <span>
          <strong>Alloy Twin</strong>

          <small>
            FACTORY DIGITAL TWIN
          </small>
        </span>
      </button>

      <nav className="nav-tabs">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={
              view === key ? 'active' : ''
            }
            onClick={() => setView(key)}
          >
            {label}

            {key === 'suggestions' &&
              todo > 0 && (
                <span className="badge">
                  {todo}
                </span>
              )}
          </button>
        ))}
      </nav>

      <div className="grow" />

      <div className="nav-live">
        <i />
        LIVE
      </div>

      <div className="bell">
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => {
            setOpen(!open);

            if (!open) {
              markRead();
            }
          }}
        >
          <span className="bell-icon">
            ◉
          </span>

          {unread > 0 && (
            <span className="badge red">
              {unread}
            </span>
          )}
        </button>

        {open && (
          <div className="drop">
            <div className="drop-head">
              <strong>
                Notifications
              </strong>

              <span>
                {unread} unread
              </span>
            </div>

            {notes.length === 0 && (
              <p className="muted small">
                Nothing yet.
              </p>
            )}

            {notes
              .slice(0, 12)
              .map((note) => (
                <div
                  key={note.id}
                  className={
                    'note ' + note.level
                  }
                >
                  <span>
                    {note.text}
                  </span>

                  <small className="muted">
                    {new Date(
                      note.ts,
                    ).toLocaleTimeString()}
                  </small>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="who">
        <b>{user.name}</b>

        <small>
          {ROLES[user.role].label}
        </small>
      </div>

      <button
        className="logout"
        type="button"
        onClick={() => setUser(null)}
      >
        Logout
      </button>
    </header>
  );
}