"use client"

import { useState, useCallback, useRef } from 'react'
const log = (...args: any[]) => console.log(`[${new Date().toISOString()}]`, ...args)
import { WorkflowFormData, StreamingState, PollingState } from '@/types/coze'

export function useCozeAPI() {
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    content: '',
    error: null,
    isComplete: false
  })
  
  const [pollingState, setPollingState] = useState<PollingState>({
    isPolling: false,
    executeId: null,
    result: '',
    error: null,
    isComplete: false
  })
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startStreaming = useCallback(async (formData: WorkflowFormData) => {
    setStreamingState({
      isStreaming: true,
      content: '',
      error: null,
      isComplete: false
    })

    try {
      const response = await fetch('/api/coze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      if (!response.body) {
        throw new Error('响应体为空')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) {
            log('流式响应结束')
            setStreamingState(prev => ({
              ...prev,
              isStreaming: false,
              isComplete: true
            }))
            break
          }
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                log('收到[DONE]信号，结束流式响应')
                setStreamingState(prev => ({
                  ...prev,
                  isStreaming: false,
                  isComplete: true
                }))
                return
              }

              try {
                const jsonData = JSON.parse(data)
                log('收到流式数据:', jsonData)
                
                // 处理不同的事件类型
                const event = jsonData.event
                const content = jsonData.content
                const nodeTitle = jsonData.nodeTitle
                const nodeId = jsonData.nodeId
                const logid = jsonData.logid
                const errorCode = jsonData.errorCode
                
                if (content) {
                  let displayContent = content
                  
                  // 根据事件类型添加前缀和详细信息
                  if (event === 'Message') {
                    // 消息内容，正常显示，可选择性显示节点信息
                    displayContent = content
                    if (nodeTitle) {
                      log(`来自节点 "${nodeTitle}" (${nodeId}) 的消息`)
                    }
                  } else if (event === 'Error') {
                    // 错误信息，添加错误标识
                    displayContent = `❌ ${content}`
                    console.error('工作流错误:', { errorCode, logid, nodeTitle })
                  } else if (event === 'Done') {
                    // 完成信息，添加完成标识
                    displayContent = `✅ ${content}`
                    log('工作流执行完成')
                  } else if (event === 'Interrupt') {
                    // 中断信息，添加中断标识
                    displayContent = `⚠️ ${content}`
                    console.warn(`[${new Date().toISOString()}]`, '工作流中断:', { logid, nodeTitle })
                  }
                  
                  // 清理JSON格式，去掉括号和引号，按行显示
                  const cleanContent = displayContent
                    .replace(/^["']|["']$/g, '') // 去掉首尾引号
                    .replace(/\\n/g, '\n') // 转换换行符
                    .replace(/\\t/g, '  ') // 转换制表符
                    .replace(/\\"/g, '"') // 转换转义引号
                    .replace(/\\'/g, "'") // 转换转义单引号
                  
                  setStreamingState(prev => ({
                    ...prev,
                    content: prev.content + cleanContent + '\n'
                  }))
                  
                  // 如果是Done事件，结束流式处理
                  if (event === 'Done') {
                    setStreamingState(prev => ({
                      ...prev,
                      isStreaming: false,
                      isComplete: true
                    }))
                    return
                  }
                  
                  // 如果是Error或Interrupt事件，结束流式处理
                  if (event === 'Error' || event === 'Interrupt') {
                    setStreamingState(prev => ({
                      ...prev,
                      isStreaming: false,
                      isComplete: false
                    }))
                    return
                  }
                }
              } catch (parseError) {
                console.warn(`[${new Date().toISOString()}]`, '解析流式数据失败:', parseError, '原始数据:', data)
                // 如果解析失败，但数据不为空，也作为内容处理
                if (data.trim()) {
                  // 清理原始数据中的JSON格式
                  const cleanData = data
                    .replace(/^["']|["']$/g, '') // 去掉首尾引号
                    .replace(/\\n/g, '\n') // 转换换行符
                    .replace(/\\t/g, '  ') // 转换制表符
                    .replace(/\\"/g, '"') // 转换转义引号
                    .replace(/\\'/g, "'") // 转换转义单引号
                  
                  setStreamingState(prev => ({
                    ...prev,
                    content: prev.content + cleanData + '\n'
                  }))
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

    } catch (error) {
      console.error(`[${new Date().toISOString()}]`, 'Coze API 调用错误:', error)
      setStreamingState(prev => ({
        ...prev,
        isStreaming: false,
        error: error instanceof Error ? error.message : '未知错误',
        isComplete: false
      }))
    }
  }, [])

  const stopStreaming = useCallback(() => {
    setStreamingState(prev => ({
      ...prev,
      isStreaming: false
    }))
  }, [])

  const clearContent = useCallback(() => {
    setStreamingState({
      isStreaming: false,
      content: '',
      error: null,
      isComplete: false
    })
  }, [])

  // 异步调用函数
  const startAsyncExecution = useCallback(async (formData: WorkflowFormData) => {
    setPollingState({
      isPolling: true,
      executeId: null,
      result: '',
      error: null,
      isComplete: false
    })

    try {
      // 提交异步执行请求
      const response = await fetch('/api/coze/async', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      log('异步执行已提交:', result)

      // 开始轮询
      setPollingState(prev => ({
        ...prev,
        executeId: result.executeId,
        debugUrl: result.debugUrl,
        logid: result.logid
      }))

      // 开始轮询结果
      startPolling(result.executeId, formData.authToken, formData.workflowId)

    } catch (error) {
      console.error(`[${new Date().toISOString()}]`, '异步执行提交错误:', error)
      setPollingState(prev => ({
        ...prev,
        isPolling: false,
        error: error instanceof Error ? error.message : '未知错误',
        isComplete: false
      }))
    }
  }, [])

  // 开始轮询
  const startPolling = useCallback((executeId: string, authToken: string, workflowId: string) => {
    let pollCount = 0;
    const poll = async () => {
      pollCount++;
      log(`🔄 开始第 ${pollCount} 次轮询 - 时间: ${new Date().toLocaleTimeString()}`);
      try {
        const response = await fetch('/api/coze/poll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authToken,
            executeId,
            workflowId
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const result = await response.json()
        log('轮询结果:', result)
        log('isRunning值:', result.isRunning, '类型:', typeof result.isRunning)
        log('executeStatus值:', result.executeStatus)

        if (result.success) {
          if (result.isRunning === true) {
            // 仍在执行中，继续轮询
            log('✅ 继续轮询 - 执行状态:', result.executeStatus)
            setPollingState(prev => ({
              ...prev,
              debugUrl: result.debugUrl,
              logid: result.logid,
              result: prev.result // 保持现有结果，不覆盖
            }))
            return // 继续轮询，不停止
          } else {
            // 执行完成，停止轮询
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current)
              pollingIntervalRef.current = null
            }
            
            // 处理结果数据 - 只显示execute_status和output
            let resultContent = '';
            if (result.data) {
              try {
                // 尝试解析JSON数据
                const parsedData = JSON.parse(result.data);
                if (typeof parsedData === 'object') {
                  // 如果是数组，取第一个元素；如果是对象，直接使用
                  const dataItem = Array.isArray(parsedData) ? parsedData[0] : parsedData;
                  
                  // 只提取execute_status和output两项
                  const filteredResult = {
                    execute_status: dataItem?.execute_status,
                    output: dataItem?.output
                  };
                  resultContent = JSON.stringify(filteredResult, null, 2);
                } else {
                  resultContent = result.data;
                }
              } catch (e) {
                // 如果不是JSON，直接显示原始数据
                resultContent = result.data;
              }
            }
            
            setPollingState(prev => ({
              ...prev,
              isPolling: false,
              result: resultContent,
              isComplete: true,
              debugUrl: result.debugUrl,
              logid: result.logid
            }))
          }
        } else {
          // 执行失败，停止轮询
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          
          setPollingState(prev => ({
            ...prev,
            isPolling: false,
            error: result.error || '执行失败',
            isComplete: false,
            debugUrl: result.debugUrl,
            logid: result.logid
          }))
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}]`, '轮询错误:', error)
        setPollingState(prev => ({
          ...prev,
          isPolling: false,
          error: error instanceof Error ? error.message : '轮询错误',
          isComplete: false
        }))
      }
    }

    // 每15秒执行一次轮询
    pollingIntervalRef.current = setInterval(poll, 15000)
  }, [])

  // 停止轮询或清除结果
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    
    // 如果正在轮询，则停止轮询；如果已完成，则清除结果
    if (pollingState.isPolling) {
      setPollingState(prev => ({
        ...prev,
        isPolling: false
      }))
    } else {
      // 清除结果
      setPollingState(prev => ({
        ...prev,
        result: '',
        error: '',
        isComplete: false,
        executeId: null,
        debugUrl: '',
        logid: ''
      }))
    }
  }, [pollingState.isPolling])

  // 清理轮询内容
  const clearPollingContent = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setPollingState({
      isPolling: false,
      executeId: null,
      result: '',
      error: null,
      isComplete: false
    })
  }, [])

  return {
    streamingState,
    pollingState,
    startStreaming,
    stopStreaming,
    clearContent,
    startAsyncExecution,
    stopPolling,
    clearPollingContent
  }
}
