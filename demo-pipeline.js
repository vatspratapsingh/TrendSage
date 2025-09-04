#!/usr/bin/env node

// TrendSage Demo Pipeline - Works with your current API setup
// This demonstrates the pipeline with sample data

const fs = require('fs');
require('dotenv').config();

class TrendSageDemo {
  constructor() {
    this.competitors = [
      { name: 'Apple', handle: 'apple', symbol: 'AAPL', website: 'https://apple.com' },
      { name: 'Google', handle: 'google', symbol: 'GOOGL', website: 'https://google.com' },
      { name: 'Microsoft', handle: 'microsoft', symbol: 'MSFT', website: 'https://microsoft.com' }
    ];
  }

  async run() {
    console.log('🚀 Starting TrendSage Market Insights Demo...');
    console.log('📊 This demo shows how the pipeline will work with your APIs\n');
    
    try {
      // Step 1: Show what data we would collect
      const sampleData = this.generateSampleData();
      
      // Step 2: Process with AI (if OpenAI key is available)
      const analysis = await this.processWithAI(sampleData);
      
      // Step 3: Store results
      this.storeResults(analysis);
      
      // Step 4: Show notifications
      this.showNotifications(analysis);
      
      console.log('\n✅ Demo completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('1. Get your Google News API key from newsapi.org');
      console.log('2. Run the full pipeline with: node simple-pipeline.js');
      console.log('3. Set up automated scheduling with cron');
      
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    }
  }

  generateSampleData() {
    console.log('📊 Sample data collection (what the pipeline would gather):');
    
    const sampleData = [];
    
    for (const competitor of this.competitors) {
      console.log(`\n  📱 ${competitor.name} data:`);
      
      // Sample Twitter data
      const twitterData = {
        tweets: [
          {
            text: `${competitor.name} announces new product innovation`,
            created_at: new Date().toISOString(),
            public_metrics: { retweet_count: 150, like_count: 500 }
          },
          {
            text: `${competitor.name} reports strong quarterly earnings`,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            public_metrics: { retweet_count: 200, like_count: 800 }
          }
        ]
      };
      
      console.log(`    🐦 Twitter: ${twitterData.tweets.length} recent tweets`);
      sampleData.push({
        competitor: competitor.name,
        source: 'twitter',
        data: twitterData
      });

      // Sample stock data
      const stockData = {
        chart: {
          result: [{
            meta: {
              symbol: competitor.symbol,
              regularMarketPrice: Math.random() * 200 + 50
            }
          }]
        }
      };
      
      console.log(`    📈 Stock: $${stockData.chart.result[0].meta.regularMarketPrice.toFixed(2)}`);
      sampleData.push({
        competitor: competitor.name,
        source: 'stock',
        data: stockData
      });

      // Sample news data
      const newsData = {
        articles: [
          {
            title: `${competitor.name} leads market innovation`,
            description: `${competitor.name} continues to drive technological advancement`,
            publishedAt: new Date().toISOString()
          }
        ]
      };
      
      console.log(`    📰 News: ${newsData.articles.length} recent articles`);
      sampleData.push({
        competitor: competitor.name,
        source: 'news',
        data: newsData
      });
    }

    return sampleData;
  }

  async processWithAI(data) {
    console.log('\n🤖 AI Analysis (using OpenAI):');
    
    if (!process.env.OPENAI_API_KEY) {
      console.log('  ⚠️ OpenAI API key not found - using sample analysis');
      return this.getSampleAnalysis();
    }

    try {
      const axios = require('axios');
      
      const prompt = `Analyze this market data and provide insights in JSON format:

${JSON.stringify(data, null, 2)}

Return JSON with:
- overall_sentiment: number (-1 to 1)
- key_insights: array of strings
- competitor_analysis: object
- recommendations: array of strings`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a market analyst. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const aiResponse = response.data.choices[0].message.content;
      console.log('  ✅ AI analysis completed');
      
      try {
        return JSON.parse(aiResponse);
      } catch (error) {
        return this.getSampleAnalysis();
      }
      
    } catch (error) {
      console.log(`  ⚠️ AI analysis failed: ${error.message}`);
      return this.getSampleAnalysis();
    }
  }

  getSampleAnalysis() {
    return {
      overall_sentiment: 0.7,
      key_insights: [
        "Technology sector showing strong growth",
        "Apple leading in innovation metrics",
        "Google maintaining search dominance",
        "Microsoft expanding cloud services"
      ],
      competitor_analysis: {
        "Apple": { sentiment: 0.8, trend: "positive" },
        "Google": { sentiment: 0.6, trend: "stable" },
        "Microsoft": { sentiment: 0.7, trend: "growing" }
      },
      recommendations: [
        "Monitor Apple's product launches closely",
        "Track Google's AI developments",
        "Watch Microsoft's enterprise growth"
      ]
    };
  }

  storeResults(analysis) {
    console.log('\n💾 Storing results:');
    
    const results = {
      timestamp: new Date().toISOString(),
      analysis: analysis,
      pipeline_version: '1.0.0-demo'
    };

    const filename = `demo_results_${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
    
    console.log(`  📄 Results saved to: ${filename}`);
  }

  showNotifications(analysis) {
    console.log('\n📱 Notification Preview:');
    console.log('='.repeat(50));
    
    const message = `📊 Daily Market Insights Report

🤖 Overall Sentiment: ${analysis.overall_sentiment > 0 ? '📈 Positive' : analysis.overall_sentiment < 0 ? '📉 Negative' : '➡️ Neutral'} (${analysis.overall_sentiment})

🔍 Key Insights:
${analysis.key_insights.map(insight => `• ${insight}`).join('\n')}

🏢 Competitor Analysis:
${Object.entries(analysis.competitor_analysis).map(([name, data]) => 
  `• ${name}: ${data.sentiment > 0 ? '📈' : '📉'} ${data.trend} (${data.sentiment})`
).join('\n')}

💡 Recommendations:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

🤖 Generated by TrendSage AI Pipeline`;

    console.log(message);
    console.log('='.repeat(50));
  }
}

// Run the demo
if (require.main === module) {
  const demo = new TrendSageDemo();
  demo.run().catch(console.error);
}

module.exports = TrendSageDemo;
