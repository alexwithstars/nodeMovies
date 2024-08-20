create table user(
	id char(36) primary key default(uuid()),
	username varchar(50) not null unique,
	password varchar(50) not null,
	logkey varchar(255) not null,
	email varchar(255) not null,
	recover varchar(255) not null
);