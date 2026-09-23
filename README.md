# Glamur

Demo de una aplicación para Android y web que conecta a cada manicurista con sus clientas mediante un espacio propio. Creada con React Native, Expo SDK 57, Expo Router y TypeScript.

## Iniciar

Requiere Node.js 24 LTS y npm. Las dependencias están fijadas en `package-lock.json`.

```sh
npm ci
npm run web
```

Abrí la dirección que muestra Expo, normalmente `http://localhost:8081`.

Para probar en un teléfono Android conectado a la misma red:

```sh
npm start
```

Escaneá el QR de Expo desde Expo Go compatible con SDK 57. El QR de Expo sirve para abrir la aplicación; el QR dentro de Glamur sirve para vincular el espacio de una profesional. `npm run android` requiere un emulador o dispositivo Android de desarrollo configurado. Esta entrega no incluye un APK firmado ni una publicación en Google Play.

## Recorrido de la demo

1. El inicio muestra **Alma Nail Studio**. Entrá al catálogo, guardá favoritos y elegí un servicio.
2. Reservá un día y horario e ingresá datos ficticios. Los domingos, el descanso del mediodía, los horarios pasados y los turnos que se superponen no están disponibles.
3. Consultá o cancelá la reserva en **Mis turnos**. Los datos se conservan al recargar.
4. Abrí **Panel profesional → Agenda** y seleccioná la fecha reservada para ver la misma cita.
5. En **Compartir espacio** podés copiar el código, el enlace o usar un QR real.
6. En **Bot de WhatsApp** configurá un número internacional. Guardarlo prepara un enlace con el código de la profesional. No activa una automatización real.
7. **Probar asistente demo** permite reservar mediante una simulación guiada que utiliza la misma agenda. No envía mensajes.
8. En **Vincular espacio** probá `LUNA25`: cambia el catálogo y la agenda. `ALMA24` te devuelve al primer estudio.

| Espacio ficticio | Código público | ID interna de demo |
| ---------------- | -------------- | ------------------ |
| Alma Nail Studio | ALMA24         | studio-alma-001    |
| Luna Nails       | LUNA25         | studio-luna-002    |

También se puede abrir `/unirse?codigo=ALMA24`. El enlace del QR se genera a partir de la dirección actual de la demo. Un enlace `localhost` solo funciona en la computadora que la ejecuta.

## Alcance

- Catálogo con imágenes locales, filtros, búsqueda y favoritos.
- Reserva en tres pasos, validación de datos, disponibilidad según duración y cancelación con confirmación.
- Agenda aislada por profesional y compartida entre los dos flujos de reserva.
- Panel profesional, código único por espacio, enlace y QR.
- Configuración local del número de WhatsApp y simulación del asistente limitada a reservas.
- Diseño adaptable a celular y escritorio, fuentes incluidas y almacenamiento local con AsyncStorage.

Es una demo **sin servidor ni autenticación**. Los perfiles, precios, horarios y métodos de pago son ejemplos. El panel profesional está abierto para probarlo; no constituye un control de permisos. Los turnos solo existen en el dispositivo donde se crearon y no se sincronizan entre pestañas o dispositivos. Las validaciones evitan superposiciones dentro de la sesión local; la versión real necesitará transacciones en el servidor.

La demo usa el reloj y la zona horaria del dispositivo; para la prueba en Salta configurá `America/Argentina/Salta`. No se procesan pagos ni señas, no hay avisos automáticos y no se conecta ningún modelo de IA ni la API de WhatsApp. Usá datos ficticios: AsyncStorage no es una base de datos cifrada.

## Verificación

```sh
npm run check       # TypeScript, ESLint y pruebas de la agenda
npm run test:e2e    # Navegador, tamaño escritorio y celular
npm run build:web   # Exportación web de producción en dist/
npx expo-doctor
npx expo export --platform android --output-dir artifacts/android-export
```

Las pruebas de navegador utilizan Microsoft Edge en Windows. En Linux/macOS instalá Chromium con `npx playwright install chromium`. Playwright exporta y sirve la versión de producción en `http://127.0.0.1:4173`. Las capturas y los artefactos de prueba quedan fuera de Git.

La exportación Android verifica el empaquetado de JavaScript y recursos; no reemplaza una prueba en un teléfono ni genera un APK.

`npm audit` reporta 13 avisos moderados transitivos en la versión actual de Expo/Router, originados en `uuid` de las herramientas de Xcode y `decode-uri-component`. No hay avisos altos o críticos en la instalación verificada. La corrección automática propuesta baja Expo a una versión incompatible; no se aplicó `--force`. Revisar versiones corregidas antes de producción.

## Estructura

- `src/app/`: pantallas y navegación con Expo Router.
- `src/components/`: componentes visuales y flujo de reserva compartido.
- `src/core/model.ts`: perfiles de demo y reglas de disponibilidad.
- `src/core/store.tsx`: estado y persistencia local.
- `tests/`: reglas de negocio y recorridos de navegador.
- `assets/photos/`: fotografías incluidas en el proyecto.

## Siguiente etapa

Conectar autenticación y una base de datos con permisos por profesional y clienta; validar las reservas en transacciones del servidor; configurar horarios, servicios y pagos reales; integrar WhatsApp mediante un webhook que resuelva el código público al espacio autorizado y llame al mismo servicio de reservas. El código público identifica un espacio y nunca debe autorizar acciones administrativas.

## Recursos

Fotografías de referencia de Unsplash, descargadas e incluidas localmente:

- [Manicura nude](https://images.unsplash.com/photo-1610992015732-2449b76344bc)
- [Trabajo de manicura](https://images.unsplash.com/photo-1632345031435-8727f6897d53)
- [Nail art oscuro](https://images.unsplash.com/photo-1604654894610-df63bc536371)

Documentación consultada: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [Expo Router](https://docs.expo.dev/router/installation/) y [Expo para web](https://docs.expo.dev/workflow/web/).
