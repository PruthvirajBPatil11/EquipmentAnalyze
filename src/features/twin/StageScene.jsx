import {
  machineById,
  machineStatus,
  stageById,
} from '../../config/factoryLayout.js';
import { canSee } from '../../config/roles.js';
import { useApp } from '../../store/AppStore.jsx';
import Glyph from './Glyph.jsx';

export default function StageScene({
  stageId,
  mini = false,
  selected,
  onPick,
}) {
  const { readings, user } = useApp();

  const stage = stageById(stageId);
  const machines = stage.machines.map(machineById);

  const width = 600;
  const height = mini ? 220 : 320;

  const machineScale = mini ? 1.42 : 2.2;

  const positions = mini
    ? [55, 325]
    : [20, 316];

  const gridId = `grid-${stageId}-${mini ? 'mini' : 'detail'}`;
  const beltId = `belt-${stageId}-${mini ? 'mini' : 'detail'}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={'scene ' + (mini ? 'mini' : 'detail')}
      role="img"
      aria-label={`${stage.name} machine layout`}
    >
      <defs>
        <pattern
          id={gridId}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0H0V30"
            fill="none"
            stroke="rgba(127,199,220,.08)"
          />
        </pattern>
      </defs>

      <rect
        width={width}
        height={height}
        fill={`url(#${gridId})`}
      />

      <path
        id={beltId}
        d={`M20 ${height - 30}H580`}
        className="belt"
      />

      <g className="wheel">
        <circle r={mini ? 8 : 11} />
        <circle r={mini ? 2 : 3} />

        {[0, 72, 144, 216, 288].map((angle) => (
          <line
            key={angle}
            y2={mini ? -8 : -11}
            transform={`rotate(${angle})`}
          />
        ))}

        <animateMotion
          dur="9s"
          repeatCount="indefinite"
        >
          <mpath href={`#${beltId}`} />
        </animateMotion>
      </g>

      {machines.map((machine, index) => {
        const status = machineStatus(machine, readings);
        const visible = canSee(user, machine.id);
        const selectable = !mini && visible;

        const classes = [
          'mach',
          status,
          selectable && 'open',
          selected === machine.id && 'sel',
          !visible && 'dim',
        ]
          .filter(Boolean)
          .join(' ');

        const x = positions[index] ?? positions[0];

        return (
          <g key={machine.id}>
            <g
              transform={`translate(${x} ${mini ? 8 : 30}) scale(${machineScale})`}
              className={classes}
              onClick={() =>
                selectable && onPick?.(machine.id)
              }
            >
              <Glyph kind={machine.kind} />
            </g>

            <text
              x={x + machineScale * 60}
              y={mini ? 154 : 268}
              textAnchor="middle"
              className="lbl machine-label"
            >
              {machine.id}
            </text>

            {mini && (
              <text
                x={x + machineScale * 60}
                y="174"
                textAnchor="middle"
                className="machine-sub-label"
              >
                {machine.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}