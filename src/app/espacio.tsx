import { useState } from 'react';
import { Switch, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import QRCode from 'react-native-qrcode-svg';
import { useDemo } from '../core/store';
import { dateLabel, money, nextDays, whatsappUrl } from '../core/model';
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
} from '../components/ui';

function ProfessionalPanel() {
  const { studio, bookings, bots, setBot } = useDemo();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState('Agenda');
  const [enabled, setEnabled] = useState(bots[studio.id]?.enabled ?? false);
  const [phone, setPhone] = useState(bots[studio.id]?.phone ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(nextDays()[0]);
  const link = Linking.createURL('/unirse', { queryParams: { codigo: studio.code } });
  const active = bookings.filter((b) => b.studioId === studio.id && b.status === 'confirmed');
  const todayBookings = active
    .filter((b) => b.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));
  async function copy(value: string, label: string) {
    try {
      await Clipboard.setStringAsync(value);
      setError('');
      setMessage(`${label} copiado.`);
    } catch {
      setError('No se pudo copiar. Podés seleccionar y copiar el texto manualmente.');
    }
  }
  function saveBot() {
    try {
      if (enabled) whatsappUrl(phone, studio.code);
      setBot(studio.id, { enabled, phone: phone.trim() });
      setError('');
      setMessage('Configuración guardada para este espacio.');
    } catch (e) {
      setMessage('');
      setError((e as Error).message);
    }
  }
  return (
    <>
      <View style={{ gap: 8 }}>
        <Eyebrow>PANEL PROFESIONAL · DEMO</Eyebrow>
        <Heading>Hola, {studio.owner.split(' ')[0]}.</Heading>
        <Txt style={{ color: colors.muted }}>Tu espacio, tus clientas y cada pequeño detalle.</Txt>
      </View>
      <View style={{ flexDirection: width >= 700 ? 'row' : 'column', gap: 15 }}>
        {[
          { label: 'Turnos confirmados', value: String(active.length), icon: 'calendar' as const },
          {
            label: 'Reservados con el asistente',
            value: String(active.filter((b) => b.source === 'bot').length),
            icon: 'message-circle' as const,
          },
          {
            label: 'Valor de reservas · no cobrado',
            value: money(active.reduce((sum, b) => sum + b.price, 0)),
            icon: 'credit-card' as const,
          },
        ].map((stat) => (
          <Card key={stat.label} style={{ flex: 1, gap: 10, padding: 20 }}>
            <View style={s.between}>
              <Txt style={{ color: colors.muted, fontSize: 11, flex: 1 }}>{stat.label}</Txt>
              <Icon name={stat.icon} color={colors.rose} size={17} />
            </View>
            <Heading style={{ fontSize: 36 }}>{stat.value}</Heading>
          </Card>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
        {['Agenda', 'Compartir espacio', 'Bot de WhatsApp', 'Mi negocio'].map((t) => (
          <Pill
            key={t}
            label={t}
            selected={t === tab}
            onPress={() => {
              setTab(t);
              setError('');
              setMessage('');
            }}
          />
        ))}
      </View>
      {message ? <Notice>{message}</Notice> : null}
      {error ? <Notice error>{error}</Notice> : null}
      {tab === 'Agenda' && (
        <Card style={{ gap: 20 }}>
          <View style={[s.between, { flexWrap: 'wrap' }]}>
            <Heading style={{ fontSize: 28 }}>Tu agenda</Heading>
            <Button
              label="Nuevo turno"
              icon="plus"
              variant="secondary"
              onPress={() => router.push('/reservar')}
            />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {nextDays(7).map((d) => (
              <Pill
                key={d}
                label={dateLabel(d)}
                selected={selectedDate === d}
                onPress={() => setSelectedDate(d)}
              />
            ))}
          </View>
          {todayBookings.length ? (
            todayBookings.map((b) => (
              <View
                key={b.id}
                style={[
                  s.row,
                  {
                    paddingVertical: 17,
                    borderTopWidth: 1,
                    borderTopColor: colors.line,
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                  },
                ]}
              >
                <View style={{ width: 65 }}>
                  <Txt style={{ fontFamily: fonts.bold, color: colors.rose }}>{b.time}</Txt>
                  <Txt style={{ fontSize: 10, color: colors.muted }}>{b.duration} min</Txt>
                </View>
                <View style={{ flex: 1, minWidth: 150 }}>
                  <Txt style={{ fontFamily: fonts.bold }}>{b.client}</Txt>
                  <Txt style={{ fontSize: 12, color: colors.muted }}>{b.serviceName}</Txt>
                  <Txt style={{ fontSize: 11, color: colors.muted }}>{b.phone}</Txt>
                </View>
                <Pill label={b.source === 'bot' ? 'Asistente' : 'App'} />
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 30, gap: 12 }}>
              <Icon name="sun" size={30} color={colors.rose} />
              <Txt style={{ color: colors.muted, textAlign: 'center' }}>
                Todavía no hay reservas para este día.
              </Txt>
            </View>
          )}
          <Txt style={{ color: colors.muted, fontSize: 11 }}>
            La agenda muestra los turnos de la app y del asistente de este espacio.
          </Txt>
        </Card>
      )}
      {tab === 'Compartir espacio' && (
        <Card style={{ gap: 22 }}>
          <Heading style={{ fontSize: 29 }}>Una invitación a tu espacio.</Heading>
          <Txt style={{ color: colors.muted }}>
            Compartí tu código, enlace o QR para que tus clientas encuentren tu catálogo.
          </Txt>
          <View
            style={{
              flexDirection: width >= 800 ? 'row' : 'column',
              gap: 30,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.line,
              }}
            >
              <QRCode value={link} size={175} color={colors.roseDark} backgroundColor="white" />
            </View>
            <View style={{ flex: 1, gap: 12, width: '100%' }}>
              <Eyebrow>TU CÓDIGO ÚNICO</Eyebrow>
              <Txt
                selectable
                style={{ fontFamily: fonts.bold, fontSize: 30, lineHeight: 40, letterSpacing: 5 }}
              >
                {studio.code}
              </Txt>
              <Txt selectable style={{ fontSize: 11, color: colors.muted }}>
                {link}
              </Txt>
              <View style={[s.row, { flexWrap: 'wrap' }]}>
                <Button
                  label="Copiar código"
                  icon="copy"
                  onPress={() => copy(studio.code, 'Código')}
                />
                <Button
                  label="Copiar enlace"
                  variant="secondary"
                  icon="link"
                  onPress={() => copy(link, 'Enlace')}
                />
              </View>
            </View>
          </View>
          <Notice>
            El enlace y el QR apuntan a esta demo. Para abrirlos en otro dispositivo, la demo debe
            estar accesible desde ese dispositivo.
          </Notice>
        </Card>
      )}
      {tab === 'Bot de WhatsApp' && (
        <Card style={{ gap: 23 }}>
          <View style={s.row}>
            <Icon name="message-circle" color={colors.green} size={29} />
            <Heading style={{ fontSize: 28, flex: 1 }}>Un asistente para tus turnos.</Heading>
          </View>
          <Txt style={{ color: colors.muted }}>
            Cada conversación comienza con el código de tu espacio. El asistente solo registra
            turnos; el resto se gestiona en la app.
          </Txt>
          <View
            style={[s.between, { padding: 16, backgroundColor: colors.greenBg, borderRadius: 12 }]}
          >
            <View style={{ flex: 1 }}>
              <Txt style={{ fontFamily: fonts.bold }}>Mostrar acceso a WhatsApp</Txt>
              <Txt style={{ fontSize: 11, color: colors.muted }}>
                Habilita el enlace en la pantalla del asistente.
              </Txt>
            </View>
            <Switch
              accessibilityLabel="Mostrar acceso a WhatsApp"
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: '#D8CDCF', true: colors.green }}
            />
          </View>
          <Field
            label="Número de WhatsApp con código de país"
            placeholder="Ej.: 5493875550123"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={20}
          />
          <View style={{ gap: 5 }}>
            <Txt style={{ color: colors.muted, fontSize: 11 }}>Cuenta vinculada</Txt>
            <Txt selectable style={{ fontFamily: fonts.bold }}>
              {studio.name} · {studio.code}
            </Txt>
            <Txt selectable style={{ fontSize: 11, color: colors.muted }}>
              ID: {studio.id}
            </Txt>
          </View>
          <Notice>
            Esta configuración guarda el número y prepara el enlace. La automatización real requiere
            conectar WhatsApp y el servidor; no se activa con este interruptor.
          </Notice>
          <View style={[s.row, { flexWrap: 'wrap' }]}>
            <Button label="Guardar configuración" icon="check" onPress={saveBot} />
            <Button
              label="Probar asistente demo"
              variant="secondary"
              onPress={() => router.push('/bot')}
            />
          </View>
        </Card>
      )}
      {tab === 'Mi negocio' && (
        <Card style={{ gap: 18 }}>
          <Heading style={{ fontSize: 29 }}>{studio.name}</Heading>
          <Txt style={{ color: colors.muted }}>{studio.description}</Txt>
          <View style={s.row}>
            <Icon name="map-pin" color={colors.rose} />
            <Txt style={{ flex: 1 }}>{studio.address}</Txt>
          </View>
          <View style={s.row}>
            <Icon name="clock" color={colors.rose} />
            <Txt style={{ flex: 1 }}>Lunes a sábado · 9 a 13 y 15 a 20 h</Txt>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 20, gap: 12 }}>
            <Eyebrow>MÉTODOS DE PAGO · EJEMPLO</Eyebrow>
            <View style={[s.row, { flexWrap: 'wrap' }]}>
              <Pill label="Transferencia" />
              <Pill label="Efectivo" />
              <Pill label="Mercado Pago" />
            </View>
            <Txt style={{ fontSize: 12, color: colors.muted }}>
              En esta demo no se solicitan señas ni se procesan pagos. Los horarios, servicios y
              métodos de pago son datos de ejemplo.
            </Txt>
          </View>
          <Button
            label="Ver mi catálogo"
            variant="secondary"
            icon="arrow-right"
            onPress={() => router.push('/catalogo')}
          />
        </Card>
      )}
      <Txt style={{ fontSize: 11, color: colors.muted }}>
        Panel abierto para probar la demo. El acceso con cuenta y la sincronización entre
        dispositivos se incorporarán en la siguiente etapa.
      </Txt>
    </>
  );
}
export default function SpaceScreen() {
  const { studio } = useDemo();
  return <ProfessionalPanel key={studio.id} />;
}
