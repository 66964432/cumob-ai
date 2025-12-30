import { NextRequest, NextResponse } from 'next/server';
const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { api_key } = body;

    if (!api_key) {
      return NextResponse.json(
        { error: 'DeepL API key is required for testing' },
        { status: 400 }
      );
    }

    // 测试翻译请求
    const testRequest = {
      text: ["Hello world!"],
      target_lang: "DE"
    };

    log('测试 DeepL API 连接...');

    const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${api_key}`
      },
      body: JSON.stringify(testRequest)
    });

    if (!deeplResponse.ok) {
      const errorText = await deeplResponse.text();
      return NextResponse.json(
        { 
          success: false,
          error: `DeepL API 测试失败: ${deeplResponse.status} - ${errorText}`,
          status: deeplResponse.status
        },
        { status: deeplResponse.status }
      );
    }

    const translationData = await deeplResponse.json();
    
    return NextResponse.json({
      success: true,
      message: 'DeepL API 连接测试成功',
      test_translation: translationData,
      api_key_valid: true
    });

  } catch (error) {
    console.error('DeepL API 测试错误:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
