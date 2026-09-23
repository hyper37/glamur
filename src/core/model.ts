export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  photo: 'nude' | 'art' | 'studio';
};
export type Studio = {
  id: string;
  code: string;
  name: string;
  owner: string;
  initials: string;
  address: string;
  description: string;
  services: Service[];
};
export type Booking = {
  id: string;
  studioId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  client: string;
  phone: string;
  source: 'app' | 'bot';
  status: 'confirmed' | 'cancelled';
};
export type BookingInput = Pick<
  Booking,
  'studioId' | 'serviceId' | 'date' | 'time' | 'client' | 'phone' | 'source'
>;
export type BotSettings = { enabled: boolean; phone: string };

export const studios: Studio[] = [
  {
    id: 'studio-alma-001',
    code: 'ALMA24',
    name: 'Alma Nail Studio',
    owner: 'Sofía Martínez',
    initials: 'AM',
    address: 'Zona centro · Salta Capital',
    description:
      'Un espacio para vos. Uñas hechas con amor, atención a los detalles y un ratito para desconectar.',
    services: [
      {
        id: 'alma-semi',
        name: 'Semipermanente',
        description: 'Preparación, cuidado de cutículas y el color que más te guste.',
        duration: 60,
        price: 14000,
        category: 'Clásicos',
        photo: 'nude',
      },
      {
        id: 'alma-kapping',
        name: 'Kapping gel',
        description: 'Un refuerzo delicado para acompañar el crecimiento de tus uñas.',
        duration: 90,
        price: 19000,
        category: 'Naturales',
        photo: 'studio',
      },
      {
        id: 'alma-art',
        name: 'Soft gel + nail art',
        description: 'Extensiones y un diseño especial que hable de vos.',
        duration: 120,
        price: 25000,
        category: 'Nail art',
        photo: 'art',
      },
      {
        id: 'alma-removal',
        name: 'Retiro y cuidado',
        description: 'Retiro cuidadoso, limado e hidratación de tus uñas naturales.',
        duration: 30,
        price: 6000,
        category: 'Naturales',
        photo: 'studio',
      },
    ],
  },
  {
    id: 'studio-luna-002',
    code: 'LUNA25',
    name: 'Luna Nails',
    owner: 'Lucía Romero',
    initials: 'LN',
    address: 'Zona Tres Cerritos · Salta Capital',
    description: 'Color, creatividad y mucho cuidado. Tu próximo diseño favorito empieza acá.',
    services: [
      {
        id: 'luna-semi',
        name: 'Semipermanente',
        description: 'Color intenso y un acabado brillante para todos los días.',
        duration: 60,
        price: 15000,
        category: 'Clásicos',
        photo: 'nude',
      },
      {
        id: 'luna-art',
        name: 'Nail art personalizado',
        description: 'Diseños a mano alzada para unas uñas únicas.',
        duration: 90,
        price: 22000,
        category: 'Nail art',
        photo: 'art',
      },
    ],
  },
];

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function nextDays(count = 14, from = new Date()): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    return dateKey(d);
  });
}
export function dateLabel(key: string, long = false): string {
  return new Date(`${key}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: long ? 'long' : 'short',
    day: 'numeric',
    month: long ? 'long' : 'short',
  });
}
export function money(value: number): string {
  return `$ ${value.toLocaleString('es-AR')}`;
}
export function minutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
export function overlaps(
  aStart: number,
  aDuration: number,
  bStart: number,
  bDuration: number,
): boolean {
  return aStart < bStart + bDuration && bStart < aStart + aDuration;
}
export function availableSlots(
  studioId: string,
  date: string,
  duration: number,
  bookings: Booking[],
  now = new Date(),
): string[] {
  const day = new Date(`${date}T12:00:00`);
  if (Number.isNaN(day.getTime()) || date < dateKey(now) || day.getDay() === 0 || duration <= 0)
    return [];
  const result: string[] = [];
  for (const [open, close] of [
    [9 * 60, 13 * 60],
    [15 * 60, 20 * 60],
  ]) {
    for (let start = open; start + duration <= close; start += 30) {
      const time = `${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`;
      if (new Date(`${date}T${time}:00`) <= now) continue;
      if (
        !bookings.some(
          (b) =>
            b.studioId === studioId &&
            b.date === date &&
            b.status === 'confirmed' &&
            overlaps(start, duration, minutes(b.time), b.duration),
        )
      )
        result.push(time);
    }
  }
  return result;
}
export function validateBooking(
  input: BookingInput,
  bookings: Booking[],
  now = new Date(),
): Service {
  const studio = studios.find((s) => s.id === input.studioId);
  const service = studio?.services.find((s) => s.id === input.serviceId);
  if (!service) throw new Error('Ese servicio no pertenece a este espacio.');
  if (input.client.trim().length < 2) throw new Error('Ingresá tu nombre y apellido.');
  if (
    !/^\+?[\d\s()-]+$/.test(input.phone) ||
    input.phone.replace(/\D/g, '').length < 8 ||
    input.phone.replace(/\D/g, '').length > 15
  )
    throw new Error('Ingresá un teléfono válido, con código de área.');
  if (!nextDays(14, now).includes(input.date))
    throw new Error('Elegí una fecha dentro de los próximos 14 días.');
  if (
    !availableSlots(input.studioId, input.date, service.duration, bookings, now).includes(
      input.time,
    )
  )
    throw new Error('Ese horario ya no está disponible. Elegí otro.');
  return service;
}
export function findStudio(code: string): Studio | undefined {
  return studios.find((s) => s.code === code.trim().toUpperCase());
}
export function whatsappUrl(phone: string, code: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15)
    throw new Error('Configurá un número internacional válido.');
  return `https://wa.me/${digits}?text=${encodeURIComponent(`Hola, quiero reservar un turno. Código de mi manicurista: ${code}`)}`;
}
