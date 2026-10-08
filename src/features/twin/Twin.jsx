import { useMemo, useState } from 'react';
import { STAGES, machineById, machineStatus, worst } from '../../config/factoryLayout.js';
import { useApp } from '../../store/AppStore.jsx';
import StageScene from './StageScene.jsx';
import MachinePanel from './MachinePanel.jsx';

export default function Twin({ go }) {
  const { readings } = useApp();
  const [stageId, setStage] = useState(null);
  const [sel, setSel] = useState(null);

  const stageStatus = (stage) =>
    stage.machines.reduce(
      (status, id) => worst(status, machineStatus(machineById(id), readings)),
      'normal',
    );

  const operationalCount = useMemo(
    () =>
      STAGES.flatMap((stage) => stage.machines)
        .map(machineById)
        .filter((machine) => machineStatus(machine, readings) === 'normal').length,
    [readings],
  );

  const machineCount = STAGES.reduce(
    (total, stage) => total + stage.machines.length,
    0,
  );

  const idx = STAGES.findIndex((stage) => stage.id === stageId);

  const openStage = (id) => {
    setStage(id);
    setSel(null);
  };

  if (stageId) {
    const stage = STAGES[idx];
    const status = stageStatus(stage);

    return (
      <div className="page twin-page">
        <div className="twin-detail-head">
          <div>
            <span className="eyebrow">
              STAGE {String(idx + 1).padStart(2, '0')} / 08
            </span>

            <h1>{stage.name}</h1>

            <p className="muted">{stage.blurb}</p>
          </div>

          <div className="twin-detail-actions">
            <button
              className="btn"
              type="button"
              onClick={() => setStage(null)}
            >
              ← Factory floor
            </button>

            <button
              className="btn"
              type="button"
              disabled={idx === 0}
              onClick={() => openStage(STAGES[idx - 1].id)}
            >
              ‹ Prev
            </button>

            <button
              className="btn"
              type="button"
              disabled={idx === STAGES.length - 1}
              onClick={() => openStage(STAGES[idx + 1].id)}
            >
              Next ›
            </button>
          </div>
        </div>

        <div className="stage-detail-meta">
          <span className={'status-dot ' + status}>
            <i />
            {status}
          </span>

          <span>{stage.machines.length} machines</span>

          <span>Live digital twin</span>
        </div>

        <div className="split twin-detail-grid">
          <section className="panel twin-scene-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">LIVE FLOOR VIEW</span>
                <h2>{stage.name}</h2>
              </div>

              <span className={'pill ' + status}>{status}</span>
            </div>

            <StageScene
              stageId={stage.id}
              selected={sel}
              onPick={setSel}
            />
          </section>

          {sel ? (
            <MachinePanel id={sel} go={go} />
          ) : (
            <aside className="panel machine-empty">
              <span className="machine-empty-icon">＋</span>

              <span className="eyebrow">MACHINE INSPECTION</span>

              <h3>Select a machine</h3>

              <p className="muted">
                Select any machine in the Digital Twin to inspect live
                parameters, operating range, ownership and recent activity.
              </p>
            </aside>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page twin-page">
      <header className="twin-hero">
        <div>
          <span className="eyebrow">LIVE FACTORY DIGITAL TWIN</span>

          <h1>Alloy Wheel Manufacturing Plant</h1>

          <p>
            A live 2D representation of the manufacturing flow from molten
            alloy to final wheel inspection.
          </p>
        </div>

        <div className="twin-stats">
          <div>
            <strong>
              {operationalCount}/{machineCount}
            </strong>

            <span>machines operational</span>
          </div>

          <div>
            <strong>08</strong>

            <span>process stages</span>
          </div>

          <div>
            <strong>LIVE</strong>

            <span>sensor stream</span>
          </div>
        </div>
      </header>

      <section className="factory-shell">
        <div className="factory-topbar">
          <div>
            <span className="eyebrow">PLANT FLOOR</span>

            <h2>Manufacturing flow</h2>
          </div>

          <div className="factory-legend">
            <span>
              <i className="legend-dot operational" />
              Operational
            </span>

            <span>
              <i className="legend-dot attention" />
              Attention
            </span>

            <span>
              <i className="legend-dot fault" />
              Fault
            </span>
          </div>
        </div>

        <div className="factory-flow">
          <div className="factory-row">
            {STAGES.slice(0, 4).map((stage, index) => (
              <StageTile
                key={stage.id}
                stage={stage}
                index={index}
                status={stageStatus(stage)}
                onOpen={openStage}
                last={index === 3}
              />
            ))}
          </div>

          <div className="factory-turn">
            <span>PROCESS CONTINUES</span>
            <i>↓</i>
          </div>

          <div className="factory-row">
            {STAGES.slice(4).map((stage, index) => (
              <StageTile
                key={stage.id}
                stage={stage}
                index={index + 4}
                status={stageStatus(stage)}
                onOpen={openStage}
                last={index === 3}
                reverse
              />
            ))}
          </div>
        </div>

        <div className="factory-footer">
          <span>
            <b>INPUT</b> Raw alloy / ingot
          </span>

          <span className="flow-line" />

          <span>
            <b>OUTPUT</b> Inspected alloy wheel
          </span>
        </div>
      </section>
    </div>
  );
}

function StageTile({ stage, index, status, onOpen, last, reverse }) {
  return (
    <button
      type="button"
      className={'factory-stage ' + status}
      onClick={() => onOpen(stage.id)}
    >
      <div className="factory-stage-head">
        <span className="stage-number">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className={'status-dot ' + status}>
          <i />
          {status}
        </span>
      </div>

      <div className="factory-stage-title">
        <strong>{stage.name}</strong>

        <span>{stage.blurb}</span>
      </div>

      <StageScene
        stageId={stage.id}
        mini
      />

      <div className="factory-stage-machines">
        {stage.machines.map((id) => (
          <span key={id}>
            <i />
            {id}
          </span>
        ))}
      </div>

      <div className="factory-stage-open">
        <span>{stage.machines.length} machines</span>

        <b>
          {last
            ? 'Final stage'
            : reverse
              ? 'Previous stage'
              : 'Open stage'}{' '}
          ↗
        </b>
      </div>
    </button>
  );
}