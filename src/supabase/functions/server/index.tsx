import { Hono } from 'npm:hono';

const app = new Hono();

app.get('*', (c) => {
  return c.json({
    error: 'This function is deprecated',
    message: 'Please use make-server-7b2c3016 instead',
    instructions: 'Deploy with: supabase functions deploy make-server-7b2c3016'
  }, 410);
});

Deno.serve(app.fetch);