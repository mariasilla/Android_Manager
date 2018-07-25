--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.3
-- Dumped by pg_dump version 9.6.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: androids; Type: TABLE; Schema: public; Owner: kuzia
--

CREATE TABLE androids (
    id integer NOT NULL,
    name character varying(24),
    avatar character varying(255),
    skills character varying(255),
    reliability integer DEFAULT 10,
    status integer,
    job_id integer,
    CONSTRAINT androids_name_min_length CHECK ((length((name)::text) >= 5)),
    CONSTRAINT androids_name_only_characters_and_numbers CHECK (((name)::text !~~ '%[^A-Z0-9 ]%'::text))
);


ALTER TABLE androids OWNER TO kuzia;

--
-- Name: androids_id_seq; Type: SEQUENCE; Schema: public; Owner: kuzia
--

CREATE SEQUENCE androids_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE androids_id_seq OWNER TO kuzia;

--
-- Name: androids_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kuzia
--

ALTER SEQUENCE androids_id_seq OWNED BY androids.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: kuzia
--

CREATE TABLE jobs (
    id integer NOT NULL,
    name character varying(16),
    description character varying(255),
    complexity character varying(255),
    CONSTRAINT jobs_name_min_length CHECK ((length((name)::text) >= 2)),
    CONSTRAINT jobs_name_only_characters_and_numbers CHECK (((name)::text !~~ '%[^A-Z0-9 ]%'::text))
);


ALTER TABLE jobs OWNER TO kuzia;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: kuzia
--

CREATE SEQUENCE jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE jobs_id_seq OWNER TO kuzia;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kuzia
--

ALTER SEQUENCE jobs_id_seq OWNED BY jobs.id;


--
-- Name: operators; Type: TABLE; Schema: public; Owner: kuzia
--

CREATE TABLE operators (
    id integer NOT NULL,
    email character varying(255),
    password_digest character varying(255)
);


ALTER TABLE operators OWNER TO kuzia;

--
-- Name: operators_id_seq; Type: SEQUENCE; Schema: public; Owner: kuzia
--

CREATE SEQUENCE operators_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE operators_id_seq OWNER TO kuzia;

--
-- Name: operators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kuzia
--

ALTER SEQUENCE operators_id_seq OWNED BY operators.id;


--
-- Name: androids id; Type: DEFAULT; Schema: public; Owner: kuzia
--

ALTER TABLE ONLY androids ALTER COLUMN id SET DEFAULT nextval('androids_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: kuzia
--

ALTER TABLE ONLY jobs ALTER COLUMN id SET DEFAULT nextval('jobs_id_seq'::regclass);


--
-- Name: operators id; Type: DEFAULT; Schema: public; Owner: kuzia
--

ALTER TABLE ONLY operators ALTER COLUMN id SET DEFAULT nextval('operators_id_seq'::regclass);


--
-- Data for Name: androids; Type: TABLE DATA; Schema: public; Owner: kuzia
--

COPY androids (id, name, avatar, skills, reliability, status, job_id) FROM stdin;
1	Chips	\N	Cleaning, vacuuming	10	1	\N
2	Hulky	\N	Plumbing	10	1	\N
3	Moodys	\N	Laundry	10	1	\N
\.


--
-- Name: androids_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kuzia
--

SELECT pg_catalog.setval('androids_id_seq', 3, true);


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: kuzia
--

COPY jobs (id, name, description, complexity) FROM stdin;
1	Landscaping	Plant trees, fix water supply	7
2	Housekeeping 	Laundry, cooking	5
\.


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kuzia
--

SELECT pg_catalog.setval('jobs_id_seq', 3, true);


--
-- Data for Name: operators; Type: TABLE DATA; Schema: public; Owner: kuzia
--

COPY operators (id, email, password_digest) FROM stdin;
1	w@gmail.com	$2b$10$EWBwL9xIheR82CEAUxNyiue6Mh0HWIIP0XPfVACjLxVC1HrlniQGK
\.


--
-- Name: operators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kuzia
--

SELECT pg_catalog.setval('operators_id_seq', 1, true);


--
-- Name: androids androids_pkey; Type: CONSTRAINT; Schema: public; Owner: kuzia
--

ALTER TABLE ONLY androids
    ADD CONSTRAINT androids_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: kuzia
--

ALTER TABLE ONLY jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: operators operators_email_key; Type: CONSTRAINT; Schema: public; Owner: kuzia
--

ALTER TABLE ONLY operators
    ADD CONSTRAINT operators_email_key UNIQUE (email);


--
-- Name: operators operators_pkey; Type: CONSTRAINT; Schema: public; Owner: kuzia
--

ALTER TABLE ONLY operators
    ADD CONSTRAINT operators_pkey PRIMARY KEY (id);


--
-- Name: androids androids_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kuzia
--

ALTER TABLE ONLY androids
    ADD CONSTRAINT androids_job_id_fkey FOREIGN KEY (job_id) REFERENCES jobs(id);


--
-- PostgreSQL database dump complete
--

