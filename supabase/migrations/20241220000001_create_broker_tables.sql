-- Create broker_features table
CREATE TABLE IF NOT EXISTS broker_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  feature_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_broker_features_broker_id ON broker_features(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_features_key ON broker_features(feature_key);

-- Create broker_regulation table
CREATE TABLE IF NOT EXISTS broker_regulation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  country_code CHAR(2) NOT NULL,
  regulator_name TEXT NOT NULL,
  license_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_broker_regulation_broker_id ON broker_regulation(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_regulation_country ON broker_regulation(country_code);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('editorial', 'user')) NOT NULL,
  author TEXT,
  author_id UUID,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  body TEXT NOT NULL,
  lang CHAR(2) DEFAULT 'en',
  flagged BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_broker_id ON reviews(broker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_kind ON reviews(kind);
CREATE INDEX IF NOT EXISTS idx_reviews_author_id ON reviews(author_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(published_at DESC);

-- Create locales table
CREATE TABLE IF NOT EXISTS locales (
  code VARCHAR(5) PRIMARY KEY,
  label TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default locales
INSERT INTO locales (code, label) VALUES 
  ('en', 'English'),
  ('es', 'Español'),
  ('pt', 'Português'),
  ('fr', 'Français'),
  ('de', 'Deutsch'),
  ('it', 'Italiano'),
  ('ru', 'Русский'),
  ('zh-Hans', '简体中文'),
  ('zh-Hant', '繁體中文'),
  ('ja', '日本語'),
  ('ko', '한국어'),
  ('ar', 'العربية'),
  ('hi', 'हिन्दी'),
  ('bn', 'বাংলা'),
  ('ur', 'اردو')
ON CONFLICT (code) DO NOTHING;

-- Create function to update broker average rating
CREATE OR REPLACE FUNCTION update_broker_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE brokers 
  SET avg_rating = (
    SELECT AVG(rating) 
    FROM reviews 
    WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id)
    AND rating IS NOT NULL
  )
  WHERE id = COALESCE(NEW.broker_id, OLD.broker_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update broker ratings
CREATE TRIGGER update_broker_rating_on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_broker_avg_rating();

CREATE TRIGGER update_broker_rating_on_review_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_broker_avg_rating();

CREATE TRIGGER update_broker_rating_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_broker_avg_rating();