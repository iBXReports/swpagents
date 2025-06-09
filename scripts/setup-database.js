/**
 * Database Setup Script for Swissport Intranet
 * 
 * This script helps set up the initial database structure and data
 * Run with: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up Swissport Intranet Database...')
  
  try {
    // Test connection
    console.log('📡 Testing database connection...')
    const { data, error } = await supabase.from('agentes').select('count').limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      console.log('\n📋 Please run the SQL schema first:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Run the contents of database/schema.sql')
      return
    }
    
    console.log('✅ Database connection successful')
    
    // Check if tables exist and have data
    console.log('📊 Checking database structure...')
    
    const tables = ['agentes', 'turnos', 'asignaciones', 'vuelos']
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`⚠️  Table '${table}' not found or accessible`)
      } else {
        console.log(`✅ Table '${table}' exists with ${count} records`)
      }
    }
    
    // Create sample data if needed
    await createSampleData()
    
    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Open http://localhost:3000')
    console.log('3. Register a new user or use sample credentials')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

async function createSampleData() {
  console.log('📝 Creating sample data...')
  
  try {
    // Check if we already have sample data
    const { data: existingAgents } = await supabase
      .from('agentes')
      .select('id')
      .limit(1)
    
    if (existingAgents && existingAgents.length > 0) {
      console.log('ℹ️  Sample data already exists, skipping creation')
      return
    }
    
    // Create sample flights
    const sampleFlights = [
      {
        numero_vuelo: 'AV123',
        tipo_vuelo: 'Nacional',
        terminal: 'Terminal 1 NAC',
        puente: 'A1',
        estado: 'Abierto'
      },
      {
        numero_vuelo: 'CM456',
        tipo_vuelo: 'Internacional',
        terminal: 'Terminal 2 INTER',
        puente: 'B3',
        estado: 'Cerrado'
      },
      {
        numero_vuelo: 'LA789',
        tipo_vuelo: 'Internacional',
        terminal: 'Terminal 2 INTER',
        puente: 'B5',
        estado: 'Abierto'
      }
    ]
    
    const { error: flightsError } = await supabase
      .from('vuelos')
      .insert(sampleFlights)
    
    if (flightsError) {
      console.log('⚠️  Could not create sample flights:', flightsError.message)
    } else {
      console.log('✅ Sample flights created')
    }
    
    console.log('✅ Sample data creation completed')
    
  } catch (error) {
    console.log('⚠️  Could not create sample data:', error.message)
  }
}

// Run the setup
setupDatabase()
