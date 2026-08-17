import GlassCard from "../ui/GlassCard";
import {
  IconWatch,
  IconBatteryMedium,
} from "../ui/icons";

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
    <GlassCard className="rounded-[26px] border-[#E4C99E] bg-[#FFF9ED] p-5">

      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#087F83]/10 text-[#087F83]">
            <IconWatch size={24} />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-black uppercase text-[#263A32]">
              NeuroWatch
            </span>

            <span className="text-xs font-semibold text-[#6B5842]">
              {connected
                ? "Reloj conectado"
                : "Reloj desconectado"}
            </span>

            <span
              className={`mt-1 text-[10px] font-black uppercase ${
                connected
                  ? "text-[#2F8F5B]"
                  : "text-[#A9967D]"
              }`}
            >
              {signalStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-[#E8A33D]/10 px-3 py-2">
          <IconBatteryMedium
            size={19}
          />

          <span className="text-sm font-black text-[#263A32]">
            {connected
              ? `${batteryPercent}%`
              : "--"}
          </span>
        </div>

      </div>
    </GlassCard>
  );
}
