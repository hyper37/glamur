import { useState } from 'react';
import { Linking, View } from 'react-native';
import { useDemo } from '../core/store';
import { whatsappUrl } from '../core/model';
import { BookingFlow } from '../components/BookingFlow';
import { Button, Card, colors, Eyebrow, Heading, Icon, Notice, s, Txt } from '../components/ui';

export default function BotScreen() {
  const { studio, bots } = useDemo();
  const [error, setError] = useState('');
  const config = bots[studio.id];
  async function openWhatsApp() {
    try {
      await Linking.openURL(whatsappUrl(config.phone, studio.code));
    } catch {
      setError('No se pudo abrir WhatsApp. Revisá el número configurado en el panel profesional.');
    }
  }
  return (
    <View style={{ width: '100%', maxWidth: 770, alignSelf: 'center', gap: 22 }}>
      <View style={{ gap: 8 }}>
        <Eyebrow>RESERVAS POR WHATSAPP</Eyebrow>
        <Heading>Tu turno, en una conversación.</Heading>
        <Txt style={{ color: colors.muted }}>
          El asistente sabe a qué espacio venís y solo se ocupa de tu reserva.
        </Txt>
      </View>
      <Card style={{ backgroundColor: colors.greenBg, borderColor: '#DDE7DE', gap: 15 }}>
        <View style={s.row}>
          <Icon name="message-circle" size={27} color={colors.green} />
          <View style={{ flex: 1 }}>
            <Txt style={{ color: colors.green }}>{studio.name}</Txt>
            <Txt style={{ fontSize: 11, color: colors.muted }}>
              Espacio vinculado · {studio.code}
            </Txt>
          </View>
          <Icon name="check-circle" color={colors.green} />
        </View>
        <Txt style={{ fontSize: 12, color: colors.green }}>
          Simulación interactiva. Los turnos de prueba aparecen en la misma agenda de la app.
          Todavía no hay una IA ni una conexión real con WhatsApp.
        </Txt>
        {config?.enabled && config.phone ? (
          <>
            <Button
              label="Abrir WhatsApp con mi código"
              variant="green"
              icon="external-link"
              onPress={openWhatsApp}
            />
            <Txt style={{ fontSize: 10, color: colors.muted }}>
              Abre el número configurado con un mensaje preparado. El envío lo hacés vos; no conecta
              un bot automáticamente.
            </Txt>
          </>
        ) : null}
      </Card>
      {error ? <Notice error>{error}</Notice> : null}
      <BookingFlow key={studio.id} source="bot" />
    </View>
  );
}
