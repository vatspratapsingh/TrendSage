#!/bin/bash

# TrendSage Quick Start Script
# This script sets up the entire TrendSage pipeline in under an hour

set -e  # Exit on any error

echo "🚀 TrendSage Market Insights - Quick Start Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        echo "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_status "Node.js $(node --version) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_status "npm $(npm --version) is installed"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    print_status "Dependencies installed"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f "env.example" ]; then
            cp env.example .env
            print_status ".env file created from template"
            print_warning "Please edit .env file with your API keys before continuing"
            echo ""
            echo "Required API keys:"
            echo "- TWITTER_BEARER_TOKEN"
            echo "- OPENAI_API_KEY"
            echo "- GOOGLE_NEWS_API_KEY"
            echo "- Database connection (DATABASE_URL or SUPABASE_URL)"
            echo ""
            read -p "Press Enter after you've configured the .env file..."
        else
            print_error "env.example file not found. Please create .env file manually."
            exit 1
        fi
    else
        print_status ".env file found"
    fi
}

# Setup database
setup_database() {
    print_info "Setting up database..."
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=" .env && ! grep -q "DATABASE_URL=$" .env; then
        print_info "Using PostgreSQL database..."
        node database/setup.js
    elif grep -q "SUPABASE_URL=" .env && ! grep -q "SUPABASE_URL=$" .env; then
        print_info "Using Supabase database..."
        node database/setup.js
    else
        print_warning "No database configuration found in .env file"
        print_info "You can set up the database later by running: node database/setup.js"
    fi
}

# Check if n8n is installed globally
check_n8n() {
    if ! command -v n8n &> /dev/null; then
        print_info "Installing n8n globally..."
        npm install -g n8n
        print_status "n8n installed globally"
    else
        print_status "n8n is already installed"
    fi
}

# Create n8n configuration
create_n8n_config() {
    print_info "Creating n8n configuration..."
    
    # Create .n8n directory if it doesn't exist
    mkdir -p ~/.n8n
    
    # Create basic n8n configuration
    cat > ~/.n8n/config.js << EOF
module.exports = {
    database: {
        type: 'postgresql',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'n8n',
    },
    credentials: {
        overwrite: {
            data: {
                encryptionKey: process.env.N8N_ENCRYPTION_KEY || 'your-encryption-key-here'
            }
        }
    },
    security: {
        audit: {
            daysAbandonedWorkflow: 90
        }
    }
};
EOF
    
    print_status "n8n configuration created"
}

# Start n8n in background
start_n8n() {
    print_info "Starting n8n..."
    
    # Kill any existing n8n processes
    pkill -f n8n || true
    
    # Start n8n in background
    nohup n8n start > n8n.log 2>&1 &
    N8N_PID=$!
    echo $N8N_PID > n8n.pid
    
    # Wait for n8n to start
    print_info "Waiting for n8n to start..."
    sleep 10
    
    # Check if n8n is running
    if ps -p $N8N_PID > /dev/null; then
        print_status "n8n started successfully (PID: $N8N_PID)"
        print_info "n8n is available at: http://localhost:5678"
    else
        print_error "Failed to start n8n. Check n8n.log for details."
        exit 1
    fi
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 TrendSage setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo ""
    echo "1. 🌐 Open n8n in your browser:"
    echo "   http://localhost:5678"
    echo ""
    echo "2. 📥 Import the workflow:"
    echo "   - Go to Workflows"
    echo "   - Click 'Import from file'"
    echo "   - Select: market-insights-workflow.json"
    echo ""
    echo "3. 🔑 Configure credentials in n8n:"
    echo "   - Go to Settings > Credentials"
    echo "   - Add your API keys"
    echo ""
    echo "4. 🧪 Test the workflow:"
    echo "   - Open the imported workflow"
    echo "   - Click 'Execute Workflow' to test"
    echo ""
    echo "5. ✅ Activate automation:"
    echo "   - Toggle the 'Active' switch"
    echo "   - Workflow will run daily at 9 AM"
    echo ""
    echo "📊 Dashboard Setup:"
    echo "=================="
    echo "- Metabase: Use dashboard/metabase-config.json"
    echo "- Google Data Studio: Use dashboard/google-data-studio-config.json"
    echo ""
    echo "📚 Documentation:"
    echo "================="
    echo "- Setup Guide: DEPLOYMENT.md"
    echo "- API Documentation: README.md"
    echo ""
    echo "🆘 Support:"
    echo "==========="
    echo "- Check n8n logs: tail -f n8n.log"
    echo "- Stop n8n: kill \$(cat n8n.pid)"
    echo "- Restart n8n: n8n start"
    echo ""
    print_status "Setup completed! Happy analyzing! 🚀"
}

# Main execution
main() {
    echo "Starting TrendSage setup..."
    echo ""
    
    check_nodejs
    check_npm
    install_dependencies
    check_env_file
    setup_database
    check_n8n
    create_n8n_config
    start_n8n
    show_next_steps
}

# Run main function
main "$@"
