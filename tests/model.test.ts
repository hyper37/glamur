import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  availableSlots,
  findStudio,
  nextDays,
  overlaps,
  studios,
  validateBooking,
  whatsappUrl,
} from '../src/core/model.ts';
import type { Booking, BookingInput } from '../src/core/model.ts';

const now = new Date('2026-09-23T08:00:00');
const input: BookingInput = {
  studioId: studios[0].id,
  serviceId: 'alma-semi',
  date: '2026-09-23',
  time: '10:00',
  client: 'Clienta Demo',
  phone: '3875550123',
  source: 'app',
};
const booked: Booking = {
  ...input,
  id: 'test',
  duration: 90,
  price: 19000,
  serviceName: 'Kapping',
  status: 'confirmed',
};

test('excludes every overlap for the full duration, but allows adjacent appointments', () => {
  const slots = availableSlots(input.studioId, input.date, 60, [booked], now);
  assert.ok(slots.includes('09:00'));
  assert.ok(!slots.includes('09:30'));
  assert.ok(!slots.includes('10:30'));
  assert.ok(!slots.includes('11:00'));
  assert.ok(slots.includes('11:30'));
  assert.equal(overlaps(600, 60, 660, 90), false);
});
test('isolates availability between professionals and frees cancelled slots', () => {
  assert.ok(availableSlots(studios[1].id, input.date, 60, [booked], now).includes('10:00'));
  assert.ok(
    availableSlots(
      input.studioId,
      input.date,
      60,
      [{ ...booked, status: 'cancelled' }],
      now,
    ).includes('10:00'),
  );
});
test('does not offer Sundays, past times, lunch breaks, or appointments extending past closing', () => {
  assert.deepEqual(availableSlots(input.studioId, '2026-09-27', 60, [], now), []);
  assert.deepEqual(availableSlots(input.studioId, '2026-09-22', 60, [], now), []);
  const slots = availableSlots(
    input.studioId,
    input.date,
    120,
    [],
    new Date('2026-09-23T10:01:00'),
  );
  assert.ok(!slots.includes('10:00'));
  assert.ok(!slots.includes('12:00'));
  assert.ok(!slots.includes('14:00'));
  assert.ok(!slots.includes('18:30'));
  assert.ok(slots.includes('18:00'));
});
test('validates both app and bot bookings against the shared agenda', () => {
  assert.equal(validateBooking(input, [], now).id, 'alma-semi');
  assert.throws(() => validateBooking({ ...input, source: 'bot' }, [booked], now), /disponible/);
  assert.throws(() => validateBooking({ ...input, serviceId: 'luna-semi' }, [], now), /pertenece/);
  assert.throws(() => validateBooking({ ...input, client: ' ' }, [], now), /nombre/);
  assert.throws(() => validateBooking({ ...input, phone: 'hola' }, [], now), /teléfono/);
  assert.throws(() => validateBooking({ ...input, date: '2027-01-01' }, [], now), /14 días/);
});
test('resolves invitation codes and includes the correct code in WhatsApp links', () => {
  assert.equal(findStudio(' alma24 ')?.id, studios[0].id);
  assert.equal(findStudio('unknown'), undefined);
  const url = new URL(whatsappUrl('+54 9 387 555 0123', 'LUNA25'));
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/5493875550123');
  assert.ok(url.searchParams.get('text')?.includes('LUNA25'));
  assert.throws(() => whatsappUrl('123', 'ALMA24'));
});
test('generates a rolling fourteen-day booking window across month boundaries', () => {
  const days = nextDays(14, new Date('2026-09-29T23:30:00'));
  assert.equal(days[0], '2026-09-29');
  assert.equal(days[13], '2026-10-12');
});
