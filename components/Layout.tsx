"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface LayoutProps {
  children: React.ReactNode
  showBackButton?: boolean
  pageTitle?: string
  onLoginClick?: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Layout({ children, showBackButton = false, pageTitle, onLoginClick, activeTab = 'workflow', onTabChange }: LayoutProps) {

  return (
    <div className="min-h-screen">
      {/* Header - 全宽导航栏 */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-border">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          {/* 左侧：Logo和导航 */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="CuMob AI Logo" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xl font-semibold">CuMob AI</span>
            </div>

            {/* Navigation Tabs - 只在首页显示 */}
            {!showBackButton && (
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => onTabChange?.('workflow')}
                  className={`px-4 py-2 transition-colors ${
                    activeTab === 'workflow' 
                      ? 'text-foreground font-medium border-b-2 border-purple-500' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  推文
                </button>
                <button 
                  onClick={() => onTabChange?.('video')}
                  className={`px-4 py-2 transition-colors ${
                    activeTab === 'video' 
                      ? 'text-foreground font-medium border-b-2 border-purple-500' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  视频
                </button>
                <button 
                  onClick={() => onTabChange?.('voice')}
                  className={`px-4 py-2 transition-colors ${
                    activeTab === 'voice' 
                      ? 'text-foreground font-medium border-b-2 border-purple-500' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  语音
                </button>
              </div>
            )}

            {/* 返回按钮 - 在其他页面显示 */}
            {showBackButton && (
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  返回首页
                </Button>
              </Link>
            )}
          </div>

          {/* 右侧操作按钮 */}
          <div className="flex items-center space-x-4">
            {pageTitle && (
              <span className="text-sm text-muted-foreground">{pageTitle}</span>
            )}
            
            <button className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
              <span>会员中心</span>
            </button>

            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18M3 9h18M3 15h18M15 3v18" />
              </svg>
            </button>

            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </button>

            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
              onClick={onLoginClick}
            >
              登录
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - 固定展开 */}
        {/* <div className="fixed left-0 h-[calc(100vh-4rem)] w-64 bg-background border-border flex flex-col py-6 space-y-4 z-40">
          <div className="px-6">
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground bg-secondary rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <span>发现</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <span>项目</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
                <span>媒体</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                <span>收藏</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 3v4M8 3v4M2 11h20" />
                </svg>
                <span>日历</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20" />
                </svg>
                <span>设置</span>
              </button>
            </div>
          </div>
        </div> */}

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Page Content */}
          {children}
        </div>
      </div>
    </div>
  )
}