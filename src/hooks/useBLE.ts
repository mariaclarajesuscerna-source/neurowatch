"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface BLEData {
  bpm: number;
  motor: boolean;
  connected: boolean;
  batteryPercent: number;
  ir: number;
  lastFrame: string;
  receivedAt: number | null;
  frameCount: number;
}

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

interface RawPayload {
  bpm: number;
  motor?: number;
  ir?: number;
}

const isMockBLE =
  typeof window !== "undefined" &&
  typeof window.location !== "undefined" &&
  new URLSearchParams(window.location.search).has("mockBLE");

export function useBLE() {
  const [data, setData] = useState<BLEData>({
    bpm: 0,
    motor: false,
    connected: false,
    batteryPercent: 100,
    ir: 0,
    lastFrame: "",
    receivedAt: null,
    frameCount: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mockRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  const applyFrame = useCallback((value: DataView) => {
    const decoder = new TextDecoder("utf-8");
    const raw = decoder.decode(value);

    try {
      const parsed: RawPayload = JSON.parse(raw);
      if (!Number.isFinite(parsed.bpm)) throw new Error("bpm inválido");
      setData((previous) => ({
        ...previous,
        bpm: Math.round(parsed.bpm),
        motor: parsed.motor === 1,
        connected: true,
        batteryPercent: 100,
        ir: Number.isFinite(parsed.ir) ? parsed.ir ?? 0 : 0,
        lastFrame: raw,
        receivedAt: Date.now(),
        frameCount: previous.frameCount + 1,
      }));
      setError(null);
      retryCountRef.current = 0;
    } catch {
      setError(`Trama BLE inválida: ${raw || "sin datos"}`);
    }
  }, []);

  const handleNotification = useCallback((event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    if (characteristic.value) applyFrame(characteristic.value);
  }, [applyFrame]);

  const connectToDevice = useCallback(async (device: BluetoothDevice) => {
    const server = await device.gatt!.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

    if (characteristicRef.current && characteristicRef.current !== characteristic) {
      characteristicRef.current.removeEventListener('characteristicvaluechanged', handleNotification);
    }
    characteristicRef.current = characteristic;
    characteristic.removeEventListener('characteristicvaluechanged', handleNotification);
    characteristic.addEventListener('characteristicvaluechanged', handleNotification);
    await characteristic.startNotifications();
    // Lee la trama actual inmediatamente y usa lectura cada segundo como
    // respaldo para navegadores que pierden alguna notificación BLE.
    applyFrame(await characteristic.readValue());
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      characteristic.readValue().then(applyFrame).catch(() => {});
    }, 1000);
    setData((prev) => ({ ...prev, connected: true }));
    retryCountRef.current = 0;
  }, [applyFrame, handleNotification]);

  const connectBLE = useCallback(async () => {
    try {
      if (!("bluetooth" in navigator)) {
        setError("Web Bluetooth no está disponible. Usa Chrome o Edge en Android/escritorio.");
        return;
      }

      setError(null);

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
        optionalServices: [SERVICE_UUID],
      });

      deviceRef.current = device;

      device.addEventListener("gattserverdisconnected", () => {
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        setData((prev) => ({ ...prev, connected: false }));
        retryCountRef.current++;
        if (retryCountRef.current <= MAX_RETRIES) {
          setTimeout(() => {
            if (deviceRef.current?.gatt) {
              connectToDevice(deviceRef.current).catch(() => {});
            }
          }, 2000);
        }
      });

      await connectToDevice(device);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al conectar con el dispositivo BLE.";
      if (!message.includes("cancelled") && !message.includes("User cancelled")) {
        setError(message);
      }
      setData((prev) => ({ ...prev, connected: false }));
    }
  }, [connectToDevice]);

  const disconnectBLE = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (characteristicRef.current) {
      characteristicRef.current.stopNotifications().catch(() => {});
      characteristicRef.current.removeEventListener(
        "characteristicvaluechanged",
        handleNotification
      );
      characteristicRef.current = null;
    }
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    setData((prev) => ({ ...prev, connected: false, motor: false, receivedAt: null }));
  }, [handleNotification]);

  const cancelDeviceAlert = useCallback(async () => {
    if (!characteristicRef.current) return;
    const command = new TextEncoder().encode("cancel");
    await characteristicRef.current.writeValue(command);
    setData((prev) => ({ ...prev, motor: false }));
  }, []);

  useEffect(() => {
    return () => {
      disconnectBLE();
    };
  }, [disconnectBLE]);

  const mockConnect = useCallback(() => {
    if (mockRef.current) clearInterval(mockRef.current);
    let bpm = 72;
    let tick = 0;
    mockRef.current = setInterval(() => {
      tick++;
      if (tick % 30 === 0) bpm = 112;
      else if (tick % 30 === 8) bpm = 70;
      else bpm = 70 + Math.round(Math.sin(tick * 0.3) * 8 + Math.random() * 4);
      const motor = bpm > 100 ? 1 : 0;
      const ir = bpm > 0 ? 180000 + Math.round(Math.random() * 30000) : 0;
      const frame = JSON.stringify({ bpm, motor, ir });
      setData((prev) => ({
        ...prev,
        bpm,
        motor: motor === 1,
        connected: true,
        batteryPercent: 85 + Math.round(Math.random() * 15),
        ir,
        lastFrame: frame,
        receivedAt: Date.now(),
        frameCount: prev.frameCount + 1,
      }));
    }, 1000);
    setData((prev) => ({ ...prev, connected: true }));
  }, []);

  const mockDisconnect = useCallback(() => {
    if (mockRef.current) {
      clearInterval(mockRef.current);
      mockRef.current = null;
    }
    setData((prev) => ({ ...prev, connected: false, bpm: 0, motor: false, receivedAt: null }));
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isMockBLE) {
      mockConnect();
      return () => mockDisconnect();
    }
  }, [mockConnect, mockDisconnect]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const connectBLEWrapped = useCallback(async () => {
    if (isMockBLE) {
      mockConnect();
      return;
    }
    return connectBLE();
  }, [connectBLE, mockConnect]);

  const disconnectBLEWrapped = useCallback(() => {
    if (isMockBLE) {
      mockDisconnect();
      return;
    }
    disconnectBLE();
  }, [disconnectBLE, mockDisconnect]);

  return {
    data,
    error,
    connect: connectBLEWrapped,
    disconnect: disconnectBLEWrapped,
    cancelDeviceAlert,
  };
}
