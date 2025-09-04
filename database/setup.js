const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database setup and initialization
class DatabaseSetup {
  constructor() {
    this.pool = pool;
  }

  async initialize() {
    try {
      console.log('🔄 Initializing TrendSage database...');
      
      // Test connection
      await this.testConnection();
      
      // Create tables
      await this.createTables();
      
      // Insert sample data
      await this.insertSampleData();
      
      console.log('✅ Database initialization completed successfully!');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW()');
      console.log('✅ Database connection successful:', result.rows[0].now);
      client.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async createTables() {
    const fs = require('fs');
    const path = require('path');
    
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      await this.pool.query(schema);
      console.log('✅ Database tables created successfully');
    } catch (error) {
      console.error('❌ Error creating tables:', error);
      throw error;
    }
  }

  async insertSampleData() {
    try {
      // Insert sample market data
      const sampleMarketData = [
        {
          date: new Date().toISOString().split('T')[0],
          competitor: 'Apple',
          data_type: 'analysis',
          raw_data: { source: 'sample', content: 'Sample market analysis' },
          processed_data: { summary: 'Sample processed data' },
          sentiment_score: 0.8,
          confidence_score: 0.9
        }
      ];

      for (const data of sampleMarketData) {
        await this.pool.query(
          `INSERT INTO market_data (date, competitor, data_type, raw_data, processed_data, sentiment_score, confidence_score)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT DO NOTHING`,
          [data.date, data.competitor, data.data_type, JSON.stringify(data.raw_data), 
           JSON.stringify(data.processed_data), data.sentiment_score, data.confidence_score]
        );
      }

      console.log('✅ Sample data inserted successfully');
    } catch (error) {
      console.error('❌ Error inserting sample data:', error);
      throw error;
    }
  }

  async getCompetitors() {
    try {
      const result = await this.pool.query('SELECT * FROM competitors WHERE is_active = TRUE');
      return result.rows;
    } catch (error) {
      console.error('❌ Error fetching competitors:', error);
      throw error;
    }
  }

  async insertMarketData(data) {
    try {
      const query = `
        INSERT INTO market_data (date, competitor, data_type, raw_data, processed_data, sentiment_score, confidence_score)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;
      
      const values = [
        data.date || new Date().toISOString().split('T')[0],
        data.competitor,
        data.data_type,
        JSON.stringify(data.raw_data),
        JSON.stringify(data.processed_data),
        data.sentiment_score,
        data.confidence_score
      ];

      const result = await this.pool.query(query, values);
      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Error inserting market data:', error);
      throw error;
    }
  }

  async getDailyInsights(date) {
    try {
      const result = await this.pool.query(
        'SELECT * FROM daily_insights WHERE date = $1',
        [date]
      );
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error fetching daily insights:', error);
      throw error;
    }
  }

  async insertDailyInsights(insights) {
    try {
      const query = `
        INSERT INTO daily_insights (date, market_summary, key_insights, sentiment_overview, stock_performance, competitor_activities, ai_analysis)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (date) DO UPDATE SET
          market_summary = EXCLUDED.market_summary,
          key_insights = EXCLUDED.key_insights,
          sentiment_overview = EXCLUDED.sentiment_overview,
          stock_performance = EXCLUDED.stock_performance,
          competitor_activities = EXCLUDED.competitor_activities,
          ai_analysis = EXCLUDED.ai_analysis,
          updated_at = NOW()
        RETURNING id
      `;

      const values = [
        insights.date,
        insights.market_summary,
        JSON.stringify(insights.key_insights),
        JSON.stringify(insights.sentiment_overview),
        JSON.stringify(insights.stock_performance),
        JSON.stringify(insights.competitor_activities),
        insights.ai_analysis
      ];

      const result = await this.pool.query(query, values);
      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Error inserting daily insights:', error);
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

// Export for use in n8n workflows
module.exports = DatabaseSetup;

// Run setup if called directly
if (require.main === module) {
  const setup = new DatabaseSetup();
  setup.initialize()
    .then(() => {
      console.log('🎉 Setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}
