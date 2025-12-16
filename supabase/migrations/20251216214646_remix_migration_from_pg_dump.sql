CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user'
);


--
-- Name: get_booked_slots(date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_booked_slots(p_booking_date date) RETURNS TABLE(time_slot text, duration integer)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT cb.time_slot, cb.duration
  FROM public.call_bookings cb
  WHERE cb.booking_date = p_booking_date
    AND cb.status != 'cancelled'
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: call_booking_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.call_booking_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    call_booking_id uuid NOT NULL,
    call_summary text,
    follow_up_actions text,
    call_outcome text,
    callback_date timestamp with time zone,
    internal_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT call_booking_notes_call_outcome_check CHECK ((call_outcome = ANY (ARRAY['interested'::text, 'converted_to_quote'::text, 'not_interested'::text, 'no_answer'::text, 'callback_scheduled'::text])))
);


--
-- Name: call_bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.call_bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    booking_date date NOT NULL,
    time_slot text NOT NULL,
    duration integer DEFAULT 30 NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: client_call_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_call_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quote_request_id uuid NOT NULL,
    call_status text DEFAULT 'not_called'::text,
    call_date timestamp with time zone,
    call_notes text,
    has_domain boolean,
    domain_name text,
    has_hosting boolean,
    hosting_details text,
    has_existing_logo boolean,
    logo_received_by_email boolean,
    preferred_colors text,
    style_preferences text,
    inspirations text,
    estimated_pages integer,
    example_sites text,
    needs_contact_form boolean,
    needs_booking boolean,
    needs_payment boolean,
    needs_blog boolean,
    needs_chat boolean,
    needs_newsletter boolean,
    needs_user_accounts boolean,
    other_features text,
    content_ready boolean,
    needs_professional_photos boolean,
    needs_multilingual boolean,
    multilingual_languages text,
    target_platforms text,
    app_main_features text,
    needs_authentication boolean,
    needs_push_notifications boolean,
    needs_store_publication boolean,
    current_tools text,
    tasks_to_automate text,
    estimated_volume text,
    proposed_price numeric(10,2),
    price_details text,
    client_accepted boolean,
    deposit_received boolean,
    deposit_amount numeric(10,2),
    estimated_start_date date,
    estimated_delivery_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    target_audience text,
    project_objectives text,
    competitors text,
    social_media_presence text,
    seo_important boolean,
    seo_keywords text,
    needs_analytics boolean,
    needs_social_integration boolean,
    who_updates_after text,
    needs_gallery boolean,
    product_count integer,
    needs_stock_management boolean,
    delivery_methods text,
    payment_methods text,
    needs_invoicing boolean,
    existing_tagline text,
    existing_brand_guidelines boolean,
    preferred_fonts text,
    elements_to_avoid text,
    needs_offline_mode boolean,
    needs_geolocation boolean,
    needs_camera_access boolean,
    third_party_integrations text,
    recurring_budget text,
    automation_users text,
    execution_frequency text,
    main_contact_name text,
    main_contact_role text,
    validation_availability text,
    urgency_level text,
    urgent_deadline text,
    preferred_communication text,
    needs_training boolean,
    wants_maintenance_contract boolean
);


--
-- Name: client_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_statuses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_email text NOT NULL,
    status text DEFAULT 'lead'::text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT client_statuses_status_check CHECK ((status = ANY (ARRAY['lead'::text, 'prospect'::text, 'client'::text, 'lost'::text])))
);


--
-- Name: quote_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quote_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    business_type text,
    services text[] NOT NULL,
    project_details text,
    budget text,
    timeline text,
    consent_given boolean DEFAULT true NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    CONSTRAINT quote_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'contacted'::text, 'converted'::text, 'rejected'::text])))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: call_booking_notes call_booking_notes_call_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_booking_notes
    ADD CONSTRAINT call_booking_notes_call_booking_id_key UNIQUE (call_booking_id);


--
-- Name: call_booking_notes call_booking_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_booking_notes
    ADD CONSTRAINT call_booking_notes_pkey PRIMARY KEY (id);


