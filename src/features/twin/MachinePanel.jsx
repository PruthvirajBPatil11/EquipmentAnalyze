import {
  machineById,
  machineStatus,
  paramStatus,
} from '../../config/factoryLayout.js';
import { ownerNamesOf } from '../../config/roles.js';
import { useApp } from '../../store/AppStore.jsx';

export default function MachinePanel({ id, go }) {
  const {
    readings,
    setpoints,
    suggestions,
    history,
  } = useApp();

  const machine = machineById(id);
  const status = machineStatus(machine, readings);

  const suggestionsForMachine = suggestions.filter(
    (suggestion) =>
      suggestion.machineId === id &&
      (
        suggestion.status === 'pending' ||
        suggestion.status === 'accepted'
      ),
  );

  const recent = history
    .filter((entry) => entry.machineId === id)
    .slice(0, 3);

  return (
    <aside className="panel machine-panel">
      <div className="machine-panel-top">
        <div>
          <span className="eyebrow">MACHINE CONTROLLER</span>

          <h2>{machine.id}</h2>

          <p>{machine.name}</p>
        </div>

        <span className={'status-dot ' + status}>
          <i />
          {status}
        </span>
      </div>

      <div className="machine-owner">
        <span>CONTROL OWNER</span>

        <strong>
          {ownerNamesOf(id).join(', ') || '—'}
        </strong>
      </div>

      <div className="parameter-list">
        <div className="panel-section-label">
          <span>LIVE PARAMETERS</span>

          <small>
            {machine.params.length} monitored
          </small>
        </div>

        {machine.params.map((parameter) => {
          const value =
            readings[`${id}.${parameter.k}`];

          const span = parameter.hi - parameter.lo;

          const a = parameter.lo - span * 0.4;
          const b = parameter.hi + span * 0.4;

          const position = (valueToPosition) =>
            Math.max(
              0,
              Math.min(
                100,
                ((valueToPosition - a) / (b - a)) * 100,
              ),
            );

          return (
            <div
              key={parameter.k}
              className="param"
            >
              <div className="param-head">
                <span>{parameter.label}</span>

                <strong
                  className={paramStatus(
                    parameter,
                    value,
                  )}
                >
                  {value}{' '}
                  <small>
                    {parameter.unit}
                  </small>
                </strong>
              </div>

              <div className="bar">
                <i
                  className="band"
                  style={{
                    left: `${position(parameter.lo)}%`,
                    width: `${
                      position(parameter.hi) -
                      position(parameter.lo)
                    }%`,
                  }}
                />

                <i
                  className="mark"
                  style={{
                    left: `${position(value)}%`,
                  }}
                />
              </div>

              <div className="param-meta">
                <span>
                  SETPOINT {setpoints[id][parameter.k]}{' '}
                  {parameter.unit}
                </span>

                <span>
                  NORMAL {parameter.lo}–{parameter.hi}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="machine-section">
        <div className="panel-section-label">
          <span>PENDING CHANGES</span>

          <small>
            {suggestionsForMachine.length}
          </small>
        </div>

        {suggestionsForMachine.length === 0 ? (
          <p className="muted small">
            No pending or approved changes.
          </p>
        ) : (
          suggestionsForMachine.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="mini-s"
              onClick={() =>
                go('suggestions')
              }
            >
              <span>
                {suggestion.action.text}
              </span>

              <span
                className={
                  'pill ' +
                  suggestion.status
                }
              >
                {suggestion.status}
              </span>
            </button>
          ))
        )}
      </div>

      <div className="machine-section">
        <div className="panel-section-label">
          <span>RECENT ACTIVITY</span>

          <small>{recent.length}</small>
        </div>

        {recent.length === 0 ? (
          <p className="muted small">
            No activity recorded.
          </p>
        ) : (
          recent.map((entry) => (
            <div
              key={entry.id}
              className="activity-row"
            >
              {entry.text}
            </div>
          ))
        )}
      </div>

      <div className="future-slot">
        <span>INTEGRATION READY</span>

        <p>
          YOLO defect feed · KG context · RCA result
        </p>
      </div>
    </aside>
  );
}