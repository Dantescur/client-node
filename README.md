# 📚 QvaPay SDK: Cliente para Node.js

[![npm version](https://img.shields.io/npm/v/qvapay-sdk.svg)](https://www.npmjs.com/package/qvapay-sdk)
[![release-it](https://img.shields.io/badge/release-it-blue.svg)](https://github.com/qvacode/client-node/releases)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/qvacode/client-node/blob/main/LICENSE)

La librería oficial de Node.js para la API de QvaPay, escrita en TypeScript.

Este SDK proporciona una forma conveniente de interactuar con la API de QvaPay
desde tu aplicación Node.js. Simplifica el proceso de realizar solicitudes y
manejar respuestas, permitiéndote concentrarte en construir tu aplicación.

## Características

- **API Moderna basada en Promesas:** Usa `async/await` para un código
  asíncrono limpio y legible.
- **Completamente Tipado:** Escrito en TypeScript para un excelente
  autocompletado en el editor y seguridad de tipos.
- **Cobertura Completa de la API:** Proporciona acceso a todos los
  principales puntos de la API de QvaPay.
- **Manejo de Errores Simplificado:** Facilita el manejo de errores
  con tipos de error personalizados.
- **Ligero:** Mínimas dependencias para una huella pequeña en tu proyecto.

## Instalación

Puedes instalar el SDK usando `pnpm`, `npm`, o `yarn`.

```bash
# pnpm
pnpm add qvapay-sdk

# npm
npm install qvapay-sdk

# yarn
yarn add qvapay-sdk
```

## Flujo de Trabajo y Uso Básico

El flujo de trabajo principal consiste en crear una instancia del cliente,
autenticarse y luego usar esa misma instancia para realizar llamadas a
los puntos protegidos de la API.

### 1. Crear una instancia del cliente

Primero, importa y crea una instancia de `QvaPayClient`.

```typescript
import { QvaPayClient } from 'qvapay-sdk'

const qvapay = new QvaPayClient()
```

### 2. Iniciar Sesión

Usa el método `login` del módulo `auth`. Si las credenciales son correctas,
el SDK almacenará automáticamente el token de acceso en la instancia del
cliente, dejándola lista para realizar solicitudes autenticadas.

```typescript
try {
  const { access_token, me } = await qvapay.auth.login({
    email: 'tu-email@example.com',
    password: 'tu-contraseña',
  })

  console.log('¡Inicio de sesión exitoso!')
  console.log('Usuario:', me.name)

  // La instancia `qvapay` ahora está autenticada.
} catch (error) {
  console.error('El inicio de sesión falló:', error)
}
```

### 3. Realizar Solicitudes Autenticadas

Una vez que la instancia está autenticada, puedes usarla para acceder a otros
módulos, como `user`.

```typescript
try {
  // Usando la misma instancia `qvapay` que ya fue autenticada
  const userInfo = await qvapay.user.getInfo()
  console.log('Información del usuario:', userInfo)
} catch (error) {
  console.error('No se pudo obtener la información del usuario:', error)
}
```

### Sesiones Persistentes

Si guardas un `authToken` de una sesión anterior, puedes crear una nueva
instancia del cliente directamente con ese token para evitar tener que
iniciar sesión de nuevo.

```typescript
const storedToken = 'un-token-guardado-previamente'
const clienteAutenticado = new QvaPayClient({ authToken: storedToken })

// Este cliente está listo para hacer llamadas autenticadas
const userInfo = await clienteAutenticado.user.getInfo()
```

## Manejo de Errores

El SDK lanza errores personalizados para facilitar su manejo. Todas las
llamadas a la API deben estar envueltas en un bloque `try...catch`.

El error principal es `QvaPayError`, que contiene el mensaje, el código
de estado y los datos de la respuesta de la API.

```typescript
import { QvaPayClient, QvaPayError, TwoFactorRequiredError } from 'qvapay-sdk'

const qvapay = new QvaPayClient()

try {
  await qvapay.auth.login({ email: 'incorrecto', password: 'user' })
} catch (error) {
  if (error instanceof QvaPayError) {
    // Error de la API (ej: credenciales incorrectas, validación fallida)
    console.error('Error de la API:', error.message)
    console.error('Status:', error.statusCode)
    console.error('Datos:', error.data)
  } else if (error instanceof TwoFactorRequiredError) {
    // Caso especial: se requiere autenticación de dos factores
    console.error('Se requiere 2FA:', error.message)
  } else {
    // Otro tipo de error (ej: problema de red)
    console.error('Ocurrió un error inesperado:', error)
  }
}
```

## Gestión del Cliente y Depuración

Puedes interactuar con la instancia del cliente para gestionar el token de
autenticación o para obtener más información sobre las solicitudes que se
están realizando.

### `setAuthToken(token)`

Establece manualmente el token de autenticación en la instancia del cliente.
Esto es útil si obtienes el token por otros medios o quieres cambiar de
sesión sin crear una nueva instancia.

- **Parámetros:**
  - `token` (string): El `access_token` a utilizar.

```typescript
const miToken = '...'
qvapay.setAuthToken(miToken)
// La instancia `qvapay` ahora usará este token.
```

### `clearAuthToken()`

Elimina el token de autenticación de la instancia del cliente. Después de
llamar a este método, la instancia volverá a estar no autenticada.

```typescript
qvapay.clearAuthToken()
// La instancia `qvapay` ya no está autenticada.
```

### Modo de Depuración (`debug`)

Si necesitas inspeccionar las solicitudes y respuestas que el SDK realiza a
la API de QvaPay, puedes activar el modo de depuración al crear la instancia
del cliente. Esto imprimirá información detallada en la consola.

```typescript
const qvapayDebug = new QvaPayClient({ debug: true })

// Ahora, cada llamada a la API con `qvapayDebug` mostrará logs.
await qvapayDebug.auth.login({ email, password })
```

## Módulo de Autenticación (`qvapay.auth`)

Este módulo agrupa todos los métodos relacionados con la gestión de la
sesión del usuario.

### `login(credenciales)`

Inicia sesión en la plataforma. Si tiene éxito, la instancia del cliente
queda autenticada para futuras solicitudes.

- **Parámetros:**
  - `credenciales` (objeto):
    - `email` (string): Correo del usuario.
    - `password` (string): Contraseña del usuario.
- **Retorna:** Una promesa que se resuelve con un objeto que contiene
  `access_token` y la información del usuario (`me`).
- **Lanza:** `QvaPayError` si las credenciales son incorrectas.
  `TwoFactorRequiredError` si la cuenta tiene 2FA activado.

```typescript
const { access_token, me } = await qvapay.auth.login({
  email: 'tu-email@example.com',
  password: 'tu-contraseña',
})
```

### `register(datos)`

Registra un nuevo usuario en la plataforma.

- **Parámetros:**
  - `datos` (objeto):
    - `name` (string): Nombre del usuario.
    - `email` (string): Correo del usuario.
    - `password` (string): Contraseña.
    - `c_password` (string): Confirmación de la contraseña.
    - `lastname` (string, opcional): Apellidos del usuario.
    - `invite` (string, opcional): Código de invitación.
- **Retorna:** Una promesa que se resuelve con un objeto con un mensaje de
  éxito y un `access_token`.

```typescript
const { message, access_token } = await qvapay.auth.register({
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'una-contraseña-segura',
  c_password: 'una-contraseña-segura',
})
```

### `logout()`

Cierra la sesión del usuario y elimina el token de autenticación de la
instancia del cliente. Requiere una instancia previamente autenticada.

- **Retorna:** Una promesa que se resuelve con un objeto con un mensaje de éxito.

```typescript
// Asumiendo que `qvapay` es una instancia autenticada
const { message } = await qvapay.auth.logout()
// message: "Successfully logged out"
```

### `check()`

Verifica si el token de autenticación actual en la instancia del cliente es válido.

- **Retorna:** Una promesa que se resuelve si el token es válido.
- **Lanza:** `QvaPayError` si el token es inválido o ha expirado.

```typescript
try {
  // Asumiendo que `clienteAutenticado` es una instancia con un token
  await clienteAutenticado.auth.check()
  console.log('El token es válido.')
} catch (error) {
  console.error('El token no es válido o ha expirado.')
}
```

### `twoFactorCheck(codigo)`

Completa el proceso de inicio de sesión para cuentas con autenticación de dos
factores (2FA) activada.

- **Parámetros:**
  - `codigo` (string): El código 2FA de 6 dígitos.
- **Retorna:** Una promesa que se resuelve con los datos de la sesión si el
  código es correcto.

```typescript
// Este método se usa después de que `login()` lanza un `TwoFactorRequiredError`
try {
  const { access_token, me } = await qvapay.auth.twoFactorCheck('123456')
  console.log('¡Login con 2FA exitoso!')
} catch (error) {
  console.error('El código 2FA es incorrecto.')
}
```

## Módulo de Aplicaciones (`qvapay.app`)

Este módulo permite gestionar las aplicaciones asociadas a la cuenta del usuario
autenticado. Todos los métodos en este módulo requieren una instancia del cliente
que ya haya iniciado sesión.

### `getAll()`

Obtiene una lista de todas las aplicaciones que pertenecen al usuario autenticado.

- **Retorna:** Una promesa que se resuelve con un objeto que contien
  e un arreglo de aplicaciones (`apps`).

```typescript
// Asumiendo que `qvapay` es una instancia autenticada
const { apps } = await qvapay.app.getAll()
console.log(`Se encontraron ${apps.length} aplicaciones.`)
```

### `get(uuid)`

Obtiene la información detallada de una aplicación específica.

- **Parámetros:**
  - `uuid` (string): El identificador único (UUID) de la aplicación.
- **Retorna:** Una promesa que se resuelve con el objeto completo de la aplicación.

```typescript
const appUuid = '...' // UUID de la aplicación
const appDetalles = await qvapay.app.get(appUuid)
console.log('Detalles de la app:', appDetalles.name)
```

### `create(datos)`

Crea una nueva aplicación.

- **Parámetros:**
  - `datos` (objeto):
    - `name` (string): Nombre de la aplicación.
    - `url` (string): URL del sitio web o aplicación.
    - `logo` (string): URL de un logo para la aplicación.
    - `callback` (string): URL de webhook para recibir notificaciones.
    - `success_url` (string): URL a la que redirigir al usuario tras un pago exitoso.
    - `cancel_url` (string): URL a la que redirigir al usuario si cancela un pago.
- **Retorna:** Una promesa que se resuelve con un objeto que contiene
  el `uuid` y el `secret` de la nueva aplicación. **Guarda el `secret` de
  forma segura, no se podrá recuperar después.**

```typescript
const { app } = await qvapay.app.create({
  name: 'Mi Nueva App',
  url: 'https://mi-app.com',
  logo: 'https://mi-app.com/logo.png',
  callback: 'https://mi-app.com/api/qvapay-webhook',
  success_url: 'https://mi-app.com/pago-exitoso',
  cancel_url: 'https://mi-app.com/pago-cancelado',
})
console.log(`App creada: ${app.name}`)
console.log(`UUID: ${app.uuid}`)
console.log(`Secret: ${app.secret}`) // ¡Guardar este valor!
```

### `delete(uuid)`

Elimina una aplicación. Esta acción es irreversible.

- **Parámetros:**
  - `uuid` (string): El UUID de la aplicación a eliminar.
- **Retorna:** Una promesa que se resuelve con el objeto de la aplicación que
  fue eliminada.

```typescript
const appUuidAEliminar = '...'
const appEliminada = await qvapay.app.delete(appUuidAEliminar)
console.log(`Se ha eliminado la aplicación: ${appEliminada.name}`)
```

## Módulo de Monedas (`qvapay.coins`)

Este módulo proporciona acceso a la información sobre las criptomonedas y
métodos de pago soportados en QvaPay. Requiere una instancia del cliente autenticada.

### `getAll()`

Obtiene una lista de todas las monedas y sus categorías.

- **Retorna:** Una promesa que se resuelve con un objeto que contiene las
  categorías y un arreglo de monedas (`coins`).

```typescript
// Asumiendo que `qvapay` es una instancia autenticada
const categorias = await qvapay.coins.getAll()
console.log('Monedas disponibles:', categorias.coins.length)
```

### `getV2(filtros)`

Obtiene una lista de monedas (versión 2 de la API) con la capacidad de aplicar filtros.

- **Parámetros:**
  - `filtros` (objeto, opcional):
    - `enabled_in` (boolean): Filtrar por monedas habilitadas para depósitos.
    - `enabled_out` (boolean): Filtrar por monedas habilitadas para retiros.
    - `enabled_p2p` (boolean): Filtrar por monedas habilitadas para P2P.
- **Retorna:** Una promesa que se resuelve con un arreglo de objetos de moneda.

```typescript
// Asumiendo que `qvapay` es una instancia autenticada
// Obtener todas las monedas habilitadas para depósitos
const monedasParaDepositar = await qvapay.coins.getV2({ enabled_in: true })
console.log(
  'Monedas para depositar:',
  monedasParaDepositar.map((c) => c.name),
)
```

### `getById(id)`

Obtiene la información detallada de una moneda específica por su ID numérico.

- **Parámetros:**
  - `id` (number): El ID de la moneda.
- **Retorna:** Una promesa que se resuelve con el objeto completo de la moneda.

```typescript
// Asumiendo que `qvapay` es una instancia autenticada
const idMoneda = 1 // ID de la moneda
const detallesMoneda = await qvapay.coins.getById(idMoneda)
console.log('Detalles de la moneda:', detallesMoneda.name)
```

## Módulo de Merchants (`qvapay.merchants`)

Este módulo contiene todos los métodos para interactuar con la API de
Merchants de QvaPay. A diferencia de otros módulos, los métodos
aquí no usan el token de sesión del usuario, sino que se autentican
en cada llamada usando las credenciales de una aplicación (`app_id` y `app_secret`).

Estas credenciales se obtienen al crear una aplicación con el [módulo de aplicaciones](#módulo-de-aplicaciones-qvapayapp).

```typescript
const credencialesApp = {
  app_id: 'TU_APP_ID',
  app_secret: 'TU_APP_SECRET',
}
```

### `appInfo(credenciales)`

Obtiene la información pública de tu aplicación.

- **Parámetros:** `credenciales` (objeto) con `app_id` y `app_secret`.
- **Retorna:** Una promesa que se resuelve con la información de la aplicación.

```typescript
const info = await qvapay.merchants.appInfo(credencialesApp)
console.log('Información de la App:', info)
```

### `checkBalance(credenciales)`

Consulta el saldo de la cuenta QvaPay propietaria de la aplicación.

- **Parámetros:** `credenciales` (objeto) con `app_id` y `app_secret`.
- **Retorna:** Una promesa que se resuelve con el saldo como un `string`.

```typescript
const balance = await qvapay.merchants.checkBalance(credencialesApp)
console.log('Saldo de la cuenta:', balance)
```

### `createInvoice(datos)`

Crea una factura de pago.

- **Parámetros:** `datos` (objeto), que debe incluir:
  - `app_id` (string)
  - `app_secret` (string)
  - `amount` (number): Monto de la factura.
  - `description` (string): Descripción de la factura.
  - `remote_id` (string, opcional): Un ID externo para tu referencia.
  - `signed` (boolean, opcional): Para URLs firmadas.
- **Retorna:** Una promesa que se resuelve con los detalles de la factura
  creada, incluyendo la URL de pago.

```typescript
const factura = await qvapay.merchants.createInvoice({
  ...credencialesApp,
  amount: 9.99,
  description: 'Factura de prueba',
  remote_id: 'mi-id-externo-123',
})
console.log('URL de pago:', factura.signed_url)
```

### `getAppTransactions(credenciales)`

Obtiene una lista de todas las transacciones asociadas a tu aplicación.

- **Parámetros:** `credenciales` (objeto) con `app_id` y `app_secret`.
- **Retorna:** Una promesa que se resuelve con un objeto que contiene un
  arreglo de transacciones.

```typescript
const { data: transacciones } =
  await qvapay.merchants.getAppTransactions(credencialesApp)
console.log(`Se encontraron ${transacciones.length} transacciones.`)
```

### `getTransactionStatus(transactionId, credenciales)`

Verifica el estado de una transacción específica.

- **Parámetros:**
  - `transactionId` (string): El UUID de la transacción.
  - `credenciales` (objeto) con `app_id` y `app_secret`.
- **Retorna:** Una promesa que se resuelve con el estado y los detalles de la transacción.

```typescript
const idTransaccion = '...' // UUID de la transacción
const estado = await qvapay.merchants.getTransactionStatus(
  idTransaccion,
  credencialesApp,
)
console.log('Estado de la transacción:', estado.status)
```

## Módulo P2P (`qvapay.p2p`)

Este módulo permite interactuar con el mercado P2P de QvaPay. Todos los
métodos requieren una instancia del cliente autenticada.

### `getOffers(filtros)`

Obtiene una lista de ofertas P2P públicas, con la posibilidad de aplicar filtros.

- **Parámetros:**
  - `filtros` (objeto, opcional):
    - `type` ('buy' | 'sell'): Filtrar por tipo de oferta.
    - `coin` (string): Filtrar por el `tick` de la moneda (ej: 'USDT').
    - `min` (number): Monto mínimo.
    - `max` (number): Monto máximo.
- **Retorna:** Una promesa que se resuelve con un objeto paginado que contiene
  un arreglo de ofertas (`data`).

```typescript
// Buscar ofertas de venta de USDT
const { data: ofertas } = await qvapay.p2p.getOffers({
  type: 'sell',
  coin: 'USDT',
})
console.log(`Hay ${ofertas.length} ofertas de venta de USDT.`)
```

### `getMyOffers(filtros)`

Obtiene una lista de las ofertas P2P creadas por el usuario autenticado.

- **Parámetros:** `filtros` (objeto, opcional), igual que en `getOffers`.
- **Retorna:** Una promesa que se resuelve con un objeto paginado de las
  ofertas del usuario.

```typescript
const { data: misOfertas } = await qvapay.p2p.getMyOffers({ type: 'buy' })
console.log(`Tengo ${misOfertas.length} ofertas de compra activas.`)
```

### `getOfferDetail(offerId)`

Obtiene los detalles completos de una oferta P2P específica.

- **Parámetros:**
  - `offerId` (string): El UUID de la oferta.
- **Retorna:** Una promesa que se resuelve con los detalles de la oferta,
  incluyendo información del propietario.

```typescript
const idOferta = '...' // UUID de la oferta
const detalles = await qvapay.p2p.getOfferDetail(idOferta)
console.log(
  `Oferta de ${detalles.owner.name} por ${detalles.amount} ${detalles.coin}`,
)
```

### `createOffer(datos)`

Crea una nueva oferta P2P.

- **Parámetros:**
  - `datos` (objeto):
    - `type` ('buy' | 'sell'): Tipo de oferta.
    - `coin` (string): `tick` de la moneda.
    - `amount` (number): Cantidad que ofreces.
    - `receive` (number): Cantidad que esperas recibir.
    - `details` (array de objetos, opcional): Detalles de pago.
- **Retorna:** Una promesa que se resuelve con los datos de la oferta creada.

```typescript
const nuevaOferta = await qvapay.p2p.createOffer({
  type: 'sell',
  coin: 'USDT',
  amount: 50,
  receive: 50,
})
console.log(`Oferta creada con UUID: ${nuevaOferta.p2p.uuid}`)
```

### `applyToOffer(offerId)`

Aplica a una oferta P2P existente para iniciar un intercambio.

- **Parámetros:**
  - `offerId` (string): El UUID de la oferta a la que se quiere aplicar.
- **Retorna:** Una promesa que se resuelve con la confirmación y los detalles
  de la oferta actualizada.

```typescript
const idOferta = '...' // UUID de una oferta de venta
const aplicacion = await qvapay.p2p.applyToOffer(idOferta)
console.log(aplicacion.msg)
```

### `cancelOffer(offerId)`

Cancela una oferta P2P que hayas creado.

- **Parámetros:**
  - `offerId` (string): El UUID de tu oferta a cancelar.
- **Retorna:** Una promesa que se resuelve cuando la oferta ha sido cancelada.

```typescript
const idMiOferta = '...' // UUID de una de mis ofertas
await qvapay.p2p.cancelOffer(idMiOferta)
console.log('Oferta cancelada.')
```

### `sendMessage(offerId, text)`

Envía un mensaje en el chat de una oferta en la que participas.

- **Parámetros:**
  - `offerId` (string): El UUID de la oferta.
  - `text` (string): El contenido del mensaje.
- **Retorna:** Una promesa que se resuelve con los detalles de la oferta actualizada.

```typescript
const idOferta = '...' // UUID de una oferta en curso
await qvapay.p2p.sendMessage(idOferta, 'Hola, ya te envié el comprobante.')
```

## Módulo de Usuario (`qvapay.user`)

Este módulo permite gestionar la información y las acciones relacionadas con
la cuenta del usuario autenticado.

### `getMe()`

Obtiene la información básica del perfil del usuario autenticado.

- **Retorna:** Una promesa que se resuelve con el objeto del usuario,
  incluyendo `uuid`, `username`, `name`, `balance`, etc.

```typescript
// Asumiendo que `qvapay` es una instancia autenticada
const miPerfil = await qvapay.user.getMe()
console.log(`Hola, ${miPerfil.name}. Tu saldo es ${miPerfil.balance}.`)
```

### `getMeExtended()`

Obtiene la información extendida del perfil del usuario, incluyendo estado de
KYC, ranking, etc.

- **Retorna:** Una promesa que se resuelve con el objeto extendido del usuario.

```typescript
const perfilExtendido = await qvapay.user.getMeExtended()
console.log(`Estado de KYC: ${perfilExtendido.kyc}`)
```

### `updateMe(datos)`

Actualiza los datos del perfil del usuario.

- **Parámetros:**
  - `datos` (objeto): Un objeto con los campos a actualizar (`name`, `lastname`
    , `bio`, `address`, `country`, `telegram`, `twitter`).
- **Retorna:** Una promesa que se resuelve con la información del usuario actualizada.

```typescript
const datosActualizados = await qvapay.user.updateMe({
  bio: 'Mi nueva biografía.',
  telegram: '@miUsuarioTelegram',
})
console.log('Biografía actualizada:', datosActualizados.bio)
```

### `topUpBalance(datos)`

Crea una orden de depósito para recargar el saldo.

- **Parámetros:**
  - `datos` (objeto):
    - `amount` (number): La cantidad a depositar.
    - `pay_method` (string): El `tick` de la moneda a usar para el pago (ej: 'USDT_TRC20').
- **Retorna:** Una promesa que se resuelve con los detalles de la transacción
  de depósito, incluyendo la `wallet` a la que se debe enviar el pago.

```typescript
const deposito = await qvapay.user.topUpBalance({
  amount: 10,
  pay_method: 'USDT_TRC20',
})
console.log(`Enviar ${deposito.value} a la wallet: ${deposito.wallet}`)
```

### `withdraw(datos)`

Crea una solicitud de retiro de fondos.

- **Parámetros:**
  - `datos` (objeto):
    - `amount` (number): La cantidad a retirar.
    - `pay_method` (string): El `tick` del método de retiro.
    - `details` (objeto): Un objeto con los detalles requeridos por el método
      de pago (ej: `{ wallet: '...' }`).
- **Retorna:** Una promesa que se resuelve con los detalles de la transacción
  de retiro.

```typescript
const retiro = await qvapay.user.withdraw({
  amount: 5,
  pay_method: 'USDT_TRC20',
  details: { wallet: 'MI_WALLET_USDT' },
})
console.log(`Retiro solicitado. ID de transacción: ${retiro.transaction_id}`)
```

### `search(termino)`

Busca usuarios en la plataforma.

- **Parámetros:**
  - `termino` (string): El nombre, apellido o username a buscar.
- **Retorna:** Una promesa que se resuelve con un arreglo de usuarios que
  coinciden con la búsqueda.

```typescript
const resultados = await qvapay.user.search('John')
console.log(`Resultados para "John":`, resultados)
```

## Módulo de Transacciones (`qvapay.transactions`)

Este módulo permite consultar el historial de transacciones y realizar
operaciones como transferencias. Requiere una instancia del cliente autenticada.

### `getLatest(filtros)`

Obtiene una lista de las transacciones más recientes del usuario autenticado.

- **Parámetros:**
  - `filtros` (objeto, opcional):
    - `status` ('paid' | 'pending' | 'cancelled'): Filtrar por estado.
    - `remote_id` (string): Filtrar por ID externo.
    - `start` (Date): Fecha de inicio.
    - `end` (Date): Fecha de fin.
- **Retorna:** Una promesa que se resuelve con un arreglo de transacciones.

```typescript
// Obtener las transacciones pagadas
const transaccionesPagadas = await qvapay.transactions.getLatest({
  status: 'paid',
})
console.log(`Tienes ${transaccionesPagadas.length} transacciones pagadas.`)
```

### `getDetails(uuid)`

Obtiene los detalles completos de una transacción específica.

- **Parámetros:**
  - `uuid` (string): El UUID de la transacción.
- **Retorna:** Una promesa que se resuelve con el objeto de la transacción.

```typescript
const idTransaccion = '...' // UUID de la transacción
const detalles = await qvapay.transactions.getDetails(idTransaccion)
console.log('Descripción de la transacción:', detalles.description)
```

### `getWithdraws()`

Obtiene el historial de retiros del usuario autenticado.

- **Retorna:** Una promesa que se resuelve con un objeto paginado que contiene
  un arreglo de retiros (`data`).

```typescript
const { data: retiros } = await qvapay.transactions.getWithdraws()
console.log(`Has realizado ${retiros.length} retiros.`)
```

### `transfer(datos)`

Transfiere saldo a otro usuario de QvaPay.

- **Parámetros:**
  - `datos` (objeto):
    - `to` (string): `uuid`, `email` o `teléfono` del destinatario.
    - `amount` (string): Monto a transferir.
    - `description` (string, opcional): Descripción de la transferencia.
    - `pin` (string, opcional): PIN de seguridad si está activado.
- **Retorna:** Una promesa que se resuelve con los detalles de la transacción
  de transferencia creada.

```typescript
const transferencia = await qvapay.transactions.transfer({
  to: 'uuid-del-destinatario',
  amount: '1.50',
  description: 'Para el café',
})
console.log('Transferencia realizada con éxito.')
```

### `pay(datos)`

Paga una transacción pendiente generada por un comercio.

- **Parámetros:**
  - `datos` (objeto):
    - `uuid` (string): El UUID de la transacción a pagar.
    - `pin` (string): Tu PIN de seguridad.
- **Retorna:** Una promesa que se resuelve con los detalles de la transacción pagada.

```typescript
const pago = await qvapay.transactions.pay({
  uuid: 'uuid-de-la-factura',
  pin: '1234', // Tu PIN
})
console.log(`Pagada la factura: ${pago.description}`)
```

## Módulo de Enlaces de Pago (`qvapay.paymentLink`)

Permite gestionar enlaces de pago para recibir cobros de forma sencilla.
Requiere una instancia del cliente autenticada.

### `getAll()`

Obtiene todos los enlaces de pago creados por el usuario.

- **Retorna:** Una promesa que se resuelve con un arreglo de objetos de enlace
  de pago.

```typescript
const misEnlaces = await qvapay.paymentLink.getAll()
console.log(`Tengo ${misEnlaces.length} enlaces de pago.`)
```

### `create(datos)`

Crea un nuevo enlace de pago.

- **Parámetros:**
  - `datos` (objeto):
    - `amount` (number): Monto a cobrar.
    - `description` (string): Descripción del pago.
- **Retorna:** Una promesa que se resuelve con el objeto del enlace de pago creado.

```typescript
const nuevoEnlace = await qvapay.paymentLink.create({
  amount: 25,
  description: 'Pago por servicios de diseño',
})
console.log('URL del enlace de pago:', nuevoEnlace.url)
```

## Módulo de Tienda (`qvapay.store`)

Permite interactuar con la tienda de productos y servicios de QvaPay. Requiere
una instancia del cliente autenticada.

### `getAll()`

Obtiene una lista de todos los productos disponibles en la tienda.

- **Retorna:** Una promesa que se resuelve con un objeto que contiene
  un arreglo de productos.

```typescript
const { data: productos } = await qvapay.store.getAll()
console.log(`Hay ${productos.length} productos en la tienda.`)
```

### `get(uuid)`

Obtiene los detalles de un producto específico de la tienda.

- **Parámetros:**
  - `uuid` (string): El UUID del producto.
- **Retorna:** Una promesa que se resuelve con los detalles del producto.

```typescript
const idProducto = '...' // UUID del producto
const producto = await qvapay.store.get(idProducto)
console.log('Producto:', producto.name)
```

### `getMyPurchases()`

Obtiene el historial de productos comprados por el usuario.

- **Retorna:** Una promesa que se resuelve con un objeto que contiene
  un arreglo de las compras del usuario.

```typescript
const { data: misCompras } = await qvapay.store.getMyPurchases()
console.log(`He comprado ${misCompras.length} productos.`)
```

### `buyProduct(datos)`

Compra un producto de la tienda.

- **Parámetros:**
  - `datos` (objeto):
    - `id` (number): El ID del producto a comprar.
    - `c` (number): La cantidad a comprar.
- **Retorna:** Una promesa que se resuelve con la confirmación de la compra.

```typescript
const idProducto = 123 // ID del producto
const confirmacion = await qvapay.store.buyProduct({ id: idProducto, c: 1 })
console.log('Compra realizada:', confirmacion)
```

---

## Contribuciones

¡Las contribuciones son bienvenidas! Si tienes alguna solicitud de característica
, reporte de error o quieres mejorar el código, por favor abre un _issue_
o envía un _pull request_.

## Licencia

Este SDK es de código abierto y está bajo la [Licencia MIT](https://github.com/qvacode/client-node/blob/main/LICENSE).
