import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srpqvtkliesdfnqirdpt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHF2dGtsaWVzZGZucWlyZHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjAxOTIsImV4cCI6MjA4MDEzNjE5Mn0.CzOH1TAUzc-CgcVMikENAQZHaJRaRPnjO-b4vvl8uIs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearData() {
    console.log('Clearing all participants...');

    const { error } = await supabase
        .from('participants')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows where ID is not empty (effectively all)

    if (error) {
        console.error('Error clearing data:', error);
    } else {
        console.log('All participants deleted successfully.');
    }
}

clearData();
