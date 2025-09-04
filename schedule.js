#!/usr/bin/env node

// TrendSage Scheduler - Run the pipeline daily at 9 AM
// This script sets up automated daily execution

const cron = require('node-cron');
const TrendSageDemo = require('./demo-pipeline');

console.log('🕘 TrendSage Scheduler Starting...');
console.log('📅 Pipeline will run daily at 9:00 AM');
console.log('⏹️  Press Ctrl+C to stop\n');

// Schedule the pipeline to run daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log(`\n🚀 Running scheduled TrendSage pipeline at ${new Date().toLocaleString()}`);
  
  try {
    const pipeline = new TrendSageDemo();
    await pipeline.run();
    console.log('✅ Scheduled run completed successfully\n');
  } catch (error) {
    console.error('❌ Scheduled run failed:', error.message, '\n');
  }
}, {
  scheduled: true,
  timezone: "America/New_York" // Adjust to your timezone
});

// Run immediately for testing (optional)
console.log('🧪 Running initial test...');
const pipeline = new TrendSageDemo();
pipeline.run().then(() => {
  console.log('\n✅ Initial test completed. Scheduler is now running...');
  console.log('📅 Next scheduled run: Tomorrow at 9:00 AM');
}).catch(console.error);

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down TrendSage scheduler...');
  process.exit(0);
});
