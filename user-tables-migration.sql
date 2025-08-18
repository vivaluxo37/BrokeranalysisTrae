-- User Tables Migration for BrokerAnalysis Platform
-- Extends the existing supabase-schema.sql with user-related functionality
-- Run this script after the main supabase-schema.sql

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- 1. User Profiles - Extended user information beyond Supabase auth.users
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    country_code CHAR(2),
    preferred_language VARCHAR(5) REFERENCES locales(code) DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    trading_experience TEXT CHECK (trading_experience IN ('beginner', 'intermediate', 'advanced', 'professional')),
    account_type TEXT CHECK (account_type IN ('individual', 'business', 'institutional')),
    investment_goals TEXT[],
    risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    preferred_instruments TEXT[],
    email_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_country ON user_profiles(country_code);
CREATE INDEX idx_user_profiles_language ON user_profiles(preferred_language);
CREATE INDEX idx_user_profiles_experience ON user_profiles(trading_experience);

-- 2. User Preferences - Trading and broker preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL CHECK (preference_type IN ('broker', 'instrument', 'feature', 'region')),
    preference_key TEXT NOT NULL,
    preference_value TEXT NOT NULL,
    weight NUMERIC(3,2) DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, preference_type, preference_key)
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_type ON user_preferences(preference_type);

-- 3. Saved Searches - User's saved broker search criteria
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    search_criteria JSONB NOT NULL,
    filters JSONB,
    sort_criteria JSONB,
    is_favorite BOOLEAN DEFAULT false,
    is_alert_enabled BOOLEAN DEFAULT false,
    alert_frequency TEXT CHECK (alert_frequency IN ('daily', 'weekly', 'monthly')) DEFAULT 'weekly',
    last_executed_at TIMESTAMPTZ,
    execution_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX idx_saved_searches_favorite ON saved_searches(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_saved_searches_alerts ON saved_searches(user_id, is_alert_enabled) WHERE is_alert_enabled = true;
CREATE INDEX idx_saved_searches_criteria_gin ON saved_searches USING GIN(search_criteria);

-- 4. Saved Results - User's saved broker recommendation results
CREATE TABLE saved_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    saved_search_id UUID REFERENCES saved_searches(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    questionnaire_responses JSONB NOT NULL,
    recommended_brokers JSONB NOT NULL,
    matching_criteria JSONB,
    score_breakdown JSONB,
    total_brokers_analyzed INTEGER,
    execution_time_ms INTEGER,
    is_favorite BOOLEAN DEFAULT false,
    tags TEXT[],
    notes TEXT,
    shared_publicly BOOLEAN DEFAULT false,
    share_token TEXT UNIQUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_results_user_id ON saved_results(user_id);
CREATE INDEX idx_saved_results_search_id ON saved_results(saved_search_id);
CREATE INDEX idx_saved_results_favorite ON saved_results(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_saved_results_public ON saved_results(shared_publicly, created_at) WHERE shared_publicly = true;
CREATE INDEX idx_saved_results_share_token ON saved_results(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX idx_saved_results_responses_gin ON saved_results USING GIN(questionnaire_responses);
CREATE INDEX idx_saved_results_brokers_gin ON saved_results USING GIN(recommended_brokers);

-- 5. User Broker Interactions - Track user interactions with brokers
CREATE TABLE user_broker_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'favorite', 'hide', 'compare', 'visit_website', 'start_application')),
    interaction_data JSONB,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_broker_interactions_user_id ON user_broker_interactions(user_id);
CREATE INDEX idx_user_broker_interactions_broker_id ON user_broker_interactions(broker_id);
CREATE INDEX idx_user_broker_interactions_type ON user_broker_interactions(interaction_type);
CREATE INDEX idx_user_broker_interactions_created ON user_broker_interactions(created_at DESC);
CREATE INDEX idx_user_broker_interactions_session ON user_broker_interactions(session_id);

-- 6. User Broker Lists - Custom broker lists (favorites, watchlist, etc.)
CREATE TABLE user_broker_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    list_type TEXT NOT NULL CHECK (list_type IN ('favorites', 'watchlist', 'hidden', 'custom')),
    is_default BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

CREATE INDEX idx_user_broker_lists_user_id ON user_broker_lists(user_id);
CREATE INDEX idx_user_broker_lists_type ON user_broker_lists(list_type);
CREATE INDEX idx_user_broker_lists_public ON user_broker_lists(is_public) WHERE is_public = true;

-- 7. User Broker List Items - Brokers in user lists
CREATE TABLE user_broker_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES user_broker_lists(id) ON DELETE CASCADE,
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    notes TEXT,
    sort_order INTEGER DEFAULT 0,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(list_id, broker_id)
);

CREATE INDEX idx_user_broker_list_items_list_id ON user_broker_list_items(list_id);
CREATE INDEX idx_user_broker_list_items_broker_id ON user_broker_list_items(broker_id);
CREATE INDEX idx_user_broker_list_items_sort ON user_broker_list_items(list_id, sort_order);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- =====================================================

-- Enable RLS on all user tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_broker_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_broker_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_broker_list_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER ACCESS POLICIES
-- =====================================================

-- User Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User Preferences: Users can only access their own preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Saved Searches: Users can only access their own searches
CREATE POLICY "Users can manage own searches" ON saved_searches
    FOR ALL USING (auth.uid() = user_id);

-- Saved Results: Users can access their own results + public results
CREATE POLICY "Users can view own results" ON saved_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public results" ON saved_results
    FOR SELECT USING (shared_publicly = true AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Users can manage own results" ON saved_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own results" ON saved_results
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own results" ON saved_results
    FOR DELETE USING (auth.uid() = user_id);

-- User Broker Interactions: Users can only access their own interactions
CREATE POLICY "Users can view own interactions" ON user_broker_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON user_broker_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Broker Lists: Users can access their own lists + public lists
CREATE POLICY "Users can view own lists" ON user_broker_lists
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public lists" ON user_broker_lists
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage own lists" ON user_broker_lists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists" ON user_broker_lists
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists" ON user_broker_lists
    FOR DELETE USING (auth.uid() = user_id);

-- User Broker List Items: Users can only access items in their own lists
CREATE POLICY "Users can manage own list items" ON user_broker_list_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_broker_lists 
            WHERE user_broker_lists.id = user_broker_list_items.list_id 
            AND user_broker_lists.user_id = auth.uid()
        )
    );

