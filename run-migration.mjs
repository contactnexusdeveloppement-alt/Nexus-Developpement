import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oowoybqlxlfcuddjxnkb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vd295YnFseGxmY3VkZGp4bmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzIxNDIsImV4cCI6MjA4MjAwODE0Mn0.MDI4mXeI4OPpfoAkEmogVu_l4L9hlUQopBlG1oDMgNU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('🔄 Executing migration: Adding qualification_data column...');

    const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
      ALTER TABLE public.quote_requests 
      ADD COLUMN IF NOT EXISTS qualification_data JSONB DEFAULT NULL;
      
      COMMENT ON COLUMN public.quote_requests.qualification_data IS 'Stores qualification wizard responses in JSON format (service type, pages, features, design, technical, budget)';
    `
    });

    if (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    console.log('Column qualification_data has been added to quote_requests table.');
}

runMigration();
