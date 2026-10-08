import { useState } from 'react';
import { ROLES, USERS } from '../config/roles.js';
import { useApp } from '../store/AppStore.jsx';

export default function Login() {
  const { setUser } = useApp();

  const [role, setRole] = useState(null);
  const [pick, setPick] = useState(null);

  const people = USERS.filter(
    (user) => user.role === role,
  );

  return (
    <div className="login">
      <section className="hero">
        <div className="hero-grid" />

        <div className="hero-content">
          <div className="login-brand">
            <span>◈</span>

            <b>ALLOY TWIN</b>

            <small>
              MANUFACTURING INTELLIGENCE
            </small>
          </div>

          <div className="hero-copy">
            <span className="eyebrow">
              DIGITAL FACTORY · LIVE
            </span>

            <h1>
              One connected view of the
              <span> alloy wheel plant.</span>
            </h1>

            <p>
              Monitor the manufacturing flow, inspect
              machine conditions and respond to production
              anomalies from one digital twin.
            </p>
          </div>

          <div className="hero-process">
            <span>01 MELT</span>
            <i />
            <span>02 DEGAS</span>
            <i />
            <span>03 CAST</span>
            <i />
            <span>04 INSPECT</span>
            <i />
            <span>08 FINAL</span>
          </div>

          <div className="hero-status">
            <span>
              <i className="legend-dot operational" />
              LIVE DIGITAL TWIN
            </span>

            <span>
              SIMULATED SENSOR STREAM
            </span>
          </div>
        </div>
      </section>

      <section className="pick">
        <div className="login-panel">
          {!role ? (
            <>
              <span className="eyebrow">
                ACCESS CONTROL · 01 / 02
              </span>

              <h2>Choose your control role</h2>

              <p className="muted">
                Select the role you are using to enter
                the manufacturing twin.
              </p>

              <div className="role-list">
                {Object.entries(ROLES).map(
                  ([key, roleData]) => (
                    <button
                      type="button"
                      key={key}
                      className="role-card"
                      onClick={() => {
                        setRole(key);
                        setPick(
                          USERS.find(
                            (user) =>
                              user.role === key,
                          ).id,
                        );
                      }}
                    >
                      <div className="role-icon">
                        {key === 'panel'
                          ? '⌁'
                          : '◫'}
                      </div>

                      <div className="role-content">
                        <strong>
                          {roleData.label}
                        </strong>

                        <p>
                          {roleData.desc}
                        </p>

                        <div className="role-tags">
                          {roleData.tags.map(
                            (tag) => (
                              <span key={tag}>
                                {tag}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      <span className="role-arrow">
                        →
                      </span>
                    </button>
                  ),
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="back-link"
                type="button"
                onClick={() => setRole(null)}
              >
                ← All roles
              </button>

              <span className="eyebrow">
                IDENTITY · 02 / 02
              </span>

              <h2>Select controller</h2>

              <p className="muted">
                {role === 'machine'
                  ? 'Each Machine Controller sees the machines assigned to them.'
                  : 'Panel Controllers can review the complete factory twin.'}
              </p>

              <div className="people-list">
                {people.map((person) => (
                  <button
                    type="button"
                    key={person.id}
                    className={
                      'person-card ' +
                      (pick === person.id
                        ? 'selected'
                        : '')
                    }
                    onClick={() =>
                      setPick(person.id)
                    }
                  >
                    <span className="avatar">
                      {person.name
                        .split(' ')
                        .map(
                          (word) =>
                            word[0],
                        )
                        .join('')}
                    </span>

                    <span className="person-info">
                      <strong>
                        {person.name}
                      </strong>

                      <small>
                        {person.owns
                          ? `CONTROLS ${person.owns.join(
                              ' · ',
                            )}`
                          : 'REVIEWS ALL MACHINES'}
                      </small>
                    </span>

                    <span className="person-check">
                      {pick === person.id
                        ? '✓'
                        : ''}
                    </span>
                  </button>
                ))}
              </div>

              <button
                className="btn primary wide login-enter"
                type="button"
                disabled={!pick}
                onClick={() =>
                  setUser(
                    USERS.find(
                      (person) =>
                        person.id === pick,
                    ),
                  )
                }
              >
                Enter Digital Twin{' '}
                <span>→</span>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}