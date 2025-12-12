-- Seed data for ataturk table
-- This file contains sample data about Mustafa Kemal Ataturk
-- Run this after creating the table

-- Clear existing data (optional, comment out if you want to keep existing data)
-- TRUNCATE TABLE public.ataturk RESTART IDENTITY CASCADE;

-- Insert seed data
INSERT INTO public.ataturk (title, description, category, year, location, significance, image_url) VALUES
('Birth of Mustafa Kemal', 'Mustafa Kemal Ataturk was born on May 19, 1881, in Salonica (now Thessaloniki, Greece).', 'Biography', 1881, 'Salonica, Ottoman Empire', 'Founder of modern Turkey', NULL),
('Military Academy', 'Ataturk graduated from the Ottoman Military Academy in Istanbul in 1905.', 'Education', 1905, 'Istanbul, Ottoman Empire', 'Military education foundation', NULL),
('Gallipoli Campaign', 'Ataturk commanded the Ottoman forces during the Gallipoli Campaign (1915-1916), successfully defending against Allied forces.', 'Military', 1915, 'Gallipoli, Ottoman Empire', 'Heroic defense, national hero status', NULL),
('War of Independence', 'Led the Turkish War of Independence (1919-1923) against occupying Allied forces and the Ottoman government.', 'Independence', 1919, 'Anatolia, Turkey', 'Foundation of modern Turkish state', NULL),
('Grand National Assembly', 'Established the Grand National Assembly of Turkey in Ankara on April 23, 1920.', 'Politics', 1920, 'Ankara, Turkey', 'First democratic parliament', NULL),
('Abolition of Sultanate', 'Abolished the Ottoman Sultanate on November 1, 1922, ending 600 years of Ottoman rule.', 'Reform', 1922, 'Istanbul, Turkey', 'End of monarchy, beginning of republic', NULL),
('Proclamation of Republic', 'Proclaimed the Republic of Turkey on October 29, 1923, and became its first President.', 'Politics', 1923, 'Ankara, Turkey', 'Birth of Turkish Republic', NULL),
('Abolition of Caliphate', 'Abolished the Islamic Caliphate on March 3, 1924, separating religion from state.', 'Reform', 1924, 'Ankara, Turkey', 'Secular state establishment', NULL),
('Hat Reform', 'Introduced the Hat Law in 1925, replacing fez and turban with Western-style hats.', 'Reform', 1925, 'Turkey', 'Modernization and Westernization', NULL),
('Surname Law', 'Introduced the Surname Law in 1934, requiring all Turkish citizens to adopt surnames. Ataturk was given the surname "Ataturk" meaning "Father of the Turks".', 'Reform', 1934, 'Turkey', 'Modern identity system', NULL),
('Women''s Rights', 'Granted Turkish women the right to vote and be elected in 1934, before many European countries.', 'Reform', 1934, 'Turkey', 'Gender equality advancement', NULL),
('Turkish Language Reform', 'Initiated the Turkish Language Reform to replace Arabic and Persian words with Turkish equivalents.', 'Reform', 1928, 'Turkey', 'Language modernization and national identity', NULL),
('Latin Alphabet', 'Replaced Arabic script with Latin alphabet in 1928, making literacy more accessible.', 'Reform', 1928, 'Turkey', 'Educational modernization', NULL),
('Industrial Development', 'Established state-owned enterprises and encouraged industrialization throughout Turkey.', 'Economy', 1930, 'Turkey', 'Economic modernization', NULL),
('Death of Ataturk', 'Mustafa Kemal Ataturk passed away on November 10, 1938, at the age of 57 in Dolmabahce Palace, Istanbul.', 'Biography', 1938, 'Istanbul, Turkey', 'End of an era, beginning of legacy', NULL),
('Ataturk''s Principles', 'Six Arrows (Altı Ok): Republicanism, Populism, Nationalism, Laicism, Statism, and Revolutionism - the fundamental principles of the Turkish Republic.', 'Philosophy', 1931, 'Turkey', 'Guiding principles of Turkish Republic', NULL),
('Ankara as Capital', 'Moved the capital from Istanbul to Ankara in 1923, symbolizing the break from Ottoman past.', 'Reform', 1923, 'Ankara, Turkey', 'New beginning, modern capital', NULL),
('International Recognition', 'Ataturk signed the Treaty of Lausanne in 1923, gaining international recognition for Turkey.', 'Diplomacy', 1923, 'Lausanne, Switzerland', 'International sovereignty recognition', NULL)
ON CONFLICT DO NOTHING;

