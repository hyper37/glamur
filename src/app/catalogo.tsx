import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useDemo } from '../core/store';
import { Eyebrow, Heading, Txt, colors, Field, Pill, Card } from '../components/ui';
import { ServiceCard } from '../components/ServiceCard';

export default function CatalogScreen() {
  const { studio, favorites } = useDemo();
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const categories = ['Todos', ...new Set(studio.services.map((s) => s.category)), 'Guardados'];
  const services = studio.services.filter(
    (s) =>
      (category === 'Todos' ||
        category === s.category ||
        (category === 'Guardados' && favorites.includes(s.id))) &&
      s.name.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')),
  );
  const columns = width >= 1250 ? 3 : width >= 600 ? 2 : 1;
  return (
    <>
      <View style={{ gap: 8 }}>
        <Eyebrow>EL CATÁLOGO DE {studio.name.toUpperCase()}</Eyebrow>
        <Heading>Elegí tu próximo diseño.</Heading>
        <Txt style={{ color: colors.muted }}>
          Un color, un detalle, una nueva forma de expresarte.
        </Txt>
      </View>
      <Field
        label="Buscar un servicio"
        placeholder="Semipermanente, kapping, nail art…"
        value={query}
        onChangeText={setQuery}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {categories.map((c) => (
          <Pill key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
        {services.map((service) => (
          <View
            key={service.id}
            style={{ width: columns === 3 ? '31.8%' : columns === 2 ? '48%' : '100%' }}
          >
            <ServiceCard service={service} />
          </View>
        ))}
      </View>
      {!services.length && (
        <Card>
          <Heading style={{ fontSize: 27 }}>Todavía no hay diseños por acá.</Heading>
          <Txt style={{ color: colors.muted }}>
            Probá otra búsqueda o guardá tus favoritos con el corazón.
          </Txt>
        </Card>
      )}
      <Txt style={{ color: colors.muted, fontSize: 11 }}>
        Precios de ejemplo en pesos argentinos. Las fotografías son referencias de inspiración.
      </Txt>
    </>
  );
}
