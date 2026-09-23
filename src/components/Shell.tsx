import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDemo } from '../core/store';
import { colors, fonts, Icon, Notice, s, Txt } from './ui';

const navigation = [
  { path: '/' as const, icon: 'grid' as const, label: 'Mi estudio', short: 'Estudio' },
  {
    path: '/catalogo' as const,
    icon: 'heart' as const,
    label: 'Diseños y servicios',
    short: 'Catálogo',
  },
  { path: '/turnos' as const, icon: 'calendar' as const, label: 'Mis turnos', short: 'Turnos' },
  {
    path: '/espacio' as const,
    icon: 'sliders' as const,
    label: 'Panel profesional',
    short: 'Mi espacio',
  },
];
export function Shell({ children }: React.PropsWithChildren) {
  const { width } = useWindowDimensions();
  const desktop = width >= 1050;
  const pathname = usePathname();
  const { studio, ready, storageError } = useDemo();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.layout}>
        {desktop && (
          <View style={styles.sidebar}>
            <View style={{ paddingHorizontal: 14, marginBottom: 44 }}>
              <Txt style={styles.logo}>
                glamur<Txt style={{ color: colors.rose, fontSize: 40 }}>.</Txt>
              </Txt>
              <Txt style={styles.tagline}>TU MOMENTO, TU ESTILO</Txt>
            </View>
            <Txt style={styles.navLabel}>TU ESPACIO DE BELLEZA</Txt>
            <View style={{ gap: 8 }}>
              {navigation.map((item) => (
                <Pressable
                  key={item.path}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  onPress={() => router.push(item.path)}
                  style={[styles.navItem, pathname === item.path && styles.navActive]}
                >
                  <Icon
                    name={item.icon}
                    size={19}
                    color={pathname === item.path ? colors.rose : colors.muted}
                  />
                  <Txt
                    style={{
                      fontFamily: pathname === item.path ? fonts.bold : fonts.regular,
                      color: pathname === item.path ? colors.rose : colors.muted,
                      fontSize: 13,
                    }}
                  >
                    {item.label}
                  </Txt>
                  {pathname === item.path && <View style={styles.dot} />}
                </Pressable>
              ))}
            </View>
            <View style={{ flex: 1 }} />
            <View style={styles.sidebarNote}>
              <Icon name="feather" color={colors.rose} size={25} />
              <Txt style={{ fontFamily: fonts.title, fontSize: 24, lineHeight: 27 }}>
                Un ratito para vos.
              </Txt>
              <Txt style={{ fontSize: 12, color: colors.muted, lineHeight: 20 }}>
                Los pequeños detalles también son una forma de cuidarte.
              </Txt>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/unirse')}
              style={[s.row, { marginTop: 25, paddingVertical: 12 }]}
            >
              <View style={styles.avatar}>
                <Txt style={{ color: colors.rose, fontFamily: fonts.bold }}>V</Txt>
              </View>
              <View style={{ flex: 1 }}>
                <Txt style={{ fontFamily: fonts.bold, fontSize: 12 }}>Mi espacio favorito</Txt>
                <Txt style={{ fontSize: 10, color: colors.muted }}>{studio.name}</Txt>
              </View>
              <Icon name="chevrons-right" size={16} color={colors.muted} />
            </Pressable>
          </View>
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={[styles.topbar, !desktop && { paddingHorizontal: 20, height: 68 }]}>
            {desktop ? (
              <View style={s.row}>
                <Txt style={{ color: colors.muted, fontSize: 12 }}>Mi espacio</Txt>
                <Icon name="chevron-right" size={13} color="#B9AAAE" />
                <Txt style={{ fontSize: 12, fontFamily: fonts.medium }}>{studio.name}</Txt>
              </View>
            ) : (
              <Txt style={[styles.logo, { fontSize: 31, lineHeight: 39 }]}>
                glamur<Txt style={{ color: colors.rose, fontSize: 31 }}>.</Txt>
              </Txt>
            )}
            <View style={[s.row, { gap: desktop ? 21 : 12 }]}>
              <View style={styles.demo}>
                <View style={[styles.dot, { marginLeft: 0, backgroundColor: colors.rose }]} />
                <Txt style={{ fontSize: 10, color: colors.rose, fontFamily: fonts.bold }}>DEMO</Txt>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Vincular otro espacio"
                onPress={() => router.push('/unirse')}
                style={s.row}
              >
                <Icon name="link" size={16} color={colors.muted} />
                {desktop && (
                  <Txt style={{ fontSize: 12, color: colors.muted }}>Vincular espacio</Txt>
                )}
              </Pressable>
            </View>
          </View>
          <ScrollView
            key={pathname}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[
                styles.content,
                { paddingHorizontal: desktop ? 42 : 20, paddingTop: desktop ? 32 : 25 },
              ]}
            >
              {storageError ? <Notice error>{storageError}</Notice> : null}
              {ready ? (
                children
              ) : (
                <ActivityIndicator color={colors.rose} style={{ marginTop: 100 }} />
              )}
              <View style={styles.footer}>
                <Txt style={{ color: colors.muted, fontSize: 10 }}>
                  Hecho para conectar belleza y confianza.
                </Txt>
                <Txt style={{ color: colors.muted, fontSize: 10 }}>Glamur · Salta, Argentina</Txt>
              </View>
            </View>
          </ScrollView>
          {!desktop && (
            <View style={styles.bottomNav}>
              {navigation.map((item) => (
                <Pressable
                  key={item.path}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  onPress={() => router.push(item.path)}
                  style={styles.bottomItem}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    color={pathname === item.path ? colors.rose : colors.muted}
                  />
                  <Txt
                    style={{
                      fontSize: 10,
                      color: pathname === item.path ? colors.rose : colors.muted,
                      fontFamily: pathname === item.path ? fonts.bold : fonts.regular,
                    }}
                  >
                    {item.short}
                  </Txt>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  layout: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: 252,
    backgroundColor: '#FFFEFC',
    borderRightWidth: 1,
    borderRightColor: colors.line,
    padding: 24,
    paddingTop: 28,
  },
  logo: { fontFamily: fonts.title, fontSize: 49, lineHeight: 57, letterSpacing: -2 },
  tagline: { fontSize: 8, letterSpacing: 2.3, color: colors.muted, lineHeight: 13 },
  navLabel: { fontSize: 9, letterSpacing: 1.4, color: '#9B8E92', marginLeft: 14, marginBottom: 15 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    height: 49,
    borderRadius: 10,
  },
  navActive: { backgroundColor: colors.blush },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.rose, marginLeft: 'auto' },
  sidebarNote: { backgroundColor: '#F7F1EA', padding: 20, borderRadius: 15, gap: 13 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topbar: {
    height: 77,
    paddingHorizontal: 42,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: colors.blush,
    borderRadius: 20,
  },
  content: {
    width: '100%',
    maxWidth: 1320,
    alignSelf: 'center',
    flex: 1,
    gap: 26,
    paddingBottom: 24,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 25,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFEFC',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 9,
    paddingBottom: 7,
  },
  bottomItem: { flex: 1, minHeight: 46, alignItems: 'center', justifyContent: 'center', gap: 2 },
});
