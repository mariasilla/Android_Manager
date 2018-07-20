DROP TABLE IF EXISTS operators CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS androids CASCADE;

CREATE TABLE operators (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);


CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(16),
  description VARCHAR(255),
  complexity VARCHAR(255)
);

CREATE TABLE androids (
  id SERIAL PRIMARY KEY,
  name VARCHAR(24),
  avatar VARCHAR(255),
  skills VARCHAR(255),
  reliability INTEGER DEFAULT 10,
  status INTEGER,
  job_id INTEGER REFERENCES jobs(id)
);

ALTER TABLE jobs
ADD CONSTRAINT jobs_name_only_characters_and_numbers
  CHECK (name NOT LIKE '%[^A-Z0-9 ]%'),
ADD CONSTRAINT jobs_name_min_length CHECK (LENGTH(name) >= 2);

-- ALTER TABLE jobs
-- WITH CHECK CHECK CONSTRAINT jobs_name_only_characters_and_numbers;
--

ALTER TABLE androids
ADD CONSTRAINT androids_name_only_characters_and_numbers
    CHECK (name NOT LIKE '%[^A-Z0-9 ]%'),
ADD CONSTRAINT androids_name_min_length CHECK (LENGTH(name) >= 5);

-- ALTER TABLE androids
-- WITH CHECK CHECK CONSTRAINT androids_name_only_characters_and_numbers;
