--
-- PostgreSQL database dump
--

\restrict V6wbUXj6URTaon9gbURGkPPeHCo2bFT7hD7cyrMA9NCRZehYactWDTz077UySzV

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: estudiante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estudiante (
    email character varying(255) NOT NULL,
    nombre character varying(255)
);


--
-- Data for Name: estudiante; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.estudiante (email, nombre) FROM stdin;
juan.perez@correo.com	Juan Perez
maria.lopez@correo.com	Maria Lopez
ana.garcia@correo.com	Ana Garcia
edi.velazquez@correo.com	Ediberto Velazquez
\.


--
-- Name: estudiante estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_pkey PRIMARY KEY (email);


--
-- PostgreSQL database dump complete
--

\unrestrict V6wbUXj6URTaon9gbURGkPPeHCo2bFT7hD7cyrMA9NCRZehYactWDTz077UySzV

