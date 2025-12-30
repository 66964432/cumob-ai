"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select'
import { useCozeAPI } from '@/hooks/useCozeAPI'
import { useToast } from '@/hooks/use-toast'
import { StreamingOutput } from '@/components/StreamingOutput'
import { 
  WorkflowFormData, 
  STYLE_OPTIONS, 
  EMOTION_OPTIONS, 
  VOICE_OPTIONS,
  LANGUAGE_OPTIONS,
  FONT_OPTIONS
} from '@/types/coze'

const defaultFormData: WorkflowFormData = {
  authToken: 'pat_fYzOGa6QUC7qn0lE5Ah8MUWitfSRaLPJYl9pUJOHYAgErPqta6NJC9eN3kp44Ky2',
  workflowId: '7555704402121506826',
  inputText: '',
  style: '日本动漫',
  emotion: 'neutral',
  font: '竹风体',
  targetLang: ['中文'],
  voiceId: 'Chinese (Mandarin)_Mature_Woman',
  deeplApi: '',
  minimaxApi: '',
  minimaxGroupId: '',
  cumobApi: '',
  cumobModel: 'nano-banana-fast',
  bailianApi: '',
  autoExpansion: false,
  test_mode: false,
  hd: false,
  maxLen: 23
}

export function CozeWorkflowForm() {
  // 初始化时就从 localStorage 加载数据，避免闪烁
  const getInitialFormData = (): WorkflowFormData => {
    if (typeof window === 'undefined') {
      return defaultFormData
    }
    
    const saved = localStorage.getItem('coze-workflow-form')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        console.log('从 localStorage 解析的数据:', parsed)
        
        // 合并保存的数据和默认数据，确保关键字段不为空
        const mergedData = { 
          ...defaultFormData, 
          ...parsed,
          // 确保关键字段不为空
          voiceId: parsed.voiceId || defaultFormData.voiceId,
          style: parsed.style || defaultFormData.style,
          emotion: parsed.emotion || defaultFormData.emotion,
          font: parsed.font || defaultFormData.font,
          targetLang: parsed.targetLang && parsed.targetLang.length > 0 ? parsed.targetLang : defaultFormData.targetLang,
          // 以下字段始终使用默认值，不允许被 localStorage 覆盖
          authToken: defaultFormData.authToken,
          cumobModel: defaultFormData.cumobModel
        }
        console.log('初始化表单数据:', mergedData)
        return mergedData
      } catch (error) {
        console.warn('加载保存的表单数据失败:', error)
        return defaultFormData
      }
    }
    
    console.log('使用默认表单数据:', defaultFormData)
    return defaultFormData
  }

  const [formData, setFormData] = useState<WorkflowFormData>(getInitialFormData)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false)
  const [useAsyncMode, setUseAsyncMode] = useState(true)
  const { 
    streamingState, 
    pollingState, 
    startStreaming, 
    clearContent, 
    startAsyncExecution, 
    stopPolling, 
    clearPollingContent 
  } = useCozeAPI()
  const { toast } = useToast()

  // 标记初始化完成，避免闪烁
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  // 保存表单数据到 localStorage
  const saveFormData = (data: WorkflowFormData) => {
    try {
      localStorage.setItem('coze-workflow-form', JSON.stringify(data))
    } catch (error) {
      console.warn('保存表单数据失败:', error)
    }
  }

  const handleInputChange = (field: keyof WorkflowFormData, value: string | string[] | boolean | number) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    
    // 使用 setTimeout 延迟保存，避免频繁更新 localStorage
    setTimeout(() => {
      saveFormData(newData)
    }, 100)
  }


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件类型
    const isTextFile = file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')
    const isWordFile = file.type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || 
                      file.type.includes('application/msword') || 
                      file.name.endsWith('.docx') || 
                      file.name.endsWith('.doc')

    if (!isTextFile && !isWordFile) {
      alert('请上传文本文件（.txt、.md）或Word文档（.doc、.docx 格式）')
      return
    }

    // 检查文件大小（限制为5MB，Word文件通常更大）
    const maxSize = isWordFile ? 5 * 1024 * 1024 : 1024 * 1024 // Word文件5MB，文本文件1MB
    if (file.size > maxSize) {
      alert(`文件大小不能超过${isWordFile ? '5MB' : '1MB'}`)
      return
    }

    if (isWordFile) {
      // 处理Word文档
      try {
        const mammoth = await import('mammoth')
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        const content = result.value
        if (content) {
          if (content.length > 10000) {
            alert(`文档内容超过10000字符限制，当前为${content.length}字符，已截取前10000字符`)
            handleInputChange('inputText', content.substring(0, 10000))
          } else {
            handleInputChange('inputText', content)
          }
        } else {
          alert('无法提取Word文档内容')
        }
      } catch (error) {
        console.error('Word文档解析错误:', error)
        alert('Word文档解析失败，请尝试其他格式')
      }
    } else {
      // 处理文本文件
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        if (content) {
          if (content.length > 10000) {
            alert(`文档内容超过10000字符限制，当前为${content.length}字符，已截取前10000字符`)
            handleInputChange('inputText', content.substring(0, 10000))
          } else {
            handleInputChange('inputText', content)
          }
        }
      }
      reader.readAsText(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证必填项
    const missingFields = []
    
    if (!formData.inputText.trim()) {
      missingFields.push('输入内容')
    }
    
    if (!formData.cumobApi.trim()) {
      missingFields.push('Cumob API Key')
    }
    
    if (!formData.deeplApi.trim()) {
      missingFields.push('DeepL API Key')
    }
    
    if (!formData.minimaxApi.trim()) {
      missingFields.push('MiniMax API Key')
    }
    
    if (!formData.minimaxGroupId.trim()) {
      missingFields.push('MiniMax Group ID')
    }
    
    if (!formData.targetLang || formData.targetLang.length === 0) {
      missingFields.push('目标语言')
    }
    
    if (missingFields.length > 0) {
      toast({
        title: "必填项缺失",
        description: `请填写以下必填项：${missingFields.join('、')}`,
        variant: "destructive",
      })
      return
    }
    
    // 验证DeepL API Key格式
    const deeplApiKey = formData.deeplApi.trim()
    const deeplKeyPattern = /^[a-zA-Z0-9-]{36}:fx$/
    
    if (!deeplKeyPattern.test(deeplApiKey)) {
      toast({
        title: "DeepL API Key格式错误",
        description: "请输入正确的DeepL API密钥",
        variant: "destructive",
      })
      return
    }
    
    // 生成视频时自动折叠所有配置区域
    setIsConfigCollapsed(true)

    if (useAsyncMode) {
      await startAsyncExecution(formData)
    } else {
      await startStreaming(formData)
    }
  }


  // 如果还未初始化完成，显示加载状态
  if (!isInitialized) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">加载配置中...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 表单区域 */}
      <div className="rounded-lg bg-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 输入内容 */}
          <div className="space-y-4">
            <div className="relative">
              <div className="relative">
                <Textarea
                  value={formData.inputText}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 10000) {
                      handleInputChange('inputText', value)
                    }
                  }}
                  placeholder="输入内容，点击「创作视频」按钮即刻生成"
                  rows={8}
                  className="resize-y pb-16"
                  maxLength={10000}
                />
                
              </div>
              
              {/* 左下角字符计数器和上传文档按钮 */}
              <div className="absolute bottom-2 left-2 flex items-center gap-3">
                {/* 字符计数器 */}
                <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded border">
                  {formData.inputText.length}/10000
                </div>
                
                {/* 上传文档按钮 */}
                <input
                  type="file"
                  accept=".txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div 
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:border-accent-foreground transition-all duration-200 group"
                    title="上传文档"
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className="text-muted-foreground group-hover:text-foreground transition-colors duration-200"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                  </div>
                </label>
              </div>
              
              {/* 右下角开关图标和创作视频按钮 */}
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                {/* 模式切换按钮 */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUseAsyncMode(!useAsyncMode)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      useAsyncMode 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {useAsyncMode ? '异步模式' : '流式模式'}
                  </button>
                </div>

                {/* 自动扩展开关 */}
                <div 
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer group relative ${
                    formData.autoExpansion 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background hover:bg-accent'
                  }`}
                  onClick={() => handleInputChange('autoExpansion', !formData.autoExpansion)}
                >
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="group-hover:scale-110 transition-transform duration-200"
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                  
                  {/* 自定义提示框 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    开启时，模型会根据您输入的内容或标题自动扩展，补齐故事内容，以提升生成质量。
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>

                {/* 测试模式开关 */}
                <div 
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer group relative ${
                    formData.test_mode 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background hover:bg-accent'
                  }`}
                  onClick={() => handleInputChange('test_mode', !formData.test_mode)}
                >
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="group-hover:scale-110 transition-transform duration-200"
                  >
                    {/* 灯泡图标 */}
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" />
                    <path d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
                    <path d="M12 6v6" />
                    <path d="M9 9h6" />
                  </svg>
                  
                  {/* 自定义提示框 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    开启时，不产生绘图、翻译、语音合成的消耗，大语言模型除外。以测试内容和流程。
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>

                {/* 创作视频按钮 */}
                <Button
                    type="submit"
                    size="sm"
                    disabled={streamingState.isStreaming || pollingState.isPolling}
                    className="h-8 px-4 text-xs"
                  >
                    {streamingState.isStreaming ? (
                      <>
                        <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        流式生成中...
                      </>
                    ) : pollingState.isPolling ? (
                      <>
                        <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        异步执行中...
                      </>
                    ) : (
                      <>
                        <svg 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          className="mr-1"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                        创作视频
                      </>
                    )}
                  </Button>
              </div>
            </div>
          </div>


          {/* 参数配置 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">配置参数</h3>
              <button
                type="button"
                onClick={() => setIsConfigCollapsed(!isConfigCollapsed)}
                className="flex items-center space-x-2 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{isConfigCollapsed ? '展开' : '折叠'}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform duration-200 ${
                    isConfigCollapsed ? 'rotate-0' : 'rotate-180'
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            
            {!isConfigCollapsed && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">目标语言</label>
                <MultiSelect
                  options={LANGUAGE_OPTIONS.map(option => ({
                    value: option.value,
                    label: option.label
                  }))}
                  value={formData.targetLang}
                  onChange={(value) => handleInputChange('targetLang', value)}
                  placeholder="请选择目标语言"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">语音音色</label>
                <Select
                  value={formData.voiceId}
                  onValueChange={(value) => handleInputChange('voiceId', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* 四个设置项一行显示 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">画面风格</label>
                <Select
                  value={formData.style}
                  onValueChange={(value) => handleInputChange('style', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">语音情感</label>
                <Select
                  value={formData.emotion}
                  onValueChange={(value) => handleInputChange('emotion', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMOTION_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">字幕字体</label>
                <Select
                  value={formData.font}
                  onValueChange={(value) => handleInputChange('font', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">字幕长度</label>
                <Input
                  type="number"
                  value={formData.maxLen}
                  onChange={(e) => handleInputChange('maxLen', parseInt(e.target.value) || 27)}
                  placeholder="字幕最大长度"
                  min="1"
                  max="100"
                />
              </div>
                </div>
              </>
            )}
          </div>

          {/* API 配置 */}
          {!isConfigCollapsed && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cumob API Key</label>
                <Input
                  type="password"
                  value={formData.cumobApi}
                  onChange={(e) => handleInputChange('cumobApi', e.target.value)}
                  placeholder="Cumob API 密钥"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cumob Model</label>
                <Input
                  value={formData.cumobModel}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                  placeholder="Cumob 模型名称"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">MiniMax API Key</label>
                <Input
                  type="password"
                  value={formData.minimaxApi}
                  onChange={(e) => {
                    const value = e.target.value
                    // 允许逐字输入：每段最大长度 26 + 'X' + '.' + 700 = 728
                    const parts = value.split(',')
                    const maxPartLen = 36 + 1 + 700
                    const allowTyping = parts.every(part => part.length <= maxPartLen)
                    if (allowTyping) {
                      handleInputChange('minimaxApi', value)
                    }
                  }}
                  placeholder="请输入正确的MiniMax API密钥，多个密钥用逗号分隔"
                />
                <div className="text-xs text-muted-foreground">
                  {formData.minimaxApi ? (
                    (() => {
                      const parts = formData.minimaxApi.split(',')
                      // 有效规则：^[A-Za-z0-9]{26}X\.[^,]{600,700}$
                      const pattern = /^[A-Za-z0-9]{36}\.[^,]{600,700}$/
                      const validParts = parts.filter(part => pattern.test(part))
                      return `${validParts.length}/${parts.length} 个有效密钥`
                    })()
                  ) : ('')}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">MiniMax Group ID</label>
                <Input
                  value={formData.minimaxGroupId}
                  onChange={(e) => {
                    const value = e.target.value
                    // 只允许数字，最多19位
                    if (/^\d*$/.test(value) && value.length <= 19) {
                      handleInputChange('minimaxGroupId', value)
                    }
                  }}
                  placeholder="请输入正确的的Group ID"
                  maxLength={19}
                  pattern="[0-9]{19}"
                  title="请输入19位数字"
                />
              </div>
              <div className="space-y-2">
              <label className="text-sm font-medium">Bailian API Key</label>
                <Input
                  type="password"
                  value={formData.bailianApi}
                  onChange={(e) => handleInputChange('bailianApi', e.target.value)}
                  placeholder="Bailian API 密钥"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">DeepL API Key</label>
                <Input
                  type="password"
                  value={formData.deeplApi}
                  onChange={(e) => handleInputChange('deeplApi', e.target.value)}
                  placeholder="DeepL API 密钥"
                />
              </div>
            </div>
            </div>
          )}

        </form>
      </div>

      {/* 输出区域 */}
      <StreamingOutput
        streamingState={streamingState}
        onClear={clearContent}
      />
      
      {/* 异步执行结果显示区域 */}
      {useAsyncMode && (
        <div className="rounded-lg p-6">
          {pollingState.isPolling && (
            <div className="mb-4 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-sm text-blue-800">
                      正在轮询执行结果... (每15秒检查一次)
                    </span>
                  </div>
                  {pollingState.executeId && (
                    <div className="mt-2 text-xs text-blue-600">
                      执行ID: {pollingState.executeId}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-blue-600">
                    状态: 执行中 (Running)
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={stopPolling}
                  className="h-8 px-3 text-xs"
                >
                  停止轮询
                </Button>
              </div>
            </div>
          )}
          
          {pollingState.result && (
            <div className="mb-4">
              <div className="space-y-3">
                {(() => {
                  try {
                    const resultData = typeof pollingState.result === 'string' 
                      ? JSON.parse(pollingState.result) 
                      : pollingState.result;
                    
                    // 解析output字段中的嵌套JSON
                    let outputData = null;
                    if (resultData.output) {
                      try {
                        outputData = JSON.parse(resultData.output);
                      } catch (e) {
                        console.warn('无法解析output字段:', e);
                      }
                    }
                    
                    return (
                      <>
                        {resultData.execute_status && (
                          <div className="p-3 rounded-md">
                            <div className="text-sm font-medium text-blue-800 mb-1">执行状态:</div>
                            <div className="text-sm text-blue-700">{resultData.execute_status}</div>
                          </div>
                        )}
                        {outputData && (
                          <div className="space-y-2">
                            {outputData.Output && (
                              <div className="p-3 rounded-md">
                                <div className="text-sm font-medium text-green-800 mb-2">输出内容:</div>
                                <div className="space-y-2">
                                  {(() => {
                                    try {
                                      const outputContent = JSON.parse(outputData.Output);
                                      return (
                                        <>
                                          {outputContent.Introduction && (
                                            <div>
                                              <div className="text-xs font-medium text-green-700 mb-1">Introduction:</div>
                                              <div className="text-sm text-green-600">
                                                {Array.isArray(outputContent.Introduction) 
                                                  ? outputContent.Introduction.join(', ')
                                                  : outputContent.Introduction
                                                }
                                              </div>
                                            </div>
                                          )}
                                          {outputContent.image_status_list && (
                                            <div>
                                              <div className="text-xs font-medium text-green-700 mb-1">Image Status:</div>
                                              <div className="text-sm text-green-600">
                                                {Array.isArray(outputContent.image_status_list) 
                                                  ? outputContent.image_status_list.length > 0 
                                                    ? outputContent.image_status_list.join(', ')
                                                    : '无图片状态'
                                                  : outputContent.image_status_list
                                                }
                                              </div>
                                            </div>
                                          )}
                                          {outputContent.output && (
                                            <div>
                                              <div className="flex items-center justify-between mb-1">
                                                <div className="text-xs font-medium text-green-700">Output:</div>
                                                <button
                                                  onClick={async () => {
                                                    let outputText = '';
                                                    if (Array.isArray(outputContent.output)) {
                                                      outputText = outputContent.output.join(', ');
                                                    } else {
                                                      outputText = outputContent.output;
                                                    }
                                                    
                                                    // 按逗号分割并分行，与显示内容保持一致
                                                    const outputLines = outputText.split(',').map(line => line.trim()).join('\n');
                                                    
                                                    try {
                                                      await navigator.clipboard.writeText(outputLines);
                                                      toast({
                                                        title: "复制成功",
                                                        description: "Output内容已复制到剪贴板",
                                                        duration: 2000,
                                                      });
                                                    } catch (err) {
                                                      console.error('复制失败:', err);
                                                      toast({
                                                        title: "复制失败",
                                                        description: "无法复制到剪贴板，请手动复制",
                                                        variant: "destructive",
                                                        duration: 3000,
                                                      });
                                                    }
                                                  }}
                                                  className="text-xs text-green-600 hover:text-green-800 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                                                  title="复制到剪贴板"
                                                >
                                                  📋 复制
                                                </button>
                                              </div>
                                              <div className="text-sm text-green-600">
                                                {(() => {
                                                  let outputText = '';
                                                  if (Array.isArray(outputContent.output)) {
                                                    outputText = outputContent.output.join(', ');
                                                  } else {
                                                    outputText = outputContent.output;
                                                  }
                                                  
                                                  // 按逗号分割并分行显示
                                                  const outputLines = outputText.split(',').map((line, index) => (
                                                    <div key={index} className="mb-1">
                                                      {line.trim()}
                                                    </div>
                                                  ));
                                                  
                                                  return outputLines;
                                                })()}
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      );
                                    } catch (e) {
                                      return (
                                        <div className="text-sm text-green-600">
                                          {outputData.Output}
                                        </div>
                                      );
                                    }
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    );
                  } catch (e) {
                    return (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800">
                          {typeof pollingState.result === 'string' 
                            ? pollingState.result 
                            : JSON.stringify(pollingState.result, null, 2)
                          }
                        </pre>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          )}
          
          {pollingState.error && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-red-600">执行错误:</h4>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{pollingState.error}</p>
              </div>
            </div>
          )}
          
          {(pollingState.result || pollingState.error) && (
            <Button
              size="sm"
              variant="outline"
              onClick={clearPollingContent}
              className="h-8 px-3 text-xs"
            >
              清除结果
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
