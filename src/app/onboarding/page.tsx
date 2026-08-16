"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconActivity,
  IconCamera,
  IconCheck,
  IconUser,
  IconSend,
  IconBluetooth,
  IconWatch,
  IconZap,
  IconArrowRight,
} from "@/components/ui/icons";
import GlassCard from "@/components/ui/GlassCard";
import StatusChip from "@/components/ui/StatusChip";
import { useNeurowatch } from "@/components/NeurowatchProvider";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const {
    onboardingComplete,
    savePatient,
    saveContact,
    contacts,
    connectBLE,
    bleData,
    finishOnboarding,
    saveBaselineImage,
  } = useNeurowatch();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [restingBPM, setRestingBPM] = useState("");
  const [localContacts, setLocalContacts] = useState<
    { name: string; relation: string; telegram: string }[]
  >([]);
  const [newContact, setNewContact] = useState({
    name: "",
    relation: "",
    telegram: "",
  });
  const [deviceFound, setDeviceFound] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (onboardingComplete) {
      router.replace("/");
    }
  }, [onboardingComplete, router]);

  const canContinueStep1 = name.trim() && age.trim() && restingBPM.trim();
  const canContinueStep3 = localContacts.length > 0;

  const handleContinue = () => {
    if (step === 1) {
      savePatient({
        name: name.trim(),
        age: age.trim(),
        restingBPM: parseInt(restingBPM, 10) || 70,
      });
    }
    if (step === 2) {
      saveBaselineImage("captured");
    }
    if (step === 3) {
      localContacts.forEach((c) => {
        saveContact({
          name: c.name,
          relation: c.relation,
          telegramChatId: c.telegram,
        });
      });
    }
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const addContact = () => {
    if (newContact.name.trim() && newContact.telegram.trim()) {
      setLocalContacts([...localContacts, { ...newContact }]);
      setNewContact({ name: "", relation: "", telegram: "" });
    }
  };

  const handlePairDevice = async () => {
    setDeviceFound(true);
    await connectBLE();
  };

  const handleFinish = () => {
    finishOnboarding();
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col justify-center gap-6 px-5 py-7 md:max-w-lg md:mx-auto">
        <div className="flex flex-col gap-3.5 p-2 items-center text-center">
          <div className="h-[76px] w-[76px] rounded-full bg-ok flex items-center justify-center shadow-[0_8px_24px_rgba(16,185,129,0.35)] text-white">
            <IconCheck size={38} />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">
            Listo para monitorear
          </h1>
          <p className="text-sm font-normal text-ink-600 leading-[1.4] max-w-[280px]">
            Configuramos todo lo necesario para empezar a cuidarte.
          </p>
        </div>

        <GlassCard className="flex flex-col gap-1 p-2">
          {[
            { label: "Foto base", sub: "Referencia facial guardada" },
            {
              label: "Contacto vinculado",
              sub: localContacts[0]
                ? `${localContacts[0].name} por Telegram`
                : "Pendiente",
            },
            { label: "Reloj emparejado", sub: deviceFound ? "Neurowatch Band conectado" : "Pendiente" },
          ].map((item, i) => (
            <div key={item.label}>
              {i > 0 && <div className="h-px bg-glass-border mx-2" />}
              <div className="flex items-center gap-3 p-3">
                <div className="h-8 w-8 rounded-full bg-ok-fill flex items-center justify-center shrink-0 text-ok">
                  <IconCheck size={16} />
                </div>
                <div className="flex flex-col gap-[1px] flex-1">
                  <span className="text-sm font-semibold text-ink-900">
                    {item.label}
                  </span>
                  <span className="text-xs font-normal text-ink-600">
                    {item.sub}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </GlassCard>

        <div className="flex-1" />

        <button
          onClick={() => router.push("/")}
          className="w-full h-14 flex items-center justify-center gap-2 rounded-[14px] bg-brand-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
        >
          <IconArrowRight size={20} />
          <span className="text-[17px] font-bold">Ir al dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col gap-5 px-5 py-6 md:max-w-lg md:mx-auto">
      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-semibold text-brand-600">
          Paso {step} de {TOTAL_STEPS}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full ${
                i < step ? "bg-brand-600" : "bg-brand-100"
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold text-ink-900">Tus datos</h1>
          <p className="text-sm font-normal text-ink-600 leading-[1.4] max-w-[300px]">
            Esto nos ayuda a crear tu perfil y a calibrar tu monitoreo.
          </p>

          <GlassCard className="flex flex-col gap-3.5 p-[18px]">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-normal text-ink-600">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Rosa Fernandez"
                className="h-11 bg-white rounded-[10px] border border-glass-border px-3 text-sm font-normal text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-normal text-ink-600">Edad</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ej. 74"
                className="h-11 bg-white rounded-[10px] border border-glass-border px-3 text-sm font-normal text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-normal text-ink-600">
                FC en reposo habitual
              </label>
              <input
                type="text"
                value={restingBPM}
                onChange={(e) => setRestingBPM(e.target.value)}
                placeholder="Ej. 68 BPM"
                className="h-11 bg-white rounded-[10px] border border-glass-border px-3 text-sm font-normal text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500"
              />
            </div>
          </GlassCard>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-2xl font-bold text-ink-900">Foto base</h1>
          <p className="text-sm font-normal text-ink-600 leading-[1.4] max-w-[300px]">
            Tomate una foto de referencia — la usaremos para comparar tus
            futuros chequeos.
          </p>

          <GlassCard className="flex flex-col gap-3.5 p-[18px] items-center">
            <div className="w-full h-[314px] rounded-2xl bg-[#1E293B] relative overflow-hidden flex items-center justify-center">
              <div className="w-[170px] h-[220px] rounded-full border-[3px] border-brand-600" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink-900/60 rounded-full px-3.5 py-[7px]">
                <span className="text-[13px] font-medium text-[#E2E8F0]">
                  Alinea tu rostro dentro del marco
                </span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)]">
              <IconCamera size={20} />
              <span className="text-base font-semibold">Tomar foto</span>
            </button>
          </GlassCard>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-2xl font-bold text-ink-900 max-w-[280px]">
            Contactos de emergencia
          </h1>
          <p className="text-sm font-normal text-ink-600">
            Agrega al menos un contacto que recibira las alertas por Telegram.
          </p>

          <GlassCard className="flex flex-col gap-3.5 p-4">
            <span className="text-sm font-semibold text-ink-900">
              Nuevo contacto
            </span>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-normal text-ink-600">
                Nombre
              </label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder="Ej. Maria Lopez"
                className="h-11 bg-white rounded-[10px] border border-glass-border px-3 text-[13px] font-normal text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-normal text-ink-600">
                Relacion
              </label>
              <input
                type="text"
                value={newContact.relation}
                onChange={(e) =>
                  setNewContact({ ...newContact, relation: e.target.value })
                }
                placeholder="Ej. Hija, Medico, Vecino"
                className="h-11 bg-white rounded-[10px] border border-glass-border px-3 text-[13px] font-normal text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-normal text-ink-600">
                Usuario de Telegram
              </label>
              <input
                type="text"
                value={newContact.telegram}
                onChange={(e) =>
                  setNewContact({ ...newContact, telegram: e.target.value })
                }
                placeholder="@usuario"
                className="h-11 bg-white rounded-[10px] border border-glass-border px-3 text-[13px] font-normal text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500"
              />
            </div>
            <button
              onClick={addContact}
              className="flex items-center justify-center gap-2 h-[52px] rounded-[14px] bg-brand-600 text-white"
            >
              <IconSend size={18} />
              <span className="text-[15px] font-semibold">
                Vincular con Telegram
              </span>
            </button>
          </GlassCard>

          {localContacts.length > 0 && (
            <GlassCard className="flex flex-col gap-1 p-3">
              <span className="text-sm font-semibold text-ink-900 px-2 pb-1">
                Contactos agregados
              </span>
              {localContacts.map((c) => (
                <div key={c.name} className="flex items-center gap-3 p-2">
                  <div className="h-11 w-11 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-600">
                    <IconUser size={20} />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <span className="text-[15px] font-bold text-ink-900">
                      {c.name}
                    </span>
                    <span className="text-[13px] font-normal text-ink-600">
                      {c.relation}
                    </span>
                  </div>
                  <StatusChip label="Vinculado" status="ok" size="sm" />
                </div>
              ))}
            </GlassCard>
          )}
        </>
      )}

      {step === 4 && (
        <>
          <h1 className="text-2xl font-bold text-ink-900 max-w-[280px]">
            Emparejar tu reloj
          </h1>
          <p className="text-sm font-normal text-ink-600">
            Buscamos tu reloj por Bluetooth para empezar a monitorear.
          </p>

          <GlassCard className="flex flex-col gap-4 p-8 items-center">
            <div className="h-[120px] w-[120px] rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
              <IconBluetooth size={32} />
            </div>
            <span className="text-base font-semibold text-ink-900">
              {deviceFound
                ? "Dispositivo encontrado"
                : "Buscando tu reloj..."}
            </span>
            <p className="text-[13px] font-normal text-ink-600 text-center max-w-[240px]">
              Asegurate de que el reloj este cerca y encendido.
            </p>
          </GlassCard>

          {!deviceFound && (
            <button
              onClick={handlePairDevice}
              className="w-full flex items-center justify-center gap-2 h-14 rounded-[14px] bg-brand-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
            >
              <IconZap size={18} />
              <span className="text-base font-bold">Buscar dispositivo</span>
            </button>
          )}

          {deviceFound && (
            <div className="flex items-center gap-3 p-3.5 rounded-[14px] bg-ok-fill border border-[#10B98159]">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0 text-ok">
                <IconWatch size={20} />
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-[15px] font-bold text-ink-900">
                  Neurowatch Band
                </span>
                <span className="text-[13px] font-normal text-ok">
                  Dispositivo encontrado
                </span>
              </div>
              <IconCheck size={20} />
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          <button
            onClick={handleFinish}
            disabled={!deviceFound}
            className="w-full h-14 flex items-center justify-center gap-2 rounded-[14px] bg-brand-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconZap size={18} />
            <span className="text-base font-bold">Probar conexion</span>
          </button>
        </>
      )}

      {/* Navigation for steps 1-3 */}
      {step < 4 && (
        <>
          <div className="flex-1" />
          <div className="flex flex-col gap-3">
            <button
              onClick={handleContinue}
              disabled={
                (step === 1 && !canContinueStep1) ||
                (step === 3 && !canContinueStep3)
              }
              className="w-full h-14 flex items-center justify-center rounded-[14px] bg-brand-600 text-white text-[17px] font-bold shadow-[0_8px_20px_rgba(79,70,229,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-full py-2 text-[13px] font-normal text-ink-400"
              >
                Volver
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
