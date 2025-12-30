import { NextRequest, NextResponse } from 'next/server';
const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args);

// Cumob 绘图请求类型定义
interface CumobDrawRequest {
  model: string; // 必填: "nano-banana-fast" | "nano-banana"
  prompt: string; // 必填: 提示词
  aspectRatio?: string; // 选填: 图像比例，默认"auto"
  urls?: string[]; // 选填: 参考图URL数组
  webHook?: string; // 选填: 回调链接，填"-1"时立即返回id用于轮询
  shutProgress?: boolean; // 选填: 关闭进度回复，默认false
}

// Cumob 绘图响应类型定义
interface CumobDrawResponse {
  id?: string; // 当webHook="-1"时返回
  results?: Array<{
    url: string;
    content: string;
  }>;
  progress?: number; // 0~100
  status?: string; // "running" | "succeeded" | "failed"
  failure_reason?: string; // "output_moderation" | "input_moderation" | "error"
  error?: string;
}

// Webhook回调响应类型
interface CumobWebhookResponse {
  code: number; // 0为成功
  msg: string;
  data?: {
    id: string;
    results?: Array<{
      url: string;
      content: string;
    }>;
    progress?: number;
    status?: string;
    failure_reason?: string;
    error?: string;
  };
}

const CUMOB_API_HOST = 'https://grsai.dakka.com.cn';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      model,
      prompt,
      aspectRatio,
      urls,
      webHook,
      shutProgress,
      api_key 
    } = body;

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

    if (!model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 验证模型
    const validModels = ['nano-banana-fast', 'nano-banana'];
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: `Invalid model. Supported models: ${validModels.join(', ')}` },
        { status: 400 }
      );
    }

    // 构建 Cumob API 请求体
    const cumobRequest: CumobDrawRequest = {
      model,
      prompt,
      ...(aspectRatio && { aspectRatio }),
      ...(urls && Array.isArray(urls) && urls.length > 0 && { urls }),
      ...(webHook !== undefined && { webHook }),
      ...(shutProgress !== undefined && { shutProgress })
    };

    log('发送到 Cumob API 的请求:', JSON.stringify(cumobRequest, null, 2));

    // 判断是否需要流式响应
    const useStream = !webHook || webHook === '';

    // 调用 Cumob API
    // 根据文档，接口路径是固定的: /v1/draw/nano-banana
    const apiUrl = `${CUMOB_API_HOST}/v1/draw/nano-banana`;
    const cumobResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(cumobRequest)
    });

    if (!cumobResponse.ok) {
      const errorText = await cumobResponse.text();
      console.error('Cumob API 错误详情:');
      console.error('- 状态码:', cumobResponse.status);
      console.error('- 状态文本:', cumobResponse.statusText);
      console.error('- 错误内容:', errorText);
      
      return NextResponse.json(
        { 
          error: `Cumob API 错误: ${cumobResponse.status} - ${errorText}`,
          details: {
            status: cumobResponse.status,
            statusText: cumobResponse.statusText
          }
        },
        { status: cumobResponse.status }
      );
    }

    // 处理流式响应
    if (useStream && cumobResponse.body) {
      // 创建流式响应
      const reader = cumobResponse.body.getReader();
      const decoder = new TextDecoder();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                controller.close();
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.trim()) {
                  try {
                    // 尝试解析JSON（如果是完整的JSON行）
                    if (line.startsWith('{') || line.startsWith('[')) {
                      const data = JSON.parse(line);
                      controller.enqueue(new TextEncoder().encode(JSON.stringify(data) + '\n'));
                    } else {
                      // 直接发送原始数据
                      controller.enqueue(new TextEncoder().encode(line + '\n'));
                    }
                  } catch (e) {
                    // 如果不是JSON，直接发送
                    controller.enqueue(new TextEncoder().encode(line + '\n'));
                  }
                }
              }
            }
          } catch (error) {
            controller.error(error);
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // 处理非流式响应（webHook 或 立即返回id）
    const responseData: CumobDrawResponse | CumobWebhookResponse = await cumobResponse.json();
    console.log('Cumob API 响应:', responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Cumob API 路由错误:', error);
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
