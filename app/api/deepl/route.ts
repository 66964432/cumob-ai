import { NextRequest, NextResponse } from 'next/server';
const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args);

// DeepL API 类型定义
interface DeepLTranslationRequest {
  text: string[];
  target_lang: string;
  source_lang?: string;
  split_sentences?: '0' | '1' | 'nonewlines';
  preserve_formatting?: '0' | '1';
  formality?: 'default' | 'more' | 'less' | 'prefer_more' | 'prefer_less';
  tag_handling?: 'xml' | 'html';
  outline_detection?: '0' | '1';
  non_splitting_tags?: string[];
  splitting_tags?: string[];
  ignore_tags?: string[];
}

interface DeepLTranslationResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      text, 
      target_lang, 
      source_lang,
      split_sentences,
      preserve_formatting,
      formality,
      tag_handling,
      outline_detection,
      non_splitting_tags,
      splitting_tags,
      ignore_tags,
      api_key 
    } = body;

    // 验证必需参数
    if (!text || !Array.isArray(text) || text.length === 0) {
      return NextResponse.json(
        { error: 'Text array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!target_lang) {
      return NextResponse.json(
        { error: 'target_lang is required' },
        { status: 400 }
      );
    }

    if (!api_key) {
      return NextResponse.json(
        { error: 'DeepL API key is required' },
        { status: 400 }
      );
    }

    // 构建 DeepL API 请求体
    const deeplRequest: DeepLTranslationRequest = {
      text,
      target_lang,
      ...(source_lang && { source_lang }),
      ...(split_sentences && { split_sentences }),
      ...(preserve_formatting && { preserve_formatting }),
      ...(formality && { formality }),
      ...(tag_handling && { tag_handling }),
      ...(outline_detection && { outline_detection }),
      ...(non_splitting_tags && { non_splitting_tags }),
      ...(splitting_tags && { splitting_tags }),
      ...(ignore_tags && { ignore_tags })
    };

    log('发送到 DeepL API 的请求:', JSON.stringify(deeplRequest, null, 2));

    // 调用 DeepL API
    const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${api_key}`
      },
      body: JSON.stringify(deeplRequest)
    });

    if (!deeplResponse.ok) {
      const errorText = await deeplResponse.text();
      console.error('DeepL API 错误详情:');
      console.error('- 状态码:', deeplResponse.status);
      console.error('- 状态文本:', deeplResponse.statusText);
      console.error('- 错误内容:', errorText);
      
      return NextResponse.json(
        { 
          error: `DeepL API 错误: ${deeplResponse.status} - ${errorText}`,
          details: {
            status: deeplResponse.status,
            statusText: deeplResponse.statusText
          }
        },
        { status: deeplResponse.status }
      );
    }

    const translationData: DeepLTranslationResponse = await deeplResponse.json();
    log('DeepL API 响应:', translationData);

    return NextResponse.json(translationData);

  } catch (error) {
    console.error('DeepL API 路由错误:', error);
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