-- =====================================================
-- ADMIN POLICIES
-- =====================================================

-- Admin full access to all user tables
CREATE POLICY "Admin full access user_profiles" ON user_profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access user_preferences" ON user_preferences
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access saved_searches" ON saved_searches
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access saved_results" ON saved_results
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access user_broker_interactions" ON user_broker_interactions
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access user_broker_lists" ON user_broker_lists
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access user_broker_list_items" ON user_broker_list_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_results_updated_at BEFORE UPDATE ON saved_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_broker_lists_updated_at BEFORE UPDATE ON user_broker_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, display_name, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    );
    
    -- Create default broker lists
    INSERT INTO user_broker_lists (user_id, name, list_type, is_default)
    VALUES 
        (NEW.id, 'Favorites', 'favorites', true),
        (NEW.id, 'Watchlist', 'watchlist', false),
        (NEW.id, 'Hidden', 'hidden', false);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to generate share token for saved results
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.shared_publicly = true AND NEW.share_token IS NULL THEN
        NEW.share_token = encode(gen_random_bytes(16), 'base64url');
    ELSIF NEW.shared_publicly = false THEN
        NEW.share_token = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate share token
CREATE TRIGGER generate_share_token_trigger
    BEFORE INSERT OR UPDATE ON saved_results
    FOR EACH ROW EXECUTE FUNCTION generate_share_token();

-- Function to update search execution stats
CREATE OR REPLACE FUNCTION update_search_execution_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.saved_search_id IS NOT NULL THEN
        UPDATE saved_searches 
        SET 
            last_executed_at = NOW(),
            execution_count = execution_count + 1
        WHERE id = NEW.saved_search_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update search stats when results are saved
