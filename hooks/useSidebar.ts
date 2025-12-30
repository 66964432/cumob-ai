"use client"

import { useState, useEffect } from 'react'

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // 从 localStorage 加载侧边栏状态
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved) {
      try {
        setIsCollapsed(JSON.parse(saved))
      } catch (error) {
        console.warn('加载侧边栏状态失败:', error)
      }
    }
  }, [])

  // 保存侧边栏状态到 localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    try {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
    } catch (error) {
      console.warn('保存侧边栏状态失败:', error)
    }
  }

  return {
    isCollapsed,
    toggleSidebar
  }
}
