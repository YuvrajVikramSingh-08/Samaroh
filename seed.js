import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akegqubzhpjgicnqpgca.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrZWdxdWJ6aHBqZ2ljbnFwZ2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzQxMTEsImV4cCI6MjA5MjExMDExMX0.yBWvjThPIGWX_ce9YsTqHnpYSaa78zpv29WcUghshUE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndSeed() {
  const { data: events, error } = await supabase.from('events').select('*');
  if (error) {
    console.error("Error fetching events:", error.message);
    return;
  }
  
  if (events && events.length > 0) {
    console.log("Events found:", events.length);
    console.log(events);
    return;
  }
  
  console.log("No events found! The database is empty or blocked by RLS.");
  
  // Try inserting
  const { data: inserted, error: insertError } = await supabase.from('events').insert({
      name: 'Finals 2026',
      date: 'August 15, 2026',
      time: '18:00',
      venue: 'Wankhede Stadium, Mumbai',
      total_capacity: 50000,
      description: 'The grand finale of the premier league.'
  }).select().single();
  
  if (insertError) {
      console.error("Insert failed, possibly due to missing table or RLS:", insertError.message);
  } else {
      console.log("Successfully inserted fallback event:", inserted);
  }
}

checkAndSeed();
