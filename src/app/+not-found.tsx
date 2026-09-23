import { router } from 'expo-router';
import { Button, Card, Heading, Txt } from '../components/ui';
export default function NotFound() {
  return (
    <Card style={{ gap: 20 }}>
      <Heading>Este espacio no está por acá.</Heading>
      <Txt>Volvé al inicio para encontrar tu estudio.</Txt>
      <Button label="Volver al inicio" onPress={() => router.replace('/')} />
    </Card>
  );
}
