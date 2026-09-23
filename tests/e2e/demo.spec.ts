import { expect, test } from '@playwright/test';

test('client booking persists, appears in professional agenda, and keeps studios isolated', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByText('Un poquito de amor propio.')).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
  );
  await page.screenshot({ path: `artifacts/home-${test.info().project.name}.png`, fullPage: true });
  await page.getByRole('button', { name: 'Reservar mi turno', exact: true }).click();
  await page.getByRole('button', { name: 'Elegir día y horario' }).click();
  const nextDate = page
    .getByRole('button', { name: /jueves|viernes|sábado|lunes|martes|miércoles/ })
    .filter({ hasText: /./ });
  await nextDate.nth(1).click();
  const timeButton = page.getByRole('button', { name: /^\d{2}:\d{2}$/ }).first();
  const time = await timeButton.innerText();
  await timeButton.click();
  await page.getByRole('button', { name: 'Continuar con mis datos' }).click();
  await page.getByRole('button', { name: 'Confirmar mi turno' }).click();
  await expect(page.getByText('Ingresá tu nombre y apellido.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Nombre y apellido' }).fill('Clienta Demo');
  await page.getByRole('textbox', { name: 'Teléfono con código de área' }).fill('3875550123');
  await page.getByRole('button', { name: 'Confirmar mi turno' }).click();
  await expect(page.getByText('¡Tu turno está reservado!')).toBeVisible();
  await page.getByRole('button', { name: 'Ver mis turnos' }).click();
  await expect(page.getByText('Clienta Demo', { exact: false })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Clienta Demo', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Panel profesional', exact: true }).click();
  await expect(page.getByText('Hola, Sofía.')).toBeVisible();
  await page
    .getByRole('button', { name: /jue|vie|sáb|lun|mar|mié/ })
    .nth(1)
    .click();
  await expect(page.getByText('Clienta Demo', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Vincular otro espacio' }).click();
  await page.getByRole('textbox', { name: 'Código de tu manicurista' }).fill('LUNA25');
  await page.getByRole('button', { name: 'Vincular mi espacio', exact: true }).click();
  await expect(page.getByText('Luna Nails', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Mis turnos', exact: true }).click();
  await expect(page.getByText('No hay turnos próximos en este espacio.')).toBeVisible();
  await page.goto('/unirse?codigo=ALMA24');
  await page.getByRole('button', { name: 'Vincular mi espacio', exact: true }).click();
  await page.getByRole('button', { name: 'Mis turnos', exact: true }).click();
  await expect(page.getByText('Clienta Demo', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Cancelar turno', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, cancelar turno' }).click();
  await page.getByRole('button', { name: 'Cancelados', exact: true }).click();
  await expect(page.getByText('Clienta Demo', { exact: false })).toBeVisible();
  expect(time).toMatch(/\d{2}:\d{2}/);
  expect(errors).toEqual([]);
});

test('catalog favorites, QR, bot configuration and bot booking work', async ({ page }) => {
  await page.goto('/catalogo');
  await page.getByRole('button', { name: 'Guardar favorito Semipermanente', exact: true }).click();
  await page.getByRole('button', { name: 'Guardados', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Elegir Semipermanente', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Elegir Kapping gel', exact: true })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Panel profesional', exact: true }).click();
  await page.getByRole('button', { name: 'Compartir espacio', exact: true }).click();
  await expect(page.getByText('ALMA24', { exact: true })).toBeVisible();
  await expect(page.locator('svg').last()).toBeVisible();
  await page.getByRole('button', { name: 'Bot de WhatsApp', exact: true }).click();
  await page.getByRole('switch', { name: 'Mostrar acceso a WhatsApp' }).click();
  await page.getByRole('button', { name: 'Guardar configuración' }).click();
  await expect(page.getByText('Configurá un número internacional válido.')).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Número de WhatsApp con código de país' })
    .fill('5493875550123');
  await page.getByRole('button', { name: 'Guardar configuración' }).click();
  await expect(page.getByText('Configuración guardada para este espacio.')).toBeVisible();
  await page.getByRole('button', { name: 'Probar asistente demo' }).click();
  await expect(page.getByRole('button', { name: 'Abrir WhatsApp con mi código' })).toBeVisible();
  await page.getByRole('button', { name: 'Elegir día y horario' }).click();
  await page
    .getByRole('button', { name: /^\d{2}:\d{2}$/ })
    .first()
    .click();
  await page.getByRole('button', { name: 'Continuar con mis datos' }).click();
  await page.getByRole('textbox', { name: 'Nombre y apellido' }).fill('Reserva Bot');
  await page.getByRole('textbox', { name: 'Teléfono con código de área' }).fill('3875557890');
  await page.getByRole('button', { name: 'Confirmar turno con el bot' }).click();
  await expect(page.getByText('¡Tu turno está reservado!')).toBeVisible();
  await page.getByRole('button', { name: 'Ver mis turnos' }).click();
  await expect(page.getByText(/Reserva Bot.*Asistente demo/)).toBeVisible();
  await page.screenshot({
    path: `artifacts/booking-${test.info().project.name}.png`,
    fullPage: true,
  });
});
