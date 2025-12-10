// Supabase Edge Function: Process Data
// A function that processes JSON data and returns computed results

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 405,
        }
      );
    }

    const body = await req.json();
    const { data: inputData, operation } = body;

    if (!inputData || !Array.isArray(inputData)) {
      return new Response(
        JSON.stringify({ error: 'Invalid input. Expected { data: array, operation: string }' }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    let result: any;

    switch (operation) {
      case 'sum':
        result = {
          operation: 'sum',
          result: inputData.reduce((acc: number, val: number) => acc + val, 0),
          count: inputData.length,
        };
        break;
      
      case 'average':
        const sum = inputData.reduce((acc: number, val: number) => acc + val, 0);
        result = {
          operation: 'average',
          result: sum / inputData.length,
          count: inputData.length,
        };
        break;
      
      case 'max':
        result = {
          operation: 'max',
          result: Math.max(...inputData),
          count: inputData.length,
        };
        break;
      
      case 'min':
        result = {
          operation: 'min',
          result: Math.min(...inputData),
          count: inputData.length,
        };
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation. Use: sum, average, max, or min' }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
          }
        );
    }

    return new Response(
      JSON.stringify({
        ...result,
        timestamp: new Date().toISOString(),
        input: inputData,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

