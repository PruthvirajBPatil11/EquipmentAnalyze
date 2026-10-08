# Roles and permissions

| Capability | Panel Controller | Machine Controller |
|---|---|---|
| Upload image | All machines | Assigned machines |
| View history | All records | Assigned machines |
| View Digital Twin | All machines | Assigned machines; other machines are dimmed |
| Review suggestion | Accept / reject | No |
| Apply approved suggestion | No | Yes, for assigned machine |
| Receive machine alerts | All | Assigned machines |

Machine ownership is configured in `src/config/roles.js`.
