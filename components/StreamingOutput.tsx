"use client"

import { useEffect, useRef } from 'react'
import { StreamingState } from '@/types/coze'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StreamingOutputProps {
  streamingState: StreamingState
  onClear: () => void
  className?: string
}

export function StreamingOutput({ streamingState, onClear, className }: StreamingOutputProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // 自动滚动到顶部（最新内容）
  useEffect(() => {
    if (contentRef.current && streamingState.isStreaming) {
      contentRef.current.scrollTop = 0
    }
  }, [streamingState.content, streamingState.isStreaming])

  if (!streamingState.content && !streamingState.error && !streamingState.isStreaming) {
    return null
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* 状态指示器 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">实时结果</h3>
          {streamingState.isStreaming && (
            <Badge variant="secondary" className="animate-pulse">
              生成中...
            </Badge>
          )}
          {streamingState.isComplete && (
            <Badge variant="default">
              完成
            </Badge>
          )}
          {streamingState.error && (
            <Badge variant="destructive">
              错误
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={streamingState.isStreaming}
        >
          清空
        </Button>
      </div>

      {/* 内容显示区域 */}
      <div className="relative">
        {streamingState.error ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <div className="flex items-center gap-2 text-destructive">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">错误</span>
            </div>
            <p className="mt-2 text-sm text-destructive">{streamingState.error}</p>
          </div>
        ) : (
          <div
            ref={contentRef}
            className={cn(
              "max-h-96 overflow-y-auto rounded-lg border bg-background p-4",
              "font-mono text-sm leading-relaxed",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
            )}
          >
            {streamingState.content ? (
              <div className="space-y-1">
                {streamingState.isStreaming && (
                  <div className="flex items-center gap-1 text-primary mb-2">
                    <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
                    <span className="text-xs">正在生成...</span>
                  </div>
                )}
                {streamingState.content.split('\n').reverse().map((line, index) => (
                  <div key={index} className="text-sm leading-relaxed">
                    {line || '\u00A0'} {/* 空行显示为空格 */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">
                {streamingState.isStreaming ? '等待响应...' : '暂无内容'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 统计信息 */}
      {streamingState.content && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>字符数: {streamingState.content.length}</span>
          <span>行数: {streamingState.content.split('\n').length}</span>
          {streamingState.isComplete && (
            <span className="text-green-600">✓ 生成完成</span>
          )}
          {streamingState.isStreaming && (
            <span className="text-blue-600 animate-pulse">🔄 正在生成...</span>
          )}
        </div>
      )}

      {/* 调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-2 rounded text-xs">
          <div>状态: {streamingState.isStreaming ? '流式传输中' : '已停止'}</div>
          <div>完成: {streamingState.isComplete ? '是' : '否'}</div>
          <div>错误: {streamingState.error || '无'}</div>
        </div>
      )}
    </div>
  )
}
