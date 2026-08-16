import GlassCard from "../ui/GlassCard";
import { IconWatch, IconBatteryMedium } from "../ui/icons";

interface DeviceCardProps {
  connected: boolean;
  signalStatus: string;
  batteryPercent: number;
}

export default function DeviceCard({
  connected,
  signalStatus,
  batteryPercent,
}: DeviceCardProps) {
  return (
    <GlassCard className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2.5">
        <IconWatch size={20} />
        <div className="flex flex-col gap-[1px]">
          <span className="text-sm font-semibold text-ink-900">
            {connected ? "Reloj conectado" : "Reloj desconectado"}
          </span>
          <span className="text-xs font-normal text-ink-600">
            {signalStatus}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <IconBatteryMedium size={20} />
        <span className="text-sm font-semibold text-ink-900">
          {batteryPercent}%
        </span>
      </div>
    </GlassCard>
  );
}
