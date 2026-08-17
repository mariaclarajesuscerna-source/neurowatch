"use client";
import { useEffect, useState } from "react";
import { IconActivity, IconBluetooth } from "@/components/ui/icons";
import GlassCard from "@/components/ui/GlassCard";
import { useNeurowatch } from "@/components/NeurowatchProvider";
export default function AjustesPage(){
 const {settings,saveSettings,patient,savePatient,bleData,bleError,connectBLE,disconnectBLE,recentBPMs}=useNeurowatch();
 const [name,setName]=useState(""),[age,setAge]=useState(""),[rest,setRest]=useState("70"),[saved,setSaved]=useState(false);
 useEffect(()=>{setName(patient?.name??"");setAge(patient?.age??"");setRest(String(patient?.restingBPM??70));},[patient]);
 const save=()=>{savePatient({name:name.trim()||"Usuario",age:age.trim(),restingBPM:Math.max(30,Math.min(220,Number(rest)||70))});setSaved(true);window.setTimeout(()=>setSaved(false),1800)};
 const input="mt-1 h-10 w-full rounded-lg border border-glass-border bg-white px-3 text-ink-900";
 return <div className="flex flex-col gap-4 px-5 pt-4 md:max-w-lg md:mx-auto">
 <div className="flex items-center gap-2"><div className="rounded-lg bg-brand-600 p-2 text-white"><IconActivity/></div><div><h1 className="text-xl font-bold">Ajustes</h1><p className="text-xs text-ink-600">Perfil, reloj y registros</p></div></div>
 <GlassCard className="flex flex-col gap-3 p-4"><b>Mis datos</b><label className="text-sm">Nombre<input className={input} value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/></label><label className="text-sm">Edad<input className={input} inputMode="numeric" value={age} onChange={e=>setAge(e.target.value)}/></label><label className="text-sm">FC en reposo (BPM)<input className={input} inputMode="numeric" value={rest} onChange={e=>setRest(e.target.value)}/></label><button onClick={save} className="h-11 rounded-xl bg-brand-600 font-semibold text-white">{saved?"Datos guardados":"Guardar mis datos"}</button></GlassCard>
 <GlassCard className="flex flex-col gap-3 p-4"><div className="flex justify-between"><b>Reloj</b><span className={bleData.connected?"text-ok":"text-ink-500"}>{bleData.connected?"Conectado":"Desconectado"}</span></div><p className="text-sm text-ink-600">{bleData.connected?`Recibiendo ${bleData.bpm||0} BPM`:"Conecta tu Neurowatch para recibir pulsaciones."}</p><button onClick={bleData.connected?disconnectBLE:connectBLE} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white"><IconBluetooth/>{bleData.connected?"Desconectar":"Conectar / re-emparejar"}</button>{bleError&&<p className="text-sm text-alert">{bleError}</p>}</GlassCard>
 <GlassCard className="flex flex-col gap-2 p-4"><b>Registro BLE en vivo</b><p className="text-xs text-ink-600">Última trama: BPM {bleData.bpm||0} · IR {bleData.ir||0}</p><div className="max-h-40 overflow-y-auto rounded-lg bg-ink-900 p-3 font-mono text-xs text-[#C4F5D2]">{recentBPMs.length?recentBPMs.slice(-12).reverse().map((b,i)=><p key={i}>RX BLE bpm={b} ir={bleData.ir||0}</p>):<p>Esperando datos del reloj…</p>}</div><small className="text-ink-400">Monitor Serie ESP32: 115200 baudios.</small></GlassCard>
 <GlassCard className="flex flex-col gap-3 p-4"><b>Monitoreo</b><label>Tolerancia: ±{settings.toleranceBPM} BPM<input type="range" min={5} max={30} value={settings.toleranceBPM} onChange={e=>saveSettings({...settings,toleranceBPM:Number(e.target.value)})} className="w-full"/></label><label>Cuenta regresiva: {settings.countdownSeconds} s<input type="range" min={30} max={60} step={5} value={settings.countdownSeconds} onChange={e=>saveSettings({...settings,countdownSeconds:Number(e.target.value)})} className="w-full"/></label></GlassCard>
 </div>
}
