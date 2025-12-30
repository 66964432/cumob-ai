"use client"

import { CozeWorkflowForm } from '@/components/CozeWorkflowForm'
import { Layout } from '@/components/Layout'

export default function WorkflowPage() {
  return (
    <Layout showBackButton pageTitle="工作流调用">
      {/* 主要内容 */}
      <main className="px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Coze 工作流调用
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            配置参数并调用 Coze 工作流 API，支持流式响应和实时内容生成
          </p>
        </div>

        <CozeWorkflowForm />
      </main>

      {/* 页脚 */}
      <footer className="bg-background mt-16">
        <div className="px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 CuMob AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Layout>
  )
}