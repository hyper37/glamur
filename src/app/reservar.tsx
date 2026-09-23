import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useDemo } from '../core/store';
import { BookingFlow } from '../components/BookingFlow';
import { colors, Eyebrow, Heading, Txt } from '../components/ui';

export default function ReserveScreen() {
  const { service } = useLocalSearchParams<{ service?: string }>();
  const { studio } = useDemo();
  return (
    <View style={{ maxWidth: 770, width: '100%', alignSelf: 'center', gap: 23 }}>
      <View style={{ gap: 7 }}>
        <Eyebrow>{studio.name.toUpperCase()}</Eyebrow>
        <Heading>Reservá un momento para vos.</Heading>
        <Txt style={{ color: colors.muted }}>Tu próximo turno, en tres pasos.</Txt>
      </View>
      <BookingFlow key={`${studio.id}-${service ?? ''}`} initialService={service} />
    </View>
  );
}
