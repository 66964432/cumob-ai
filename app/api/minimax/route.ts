import { NextRequest, NextResponse } from 'next/server';
const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args);

// MiniMax 语音合成请求类型定义
interface MiniMaxT2ARequest {
  model: string;
  text_file_id?: string; // 文件输入
  text?: string; // 文本输入
  language_boost?: string;
  voice_setting?: {
    voice_id: string;
    speed: number;
    vol: number;
    pitch: number;
  };
  pronunciation_dict?: {
    tone: string[];
  };
  audio_setting?: {
    audio_sample_rate: number;
    bitrate: number;
    format: string;
    channel: number;
  };
  voice_modify?: {
    pitch: number;
    intensity: number;
    timbre: number;
    sound_effects: string;
  };
}

// MiniMax 语音合成响应类型定义
interface MiniMaxT2AResponse {
  code: number;
  message: string;
  data?: {
    task_id: string;
    status: string;
    audio_url?: string;
    duration?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      model,
      text_file_id,
      text,
      language_boost,
      voice_setting,
      pronunciation_dict,
      audio_setting,
      voice_modify,
      api_key 
    } = body;

    // 验证必需参数
    if (!api_key) {
      return NextResponse.json(
        { error: 'MiniMax API key is required' },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    // 验证输入方式：必须提供text或text_file_id之一
    if (!text && !text_file_id) {
      return NextResponse.json(
        { error: 'Either text or text_file_id is required' },
        { status: 400 }
      );
    }

    if (text && text_file_id) {
      return NextResponse.json(
        { error: 'Cannot provide both text and text_file_id' },
        { status: 400 }
      );
    }

    // 构建 MiniMax API 请求体
    const minimaxRequest: MiniMaxT2ARequest = {
      model,
      ...(text_file_id && { text_file_id }),
      ...(text && { text }),
      ...(language_boost && { language_boost }),
      ...(voice_setting && { voice_setting }),
      ...(pronunciation_dict && { pronunciation_dict }),
      ...(audio_setting && { audio_setting }),
      ...(voice_modify && { voice_modify })
    };

    log('发送到 MiniMax API 的请求:', JSON.stringify(minimaxRequest, null, 2));

    // 调用 MiniMax API
    const minimaxResponse = await fetch('https://api.minimaxi.com/v1/t2a_async_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify(minimaxRequest)
    });

    if (!minimaxResponse.ok) {
      const errorText = await minimaxResponse.text();
      console.error('MiniMax API 错误详情:');
      console.error('- 状态码:', minimaxResponse.status);
      console.error('- 状态文本:', minimaxResponse.statusText);
      console.error('- 错误内容:', errorText);
      
      return NextResponse.json(
        { 
          error: `MiniMax API 错误: ${minimaxResponse.status} - ${errorText}`,
          details: {
            status: minimaxResponse.status,
            statusText: minimaxResponse.statusText
          }
        },
        { status: minimaxResponse.status }
      );
    }

    const responseData: MiniMaxT2AResponse = await minimaxResponse.json();
    log('MiniMax API 响应:', responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('MiniMax API 路由错误:', error);
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
