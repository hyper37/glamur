import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useDemo } from '../core/store';
import { dateLabel, money } from '../core/model';
import {
  Button,
  Card,
  colors,
  Eyebrow,
  fonts,
  Heading,
  Icon,
  Notice,
  Pill,
  s,
  Txt,
} from '../components/ui';

export default function AppointmentsScreen() {
  const { studio, bookings, cancel } = useDemo();
  const [filter, setFilter] = useState('Próximos');
  const [confirmCancel, setConfirmCancel] = useState('');
  const all = bookings.filter((b) => b.studioId === studio.id);
  const shown = all
    .filter((b) =>
      filter === 'Cancelados'
        ? b.status === 'cancelled'
        : b.status === 'confirmed' &&
          (filter === 'Próximos'
            ? new Date(`${b.date}T${b.time}:00`) >= new Date()
            : new Date(`${b.date}T${b.time}:00`) < new Date()),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return (
    <>
      <View style={{ gap: 7 }}>
        <Eyebrow>TU AGENDA DE BELLEZA</Eyebrow>
        <Heading>Un espacio en tu día.</Heading>
        <Txt style={{ color: colors.muted }}>Tus reservas con {studio.name}.</Txt>
      </View>
      <View style={[s.row, { flexWrap: 'wrap' }]}>
        {['Próximos', 'Anteriores', 'Cancelados'].map((f) => (
          <Pill
            key={f}
            label={f}
            selected={f === filter}
            onPress={() => {
              setFilter(f);
              setConfirmCancel('');
            }}
          />
        ))}
      </View>
      {!shown.length ? (
        <Card style={{ alignItems: 'center', gap: 17, paddingVertical: 45 }}>
          <Icon name="calendar" color={colors.rose} size={34} />
          <Heading style={{ fontSize: 29, textAlign: 'center' }}>
            Tu agenda tiene lugar para vos.
          </Heading>
          <Txt style={{ color: colors.muted, textAlign: 'center' }}>
            No hay turnos {filter.toLowerCase()} en este espacio.
          </Txt>
          <Button label="Reservar un turno" icon="plus" onPress={() => router.push('/reservar')} />
        </Card>
      ) : (
        shown.map((b) => (
          <Card key={b.id} style={{ gap: 16 }}>
            <View style={[s.between, { flexWrap: 'wrap' }]}>
              <View style={{ gap: 5 }}>
                <Txt style={{ fontFamily: fonts.bold, fontSize: 18 }}>{b.serviceName}</Txt>
                <Txt style={{ color: colors.muted }}>
                  {dateLabel(b.date, true)} · {b.time} h
                </Txt>
              </View>
              <Pill
                label={b.status === 'cancelled' ? 'Cancelado' : 'Confirmado'}
                selected={b.status === 'confirmed'}
              />
            </View>
            <Txt style={{ fontSize: 12, color: colors.muted }}>
              {b.client} · {b.duration} min · {money(b.price)} ·{' '}
              {b.source === 'bot' ? 'Asistente demo' : 'Aplicación'}
            </Txt>
            {filter === 'Próximos' &&
              (confirmCancel === b.id ? (
                <View style={{ gap: 10 }}>
                  <Notice error>
                    ¿Querés cancelar este turno? El horario volverá a estar disponible.
                  </Notice>
                  <View style={[s.row, { flexWrap: 'wrap' }]}>
                    <Button
                      label="Sí, cancelar turno"
                      onPress={() => {
                        cancel(b.id);
                        setConfirmCancel('');
                      }}
                    />
                    <Button
                      label="Conservar turno"
                      variant="secondary"
                      onPress={() => setConfirmCancel('')}
                    />
                  </View>
                </View>
              ) : (
                <Button
                  label="Cancelar turno"
                  variant="ghost"
                  onPress={() => setConfirmCancel(b.id)}
                  style={{ alignSelf: 'flex-start' }}
                />
              ))}
          </Card>
        ))
      )}
      <Txt style={{ fontSize: 11, color: colors.muted }}>
        En esta demo se muestran las reservas creadas en este dispositivo. Las cuentas privadas de
        clientas se incorporarán al conectar el servidor.
      </Txt>
    </>
  );
}