CREATE TRIGGER update_search_execution_stats_trigger
    AFTER INSERT ON saved_results
    FOR EACH ROW EXECUTE FUNCTION update_search_execution_stats();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for user dashboard data
CREATE VIEW user_dashboard AS
SELECT 
    up.id as user_id,
    up.display_name,
    up.trading_experience,
    up.country_code,
    COUNT(DISTINCT ss.id) as saved_searches_count,
    COUNT(DISTINCT sr.id) as saved_results_count,
    COUNT(DISTINCT ubi.id) FILTER (WHERE ubi.interaction_type = 'favorite') as favorite_brokers_count,
    COUNT(DISTINCT ubi.id) FILTER (WHERE ubi.created_at >= NOW() - INTERVAL '30 days') as recent_interactions_count,
    MAX(ubi.created_at) as last_activity_at
FROM user_profiles up
LEFT JOIN saved_searches ss ON up.id = ss.user_id
LEFT JOIN saved_results sr ON up.id = sr.user_id
LEFT JOIN user_broker_interactions ubi ON up.id = ubi.user_id
GROUP BY up.id, up.display_name, up.trading_experience, up.country_code;

-- View for broker popularity metrics
CREATE VIEW broker_popularity AS
SELECT 
    b.id as broker_id,
    b.name as broker_name,
    b.slug as broker_slug,
    COUNT(DISTINCT ubi.user_id) as total_users_interacted,
    COUNT(DISTINCT ubi.id) FILTER (WHERE ubi.interaction_type = 'view') as total_views,
    COUNT(DISTINCT ubi.id) FILTER (WHERE ubi.interaction_type = 'favorite') as total_favorites,
    COUNT(DISTINCT ubi.id) FILTER (WHERE ubi.interaction_type = 'compare') as total_compares,
    COUNT(DISTINCT ubi.id) FILTER (WHERE ubi.interaction_type = 'visit_website') as total_website_visits,
    COUNT(DISTINCT ubi.id) FILTER (WHERE ubi.created_at >= NOW() - INTERVAL '30 days') as recent_interactions,
    AVG(CASE WHEN ubi.interaction_type = 'favorite' THEN 1 ELSE 0 END) as favorite_rate
FROM brokers b
LEFT JOIN user_broker_interactions ubi ON b.id = ubi.broker_id
WHERE b.status = 'active'
GROUP BY b.id, b.name, b.slug;

-- View for user broker recommendations with personalization
CREATE VIEW user_broker_recommendations AS
SELECT 
    up.id as user_id,
    b.id as broker_id,
    b.name as broker_name,
    b.slug as broker_slug,
    b.avg_rating,
    CASE 
        WHEN ubli.broker_id IS NOT NULL AND ubl.list_type = 'favorites' THEN 'favorited'
        WHEN ubli.broker_id IS NOT NULL AND ubl.list_type = 'hidden' THEN 'hidden'
        WHEN ubi.interaction_type = 'favorite' THEN 'previously_favorited'
        ELSE 'neutral'
    END as user_relationship,
    COUNT(ubi.id) FILTER (WHERE ubi.interaction_type = 'view') as user_view_count,
    MAX(ubi.created_at) as last_interaction_at
FROM user_profiles up
CROSS JOIN brokers b
LEFT JOIN user_broker_interactions ubi ON up.id = ubi.user_id AND b.id = ubi.broker_id
LEFT JOIN user_broker_list_items ubli ON b.id = ubli.broker_id
LEFT JOIN user_broker_lists ubl ON ubli.list_id = ubl.id AND ubl.user_id = up.id
WHERE b.status = 'active'
GROUP BY up.id, b.id, b.name, b.slug, b.avg_rating, ubli.broker_id, ubl.list_type, ubi.interaction_type;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Note: Sample data will be inserted automatically when users sign up
-- through the create_user_profile() trigger function

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

SELECT 'User tables migration completed successfully! Ready for user data management.' as status;

-- Next steps:
-- 1. Run this migration after the main supabase-schema.sql
-- 2. Test user registration and profile creation
-- 3. Implement frontend components for saved searches and results
-- 4. Set up analytics and monitoring for user interactions
-- 5. Configure email notifications for search alerts