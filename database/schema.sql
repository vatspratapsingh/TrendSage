-- TrendSage Market Insights Database Schema
-- PostgreSQL/Supabase compatible

-- Create database (run this separately if needed)
-- CREATE DATABASE trendsage;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Market data table for storing raw and processed data
CREATE TABLE IF NOT EXISTS market_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    competitor VARCHAR(100) NOT NULL,
    data_type VARCHAR(50) NOT NULL, -- 'website', 'twitter', 'stock', 'news', 'sentiment', 'analysis'
    raw_data JSONB,
    processed_data JSONB,
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    confidence_score DECIMAL(3,2), -- 0.0 to 1.0
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitors configuration table
CREATE TABLE IF NOT EXISTS competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    website VARCHAR(255),
    twitter_handle VARCHAR(100),
    stock_symbol VARCHAR(10),
    industry VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily insights summary table
CREATE TABLE IF NOT EXISTS daily_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    market_summary TEXT,
    key_insights JSONB,
    sentiment_overview JSONB,
    stock_performance JSONB,
    competitor_activities JSONB,
    ai_analysis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications log table
CREATE TABLE IF NOT EXISTS notifications_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'slack', 'telegram', 'email'
    recipient VARCHAR(255),
    message_content TEXT,
    status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'failed', 'pending'
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard metrics table
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(20),
    competitor VARCHAR(100),
    category VARCHAR(50), -- 'sentiment', 'stock', 'social', 'news'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_market_data_date ON market_data(date);
CREATE INDEX IF NOT EXISTS idx_market_data_competitor ON market_data(competitor);
CREATE INDEX IF NOT EXISTS idx_market_data_type ON market_data(data_type);
CREATE INDEX IF NOT EXISTS idx_market_data_created_at ON market_data(created_at);

CREATE INDEX IF NOT EXISTS idx_daily_insights_date ON daily_insights(date);
CREATE INDEX IF NOT EXISTS idx_notifications_log_date ON notifications_log(date);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_date ON dashboard_metrics(date);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_competitor ON dashboard_metrics(competitor);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_market_data_raw_data ON market_data USING GIN(raw_data);
CREATE INDEX IF NOT EXISTS idx_market_data_processed_data ON market_data USING GIN(processed_data);
CREATE INDEX IF NOT EXISTS idx_daily_insights_key_insights ON daily_insights USING GIN(key_insights);
CREATE INDEX IF NOT EXISTS idx_daily_insights_sentiment_overview ON daily_insights USING GIN(sentiment_overview);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_market_data_updated_at BEFORE UPDATE ON market_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitors_updated_at BEFORE UPDATE ON competitors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_insights_updated_at BEFORE UPDATE ON daily_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample competitors data
INSERT INTO competitors (name, website, twitter_handle, stock_symbol, industry) VALUES
('Apple', 'https://apple.com', 'apple', 'AAPL', 'Technology'),
('Google', 'https://google.com', 'google', 'GOOGL', 'Technology'),
('Microsoft', 'https://microsoft.com', 'microsoft', 'MSFT', 'Technology'),
('Amazon', 'https://amazon.com', 'amazon', 'AMZN', 'E-commerce'),
('Tesla', 'https://tesla.com', 'tesla', 'TSLA', 'Automotive')
ON CONFLICT (name) DO NOTHING;

-- Create view for daily summary
CREATE OR REPLACE VIEW daily_market_summary AS
SELECT 
    d.date,
    d.market_summary,
    d.ai_analysis,
    COUNT(DISTINCT m.competitor) as competitors_analyzed,
    AVG(m.sentiment_score) as avg_sentiment,
    COUNT(m.id) as total_data_points
FROM daily_insights d
LEFT JOIN market_data m ON d.date = m.date
GROUP BY d.date, d.market_summary, d.ai_analysis
ORDER BY d.date DESC;

-- Create view for competitor performance
CREATE OR REPLACE VIEW competitor_performance AS
SELECT 
    c.name,
    c.stock_symbol,
    c.industry,
    COUNT(m.id) as data_points_count,
    AVG(m.sentiment_score) as avg_sentiment,
    MAX(m.created_at) as last_updated
FROM competitors c
LEFT JOIN market_data m ON c.name = m.competitor
WHERE c.is_active = TRUE
GROUP BY c.id, c.name, c.stock_symbol, c.industry
ORDER BY avg_sentiment DESC NULLS LAST;
