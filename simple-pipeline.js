#!/usr/bin/env node

// TrendSage Simple Pipeline - No n8n needed!
// This script runs the market insights pipeline directly

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

class TrendSagePipeline {
  constructor() {
    this.competitors = [
      { name: 'Apple', handle: 'apple', symbol: 'AAPL', website: 'https://apple.com' },
      { name: 'Google', handle: 'google', symbol: 'GOOGL', website: 'https://google.com' },
      { name: 'Microsoft', handle: 'microsoft', symbol: 'MSFT', website: 'https://microsoft.com' }
    ];
  }

  async run() {
    console.log('🚀 Starting TrendSage Market Insights Pipeline...');
    
    try {
      // Step 1: Collect data from all sources
      const allData = await this.collectData();
      
      // Step 2: Process with AI
      const analysis = await this.processWithAI(allData);
      
      // Step 3: Store results
      await this.storeResults(analysis);
      
      // Step 4: Send notifications
      await this.sendNotifications(analysis);
      
      console.log('✅ Pipeline completed successfully!');
      
    } catch (error) {
      console.error('❌ Pipeline failed:', error.message);
    }
  }

  async collectData() {
    console.log('📊 Collecting data from all sources...');
    const allData = [];

    for (const competitor of this.competitors) {
      console.log(`  📱 Collecting data for ${competitor.name}...`);
      
      // Twitter data
      try {
        const twitterData = await this.getTwitterData(competitor.handle);
        allData.push({
          competitor: competitor.name,
          source: 'twitter',
          data: twitterData
        });
      } catch (error) {
        console.log(`    ⚠️ Twitter data failed for ${competitor.name}: ${error.message}`);
      }

      // Stock data
      try {
        const stockData = await this.getStockData(competitor.symbol);
        allData.push({
          competitor: competitor.name,
          source: 'stock',
          data: stockData
        });
      } catch (error) {
        console.log(`    ⚠️ Stock data failed for ${competitor.name}: ${error.message}`);
      }

      // News data
      try {
        const newsData = await this.getNewsData(competitor.name);
        allData.push({
          competitor: competitor.name,
          source: 'news',
          data: newsData
        });
      } catch (error) {
        console.log(`    ⚠️ News data failed for ${competitor.name}: ${error.message}`);
      }
    }

    return allData;
  }

  async getTwitterData(handle) {
    if (!process.env.TWITTER_BEARER_TOKEN) {
      throw new Error('Twitter Bearer Token not configured');
    }

    const response = await axios.get(`https://api.twitter.com/2/tweets/search/recent`, {
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
      },
      params: {
        query: `from:${handle}`,
        max_results: 10,
        'tweet.fields': 'created_at,public_metrics,context_annotations'
      }
    });

    return response.data;
  }

  async getStockData(symbol) {
    // Using Yahoo Finance API (free)
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    return response.data;
  }

  async getNewsData(company) {
    if (!process.env.GOOGLE_NEWS_API_KEY) {
      throw new Error('Google News API Key not configured');
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: company,
        apiKey: process.env.GOOGLE_NEWS_API_KEY,
        sortBy: 'publishedAt',
        pageSize: 10
      }
    });

    return response.data;
  }

  async processWithAI(data) {
    console.log('🤖 Processing data with AI...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API Key not configured');
    }

    const prompt = `Analyze the following market data and provide insights:

${JSON.stringify(data, null, 2)}

Please provide:
1. Overall market sentiment (positive/negative/neutral)
2. Key insights about each competitor
3. Market trends and patterns
4. Actionable recommendations

Format your response as JSON with these fields:
- overall_sentiment: number (-1 to 1)
- key_insights: array of strings
- competitor_analysis: object with competitor names as keys
- recommendations: array of strings`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a market analyst. Analyze the provided data and return structured JSON insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    
    try {
      return JSON.parse(aiResponse);
    } catch (error) {
      return {
        overall_sentiment: 0,
        key_insights: [aiResponse],
        competitor_analysis: {},
        recommendations: ['Review AI analysis manually']
      };
    }
  }

  async storeResults(analysis) {
    console.log('💾 Storing results...');
    
    const results = {
      timestamp: new Date().toISOString(),
      analysis: analysis,
      pipeline_version: '1.0.0'
    };

    // Store in local file
    const filename = `results_${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
    
    console.log(`  📄 Results saved to: ${filename}`);
  }

  async sendNotifications(analysis) {
    console.log('📱 Sending notifications...');
    
    // Create notification message
    const message = `📊 Daily Market Insights Report

🤖 Overall Sentiment: ${analysis.overall_sentiment > 0 ? '📈 Positive' : analysis.overall_sentiment < 0 ? '📉 Negative' : '➡️ Neutral'} (${analysis.overall_sentiment})

🔍 Key Insights:
${analysis.key_insights.map(insight => `• ${insight}`).join('\n')}

💡 Recommendations:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

🤖 Generated by TrendSage AI Pipeline`;

    console.log('📧 Notification Message:');
    console.log(message);
    
    // Here you could add Slack/Telegram/Email sending logic
    // For now, we'll just log it
  }
}

// Run the pipeline
if (require.main === module) {
  const pipeline = new TrendSagePipeline();
  pipeline.run().catch(console.error);
}

module.exports = TrendSagePipeline;
