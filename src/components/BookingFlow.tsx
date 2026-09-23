import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { availableSlots, Booking, dateLabel, money, nextDays } from '../core/model';
import { useDemo } from '../core/store';
import {
  Button,
  Card,
  colors,
  Eyebrow,
  Field,
  fonts,
  Heading,
  Icon,
  Notice,
  Pill,
  s,
  Txt,
} from './ui';

export function BookingFlow({
  initialService,
  source = 'app',
}: {
  initialService?: string;
  source?: 'app' | 'bot';
}) {
  const { studio, bookings, book } = useDemo();
  const [serviceId, setServiceId] = useState(
    studio.services.find((s) => s.id === initialService)?.id ?? studio.services[0].id,
  );
  const [date, setDate] = useState(
    nextDays().find(
      (d) =>
        availableSlots(
          studio.id,
          d,
          studio.services.find((s) => s.id === serviceId)!.duration,
          bookings,
        ).length,
    ) ?? nextDays()[0],
  );
  const [time, setTime] = useState('');
  const [client, setClient] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const service = studio.services.find((s) => s.id === serviceId)!;
  const slots = availableSlots(studio.id, date, service.duration, bookings);
  const bot = source === 'bot';
  const prompts = [
    '¡Hola! Ya encontré tu espacio. ¿Para qué servicio querés reservar?',
    'Perfecto. Estos son los días y horarios disponibles. ¿Cuál te queda mejor?',
    '¡Ya casi! Decime tu nombre y teléfono para confirmar el turno.',
  ];
  function confirm() {
    if (confirmed) return;
    try {
      setConfirmed(book({ studioId: studio.id, serviceId, date, time, client, phone, source }));
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (confirmed)
    return (
      <Card style={{ gap: 22, alignItems: 'center', paddingVertical: 35 }}>
        <View
          style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: colors.greenBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="check" color={colors.green} size={30} />
        </View>
        <Eyebrow>UN MOMENTO SOLO PARA VOS</Eyebrow>
        <Heading style={{ textAlign: 'center' }}>¡Tu turno está reservado!</Heading>
        <Txt style={{ textAlign: 'center', color: colors.muted }}>
          {studio.name}
          {'\n'}
          {confirmed.serviceName}
          {'\n'}
          {dateLabel(confirmed.date, true)} · {confirmed.time} h
        </Txt>
        <Notice>
          Reserva de demostración guardada en este dispositivo. No se envió a una profesional real
          ni se realizó ningún cobro.
        </Notice>
        <Button label="Ver mis turnos" icon="calendar" onPress={() => router.replace('/turnos')} />
        <Txt style={{ fontSize: 10, color: colors.muted }}>Referencia: {confirmed.id}</Txt>
      </Card>
    );
  return (
    <View style={{ gap: 20 }}>
      <View style={[s.row, { gap: 8, flexWrap: 'wrap' }]}>
        {['Servicio', 'Día y hora', 'Tus datos'].map((label, index) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            disabled={index + 1 > step}
            onPress={() => {
              setStep(index + 1);
              setError('');
            }}
            style={[s.row, { gap: 7, paddingVertical: 6, opacity: index + 1 > step ? 0.45 : 1 }]}
          >
            <View
              style={{
                width: 25,
                height: 25,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: step === index + 1 ? colors.rose : colors.blush,
              }}
            >
              <Txt style={{ fontSize: 10, color: step === index + 1 ? 'white' : colors.rose }}>
                {index + 1}
              </Txt>
            </View>
            <Txt
              style={{ fontSize: 11, fontFamily: step === index + 1 ? fonts.bold : fonts.regular }}
            >
              {label}
            </Txt>
            {index < 2 && <Icon name="chevron-right" size={12} color={colors.muted} />}
          </Pressable>
        ))}
      </View>
      {bot && (
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: 'white',
            borderRadius: 15,
            borderTopLeftRadius: 2,
            padding: 17,
            maxWidth: 500,
            borderWidth: 1,
            borderColor: colors.line,
          }}
        >
          <Txt
            style={{ fontSize: 10, color: colors.green, fontFamily: fonts.bold, marginBottom: 4 }}
          >
            ASISTENTE · {studio.name.toUpperCase()}
          </Txt>
          <Txt>{prompts[step - 1]}</Txt>
        </View>
      )}
      <Card style={{ gap: 20 }}>
        {step === 1 && (
          <>
            <Heading style={{ fontSize: 29 }}>¿Qué te gustaría hacerte?</Heading>
            {studio.services.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="radio"
                accessibilityLabel={item.name}
                accessibilityState={{ checked: serviceId === item.id }}
                onPress={() => {
                  setServiceId(item.id);
                  setTime('');
                }}
                style={{
                  padding: 17,
                  borderRadius: 13,
                  borderWidth: 1,
                  borderColor: serviceId === item.id ? colors.rose : colors.line,
                  backgroundColor: serviceId === item.id ? '#FCF6F7' : 'white',
                  gap: 5,
                }}
              >
                <View style={s.between}>
                  <Txt style={{ fontFamily: fonts.bold, flex: 1 }}>{item.name}</Txt>
                  <Txt style={{ fontFamily: fonts.bold, color: colors.rose }}>
                    {money(item.price)}
                  </Txt>
                </View>
                <Txt style={{ color: colors.muted, fontSize: 12 }}>{item.description}</Txt>
                <Txt style={{ color: colors.muted, fontSize: 11 }}>{item.duration} minutos</Txt>
              </Pressable>
            ))}
            <Button label="Elegir día y horario" icon="arrow-right" onPress={() => setStep(2)} />
          </>
        )}
        {step === 2 && (
          <>
            <Heading style={{ fontSize: 29 }}>Encontrá tu momento.</Heading>
            <Txt style={{ color: colors.muted, fontSize: 12 }}>
              Lunes a sábado · 9 a 13 y 15 a 20 h · Horario de Salta
            </Txt>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 9, paddingVertical: 3 }}
            >
              {nextDays().map((d) => {
                const free = availableSlots(studio.id, d, service.duration, bookings).length > 0;
                return (
                  <Pressable
                    key={d}
                    accessibilityRole="button"
                    accessibilityLabel={dateLabel(d, true)}
                    accessibilityState={{ selected: d === date, disabled: !free }}
                    disabled={!free}
                    onPress={() => {
                      setDate(d);
                      setTime('');
                    }}
                    style={{
                      width: 75,
                      paddingVertical: 12,
                      alignItems: 'center',
                      gap: 3,
                      backgroundColor: d === date ? colors.rose : colors.bg,
                      borderRadius: 12,
                      opacity: free ? 1 : 0.35,
                    }}
                  >
                    <Txt style={{ fontSize: 10, color: d === date ? 'white' : colors.muted }}>
                      {new Date(`${d}T12:00:00`)
                        .toLocaleDateString('es-AR', { weekday: 'short' })
                        .toUpperCase()}
                    </Txt>
                    <Txt
                      style={{
                        fontSize: 24,
                        fontFamily: fonts.title,
                        lineHeight: 29,
                        color: d === date ? 'white' : colors.ink,
                      }}
                    >
                      {Number(d.slice(-2))}
                    </Txt>
                    <Txt style={{ fontSize: 10, color: d === date ? 'white' : colors.muted }}>
                      {new Date(`${d}T12:00:00`).toLocaleDateString('es-AR', { month: 'short' })}
                    </Txt>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Txt style={{ fontFamily: fonts.bold, fontSize: 12 }}>
              Horarios disponibles · {service.duration} min
            </Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
              {slots.map((t) => (
                <Pill key={t} label={t} selected={time === t} onPress={() => setTime(t)} />
              ))}
            </View>
            {!slots.length && (
              <Notice>
                Este día no tiene horarios disponibles para el servicio. Elegí otra fecha.
              </Notice>
            )}
            <Button
              label="Continuar con mis datos"
              disabled={!slots.includes(time)}
              icon="arrow-right"
              onPress={() => setStep(3)}
            />
          </>
        )}
        {step === 3 && (
          <>
            <Heading style={{ fontSize: 29 }}>Ya casi es tuyo.</Heading>
            <View style={{ padding: 17, backgroundColor: colors.bg, borderRadius: 12, gap: 5 }}>
              <Txt style={{ fontFamily: fonts.bold }}>{service.name}</Txt>
              <Txt style={{ fontSize: 12 }}>
                {dateLabel(date, true)} · {time} h · {service.duration} min
              </Txt>
              <Txt style={{ color: colors.rose, fontFamily: fonts.bold }}>
                {money(service.price)}
              </Txt>
            </View>
            <Field
              label="Nombre y apellido"
              placeholder="Ej.: Valentina López"
              value={client}
              onChangeText={setClient}
              autoComplete="name"
              maxLength={80}
            />
            <Field
              label="Teléfono con código de área"
              placeholder="Ej.: 387 555 0123"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              maxLength={25}
            />
            <Txt style={{ fontSize: 11, color: colors.muted }}>
              Esta es una prueba: podés usar datos ficticios. No se envían mensajes ni se procesan
              pagos.
            </Txt>
            {error ? <Notice error>{error}</Notice> : null}
            <Button
              label={bot ? 'Confirmar turno con el bot' : 'Confirmar mi turno'}
              variant={bot ? 'green' : 'primary'}
              icon="check"
              onPress={confirm}
            />
          </>
        )}
        {step > 1 && (
          <Button
            label="Volver al paso anterior"
            variant="ghost"
            icon="arrow-left"
            onPress={() => {
              setStep(step - 1);
              setError('');
            }}
          />
        )}
      </Card>
    </View>
  );
}
