# Digital Twin layout

The Digital Twin uses eight manufacturing stages:

1. Melting Furnace
2. Degassing & Filtration
3. Low-Pressure Die Casting
4. X-ray Inspection
5. Heat Treatment (T6)
6. CNC Machining
7. Painting & Coating
8. Final Inspection

The layout is data-driven from `src/config/factoryLayout.js`.

The overview displays all eight stages. Selecting a stage opens its detailed 2D view, where individual machines can be selected to inspect their live parameters, controller ownership and workflow state.
