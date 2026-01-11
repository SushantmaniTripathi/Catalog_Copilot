import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessProductRequest {
  imageBase64: string;
  transcript: string; // Now receives transcript directly instead of audio
}

interface ProductResult {
  title: string;
  description: string;
  price: number | null;
  whatsappCopy: string;
  instagramCopy: string;
  enhancedImageBase64: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, transcript }: ProcessProductRequest = await req.json();

    if (!imageBase64) {
      throw new Error('Image is required');
    }

    if (!transcript || transcript.trim().length === 0) {
      throw new Error('Voice transcript is required');
    }

    console.log('Processing product with transcript:', transcript);

    // Image is passed through as-is (already captured at reasonable resolution)
    const enhancedImageBase64 = imageBase64;

    // Generate product details using Gemini via Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a product listing assistant for small shopkeepers. 
Given a voice description of a product (which may be in any language, often Hindi or regional Indian languages mixed with English), 
extract and generate the following in clean, professional English:

1. title: A short, catchy product title (max 10 words)
2. description: A clear product description (2-3 sentences)
3. price: Extract the price if mentioned (as a number only, no currency symbol). If not mentioned, return null.
4. whatsappCopy: Ready-to-share WhatsApp message with product details, price, and a call-to-action like "DM to order!"
5. instagramCopy: Instagram-ready caption with emojis and relevant hashtags

Respond ONLY with valid JSON in this exact format:
{
  "title": "...",
  "description": "...",
  "price": 500 or null,
  "whatsappCopy": "...",
  "instagramCopy": "..."
}`;

    console.log('Calling Gemini API...');
    const geminiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Voice transcript from shopkeeper: "${transcript}"` }
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      
      if (geminiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (geminiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiResult = await geminiResponse.json();
    const aiContent = geminiResult.choices?.[0]?.message?.content || '';
    console.log('AI Response:', aiContent);

    // Parse the JSON response from Gemini
    let productData;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        productData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback with transcript
      productData = {
        title: 'Product',
        description: transcript || 'No description available',
        price: null,
        whatsappCopy: `Check out this product! ${transcript}`,
        instagramCopy: `🛍️ New arrival! ${transcript} #shopping #newproduct`,
      };
    }

    const result: ProductResult = {
      title: productData.title || 'Product',
      description: productData.description || '',
      price: productData.price,
      whatsappCopy: productData.whatsappCopy || '',
      instagramCopy: productData.instagramCopy || '',
      enhancedImageBase64,
    };

    console.log('Product processed successfully');
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing product:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
