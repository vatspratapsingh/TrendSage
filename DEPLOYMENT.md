# TrendSage Deployment Guide

## 🚀 Quick Start (1 Hour Setup)

### Prerequisites
- Node.js 16+ installed
- n8n instance (local or cloud)
- API keys for required services
- PostgreSQL database or Supabase account

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Setup Script
```bash
node scripts/setup-workflow.js
```

### Step 3: Start n8n
```bash
npm start
```

### Step 4: Import Workflow
1. Open n8n (http://localhost:5678)
2. Import `market-insights-workflow.json`
3. Configure credentials
4. Test workflow
5. Activate automation

## 📋 Detailed Setup

### 1. Environment Configuration

Create a `.env` file with the following variables:

```bash
# API Keys
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
OPENAI_API_KEY=your_openai_api_key
YAHOO_FINANCE_API_KEY=your_yahoo_finance_api_key
GOOGLE_NEWS_API_KEY=your_google_news_api_key

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/trendsage
# OR for Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Competitors
COMPETITOR_WEBSITES=https://apple.com,https://google.com
COMPETITOR_TWITTER_HANDLES=@apple,@google
COMPETITOR_STOCK_SYMBOLS=AAPL,GOOGL
```

### 2. Database Setup

#### Option A: PostgreSQL (Local)
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Create database
createdb trendsage

# Run schema setup
psql trendsage < database/schema.sql
```

#### Option B: Supabase (Cloud)
1. Create account at supabase.com
2. Create new project
3. Run the SQL schema in the SQL editor
4. Get connection details from Settings > Database

### 3. API Keys Setup

#### Twitter API
1. Go to developer.twitter.com
2. Create a new app
3. Generate Bearer Token
4. Add to environment variables

#### OpenAI API
1. Go to platform.openai.com
2. Create API key
3. Add to environment variables

#### Google News API
1. Go to newsapi.org
2. Register for free API key
3. Add to environment variables

#### Yahoo Finance
- No API key required (free tier available)
- Optional: Get premium API key for higher limits

### 4. Notification Setup

#### Slack
1. Go to api.slack.com
2. Create new app
3. Enable Incoming Webhooks
4. Create webhook URL
5. Add to environment variables

#### Telegram
1. Message @BotFather on Telegram
2. Create new bot with /newbot
3. Get bot token
4. Get your chat ID (message @userinfobot)
5. Add to environment variables

### 5. n8n Configuration

#### Local Installation
```bash
npm install -g n8n
n8n start
```

#### Docker Installation
```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

#### Cloud Installation
- Use n8n Cloud (n8n.cloud)
- Or deploy on your own server

### 6. Workflow Import

1. Open n8n interface
2. Go to Workflows
3. Click "Import from file"
4. Select `market-insights-workflow.json`
5. Configure all credentials
6. Test each node individually
7. Activate the workflow

## 🔧 Customization

### Adding New Competitors
1. Update environment variables
2. Modify the data preparation node
3. Update database competitors table

### Changing Schedule
1. Edit the cron trigger node
2. Update cron expression (e.g., "0 8 * * *" for 8 AM)

### Adding Data Sources
1. Create new HTTP request nodes
2. Add data processing logic
3. Update database schema if needed

### Custom AI Prompts
1. Edit OpenAI nodes
2. Modify system and user prompts
3. Adjust temperature and max tokens

## 📊 Dashboard Setup

### Metabase
1. Install Metabase
2. Connect to your database
3. Import `dashboard/metabase-config.json`
4. Customize dashboards as needed

### Google Data Studio
1. Go to datastudio.google.com
2. Create new data source
3. Connect to your database
4. Use `dashboard/google-data-studio-config.json` as reference

## 🚨 Monitoring & Troubleshooting

### Common Issues

#### Workflow Not Running
- Check if workflow is activated
- Verify cron expression
- Check n8n execution logs

#### API Errors
- Verify API keys are correct
- Check API rate limits
- Ensure API quotas are not exceeded

#### Database Connection Issues
- Verify connection string
- Check database is running
- Ensure proper permissions

#### Notification Failures
- Verify webhook URLs
- Check bot tokens
- Test notifications manually

### Monitoring Setup

#### n8n Monitoring
- Enable webhook monitoring
- Set up error notifications
- Monitor execution history

#### Database Monitoring
- Set up query performance monitoring
- Monitor storage usage
- Check for failed queries

#### API Monitoring
- Monitor API usage
- Set up rate limit alerts
- Track API response times

## 🔒 Security Considerations

### API Keys
- Store in environment variables
- Never commit to version control
- Rotate keys regularly

### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict network access

### n8n Security
- Enable basic authentication
- Use HTTPS in production
- Regular security updates

## 📈 Scaling

### Performance Optimization
- Use database indexes
- Optimize API calls
- Implement caching

### High Availability
- Use load balancers
- Set up database replication
- Implement failover mechanisms

### Cost Optimization
- Monitor API usage
- Optimize data collection frequency
- Use efficient database queries

## 🆘 Support

### Documentation
- n8n Documentation: https://docs.n8n.io
- API Documentation: Check individual service docs

### Community
- n8n Community: https://community.n8n.io
- GitHub Issues: Create issue in project repository

### Professional Support
- n8n Enterprise Support
- Custom development services

## 📝 Maintenance

### Regular Tasks
- Update API keys
- Monitor data quality
- Review and optimize queries
- Update dependencies

### Backup Strategy
- Database backups
- Workflow exports
- Configuration backups

### Updates
- Keep n8n updated
- Update API integrations
- Monitor for breaking changes
