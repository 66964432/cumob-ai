import { NextRequest, NextResponse } from 'next/server';
const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { api_key } = body;

    if (!api_key) {
      return NextResponse.json(
        { error: 'MiniMax API key is required for testing' },
        { status: 400 }
      );
    }

    // 测试语音合成请求
    const testRequest = {
      model: "speech-2.5-hd-preview",
      text: "微风拂过柔软的草地，清新的芳香伴随着鸟儿的歌唱。",
      language_boost: "auto",
      voice_setting: {
        voice_id: "audiobook_male_1",
        speed: 1,
        vol: 10,
        pitch: 1
      },
      audio_setting: {
        audio_sample_rate: 32000,
        bitrate: 128000,
        format: "mp3",
        channel: 2
      }
    };

    log('测试 MiniMax API 连接...');

    const minimaxResponse = await fetch('https://api.minimaxi.com/v1/t2a_async_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify(testRequest)
    });

    if (!minimaxResponse.ok) {
      const errorText = await minimaxResponse.text();
      return NextResponse.json(
        { 
          success: false,
          error: `MiniMax API 测试失败: ${minimaxResponse.status} - ${errorText}`,
          status: minimaxResponse.status
        },
        { status: minimaxResponse.status }
      );
    }

    const responseData = await minimaxResponse.json();
    
    return NextResponse.json({
      success: true,
      message: 'MiniMax API 连接测试成功',
      test_response: responseData,
      api_key_valid: true
    });

  } catch (error) {
    console.error('MiniMax API 测试错误:', error);
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
