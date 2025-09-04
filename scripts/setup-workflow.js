#!/usr/bin/env node

// TrendSage Workflow Setup Script
// This script helps set up the n8n workflow with proper configuration

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class WorkflowSetup {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.config = {};
  }

  async setup() {
    console.log('🚀 Welcome to TrendSage Market Insights Setup!');
    console.log('This script will help you configure your n8n workflow.\n');

    try {
      await this.collectConfiguration();
      await this.validateConfiguration();
      await this.createEnvironmentFile();
      await this.setupDatabase();
      await this.importWorkflow();
      await this.createSetupInstructions();
      
      console.log('\n✅ Setup completed successfully!');
      console.log('📋 Next steps:');
      console.log('1. Start n8n: npm start');
      console.log('2. Import the workflow from: market-insights-workflow.json');
      console.log('3. Configure your API credentials in n8n');
      console.log('4. Test the workflow manually first');
      console.log('5. Enable the workflow for automatic execution');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async collectConfiguration() {
    console.log('📝 Configuration Collection\n');

    // API Keys
    this.config.twitter_bearer_token = await this.askQuestion('Enter your Twitter Bearer Token: ');
    this.config.openai_api_key = await this.askQuestion('Enter your OpenAI API Key: ');
    this.config.yahoo_finance_api_key = await this.askQuestion('Enter your Yahoo Finance API Key (optional): ');
    this.config.google_news_api_key = await this.askQuestion('Enter your Google News API Key: ');

    // Database Configuration
    console.log('\n🗄️ Database Configuration');
    const useSupabase = await this.askYesNo('Do you want to use Supabase? (y/n): ');
    
    if (useSupabase) {
      this.config.supabase_url = await this.askQuestion('Enter your Supabase URL: ');
      this.config.supabase_anon_key = await this.askQuestion('Enter your Supabase Anon Key: ');
    } else {
      this.config.database_url = await this.askQuestion('Enter your PostgreSQL connection string: ');
    }

    // Notification Configuration
    console.log('\n📱 Notification Configuration');
    const useSlack = await this.askYesNo('Do you want to use Slack notifications? (y/n): ');
    if (useSlack) {
      this.config.slack_webhook_url = await this.askQuestion('Enter your Slack webhook URL: ');
    }

    const useTelegram = await this.askYesNo('Do you want to use Telegram notifications? (y/n): ');
    if (useTelegram) {
      this.config.telegram_bot_token = await this.askQuestion('Enter your Telegram bot token: ');
      this.config.telegram_chat_id = await this.askQuestion('Enter your Telegram chat ID: ');
    }

    // Competitor Configuration
    console.log('\n🏢 Competitor Configuration');
    this.config.competitor_websites = await this.askQuestion('Enter competitor websites (comma-separated): ');
    this.config.competitor_twitter_handles = await this.askQuestion('Enter competitor Twitter handles (comma-separated): ');
    this.config.competitor_stock_symbols = await this.askQuestion('Enter competitor stock symbols (comma-separated): ');

    // n8n Configuration
    console.log('\n⚙️ n8n Configuration');
    this.config.n8n_basic_auth_user = await this.askQuestion('Enter n8n admin username: ');
    this.config.n8n_basic_auth_password = await this.askQuestion('Enter n8n admin password: ');
  }

  async validateConfiguration() {
    console.log('\n🔍 Validating configuration...');

    const required = [
      'twitter_bearer_token',
      'openai_api_key',
      'google_news_api_key'
    ];

    for (const field of required) {
      if (!this.config[field]) {
        throw new Error(`Required field missing: ${field}`);
      }
    }

    if (!this.config.database_url && !this.config.supabase_url) {
      throw new Error('Database configuration is required');
    }

    console.log('✅ Configuration validation passed');
  }

  async createEnvironmentFile() {
    console.log('\n📄 Creating environment file...');

    const envContent = Object.entries(this.config)
      .map(([key, value]) => `${key.toUpperCase()}=${value}`)
      .join('\n');

    fs.writeFileSync('.env', envContent);
    console.log('✅ Environment file created: .env');
  }

  async setupDatabase() {
    console.log('\n🗄️ Setting up database...');

    try {
      const DatabaseSetup = require('./database/setup.js');
      const dbSetup = new DatabaseSetup();
      await dbSetup.initialize();
      console.log('✅ Database setup completed');
    } catch (error) {
      console.log('⚠️ Database setup failed, but continuing...');
      console.log('You can run the database setup manually later');
    }
  }

  async importWorkflow() {
    console.log('\n📋 Workflow import instructions...');
    
    const workflowPath = path.join(__dirname, '..', 'market-insights-workflow.json');
    if (fs.existsSync(workflowPath)) {
      console.log('✅ Workflow file found: market-insights-workflow.json');
      console.log('📝 To import:');
      console.log('1. Open n8n in your browser');
      console.log('2. Go to Workflows');
      console.log('3. Click "Import from file"');
      console.log('4. Select: market-insights-workflow.json');
    } else {
      console.log('❌ Workflow file not found');
    }
  }

  async createSetupInstructions() {
    console.log('\n📖 Creating setup instructions...');

    const instructions = `
# TrendSage Setup Instructions

## 1. Start n8n
\`\`\`bash
npm start
\`\`\`

## 2. Import Workflow
1. Open n8n in your browser (usually http://localhost:5678)
2. Go to Workflows
3. Click "Import from file"
4. Select: market-insights-workflow.json

## 3. Configure Credentials
In n8n, go to Settings > Credentials and add:

### Twitter API
- Type: Twitter OAuth2 API
- Bearer Token: ${this.config.twitter_bearer_token}

### OpenAI
- Type: OpenAI
- API Key: ${this.config.openai_api_key}

### Database
- Type: PostgreSQL
- Connection String: ${this.config.database_url || this.config.supabase_url}

### Notifications
${this.config.slack_webhook_url ? '- Slack Webhook: ' + this.config.slack_webhook_url : ''}
${this.config.telegram_bot_token ? '- Telegram Bot Token: ' + this.config.telegram_bot_token : ''}

## 4. Test Workflow
1. Open the imported workflow
2. Click "Execute Workflow" to test manually
3. Check all nodes are working correctly

## 5. Enable Automation
1. Click the "Active" toggle in the workflow
2. The workflow will now run daily at 9 AM

## 6. Monitor Results
- Check your Slack/Telegram for daily reports
- View data in your database
- Set up dashboards using the provided configurations

## Troubleshooting
- Check n8n execution logs for errors
- Verify all API keys are valid
- Ensure database connection is working
- Test individual nodes if workflow fails

## Support
For issues, check the n8n documentation or create an issue in the project repository.
`;

    fs.writeFileSync('SETUP_INSTRUCTIONS.md', instructions);
    console.log('✅ Setup instructions created: SETUP_INSTRUCTIONS.md');
  }

  askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  askYesNo(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.toLowerCase().startsWith('y'));
      });
    });
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new WorkflowSetup();
  setup.setup().catch(console.error);
}

module.exports = WorkflowSetup;
