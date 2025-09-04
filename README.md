# TrendSage - Automated Market Insights Pipeline

## 🚀 Overview
An automated data pipeline that collects, processes, and analyzes market data to provide daily insights on competitors, market trends, and sentiment analysis.

## 🔧 Features
- **Daily Automation**: Runs every day at 9 AM
- **Multi-Source Data Collection**: 
  - Competitor website/blog scraping
  - Twitter API integration
  - Yahoo Finance stock data
  - Google News API
- **AI Processing**: 
  - OpenAI-powered summarization
  - Sentiment analysis
- **Storage**: PostgreSQL/Supabase integration
- **Visualization**: Auto-updating dashboards
- **Notifications**: Slack/Telegram reports

## 📋 Prerequisites
- n8n instance (local or cloud)
- API keys for:
  - Twitter API v2
  - OpenAI API
  - Yahoo Finance (free)
  - Google News API
  - Slack/Telegram webhooks
- PostgreSQL database or Supabase account

## 🛠️ Setup
1. Install dependencies: `npm install`
2. Configure environment variables
3. Import the workflow into n8n
4. Set up your API credentials
5. Configure database connections

## 📊 Workflow Structure
1. **Trigger**: Cron job (daily at 9 AM)
2. **Data Collection**: Multiple parallel data sources
3. **AI Processing**: Summarization and sentiment analysis
4. **Storage**: Database insertion
5. **Visualization**: Dashboard updates
6. **Notifications**: Alert distribution

## 🔑 Environment Variables
```bash
TWITTER_BEARER_TOKEN=your_twitter_token
OPENAI_API_KEY=your_openai_key
YAHOO_FINANCE_API_KEY=your_yahoo_key
GOOGLE_NEWS_API_KEY=your_google_news_key
SLACK_WEBHOOK_URL=your_slack_webhook
TELEGRAM_BOT_TOKEN=your_telegram_token
DATABASE_URL=your_database_url
```

## 📈 Usage
Once configured, the workflow will automatically:
- Collect data every morning at 9 AM
- Process and analyze the information
- Store results in your database
- Update dashboards
- Send summary reports via Slack/Telegram

## 🔄 Customization
- Modify cron schedule in the trigger node
- Add/remove data sources in collection nodes
- Adjust AI prompts for different analysis types
- Customize notification templates
- Add new visualization components

## 🚀 Quick Start
```bash
# Run the demo
node demo-pipeline.js

# Run the full pipeline
node working-pipeline.js

# Start daily automation
node schedule.js
```

## 📁 Project Files
- `working-pipeline.js` - Main data collection and processing
- `demo-pipeline.js` - Demonstration with sample data
- `schedule.js` - Daily automation scheduler
- `market-insights-workflow.json` - Complete n8n workflow
- `database/schema.sql` - Database schema
- `dashboard/` - Dashboard configurations
- `notifications/` - Notification templates
