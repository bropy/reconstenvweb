// app/map/page.tsx
import MapViewClient from './ClientPart';

export default function MapPage() {
  return (
    <div className="w-full h-screen">
      <MapViewClient />
    </div>
  );
}