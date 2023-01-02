create database pagoDeServicios;


create table usuarios(
	numero_documento int primary key,
    email varchar not null,
    nombre varchar not null,
    saldo_disponible int not null,
	constraint unique_email unique (email)
);

create table tokens(
    token varchar null,
    id_usuario int not null,
    id primary key serial,
    constraint fk_usuario_token foreign key (id_usuario) references usuarios(numero_documento);
)

create table servicios(
    id serial primary key,
    nombre_servicio varchar not null
);

create table deudas(
    id_servicio int not null,
    documento_usuario int not null,
    deuda_total int not null,
    primary key(id_servicio, documento_usuario),
    constraint fk_deuda_servicio foreign key (id_servicio) references servicios(id),
    constraint fk_deuda_usuario foreign key (documento_usuario) references usuarios(numero_documento)
);


create table facturas(
    num_factura serial primary key,
    documento_usuario int not null,
	id_servicio int not null,
    fecha date not null,
	monto_abonado int not null,
    constraint fk_usuario_factura foreign key (documento_usuario) references usuarios(numero_documento),
	constraint fk_servicio_factura foreign key (id_servicio) references servicios(id)
);

