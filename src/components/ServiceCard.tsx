import { Image, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Service, money } from '../core/model';
import { useDemo } from '../core/store';
import { colors, fonts, Icon, s, Txt } from './ui';

export const photos = {
  nude: require('../../assets/photos/nails-art.jpg'),
  art: require('../../assets/photos/studio.jpg'),
  studio: require('../../assets/photos/nails-rose.jpg'),
};
export function ServiceCard({ service }: { service: Service }) {
  const { favorites, toggleFavorite } = useDemo();
  const favorite = favorites.includes(service.id);
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: 16,
        overflow: 'hidden',
        flex: 1,
      }}
    >
      <View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Reservar ${service.name}`}
          onPress={() => router.push({ pathname: '/reservar', params: { service: service.id } })}
        >
          <Image
            source={photos[service.photo]}
            accessibilityLabel={service.name}
            style={{ width: '100%', height: 192, backgroundColor: colors.blush }}
            resizeMode="cover"
          />
        </Pressable>
        <View
          style={{
            position: 'absolute',
            left: 13,
            top: 13,
            backgroundColor: '#FFFEF4F0',
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 6,
          }}
        >
          <Txt style={{ fontSize: 9, letterSpacing: 0.6, fontFamily: fonts.bold }}>
            {service.category.toUpperCase()}
          </Txt>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${favorite ? 'Quitar' : 'Guardar'} favorito ${service.name}`}
          accessibilityState={{ selected: favorite }}
          onPress={() => toggleFavorite(service.id)}
          style={{
            position: 'absolute',
            right: 12,
            top: 12,
            width: 34,
            height: 34,
            borderRadius: 18,
            backgroundColor: favorite ? colors.rose : '#FFFFFFEA',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="heart" size={16} color={favorite ? 'white' : colors.ink} />
        </Pressable>
      </View>
      <View style={{ padding: 17, gap: 9 }}>
        <Txt style={{ fontFamily: fonts.bold, fontSize: 15 }}>{service.name}</Txt>
        <View style={[s.row, { gap: 5 }]}>
          <Icon name="clock" size={12} color={colors.muted} />
          <Txt style={{ fontSize: 11, color: colors.muted }}>
            {service.duration} min · Cuidado personalizado
          </Txt>
        </View>
        <View style={[s.between, { marginTop: 5 }]}>
          <Txt style={{ color: colors.rose, fontFamily: fonts.bold }}>{money(service.price)}</Txt>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Elegir ${service.name}`}
            onPress={() => router.push({ pathname: '/reservar', params: { service: service.id } })}
            style={{ minHeight: 36, paddingLeft: 12, justifyContent: 'center' }}
          >
            <Icon name="arrow-up-right" color={colors.rose} size={19} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
