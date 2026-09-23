import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDemo } from '../core/store';
import { studios } from '../core/model';
import {
  Button,
  Card,
  colors,
  Eyebrow,
  Field,
  Heading,
  Icon,
  Notice,
  s,
  Txt,
} from '../components/ui';

function JoinForm({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState('');
  const { selectStudio, studio } = useDemo();
  function join(value: string) {
    if (selectStudio(value)) router.replace('/');
    else setError('No encontramos ese código. Probá ALMA24 o LUNA25 en esta demo.');
  }
  return (
    <View style={{ width: '100%', maxWidth: 660, alignSelf: 'center', gap: 24 }}>
      <View style={{ gap: 9 }}>
        <Eyebrow>UN ESPACIO QUE CONECTA</Eyebrow>
        <Heading>Tu manicurista, más cerca.</Heading>
        <Txt style={{ color: colors.muted }}>
          Ingresá el código que te compartió tu profesional para ver sus servicios y reservar.
        </Txt>
      </View>
      <Card style={{ gap: 20 }}>
        <Icon name="link" color={colors.rose} size={30} />
        <Field
          label="Código de tu manicurista"
          placeholder="Ej.: ALMA24"
          value={code}
          onChangeText={(v) => {
            setCode(v.toUpperCase());
            setError('');
          }}
          autoCapitalize="characters"
          maxLength={20}
          onSubmitEditing={() => join(code)}
        />
        {error ? <Notice error>{error}</Notice> : null}
        <Button label="Vincular mi espacio" icon="arrow-right" onPress={() => join(code)} />
      </Card>
      <Eyebrow>EXPLORÁ LOS ESPACIOS DE DEMOSTRACIÓN</Eyebrow>
      {studios.map((item) => (
        <Card key={item.id} style={{ gap: 12 }}>
          <View style={s.between}>
            <View style={{ flex: 1 }}>
              <Heading style={{ fontSize: 25 }}>{item.name}</Heading>
              <Txt style={{ color: colors.muted, fontSize: 12 }}>
                {item.owner} · Código {item.code}
              </Txt>
            </View>
            <Icon name={studio.id === item.id ? 'check-circle' : 'heart'} color={colors.rose} />
          </View>
          <Button
            label={studio.id === item.id ? 'Volver a mi espacio' : `Conocer ${item.name}`}
            variant="secondary"
            onPress={() => join(item.code)}
          />
        </Card>
      ))}
    </View>
  );
}
export default function JoinScreen() {
  const { codigo } = useLocalSearchParams<{ codigo?: string }>();
  return <JoinForm key={codigo ?? ''} initialCode={codigo ?? ''} />;
}
