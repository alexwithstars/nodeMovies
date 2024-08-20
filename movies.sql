-- Crear la base de datos no es necesario en SQLite

-- Crear la tabla genre
CREATE TABLE IF NOT EXISTS genre (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Insertar datos en la tabla genre
INSERT INTO genre (id, name) VALUES
    (39, 'Action'),
    (41, 'Adventure'),
    (44, 'Animation'),
    (45, 'Biography'),
    (40, 'Crime'),
    (38, 'Drama'),
    (46, 'Fantasy'),
    (43, 'Romance'),
    (42, 'Sci-Fi');

-- Crear la tabla movie
CREATE TABLE IF NOT EXISTS movie (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || '4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  director TEXT NOT NULL,
  duration INTEGER NOT NULL,
  poster TEXT,
  rate REAL NOT NULL
);

-- Insertar datos en la tabla movie
INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
    ('04986507-b3ed-442c-8ae7-4c5df804f896', 'The Avengers', 2012, 'Joss Whedon', 143, 'https://img.fruugo.com/product/7/41/14532417_max.jpg', 8.0),
    ('241bf55d-b649-4109-af7c-0e6890ded3fc', 'Pulp Fiction', 1994, 'Quentin Tarantino', 154, 'https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 8.9),
    ('2e6900e2-0b48-4fb6-ad48-09c7086e54fe', 'The Lion King', 1994, 'Roger Allers, Rob Minkoff', 88, 'https://m.media-amazon.com/images/I/81BMmrwSFOL._AC_UF1000,1000_QL80_.jpg', 8.5),
    ('5ad1a235-0d9c-410a-b32b-220d91689a08', 'Inception', 2010, 'Christopher Nolan', 148, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8),
    ('6a360a18-c645-4b47-9a7b-2a71babbf3e0', 'Avatar', 2009, 'James Cameron', 162, 'https://i.etsystatic.com/35681979/r/il/dfe3ba/3957859451/il_fullxfull.3957859451_h27r.jpg', 7.8),
    ('7d2832f8-c70a-410e-8963-4c93bf36cc9c', 'Jurassic Park', 1993, 'Steven Spielberg', 127, 'https://vice-press.com/cdn/shop/products/Jurassic-Park-Editions-poster-florey.jpg?v=1654518755&width=1024', 8.1),
    ('7e3fd5ab-60ff-4ae2-92b6-9597f0308d1d', 'Gladiator', 2000, 'Ridley Scott', 155, 'https://img.fruugo.com/product/0/60/14417600_max.jpg', 8.5),
    ('8fb17ae1-bdfe-45e5-a871-4772d7e526b8', 'The Social Network', 2010, 'David Fincher', 120, 'https://i.pinimg.com/originals/7e/37/b9/7e37b994b613e94cba64f307b1983e39.jpg', 7.7),
    ('9e6106f0-848b-4810-a11a-3d832a5610f9', 'Forrest Gump', 1994, 'Robert Zemeckis', 142, 'https://i.ebayimg.com/images/g/qR8AAOSwkvRZzuMD/s-l1600.jpg', 8.8),
    ('aa391090-b938-42eb-b520-86ea0aa3917b', 'The Lord of the Rings: The Return of the King', 2003, 'Peter Jackson', 201, 'https://i.ebayimg.com/images/g/0hoAAOSwe7peaMLW/s-l1600.jpg', 8.9),
    ('b6e03689-cccd-478e-8565-d92f40813b13', 'Interstellar', 2014, 'Christopher Nolan', 169, 'https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg', 8.6),
    ('c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf', 'The Dark Knight', 2008, 'Christopher Nolan', 152, 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0),
    ('c906673b-3948-4402-ac7f-73ac3a9e3105', 'The Matrix', 1999, 'Lana Wachowski', 136, 'https://i.ebayimg.com/images/g/QFQAAOSwAQpfjaA6/s-l1200.jpg', 8.7),
    ('ccf36f2e-8566-47f7-912d-9f4647250bc7', 'Titanic', 1997, 'James Cameron', 195, 'https://i.pinimg.com/originals/42/42/65/4242658e6f1b0d6322a4a93e0383108b.png', 7.8),
    ('dcdd0fad-a94c-4810-8acc-5f108d3b18c3', 'The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3);

-- Crear la tabla movie_genre
CREATE TABLE IF NOT EXISTS movie_genre (
  movie_id TEXT NOT NULL,
  genre_id INTEGER NOT NULL,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movie(id),
  FOREIGN KEY (genre_id) REFERENCES genre(id)
);

-- Insertar datos en la tabla movie_genre
INSERT INTO movie_genre (movie_id, genre_id) VALUES
	('04986507-b3ed-442c-8ae7-4c5df804f896', 39),
	('04986507-b3ed-442c-8ae7-4c5df804f896', 41),
	('04986507-b3ed-442c-8ae7-4c5df804f896', 42),
	('241bf55d-b649-4109-af7c-0e6890ded3fc', 38),
	('241bf55d-b649-4109-af7c-0e6890ded3fc', 40),
	('2e6900e2-0b48-4fb6-ad48-09c7086e54fe', 38),
	('2e6900e2-0b48-4fb6-ad48-09c7086e54fe', 41),
	('2e6900e2-0b48-4fb6-ad48-09c7086e54fe', 44),
	('5ad1a235-0d9c-410a-b32b-220d91689a08', 39),
	('5ad1a235-0d9c-410a-b32b-220d91689a08', 41),
	('5ad1a235-0d9c-410a-b32b-220d91689a08', 42),
	('6a360a18-c645-4b47-9a7b-2a71babbf3e0', 39),
	('6a360a18-c645-4b47-9a7b-2a71babbf3e0', 41),
	('6a360a18-c645-4b47-9a7b-2a71babbf3e0', 46),
	('7d2832f8-c70a-410e-8963-4c93bf36cc9c', 41),
	('7d2832f8-c70a-410e-8963-4c93bf36cc9c', 42),
	('7e3fd5ab-60ff-4ae2-92b6-9597f0308d1d', 38),
	('7e3fd5ab-60ff-4ae2-92b6-9597f0308d1d', 39),
	('7e3fd5ab-60ff-4ae2-92b6-9597f0308d1d', 41),
	('8fb17ae1-bdfe-45e5-a871-4772d7e526b8', 38),
	('8fb17ae1-bdfe-45e5-a871-4772d7e526b8', 45),
	('9e6106f0-848b-4810-a11a-3d832a5610f9', 38),
	('9e6106f0-848b-4810-a11a-3d832a5610f9', 43),
	('aa391090-b938-42eb-b520-86ea0aa3917b', 38),
	('aa391090-b938-42eb-b520-86ea0aa3917b', 39),
	('aa391090-b938-42eb-b520-86ea0aa3917b', 41),
	('b6e03689-cccd-478e-8565-d92f40813b13', 38),
	('b6e03689-cccd-478e-8565-d92f40813b13', 41),
	('b6e03689-cccd-478e-8565-d92f40813b13', 42),
	('c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf', 38),
	('c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf', 39),
	('c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf', 40),
	('c906673b-3948-4402-ac7f-73ac3a9e3105', 39),
	('c906673b-3948-4402-ac7f-73ac3a9e3105', 42),
	('ccf36f2e-8566-47f7-912d-9f4647250bc7', 38),
	('ccf36f2e-8566-47f7-912d-9f4647250bc7', 43),
	('dcdd0fad-a94c-4810-8acc-5f108d3b18c3', 38);
