const { insertUser, insertToken, selectUser, updateToken, selectServicios, selectDeudaServicio, pagarDeuda, selectUserData, 
    selectPagos, selectToken, insertDeudas } = require('../model/model');
const jwt = require('jsonwebtoken');
const credenciales = require('../config');



// Imprementacion de los controladores

const registerUser = async (req, res) => {
    try {
        const { nombre, email, numero_documento, saldo_disponible } = req.body;

        await insertUser({numero_documento, email, nombre, saldo_disponible});

        await insertToken(numero_documento);

        await insertDeudas(numero_documento);

        res.json({message: "Usuario registrado correctamente"})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const loginUser = async (req, res) => {
    const { numero_documento, email } = req.body;

    try {
        const result = await selectUser(numero_documento);

        if(result.rows.length == 0){
            return res.status(404).json({message: "El usuario no existe"});
        }

        const usuario = result.rows[0];

        if(email != usuario.email){
            return res.status(401).json({message: "Email incorrecto"});
        }

        const token = jwt.sign({numero_documento: numero_documento}, credenciales.jwt_secret);

        await updateToken({token, numero_documento})

        res.json({mensaje: 'Usuario logeado', token})
        
    } catch (error) {
        res.json({message: error.message})
    }
}

const logoutUser = async(req, res) => {

    const token = req.headers['x-access-token'];

    const tokenDecoded = jwt.verify(token, credenciales.jwt_secret);

    try {
        await updateToken({token:null, numero_documento:tokenDecoded.numero_documento});

        res.status(200).json({message: "Usuario desconectado del servidor"});

    } catch (error) {
        res.status(404).json({message: error.message})
    }

}


const servicios = async(req, res) => {
    try {
        const result = await selectServicios();
        res.status(200).json({Servicios: result.rows});
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


const servicio = async(req, res) => {
    try {
        const servicio = req.params.servicio;
        const result = await selectServicios(servicio);
        if(result.rows.length == 0){
            return res.status(404).json({message: 'Datos no encontrados'});
        }
        res.status(200).json({Servicios: result.rows});
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


const pagar = async(req, res) => {

    const { tipo_servicio, monto_abonado } = req.body;

    if (tipo_servicio == undefined || monto_abonado == undefined){
        return res.status(400).json({message: "Cabecera con datos insuficientes"});
    }

    try {

        const result = await selectDeudaServicio({numero_documento: req.usuario, tipo_servicio});
        if(result.rows.length == 0){
            return res.status(400).
            json({message: 'El usuario no tiene deudas con el servicio solicitado'})
        }else{
            const saldo_disponible = result.rows[0].saldo_disponible;
            const deuda_total = result.rows[0].deuda_total;
            

            if(saldo_disponible == 0){
                return res.status(400).json({message: "Saldo insuficiente"});
                
            }else if(saldo_disponible < monto_abonado){
                return res.status(400).json({message: "El monto a abonar supera al saldo disponible"});

            }else if(deuda_total < monto_abonado){
                return res.status(400).json({message: "El monto a abonar supera a la deuda total"});
            }else{

                const result = await pagarDeuda({deuda_total, monto_abonado, documento_usuario: req.usuario, tipo_servicio, saldo_disponible})

                result.rows[0].fecha = new Date().toLocaleString();
                
                res.status(201).json({Factura: result.rows});

            }
        }
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


const dashboard = async (req, res) => {

    try {
        const usuario = await selectUserData(req.usuario);

        res.status(200).json({usuario})

    } catch (error) {
        res.status(404).json({message: error.message})
    }

}


const pagos = async (req, res) => {

    const { tipo_servicio } = req.params;

    try {

        const result = await selectPagos(req.usuario, tipo_servicio);

        if (result.rows.length == 0){
            return res.status(404).json({message: "Datos no encontrados"})
        }
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


const verifyToken = async(req, res, next) => {
    const token = req.headers['x-access-token'];

    if(!token){
        return res.status(401).json({message: "Token no proveido"});
    }
    
    
    jwt.verify(token, credenciales.jwt_secret, async(err, decoded) => {
        if(err){
            res.status(401).json({message: 'Token invalido'})
        }else{
            const result = await selectToken({numero_documento: decoded.numero_documento, token})
            const userToken = result.rows;
        
            if(userToken.length == 0){
                return res.status(401).json({message: "Autorizacion denegada"})
            }else{
                req.usuario = decoded.numero_documento;
                next();
            }
        }
    })


}



module.exports = {
    registerUser,
    loginUser,
    verifyToken,
    servicios,
    servicio,
    logoutUser,
    pagar,
    pagos,
    dashboard
}