import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  Booking,
  BookingInput,
  BotSettings,
  Studio,
  findStudio,
  studios,
  validateBooking,
} from './model';

type SavedState = {
  version: 1;
  studioId: string;
  bookings: Booking[];
  favorites: string[];
  bots: Record<string, BotSettings>;
};
const initial: SavedState = {
  version: 1,
  studioId: studios[0].id,
  bookings: [],
  favorites: [],
  bots: {},
};
const KEY = 'glamur-demo-v1';
type Store = SavedState & {
  studio: Studio;
  ready: boolean;
  storageError: string;
  selectStudio: (code: string) => boolean;
  book: (input: BookingInput) => Booking;
  cancel: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setBot: (id: string, value: BotSettings) => void;
};
const Context = createContext<Store | null>(null);
export function DemoProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<SavedState>(initial);
  const current = useRef(state);
  const queue = useRef(Promise.resolve());
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!active || !raw) return;
        const saved = JSON.parse(raw) as SavedState;
        if (
          saved.version !== 1 ||
          !studios.some((s) => s.id === saved.studioId) ||
          !Array.isArray(saved.bookings) ||
          !Array.isArray(saved.favorites) ||
          !saved.bots
        )
          throw new Error('Invalid data');
        current.current = saved;
        setState(saved);
      })
      .catch(() => {
        if (active)
          setStorageError('No pudimos recuperar los datos guardados. Esta sesión comienza vacía.');
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  function update(transform: (prev: SavedState) => SavedState) {
    const next = transform(current.current);
    current.current = next;
    setState(next);
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(KEY, JSON.stringify(next)))
      .catch(() =>
        setStorageError('No pudimos guardar los cambios en este dispositivo. No cierres la demo.'),
      );
  }
  const value: Store = {
    ...state,
    ready,
    storageError,
    studio: studios.find((s) => s.id === state.studioId)!,
    selectStudio(code) {
      const studio = findStudio(code);
      if (!studio) return false;
      update((s) => ({ ...s, studioId: studio.id }));
      return true;
    },
    book(input) {
      const service = validateBooking(input, current.current.bookings);
      const booking: Booking = {
        ...input,
        client: input.client.trim(),
        phone: input.phone.trim(),
        id: `GL-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        serviceName: service.name,
        price: service.price,
        duration: service.duration,
        status: 'confirmed',
      };
      update((s) => ({ ...s, bookings: [...s.bookings, booking] }));
      return booking;
    },
    cancel(id) {
      update((s) => ({
        ...s,
        bookings: s.bookings.map((b) =>
          b.id === id && b.studioId === s.studioId ? { ...b, status: 'cancelled' } : b,
        ),
      }));
    },
    toggleFavorite(id) {
      update((s) => ({
        ...s,
        favorites: s.favorites.includes(id)
          ? s.favorites.filter((f) => f !== id)
          : [...s.favorites, id],
      }));
    },
    setBot(id, value) {
      update((s) => ({ ...s, bots: { ...s.bots, [id]: value } }));
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error('DemoProvider missing');
  return value;
}