--
-- Name: call_bookings call_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_bookings
    ADD CONSTRAINT call_bookings_pkey PRIMARY KEY (id);


--
-- Name: client_call_notes client_call_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_call_notes
    ADD CONSTRAINT client_call_notes_pkey PRIMARY KEY (id);


--
-- Name: client_call_notes client_call_notes_quote_request_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_call_notes
    ADD CONSTRAINT client_call_notes_quote_request_id_key UNIQUE (quote_request_id);


--
-- Name: client_statuses client_statuses_client_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_statuses
    ADD CONSTRAINT client_statuses_client_email_key UNIQUE (client_email);


--
-- Name: client_statuses client_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_statuses
    ADD CONSTRAINT client_statuses_pkey PRIMARY KEY (id);


--
-- Name: quote_requests quote_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_quote_requests_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quote_requests_created_at ON public.quote_requests USING btree (created_at DESC);


--
-- Name: idx_quote_requests_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quote_requests_email ON public.quote_requests USING btree (email);


--
-- Name: idx_quote_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quote_requests_status ON public.quote_requests USING btree (status);


--
-- Name: call_booking_notes update_call_booking_notes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_call_booking_notes_updated_at BEFORE UPDATE ON public.call_booking_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: call_bookings update_call_bookings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_call_bookings_updated_at BEFORE UPDATE ON public.call_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: client_call_notes update_client_call_notes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_client_call_notes_updated_at BEFORE UPDATE ON public.client_call_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: client_statuses update_client_statuses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_client_statuses_updated_at BEFORE UPDATE ON public.client_statuses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: call_booking_notes call_booking_notes_call_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_booking_notes
    ADD CONSTRAINT call_booking_notes_call_booking_id_fkey FOREIGN KEY (call_booking_id) REFERENCES public.call_bookings(id) ON DELETE CASCADE;


--
-- Name: client_call_notes client_call_notes_quote_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_call_notes
    ADD CONSTRAINT client_call_notes_quote_request_id_fkey FOREIGN KEY (quote_request_id) REFERENCES public.quote_requests(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: call_bookings Admins can delete bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete bookings" ON public.call_bookings FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: call_booking_notes Admins can delete call booking notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete call booking notes" ON public.call_booking_notes FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: client_call_notes Admins can delete call notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete call notes" ON public.client_call_notes FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: client_statuses Admins can delete client statuses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete client statuses" ON public.client_statuses FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: quote_requests Admins can delete quote requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete quote requests" ON public.quote_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can delete roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: call_booking_notes Admins can insert call booking notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert call booking notes" ON public.call_booking_notes FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: client_call_notes Admins can insert call notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert call notes" ON public.client_call_notes FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: client_statuses Admins can insert client statuses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert client statuses" ON public.client_statuses FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can insert roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: call_bookings Admins can update bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update bookings" ON public.call_bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: call_booking_notes Admins can update call booking notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update call booking notes" ON public.call_booking_notes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: client_call_notes Admins can update call notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update call notes" ON public.client_call_notes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: client_statuses Admins can update client statuses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update client statuses" ON public.client_statuses FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: quote_requests Admins can update quote requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update quote requests" ON public.quote_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can update roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: call_bookings Admins can view all bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all bookings" ON public.call_bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: client_call_notes Admins can view all call notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all call notes" ON public.client_call_notes FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: quote_requests Admins can view all quote requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all quote requests" ON public.quote_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: call_booking_notes Admins can view call booking notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view call booking notes" ON public.call_booking_notes FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: client_statuses Admins can view client statuses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view client statuses" ON public.client_statuses FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: call_bookings Anyone can create a booking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create a booking" ON public.call_bookings FOR INSERT WITH CHECK (true);


--
-- Name: quote_requests Anyone can submit a quote request; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit a quote request" ON public.quote_requests FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: user_roles Users can view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: call_booking_notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.call_booking_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: call_bookings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.call_bookings ENABLE ROW LEVEL SECURITY;

--
-- Name: client_call_notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.client_call_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: client_statuses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.client_statuses ENABLE ROW LEVEL SECURITY;

--
-- Name: quote_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


