create table movie(
	id char(36) primary key default(uuid()),
	title varchar(255) not null,
	year int not null,
	director varchar(255) not null,
	duration int not null,
	poster text,
	rate decimal(3,1) unsigned not null
);

create table genre(
	id int auto_increment primary key,
	name varchar(255) not null unique
);

create table movie_genre(
	movie_id char(36) references movie(id),
	genre_id int references genre(id),
	primary key (movie_id,genre_id)
);