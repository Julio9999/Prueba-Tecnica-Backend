const { Router } = require('express');
const { registerUser, loginUser, servicios, servicio, verifyToken, logoutUser, pagar, pagos, dashboard } = require('../controllers/controllers');

const router = Router();

//Definicion de las rutas


/**
 * @swagger
 * components:
 *  schemas:
 *    Usuario:
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: nombre del usuario
 *        email:
 *          type: string
 *          description: email del usuario
 *        numero_documento:
 *          type: integer
 *          description: numero de documento del usuario
 *      required:
 *        - nombre
 *        - email
 *        - numero_documento
 *      example:
 *        nombre: Jorge Gonzales
 *        email: jorge@gmail.com
 *        numero_documento: 4654329
 */


/**
 * @swagger
 *  /api/register:
 *    post:
 *      summary: Registro de un nuevo usuario
 *      tags: [Usuario]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Usuario'
 *      responses:
 *        200:
 *          description: Usuario registrado correctamente
 *        400:
 *          description: No debe haber campos vacios
 */
router.post('/api/register', registerUser);

/**
 * @swagger
 *  /api/login:
 *    post:
 *      summary: Inicio de sesion del usuario
 *      tags: [Usuario]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                numero_documento:
 *                  type: integer
 *                  description: Numero de documento del usuario
 *                email:
 *                  type: string
 *                  description: Email del usuario
 *              required:
 *                - numero_documento
 *                - email
 *              example:
 *                numero_documento: 4654329
 *                email: jorge@gmail.com
 *      responses:
 *        200:
 *          description: Usuario loggeado correctamente
 *        404:
 *          description: Usuario no existe
 *        401:
 *          description: Email incorrecto
 */
router.post('/api/login', loginUser);

/**
 * @swagger
 *  /api/dashboard:
 *    get:
 *      summary: Obtener datos del usuario
 *      tags: [Usuario]
 *      parameters:
 *          -   in: header
 *              name: x-access-token
 *              description: Token de acceso obtenido al iniciar sesion
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *        200:
 *          description: Los datos del usuario
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  nombre:
 *                    type: string
 *                    description: nombre del usuario
 *                  email:
 *                    type: string
 *                    description: email del usuario
 *                  numero_documento:
 *                    type: integer
 *                    description: numero de documento del usuario
 *                  saldo_disponible:
 *                    type: integer
 *                    description: saldo disponible
 *                  deudas:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                          description: id del servicio
 *                        nombre_servicio:
 *                          type: string
 *                          description: nombre del servicio
 *                        deuda_total:
 *                          type: integer
 *                          description: deuda total
 *                example:
 *                  nombre: Jorge Gonzales
 *                  email: jorge@gmail.com
 *                  numero_documento: 4654329
 *                  saldo_disponible: 500000
 *                  deudas:
 *                    id: 1
 *                    nombre_servicio: Ande
 *                    deuda_total: 500000
 */
router.get('/api/dashboard', verifyToken, dashboard);


/**
 * @swagger
 * /api/servicios:
 *    get:
 *      summary: Todos los servicios
 *      tags: [Servicios]
 *      parameters:
 *          -   in: header
 *              name: x-access-token
 *              description: Token de acceso obtenido al iniciar sesion
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *        200:
 *          description: servicios disponibles
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                properties:
 *                  nombre_servicio:
 *                    type: string
 *                    description: nombre del servicio
 *                  id:
 *                    type: integer
 *                    description: id del servicio
 *                example:
 *                  nombre_servicio: Essap
 *                  id: 1
 */
router.get('/api/servicios', verifyToken, servicios);



/**
 * @swagger
 * /api/servicios/{id}:
 *    get:
 *      summary: Servicio especificado
 *      tags: [Servicios]
 *      parameters:
 *        - in: path
 *          name: nombre_servicio
 *          schema:
 *            type: string
 *          description: El nombre o inicial de un servicio
 *        -   in: header
 *            name: x-access-token
 *            description: Token de acceso obtenido al iniciar sesion
 *            required: true
 *            schema:
 *                  type: string
 *      responses:
 *        200:
 *          description: servicios disponibles
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                properties:
 *                  nombre_servicio:
 *                    type: string
 *                    description: nombre del servicio
 *                  id:
 *                    type: integer
 *                    description: id del servicio
 *                example:
 *                  nombre_servicio: Essap
 *                  id: 1
 */
