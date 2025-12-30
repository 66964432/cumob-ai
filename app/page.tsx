"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { CozeWorkflowForm } from "@/components/CozeWorkflowForm";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeTab, setActiveTab] = useState('workflow');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workflow':
        return (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                让你的创意变成视频
              </h1>
            </div>
            <CozeWorkflowForm />
          </>
        );
      case 'video':
        return (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                AI 视频生成
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                输入创意，让 AI 为你生成精美的视频内容
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg border bg-card p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">视频创意描述</label>
                    <Input
                      placeholder="描述你想要生成的视频内容..."
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">视频风格</label>
                      <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                        <option>写实风格</option>
                        <option>动漫风格</option>
                        <option>水彩风格</option>
                        <option>吉卜力风格</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">视频时长</label>
                      <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                        <option>15秒</option>
                        <option>30秒</option>
                        <option>60秒</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button className="min-w-48 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      生成视频
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'voice':
        return (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                AI 语音生成
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                将文本转换为自然流畅的语音，支持多种语言和音色
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg border bg-card p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">要转换的文本</label>
                    <textarea
                      placeholder="输入要转换为语音的文本内容..."
                      className="w-full h-32 px-3 py-2 rounded-md border border-input bg-background resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">语音类型</label>
                      <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                        <option>中文女声</option>
                        <option>中文男声</option>
                        <option>英文女声</option>
                        <option>英文男声</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">语速</label>
                      <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                        <option>慢速</option>
                        <option>正常</option>
                        <option>快速</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button className="min-w-48 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      生成语音
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      onLoginClick={() => setShowRegisterModal(true)}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* 主要内容 */}
      <main className="px-6 py-8">
        {renderTabContent()}
      </main>

      {/* 页脚 */}
      <footer className="border-t bg-background mt-16">
        <div className="px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 CuMob AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <button
            onClick={() => setShowRegisterModal(false)}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <DialogHeader className="text-center space-y-3 pt-6">
            <DialogTitle className="text-2xl font-bold">注册即享好礼</DialogTitle>
            <p className="text-muted-foreground text-sm">
              新用户注册即赠获积分，免费畅享AI视频创作
            </p>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-foreground font-medium rounded-lg text-base">
              <span className="flex items-center justify-center space-x-2">
                <span>立即注册</span>
                <Badge className="bg-white/20 text-foreground text-xs px-2 py-1 hover:bg-white/20">
                  Get 500
                </Badge>
              </span>
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              注册即表示同意用户协议和隐私政策
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}