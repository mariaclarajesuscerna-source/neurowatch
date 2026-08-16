// Web Bluetooth API types
// These augment the existing TypeScript DOM types

interface BluetoothDevice extends EventTarget {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  watchAdvertisements(): Promise<void>;
  unwatchAdvertisements(): void;
  addEventListener(
    type: "gattserverdisconnected",
    listener: (this: BluetoothDevice, ev: Event) => void
  ): void;
  removeEventListener(
    type: "gattserverdisconnected",
    listener: (this: BluetoothDevice, ev: Event) => void
  ): void;
}

interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  getPrimaryServices(service?: string): Promise<BluetoothRemoteGATTService[]>;
}

interface BluetoothRemoteGATTService {
  device: BluetoothDevice;
  uuid: string;
  isPrimary: boolean;
  getCharacteristic(
    characteristic: string
  ): Promise<BluetoothRemoteGATTCharacteristic>;
  getCharacteristics(
    characteristic?: string
  ): Promise<BluetoothRemoteGATTCharacteristic[]>;
}

interface BluetoothRemoteGATTCharacteristic extends EventTarget {
  service: BluetoothRemoteGATTService;
  uuid: string;
  properties: BluetoothCharacteristicProperties;
  value?: DataView;
  readValue(): Promise<DataView>;
  writeValue(value: BufferSource): Promise<void>;
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  addEventListener(
    type: "characteristicvaluechanged",
    listener: (this: BluetoothRemoteGATTCharacteristic, ev: Event) => void
  ): void;
  removeEventListener(
    type: "characteristicvaluechanged",
    listener: (this: BluetoothRemoteGATTCharacteristic, ev: Event) => void
  ): void;
}

interface BluetoothCharacteristicProperties {
  broadcast: boolean;
  read: boolean;
  writeWithoutResponse: boolean;
  write: boolean;
  notify: boolean;
  indicate: boolean;
  authenticatedSignedWrites: boolean;
  reliableWrite: boolean;
  writableAuxiliaries: boolean;
}

interface BluetoothRequestDeviceFilter {
  services?: string[];
  name?: string;
  namePrefix?: string;
  manufacturerId?: number;
  serviceDataUUID?: string;
}

interface RequestDeviceOptions {
  filters: BluetoothRequestDeviceFilter[];
  optionalServices?: string[];
  acceptAllDevices?: boolean;
}

interface Bluetooth extends EventTarget {
  getAvailability(): Promise<boolean>;
  requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
  getDevices(): Promise<BluetoothDevice[]>;
}

interface Navigator {
  bluetooth: Bluetooth;
}
