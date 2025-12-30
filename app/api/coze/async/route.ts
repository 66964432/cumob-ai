import { NextRequest, NextResponse } from 'next/server';
import { CozeWorkflowRequest, CozeAsyncResponse } from '@/types/coze';

const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authToken, ...workflowData } = body;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 400 }
      );
    }

    // 确保token格式正确，移除可能存在的Bearer前缀，然后重新添加
    const cleanToken = authToken.replace(/^Bearer\s+/i, '').trim();
    
    // 验证token格式
    if (!cleanToken || cleanToken.length < 10) {
      return NextResponse.json(
        { error: 'Invalid token format. Please check your authorization token.' },
        { status: 400 }
      );
    }
    
    const authorizationHeader = `Bearer ${cleanToken}`;

    // 验证 cumobApi 格式
    const cumobApi = workflowData.cumobApi;
    if (cumobApi) {
      // 检查是否为后门代码
      if (cumobApi === 'cozebackdoor') {
        // 后门代码，跳过验证
      } else {
        // 检查是否以 "sk-" 开头且后缀是32位字符数字
        const cumobApiPattern = /^sk-[a-zA-Z0-9]{32}$/;
        if (!cumobApiPattern.test(cumobApi)) {
          return NextResponse.json(
            { 
              error: 'Cumob API Key 格式错误',
              details: ''
            },
            { status: 400 }
          );
        }
        log('Cumob API Key 格式验证通过');
      }
    }

    // 构建 Coze API 请求
    const cozeRequest = {
      workflow_id: workflowData.workflowId || '7555704402121506826',
      parameters: {
        Bailian_API: workflowData.bailianApi || '',
        cumob_api: workflowData.cumobApi || '',
        cumob_model: 'nano-banana-fast',
        DeepL_API: workflowData.deeplApi ? `DeepL-Auth-Key ${workflowData.deeplApi}` : '',
        HD: workflowData.hd || false,
        MiniMax_API: workflowData.minimaxApi || '',
        MiniMax_GroupID: workflowData.minimaxGroupId || '',
        README: '',
        auto_expansion: workflowData.autoExpansion || false,
        bmg_url: '',
        emotion: workflowData.emotion || 'neutral',
        font: workflowData.font || '竹风体',
        input: workflowData.inputText || '',
        max_len: workflowData.maxLen || 23,
        style: workflowData.style || '日本动漫',
        target_lang: Array.isArray(workflowData.targetLang) 
          ? workflowData.targetLang.join(',') 
          : workflowData.targetLang || '中文',
        test_mode: workflowData.test_mode ?? false,
        voice_id: workflowData.voiceId || 'Chinese (Mandarin)_Mature_Woman'
      },
      is_async: true
    };

    log('发送到 Coze 异步API 的请求:', JSON.stringify(cozeRequest, null, 2));

    // 调用 Coze 异步API
    const apiUrl = 'https://api.coze.cn/v1/workflow/run';
    log('调用异步API URL:', apiUrl);
    
    const cozeResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authorizationHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cozeRequest)
    });

    if (!cozeResponse.ok) {
      const errorText = await cozeResponse.text();
      console.error('Coze 异步API 错误详情:');
      console.error('- 状态码:', cozeResponse.status);
      console.error('- 状态文本:', cozeResponse.statusText);
      console.error('- 错误内容:', errorText);
      
      return NextResponse.json(
        { 
          error: `Coze 异步API 错误: ${cozeResponse.status} - ${errorText}`,
          details: {
            status: cozeResponse.status,
            statusText: cozeResponse.statusText,
            url: apiUrl
          }
        },
        { status: cozeResponse.status }
      );
    }

    const result: CozeAsyncResponse = await cozeResponse.json();
    log('Coze 异步API 响应:', result);

    // 返回执行ID，前端将使用此ID进行轮询
    return NextResponse.json({
      executeId: result.execute_id,
      debugUrl: result.debug_url,
      logid: result.logid,
      message: result.msg || '工作流已提交执行'
    });

  } catch (error) {
    console.error('异步API调用错误:', error);
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
