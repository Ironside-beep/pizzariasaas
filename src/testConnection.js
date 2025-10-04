import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testConnection() {
  const { data, error } = await supabase.from('menu_items').select()
  if (error) {
    console.error('Erro de conexão ou tabela não encontrada:', error)
  } else {
    console.log('Conexão funcionando, dados da tabela:', data)
  }
}

testConnection()
