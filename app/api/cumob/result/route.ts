import { NextRequest, NextResponse } from 'next/server';
const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args);

// Cumob 获取结果请求类型定义
interface CumobResultRequest {
  id: string; // 必填: 任务ID
}

// Cumob 获取结果响应类型定义
interface CumobResultResponse {
  code: number; // 0成功, -22任务不存在
  msg: string;
  data?: {
    id: string;
    results?: Array<{
      url: string;
      content: string;
    }>;
    progress?: number; // 0~100
    status?: string; // "running" | "succeeded" | "failed"
    failure_reason?: string;
    error?: string;
  };
}

const CUMOB_API_HOST = 'https://grsai.dakka.com.cn';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, api_key } = body;

    // 优先从请求头获取API密钥，如果没有则从请求体获取
    const authHeader = request.headers.get('authorization');
    let apiKey = api_key;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7); // 移除 "Bearer " 前缀
    }

    // 验证必需参数
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Cumob API key is required. Please provide it in Authorization header or api_key field.' },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // 构建请求体
    const requestBody: CumobResultRequest = { id };

    log('查询 Cumob 任务结果:', JSON.stringify(requestBody, null, 2));

    // 调用 Cumob API 获取结果
    const apiUrl = `${CUMOB_API_HOST}/v1/draw/result`;
    const cumobResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!cumobResponse.ok) {
      const errorText = await cumobResponse.text();
      console.error('Cumob Result API 错误详情:');
      console.error('- 状态码:', cumobResponse.status);
      console.error('- 状态文本:', cumobResponse.statusText);
      console.error('- 错误内容:', errorText);
      
      return NextResponse.json(
        { 
          error: `Cumob Result API 错误: ${cumobResponse.status} - ${errorText}`,
          details: {
            status: cumobResponse.status,
            statusText: cumobResponse.statusText
          }
        },
        { status: cumobResponse.status }
      );
    }

    const responseData: CumobResultResponse = await cumobResponse.json();
    log('Cumob Result API 响应:', responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Cumob Result API 路由错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
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
