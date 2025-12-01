import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srpqvtkliesdfnqirdpt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHF2dGtsaWVzZGZucWlyZHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjAxOTIsImV4cCI6MjA4MDEzNjE5Mn0.CzOH1TAUzc-CgcVMikENAQZHaJRaRPnjO-b4vvl8uIs';

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
    { name: 'Cyber_Alice', question: '如果可以把意識上傳到一本書裡，你會選哪一本？' },
    { name: 'Neo_Reader', question: '你覺得最接近現實的科幻小說是哪一本？' },
    { name: 'Book_Worm_2077', question: '如果有时光机，你想回到过去见哪位作者？' },
    { name: 'Galaxy_Hitchhiker', question: '去火星殖民只能帶一本書，你會帶什麼？' },
    { name: 'Proton_Page', question: '如果能瞬間學會一項技能，你會選什麼？' },
    { name: 'Quantum_Cat', question: '你相信平行宇宙存在嗎？為什麼？' },
    { name: 'Data_Miner', question: 'AI 寫的小說你會想看嗎？' },
    { name: 'Neural_Link', question: '如果可以刪除一段記憶，你會刪除什麼？' }
];

async function seed() {
    console.log('Starting seed...');

    for (const user of testUsers) {
        const { error } = await supabase
            .from('participants')
            .insert({
                name: user.name,
                question: user.question,
                is_active: true
            });

        if (error) console.error('Error inserting', user.name, error);
        else console.log('Inserted:', user.name);
    }

    console.log('Seed complete!');
}

seed();
