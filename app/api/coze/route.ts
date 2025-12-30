import { NextRequest, NextResponse } from 'next/server';
import { CozeWorkflowRequest, CozeStreamResponse } from '@/types/coze';

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

    // 构建 Coze API 请求 - 确保格式与官方文档一致
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
      }//,
      //is_async: true
    };

    log('发送到 Coze API 的请求:', JSON.stringify(cozeRequest, null, 2));
    log('Authorization Header:', authorizationHeader);
    log('请求URL:', 'https://api.coze.cn/v1/workflow/stream_run');

    // 直接调用工作流API，不进行预验证

    // 调用 Coze API
    const apiUrl = 'https://api.coze.cn/v1/workflow/stream_run';
    //const apiUrl = 'https://api.coze.cn/v1/workflow/run';
    log('调用API URL:', apiUrl);
    
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
      console.error('Coze API 错误详情:');
      console.error('- 状态码:', cozeResponse.status);
      console.error('- 状态文本:', cozeResponse.statusText);
      console.error('- 错误内容:', errorText);
      console.error('- 请求URL:', apiUrl);
      console.error('- Authorization Header:', authorizationHeader);
      console.error('- 原始token:', authToken);
      console.error('- 请求体:', JSON.stringify(cozeRequest, null, 2));
      
      return NextResponse.json(
        { 
          error: `Coze API 错误: ${cozeResponse.status} - ${errorText}`,
          details: {
            status: cozeResponse.status,
            statusText: cozeResponse.statusText,
            url: apiUrl,
            authHeader: authorizationHeader
          }
        },
        { status: cozeResponse.status }
      );
    }

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const reader = cozeResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const jsonData: CozeStreamResponse = JSON.parse(data);
                  log('API路由收到完整数据:', jsonData);
                  
                  // 根据Coze官方文档处理不同事件类型
                  const event = jsonData.event;
                  const content = jsonData.content;
                  const code = jsonData.code;
                  const errorCode = jsonData.error_code;
                  const errorMessage = jsonData.error_message;
                  const nodeTitle = jsonData.node_title;
                  const nodeId = jsonData.node_id;
                  const logid = jsonData.logid;
                  
                  log('事件类型:', event, '节点:', nodeTitle, '内容长度:', content?.length || 0);
                  
                  if (event === 'Message') {
                    // 工作流节点输出消息
                    if (content) {
                      log('发送消息内容到客户端:', content);
                      controller.enqueue(
                        new TextEncoder().encode(`data: ${JSON.stringify({ 
                          content, 
                          event: 'Message',
                          nodeTitle,
                          nodeId,
                          logid
                        })}\n\n`)
                      );
                    }
                  } else if (event === 'Error') {
                    // 报错处理
                    log('检测到错误:', { errorCode, errorMessage, code, logid });
                    
                    let errorContent = '';
                    if (errorCode !== undefined) {
                      errorContent = `错误 (${errorCode}): ${errorMessage || '未知错误'}`;
                    } else if (code !== undefined && code !== 0) {
                      errorContent = `调用失败 (${code}): ${jsonData.msg || '未知错误'}`;
                    } else {
                      errorContent = '发生未知错误';
                    }
                    
                    // 特殊错误码处理
                    if (errorCode === 5000) {
                      errorContent = '参数错误';
                    }
                    
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ 
                        content: errorContent, 
                        event: 'Error', 
                        errorCode: errorCode || code,
                        logid
                      })}\n\n`)
                    );
                    controller.close();
                    return;
                  } else if (event === 'Done') {
                    // 工作流执行结束
                    log('工作流执行结束');
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ 
                        content: '工作流执行完成', 
                        event: 'Done',
                        logid
                      })}\n\n`)
                    );
                    controller.close();
                    return;
                  } else if (event === 'Interrupt') {
                    // 工作流中断
                    const interruptData = jsonData.interrupt_data;
                    log('工作流中断:', interruptData);
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ 
                        content: `工作流中断: ${interruptData || '未知原因'}`, 
                        event: 'Interrupt',
                        logid
                      })}\n\n`)
                    );
                    controller.close();
                    return;
                  } else {
                    // 处理其他情况或没有event字段的旧格式
                    if (content) {
                      log('发送内容到客户端:', content);
                      controller.enqueue(
                        new TextEncoder().encode(`data: ${JSON.stringify({ 
                          content,
                          logid
                        })}\n\n`)
                      );
                    }
                  }
                } catch (parseError) {
                  console.warn(`[${new Date().toISOString()}]`, '解析 JSON 失败:', parseError, '原始数据:', data);
                  if (data.trim()) {
                    log('发送原始数据到客户端:', data);
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ content: data })}\n\n`)
                    );
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('流式读取错误:', error);
          controller.error(error);
        } finally {
          log('流式响应结束，发送[DONE]信号');
          // 确保发送结束信号
          controller.enqueue(
            new TextEncoder().encode(`data: [DONE]\n\n`)
          );
          controller.close();
          reader.releaseLock();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('API 路由错误:', error);
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
