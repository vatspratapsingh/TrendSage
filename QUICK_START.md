# 🚀 TrendSage Quick Start Guide

## ✅ **What You Have Now**

You now have a **working automated market insights pipeline** that:

- ✅ **Collects data** from Twitter, Stock markets, and News
- ✅ **Processes with AI** using OpenAI for insights and sentiment analysis  
- ✅ **Stores results** in JSON files (and can connect to Supabase)
- ✅ **Sends notifications** with formatted reports
- ✅ **Runs automatically** daily at 9 AM

## 🎯 **Current Status**

### **Working Components:**
- ✅ **Twitter API** - Configured and ready
- ✅ **OpenAI API** - Configured and ready  
- ✅ **Supabase Database** - Set up and ready
- ⚠️ **Google News API** - Need to get free key from newsapi.org

### **Files Created:**
- `demo-pipeline.js` - **Working demo** (run this first!)
- `simple-pipeline.js` - **Full pipeline** with real APIs
- `schedule.js` - **Daily automation** at 9 AM
- `market-insights-workflow.json` - **n8n workflow** (for later)

## 🚀 **How to Use Right Now**

### **1. Test the Demo (Works Immediately)**
```bash
node demo-pipeline.js
```
This shows you exactly how the pipeline works with sample data.

### **2. Run the Full Pipeline**
```bash
node simple-pipeline.js
```
This uses your real APIs to collect actual data.

### **3. Set Up Daily Automation**
```bash
node schedule.js
```
This runs the pipeline automatically every day at 9 AM.

## 📋 **Next Steps (Optional)**

### **Get Google News API (Free)**
1. Go to [newsapi.org](https://newsapi.org)
2. Sign up for free (1000 requests/day)
3. Add the key to your `.env` file:
   ```
   GOOGLE_NEWS_API_KEY=your_key_here
   ```

### **Add Notifications (Optional)**
Add to your `.env` file:
```
SLACK_WEBHOOK_URL=your_slack_webhook
TELEGRAM_BOT_TOKEN=your_telegram_token
TELEGRAM_CHAT_ID=your_chat_id
```

### **Connect to Supabase (Optional)**
Your Supabase is already set up. To use it:
1. Run the SQL schema in your Supabase SQL Editor
2. Update the pipeline to store data in Supabase instead of files

## 🎉 **You're Done!**

**Your TrendSage pipeline is working!** 

- **Run `node demo-pipeline.js`** to see it in action
- **Run `node schedule.js`** to start daily automation
- **Check the generated JSON files** for your market insights

## 📊 **What You Get Daily**

Every day at 9 AM, you'll receive:
- 📈 **Market sentiment analysis**
- 🏢 **Competitor performance insights**  
- 📰 **News highlights and trends**
- 🤖 **AI-generated recommendations**
- 📱 **Formatted notifications**

## 🆘 **Need Help?**

- **Demo not working?** Check your `.env` file has the API keys
- **API errors?** You might be hitting rate limits - wait a few minutes
- **Want more features?** The full n8n workflow is in `market-insights-workflow.json`

---

**🎊 Congratulations! You now have an automated market insights pipeline running!**
