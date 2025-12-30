import { NextRequest, NextResponse } from 'next/server';
import { CozeAsyncResponse } from '@/types/coze';

const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authToken, executeId, workflowId } = body;

    if (!authToken || !executeId || !workflowId) {
      return NextResponse.json(
        { error: 'Authorization token, execute ID and workflow ID are required' },
        { status: 400 }
      );
    }

    // 确保token格式正确
    const cleanToken = authToken.replace(/^Bearer\s+/i, '').trim();
    const authorizationHeader = `Bearer ${cleanToken}`;

    // 调用 Coze 查询执行结果API - 使用正确的URL格式
    const apiUrl = `https://api.coze.cn/v1/workflows/${workflowId}/run_histories/${executeId}`;
  log('查询执行结果 URL:', apiUrl);
    
    const cozeResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorizationHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!cozeResponse.ok) {
      const errorText = await cozeResponse.text();
  console.error(`[${new Date().toISOString()}]`, '查询执行结果错误:');
  console.error(`[${new Date().toISOString()}]`, '- 状态码:', cozeResponse.status);
  console.error(`[${new Date().toISOString()}]`, '- 错误内容:', errorText);
      
      return NextResponse.json(
        { 
          error: `查询执行结果错误: ${cozeResponse.status} - ${errorText}`,
          details: {
            status: cozeResponse.status,
            statusText: cozeResponse.statusText,
            executeId
          }
        },
        { status: cozeResponse.status }
      );
    }

    const result: CozeAsyncResponse = await cozeResponse.json();
  log('执行结果:', result);

    // 检查执行状态
    if (result.code === 0) {
      // 解析data字段获取详细的执行信息
      let executionDetails = null;
      if (result.data) {
        try {
          // 检查data是否已经是对象
          if (typeof result.data === 'string') {
            executionDetails = JSON.parse(result.data);
          } else if (typeof result.data === 'object') {
            executionDetails = result.data[0];
          } else {
            console.warn(`[${new Date().toISOString()}]`, '未知的data类型:', typeof result.data, result.data);
          }
        } catch (e) {
                 console.warn(`[${new Date().toISOString()}]`, '无法解析执行结果数据:', e);
                 console.warn(`[${new Date().toISOString()}]`, '原始数据:', result.data);
        }
      }

      const executeStatus = executionDetails?.execute_status;
      log('执行状态:', executeStatus);
      log('执行详情:', executionDetails);

      // 根据execute_status判断是否继续轮询
      // 如果executeStatus为undefined或null，默认继续轮询
      const shouldContinuePolling = executeStatus === 'Running' || executeStatus === undefined || executeStatus === null;
      
      if (shouldContinuePolling) {
        // 仍在执行中，继续轮询
        log('🔄 继续轮询 - 原因:', executeStatus === 'Running' ? '状态为Running' : '状态未定义');
        return NextResponse.json({
          success: true,
          isRunning: true,
          executeStatus: executeStatus || 'Unknown',
          debugUrl: result.debug_url,
          logid: result.logid,
          message: '执行中，继续轮询...'
        });
      } else {
        // 执行完成（成功或失败）
        log('✅ 停止轮询 - 原因: 状态为', executeStatus);
        
        // 只提取execute_status和output字段
        let filteredData = null;
        if (executionDetails) {
          filteredData = {
            execute_status: executionDetails.execute_status,
            output: executionDetails.output
          };
        }
        
        return NextResponse.json({
          success: true,
          isRunning: false,
          executeStatus: executeStatus,
          data: filteredData ? JSON.stringify(filteredData) : result.data,
          debugUrl: result.debug_url,
          logid: result.logid,
          message: executeStatus === 'Success' ? '执行成功' : `执行完成，状态: ${executeStatus}`
        });
      }
    } else {
      // API调用失败
      return NextResponse.json({
        success: false,
        error: result.msg || '执行失败',
        code: result.code,
        debugUrl: result.debug_url,
        logid: result.logid
      });
    }

  } catch (error) {
  console.error(`[${new Date().toISOString()}]`, '查询执行结果错误:', error);
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
