import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { MACHINES, machineStatus } from '../config/factoryLayout.js';
import { ownerIdsOf } from '../config/roles.js';
import { services } from '../integrations/registry.js';
import { bus } from '../services/eventBus.js';

const Ctx = createContext(null);

export const useApp = () => useContext(Ctx);

let sequence = 0;

const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${sequence++}`;

const initialSetpoints = () =>
  Object.fromEntries(
    MACHINES.map((machine) => [
      machine.id,
      Object.fromEntries(
        machine.params.map((parameter) => [
          parameter.k,
          parameter.sp,
        ]),
      ),
    ]),
  );

const initialReadings = () =>
  Object.fromEntries(
    MACHINES.flatMap((machine) =>
      machine.params.map((parameter) => [
        `${machine.id}.${parameter.k}`,
        parameter.sp,
      ]),
    ),
  );

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [setpoints, setSetpoints] = useState(initialSetpoints);
  const [readings, setReadings] = useState(initialReadings);
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [notes, setNotes] = useState([]);

  const setpointRef = useRef(setpoints);
  const previousStatus = useRef({});

  setpointRef.current = setpoints;

  const notify = (notification) => {
    setNotes((items) => [
      {
        id: uid('note'),
        ts: Date.now(),
        level: 'info',
        readBy: [],
        ...notification,
      },
      ...items,
    ].slice(0, 100));
  };

  const log = (entry) => {
    setHistory((items) => [
      {
        id: uid('history'),
        ts: Date.now(),
        ...entry,
      },
      ...items,
    ]);
  };

  useEffect(
    () =>
      services.sensors.subscribe(
        (machineId, parameterKey) =>
          setpointRef.current[machineId][parameterKey],
        (batch) =>
          setReadings((current) => ({
            ...current,
            ...batch,
          })),
      ),
    [],
  );

  useEffect(() => {
    MACHINES.forEach((machine) => {
      const status = machineStatus(machine, readings);
      const previous =
        previousStatus.current[machine.id] || 'normal';

      if (status === previous) return;

      previousStatus.current[machine.id] = status;

      bus.emit('alert', {
        machineId: machine.id,
        status,
      });

      if (status !== 'normal') {
        notify({
          to: [
            ...ownerIdsOf(machine.id),
            'role:panel',
          ],
          machineId: machine.id,
          level: status,
          text: `${machine.id} · ${machine.name} is in ${status} state.`,
        });
      }
    });
  }, [readings]);

  const submitImage = async ({ file }) => {
    const detection = await services.defects.detect(file);

    const defect = {
      id: uid('defect'),
      imageUrl: URL.createObjectURL(file),
      detection,
    };

    log({
      type: 'defect',
      by: user?.name || 'User',
      text: `${detection.label} · ${Math.round(
        detection.confidence * 100,
      )}%`,
    });

    bus.emit('defect.detected', defect);

    return {
      defect,
    };
  };

  const decide = (id, accept) => {
    const suggestion = suggestions.find(
      (item) => item.id === id,
    );

    if (!suggestion) return;

    const status = accept ? 'accepted' : 'rejected';

    setSuggestions((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );

    log({
      type: 'decision',
      by: user?.name || 'User',
      text: `${
        accept ? 'Accepted' : 'Rejected'
      }: ${suggestion.action.text}`,
    });

    if (accept) {
      notify({
        to: ownerIdsOf(suggestion.machineId),
        machineId: suggestion.machineId,
        level: 'info',
        text: `Panel Controller approved a recommendation for ${suggestion.machineId}.`,
      });
    }

    bus.emit('suggestion.decided', {
      ...suggestion,
      status,
      decidedBy: user?.id,
    });
  };

  const apply = (id) => {
    const suggestion = suggestions.find(
      (item) => item.id === id,
    );

    if (!suggestion || suggestion.status !== 'accepted') {
      return;
    }

    setSetpoints((current) => ({
      ...current,
      [suggestion.machineId]: {
        ...current[suggestion.machineId],
        [suggestion.action.key]:
          suggestion.action.to,
      },
    }));

    setSuggestions((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'applied',
            }
          : item,
      ),
    );

    log({
      type: 'applied',
      by: user?.name || 'User',
      text: `Applied: ${suggestion.action.label} ${suggestion.action.from} → ${suggestion.action.to}`,
    });

    notify({
      to: ['role:panel'],
      machineId: suggestion.machineId,
      text: `${user?.name || 'Machine Controller'} applied the approved change on ${suggestion.machineId}.`,
    });

    bus.emit('change.applied', suggestion);
  };

  const visibleNotification = (notification) =>
    user &&
    (
      notification.to.includes(user.id) ||
      notification.to.includes(`role:${user.role}`)
    );

  const markRead = () => {
    if (!user) return;

    setNotes((items) =>
      items.map((item) =>
        visibleNotification(item) &&
        !item.readBy.includes(user.id)
          ? {
              ...item,
              readBy: [
                ...item.readBy,
                user.id,
              ],
            }
          : item,
      ),
    );
  };

  return (
    <Ctx.Provider
      value={{
        user,
        setUser,
        setpoints,
        readings,
        history,
        suggestions,
        notes: notes.filter(visibleNotification),
        markRead,
        submitImage,
        decide,
        apply,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}