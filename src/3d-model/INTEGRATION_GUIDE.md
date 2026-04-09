# Synced Home Experience — 3D Smart Room Integration

## File Structure

```
src/
├── SmartHomeContext.tsx   ← State management (all device states)
├── RoomScene.tsx          ← Three.js / R3F scene + dynamic lights
├── ControlsPanel.tsx      ← Dashboard UI (toggles, sliders)
├── SmartRoomApp.tsx       ← Root component wiring everything
└── App.tsx                ← Replace your existing App.tsx

public/
└── models/
    └── white_mesh.glb     ← Place your .glb file HERE
```

---

## 1. Install Dependencies

```bash
npm install @react-three/fiber @react-three/drei three
npm install --save-dev @types/three
```

---

## 2. Place your .glb model

```bash
# Create the folder and copy your model
mkdir -p public/models
cp /path/to/white_mesh.glb public/models/white_mesh.glb
```

---

## 3. Copy the source files

Copy all four `.tsx` files from this set into your `src/` folder:

- `SmartHomeContext.tsx`
- `RoomScene.tsx`
- `ControlsPanel.tsx`
- `SmartRoomApp.tsx`

Then replace your existing `src/App.tsx` with the one provided.

---

## 4. Tailwind CSS (already in your project)

No changes needed — all styling uses Tailwind utility classes already available in your config.

---

## 5. Run

```bash
npm run dev
```

---

## Architecture Overview

```
SmartHomeProvider (Context)
│
├── devices: Record<DeviceId, DeviceState>   ← single source of truth
├── toggle(id)                               ← flip on/off
├── setLevel(id, 0–100)                      ← brightness / volume / temp
├── allOn() / allOff()                       ← bulk controls
│
├── RoomScene.tsx
│   ├── SceneLights            ← pointLights driven by devices state
│   ├── TVScreen               ← emissive plane mesh for TV glow
│   └── RoomModel              ← GLTF primitive with idle bob animation
│
└── ControlsPanel.tsx
    ├── RoomStatus             ← active device count + progress bar
    ├── DeviceCard × 6         ← toggle + optional level slider per device
    └── QuickActions           ← All On / All Off
```

---

## Customizing Devices

Open `SmartHomeContext.tsx` and edit the `defaults` object:

```ts
const defaults: Record<DeviceId, DeviceState> = {
  ceilingLight: {
    id: "ceilingLight",
    label: "Ceiling Light",
    icon: "💡",
    on: true,
    level: 70,          // 0–100, drives light intensity
    color: "#ffe8a0",   // glow colour in scene
  },
  // ...add more devices by extending DeviceId union type
};
```

---

## Extending: Real-time backend sync

To connect to a real IoT backend (MQTT / WebSocket), call `toggle` and `setLevel`
from your socket handler. The context is the single source of truth — 3D scene
and UI stay in sync automatically:

```ts
// websocket-bridge.ts
import { useSmartHome } from "./SmartHomeContext";

// Inside a component:
const { toggle } = useSmartHome();
socket.on("device-update", ({ id, on }) => {
  if (devices[id].on !== on) toggle(id as DeviceId);
});
```

---

## Adding custom 3D reactions

In `RoomScene.tsx`, add mesh children inside `<RoomModel>` or `<Canvas>` and
read device state via `useSmartHome()`. Three.js materials react immediately:

```tsx
const { devices } = useSmartHome();
// Drive any material property
meshRef.current.material.emissiveIntensity = devices.lamp.on ? 1 : 0;
```
