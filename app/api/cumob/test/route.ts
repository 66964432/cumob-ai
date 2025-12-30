import { NextRequest, NextResponse } from 'next/server';
const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { api_key } = body;

    // 优先从请求头获取API密钥，如果没有则从请求体获取
    const authHeader = request.headers.get('authorization');
    let apiKey = api_key;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7); // 移除 "Bearer " 前缀
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Cumob API key is required for testing. Please provide it in Authorization header or api_key field.' },
        { status: 400 }
      );
    }

    // 测试绘图请求（使用最简单的参数）
    const testRequest = {
      model: "nano-banana-fast",
      prompt: "测试提示词",
      aspectRatio: "auto",
      webHook: "-1", // 使用轮询方式，立即返回id
      shutProgress: false
    };

    log('测试 Cumob API 连接...');

    const apiUrl = 'https://grsai.dakka.com.cn/v1/draw/nano-banana';
    const cumobResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(testRequest)
    });

    if (!cumobResponse.ok) {
      const errorText = await cumobResponse.text();
      return NextResponse.json(
        { 
          success: false,
          error: `Cumob API 测试失败: ${cumobResponse.status} - ${errorText}`,
          status: cumobResponse.status
        },
        { status: cumobResponse.status }
      );
    }

    const responseData = await cumobResponse.json();
    
    return NextResponse.json({
      success: true,
      message: 'Cumob API 连接测试成功',
      test_response: responseData,
      api_key_valid: true
    });

  } catch (error) {
    console.error('Cumob API 测试错误:', error);
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
