import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useDemo } from '../core/store';
import { Button, Card, colors, Eyebrow, fonts, Heading, Icon, s, Txt } from '../components/ui';
import { photos, ServiceCard } from '../components/ServiceCard';
import { dateLabel } from '../core/model';

export default function StudioScreen() {
  const { studio, bookings, bots } = useDemo();
  const { width } = useWindowDimensions();
  const wide = width >= 800;
  const next = bookings
    .filter(
      (b) =>
        b.studioId === studio.id &&
        b.status === 'confirmed' &&
        new Date(`${b.date}T${b.time}:00`) > new Date(),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0];
  return (
    <>
      <View style={s.between}>
        <View style={{ flex: 1, gap: 4 }}>
          <Eyebrow>BIENVENIDA A TU MOMENTO</Eyebrow>
          <Heading style={{ fontSize: wide ? 34 : 30 }}>Un poquito de amor propio.</Heading>
        </View>
        {wide && (
          <View style={[s.row, { gap: 6 }]}>
            <Icon name="map-pin" size={14} color={colors.muted} />
            <Txt style={{ color: colors.muted, fontSize: 11 }}>Salta, Argentina</Txt>
          </View>
        )}
      </View>
      <View style={[styles.hero, { minHeight: wide ? 318 : 430 }]}>
        <Image
          source={photos.nude}
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={
            wide ? ['#F2E6DDED', '#F2E6DDBC', '#F2E6DD00'] : ['#F3E8E0F5', '#F3E8E0C5', '#F3E8E033']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: wide ? 0.84 : 0.4, y: wide ? 0.2 : 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ padding: wide ? 36 : 25, maxWidth: wide ? 460 : 350, gap: 17 }}>
          <View style={styles.heroPill}>
            <View style={{ width: 5, height: 5, backgroundColor: colors.green, borderRadius: 3 }} />
            <Txt
              style={{ fontSize: 9, letterSpacing: 1.4, fontFamily: fonts.bold, color: '#64594E' }}
            >
              TU ESTUDIO, MÁS CERCA
            </Txt>
          </View>
          <Heading style={{ fontSize: wide ? 52 : 45, lineHeight: wide ? 53 : 47 }}>
            Pequeños detalles.{'\n'}
            <Txt
              style={{
                fontFamily: fonts.italic,
                fontSize: wide ? 52 : 45,
                lineHeight: wide ? 53 : 47,
                color: colors.roseDark,
              }}
            >
              Mucho de vos.
            </Txt>
          </Heading>
          <Txt style={{ color: '#75665F', fontSize: 12, lineHeight: 21, maxWidth: 275 }}>
            Encontrá tu próximo diseño favorito y regalate un momento para brillar.
          </Txt>
          <Button
            label="Reservar mi turno"
            icon="arrow-right"
            onPress={() => router.push('/reservar')}
            style={{ alignSelf: 'flex-start', marginTop: 3 }}
          />
        </View>
        {wide && (
          <View style={styles.heroSignature}>
            <Txt style={{ fontFamily: fonts.italic, fontSize: 22, color: '#6C5349' }}>
              made with love
            </Txt>
            <Txt style={{ fontSize: 8, letterSpacing: 2, color: '#816B60' }}>NAILS & SELF CARE</Txt>
          </View>
        )}
      </View>
      <View
        style={[
          styles.studioBar,
          { flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'stretch' },
        ]}
      >
        <View style={[s.row, { flex: 1 }]}>
          <View style={styles.studioAvatar}>
            <Txt style={{ fontFamily: fonts.title, color: colors.rose, fontSize: 27 }}>
              {studio.initials}
            </Txt>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={[s.row, { gap: 8, flexWrap: 'wrap' }]}>
              <Txt style={{ fontSize: 18, fontFamily: fonts.bold }}>{studio.name}</Txt>
              <Icon name="check-circle" color={colors.rose} size={15} />
            </View>
            <Txt style={{ fontSize: 11, color: colors.muted }}>
              Por {studio.owner} · {studio.address}
            </Txt>
          </View>
        </View>
        <View style={[s.row, { gap: 8 }]}>
          <View
            style={{
              backgroundColor: colors.greenBg,
              borderRadius: 6,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <Txt style={{ fontSize: 10, color: colors.green }}>Tu espacio vinculado</Txt>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cambiar de espacio"
            onPress={() => router.push('/unirse')}
            style={{ padding: 8 }}
          >
            <Icon name="more-horizontal" color={colors.muted} />
          </Pressable>
        </View>
      </View>
      <View style={{ flexDirection: wide ? 'row' : 'column', gap: 26 }}>
        <View style={{ flex: 1, gap: 20 }}>
          <View style={s.between}>
            <View>
              <Eyebrow>INSPIRACIÓN PARA TUS MANOS</Eyebrow>
              <Heading style={{ fontSize: 29, lineHeight: 35 }}>Tu próximo flechazo</Heading>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver todo el catálogo"
              onPress={() => router.push('/catalogo')}
              style={[s.row, { gap: 5, paddingVertical: 10 }]}
            >
              <Txt style={{ fontSize: 11, color: colors.rose, fontFamily: fonts.bold }}>
                Ver todos
              </Txt>
              <Icon name="arrow-right" size={14} color={colors.rose} />
            </Pressable>
          </View>
          <View style={{ flexDirection: width < 470 ? 'column' : 'row', gap: 17 }}>
            {studio.services.slice(0, 2).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        </View>
        <View style={{ width: wide ? 282 : '100%', gap: 17 }}>
          <Card style={{ padding: 21, gap: 13, backgroundColor: '#F5EEE9' }}>
            <View style={s.between}>
              <Icon name="calendar" color={colors.rose} size={20} />
              <Txt style={{ fontSize: 9, letterSpacing: 1.2, color: colors.muted }}>
                UN MOMENTO PARA VOS
              </Txt>
            </View>
            <Heading style={{ fontSize: 26, lineHeight: 29 }}>
              {next ? 'Ya tenés una cita.' : 'Tu próxima cita empieza acá.'}
            </Heading>
            <Txt style={{ fontSize: 12, color: colors.muted, lineHeight: 20 }}>
              {next
                ? `${next.serviceName}\n${dateLabel(next.date)} a las ${next.time}`
                : 'Elegí tu servicio y encontrá el horario que mejor va con vos.'}
            </Txt>
            <Button
              label={next ? 'Ver mi turno' : 'Encontrar un horario'}
              variant="secondary"
              onPress={() => router.push(next ? '/turnos' : '/reservar')}
              icon="arrow-right"
            />
          </Card>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Probar reserva por WhatsApp"
            onPress={() => router.push('/bot')}
            style={styles.whatsapp}
          >
            <View style={[s.row, { alignItems: 'flex-start' }]}>
              <View style={styles.chatIcon}>
                <Icon name="message-circle" color={colors.green} size={19} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Txt style={{ fontSize: 12, fontFamily: fonts.bold, color: colors.green }}>
                  ¿Preferís WhatsApp?
                </Txt>
                <Txt style={{ fontSize: 11, lineHeight: 18, color: '#708074' }}>
                  Tu asistente te ayuda a encontrar un turno.
                </Txt>
                <Txt
                  style={{
                    color: colors.green,
                    fontSize: 11,
                    fontFamily: fonts.bold,
                    marginTop: 3,
                  }}
                >
                  {bots[studio.id]?.enabled
                    ? 'Reservar con el asistente'
                    : 'Probar el asistente demo'}{' '}
                  ↗
                </Txt>
              </View>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={[styles.promise, { flexDirection: wide ? 'row' : 'column' }]}>
        {[
          {
            icon: 'heart' as const,
            title: 'Hecho con dedicación',
            copy: 'Cada detalle está pensado para vos.',
          },
          {
            icon: 'calendar' as const,
            title: 'Tu tiempo vale',
            copy: 'Reservá en unos pocos pasos.',
          },
          {
            icon: 'sun' as const,
            title: 'Tu estilo, siempre',
            copy: 'Un diseño para cada versión de vos.',
          },
        ].map((item) => (
          <View key={item.title} style={[s.row, { flex: 1 }]}>
            <Icon name={item.icon} color={colors.rose} size={21} />
            <View>
              <Txt style={{ fontSize: 11, fontFamily: fonts.bold }}>{item.title}</Txt>
              <Txt style={{ fontSize: 10, color: colors.muted }}>{item.copy}</Txt>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  hero: { borderRadius: 20, overflow: 'hidden', backgroundColor: '#ECDDD1' },
  heroPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#CDBEB38A',
    paddingHorizontal: 11,
    paddingVertical: 2,
    borderRadius: 20,
  },
  heroSignature: { position: 'absolute', bottom: 28, right: 30, alignItems: 'center', gap: 2 },
  studioBar: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 15,
    gap: 15,
    marginTop: -9,
  },
  studioAvatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: colors.blush,
    borderWidth: 3,
    borderColor: '#FAF4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsapp: {
    backgroundColor: '#EEF3EB',
    borderRadius: 15,
    padding: 19,
    borderColor: '#E1E8DC',
    borderWidth: 1,
  },
  chatIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDEAD9',
  },
  promise: { gap: 22, backgroundColor: '#F6F2EC', padding: 22, borderRadius: 14 },
});
