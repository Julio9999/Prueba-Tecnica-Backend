const pool = require('../database/db');


// Definicion de los modelos

const insertUser = async({nombre, email, numero_documento, saldo_disponible = 2500000}) => {

    await pool.query("insert into usuarios (nombre, email, numero_documento, saldo_disponible) values($1,$2,$3,$4)",
    [nombre, email, numero_documento, saldo_disponible]);
}

const selectUser = async(numero_documento) => {
    return await pool.query('select * from usuarios where numero_documento = $1', [numero_documento]);
}

const selectUserData = async (documento_usuario) => {
    const result = await pool.query("select * from usuarios where numero_documento = $1", [documento_usuario]);

    const usuario = result.rows[0];

    query = "select se.id, se.nombre_servicio, de.deuda_total from deudas de join servicios se on de.id_servicio = se.id where de.documento_usuario = $1"

    const { rows } =  await pool.query(query, [documento_usuario]);
    usuario.deudas = rows;
    return usuario;
}



const insertToken = async(numero_documento) => {

    await pool.query("insert into tokens (id_usuario) values($1)",[numero_documento]);
}


const updateToken = async({token, numero_documento }) => {
    await pool.query("update tokens set token = $1 where id_usuario = $2", [token, numero_documento]);
}

const selectToken = async({token, numero_documento}) => {
    return await pool.query("select token from tokens where id_usuario = $1 and token = $2", [numero_documento, token]);
}



const selectServicios = async(nombre = '') => {
    if(nombre !== ''){
        return await pool.query('select * from servicios where nombre_servicio ilike $1', [`${nombre}%`]);
    }else{
        return await pool.query('select * from servicios');
    }
}

const selectDeudaServicio = async({ numero_documento, tipo_servicio }) => {
    const query = "select de.deuda_total, us.saldo_disponible from deudas de join usuarios us on de.documento_usuario = us.numero_documento where de.documento_usuario = $1 and de.id_servicio = $2";
    return await pool.query(query, [numero_documento, tipo_servicio]);
}


const insertDeudas = async(documento_usuario) => {
    await pool.query("insert into deudas (id_servicio, documento_usuario, deuda_total) values($1,$2,$3)", [1,documento_usuario, 500000]);
    await pool.query("insert into deudas (id_servicio, documento_usuario, deuda_total) values($1,$2,$3)", [2,documento_usuario, 500000]);
    await pool.query("insert into deudas (id_servicio, documento_usuario, deuda_total) values($1,$2,$3)", [3,documento_usuario, 500000]);
    await pool.query("insert into deudas (id_servicio, documento_usuario, deuda_total) values($1,$2,$3)", [4,documento_usuario, 500000]);
    await pool.query("insert into deudas (id_servicio, documento_usuario, deuda_total) values($1,$2,$3)", [5,documento_usuario, 500000]);
}


const pagarDeuda = async({ deuda_total, monto_abonado, documento_usuario, tipo_servicio, saldo_disponible }) => {
    await pool.query("update deudas set deuda_total = $1 where id_servicio = $2 and documento_usuario = $3", [deuda_total-monto_abonado, tipo_servicio, documento_usuario]);

    if (deuda_total-monto_abonado == 0){
        await pool.query("delete from deudas where documento_usuario = $1 and id_servicio = $2", [documento_usuario, tipo_servicio]);
    }

    await pool.query("update usuarios set saldo_disponible = $1 where numero_documento = $2",
    [saldo_disponible-monto_abonado, documento_usuario]);


    return await pool.query("insert into facturas (documento_usuario, id_servicio, fecha, monto_abonado)"+
    "values($1,$2,$3,$4) returning *", [documento_usuario, tipo_servicio,
    new Date().toLocaleDateString(), monto_abonado]);
}


const selectPagos = async (documento_usuario, tipo_servicio = '') => {
    let query = "select num_factura, documento_usuario, se.id, se.nombre_servicio,to_char(fecha, 'DD/MM/YYYY HH24:MI') as fecha, monto_abonado from facturas fa join servicios se on fa.id_servicio = se.id where documento_usuario = $1";
    if (!tipo_servicio){
        return await pool.query(query + " order by fecha desc " , [documento_usuario]);
    }else{
        return await pool.query(query + " and id_servicio = $2 order by fecha desc ", [documento_usuario, tipo_servicio]);
    }
}


module.exports = { insertUser, insertToken, updateToken, selectUser, selectServicios, selectDeudaServicio, pagarDeuda, selectUserData, selectPagos, selectToken, insertDeudas };