-- Create public ataturk table
-- This table stores information about Mustafa Kemal Ataturk
-- Public access enabled (no authentication required)

CREATE TABLE IF NOT EXISTS public.ataturk (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  year INTEGER,
  location TEXT,
  significance TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security but allow public read access
ALTER TABLE public.ataturk ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (no authentication required)
CREATE POLICY "Allow public read access" ON public.ataturk
  FOR SELECT
  USING (true);

-- Create policy to allow public insert (optional, if you want public writes)
CREATE POLICY "Allow public insert" ON public.ataturk
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public update (optional, if you want public updates)
CREATE POLICY "Allow public update" ON public.ataturk
  FOR UPDATE
  USING (true);

-- Create policy to allow public delete (optional, if you want public deletes)
CREATE POLICY "Allow public delete" ON public.ataturk
  FOR DELETE
  USING (true);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_ataturk_category ON public.ataturk(category);

-- Create index on year for faster queries
CREATE INDEX IF NOT EXISTS idx_ataturk_year ON public.ataturk(year);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ataturk_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ataturk_timestamp
  BEFORE UPDATE ON public.ataturk
  FOR EACH ROW
  EXECUTE FUNCTION update_ataturk_updated_at();

-- Insert seed data about Ataturk
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
('International Recognition', 'Ataturk signed the Treaty of Lausanne in 1923, gaining international recognition for Turkey.', 'Diplomacy', 1923, 'Lausanne, Switzerland', 'International sovereignty recognition', NULL);