router.get('/api/servicios/:servicio', verifyToken, servicio);


/**
 * @swagger
 *  /api/pagar:
 *    post:
 *      summary: Pago de deudas
 *      tags: [Pagos]
 *      parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso obtenido al iniciar sesion
 *         schema:
 *          type: string
 *         required: true
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                monto_abonado:
 *                  type: integer
 *                  description: Cantidad a pagar
 *                tipo_servicio:
 *                  type: integer
 *                  description: El id del servicio a pagar
 *              required:
 *                - monto_abonado
 *                - tipo_servicio
 *              example:
 *                monto_abonado: 5000000
 *                tipo_servicio: 1
 *      responses:
 *        200:
 *          description: factura
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  num_factura:
 *                    type: integer
 *                    description: numero de factura
 *                  documento_usuario:
 *                    type: integer
 *                    description: numero de documento del usuario
 *                  nombre_servicio:
 *                    type: string
 *                    description: nombre del servicio
 *                  fecha:
 *                    type: string
 *                    description: fecha de la factura
 *                  monto_abonado:
 *                    type: integer
 *                    description: monto abonado
 *                example:
 *                  num_factura: 21343
 *                  documento_usuario: 234234
 *                  nombre_servicio: Essap
 *                  id: 1
 *                  fecha: 22/08/2022
 *                  monto_abonado: 500000
 *        400:
 *          description: Cabecera con datos insuficientes, El usuario no tiene deudas con el servicio solicitado, Saldo insuficiente, El monto a abonar supera al saldo disponible, El monto a abonar supera a la deuda total
 */
router.post('/api/pagar', verifyToken, pagar);


/**
 * @swagger
 * /api/pagos:
 *    get:
 *      summary: Historial de pagos
 *      tags: [Pagos]
 *      parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso obtenido al iniciar sesion
 *         schema:
 *          type: string
 *         required: true
 *      responses:
 *        200:
 *          description: historial de todos los pagos realizados
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  num_factura:
 *                    type: integer
 *                    description: numero de factura
 *                  documento_usuario:
 *                    type: integer
 *                    description: numero de documento del usuario
 *                  nombre_servicio:
 *                    type: string
 *                    description: nombre del servicio
 *                  fecha:
 *                    type: string
 *                    description: fecha de la factura
 *                  monto_abonado:
 *                    type: integer
 *                    description: monto abonado
 *                example:
 *                  num_factura: 21343
 *                  documento_usuario: 234234
 *                  nombre_servicio: Essap
 *                  id: 1
 *                  fecha: 22/08/2022
 *                  monto_abonado: 500000
 */
router.get('/api/pagos', verifyToken, pagos);

/**
 * @swagger
 * /api/pagos/{id}:
 *    get:
 *      summary: Pagos correspondientes al id del servicio
 *      tags: [Pagos]
 *      parameters:
 *        - in: path
 *          name: id_servicio
 *          schema:
 *            type: integer
 *          description: El id del servicio
 *        - in: header
 *          name: x-access-token
 *          description: Token de acceso obtenido al iniciar sesion
 *          schema:
 *           type: string
 *          required: true
 *      responses:
 *        200:
 *         200:
 *          description: historial de todos los pagos realizados
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  num_factura:
 *                    type: integer
 *                    description: numero de factura
 *                  documento_usuario:
 *                    type: integer
 *                    description: numero de documento del usuario
 *                  nombre_servicio:
 *                    type: string
 *                    description: nombre del servicio
 *                  fecha:
 *                    type: string
 *                    description: fecha de la factura
 *                  monto_abonado:
 *                    type: integer
 *                    description: monto abonado
 *                example:
 *                  num_factura: 21343
 *                  documento_usuario: 234234
 *                  nombre_servicio: Essap
 *                  id: 1
 *                  fecha: 22/08/2022
 *                  monto_abonado: 500000
 */
router.get('/api/pagos/:tipo_servicio', verifyToken, pagos);


/**
 * @swagger
 *  /api/logout:
 *    patch:
 *      summary: cerrar sesion
 *      tags: [Usuario]
 *      parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso obtenido al iniciar sesion
 *         schema:
 *          type: string
 *         required: true
 *      responses:
 *        200:
 *          descripcion: usuario desconectado del servidor
 */
router.patch('/api/logout', verifyToken, logoutUser);




module.exports = router;