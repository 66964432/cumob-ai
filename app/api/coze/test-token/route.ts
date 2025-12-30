import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authToken } = body;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 400 }
      );
    }

    // 确保token格式正确
    const cleanToken = authToken.replace(/^Bearer\s+/i, '').trim();
    
    if (!cleanToken || cleanToken.length < 10) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }
    
    const authorizationHeader = `Bearer ${cleanToken}`;

    // 测试token是否有效
    const testResponse = await fetch('https://api.coze.cn/v1/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': authorizationHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('Token验证失败:', testResponse.status, errorText);
      return NextResponse.json(
        { error: `Token无效: ${testResponse.status} - ${errorText}` },
        { status: 401 }
      );
    }

    const userData = await testResponse.json();
    console.log('Token验证成功，用户信息:', userData);

    return NextResponse.json({
      success: true,
      message: 'Token验证成功',
      user: userData
    });

  } catch (error) {
    console.error('Token测试错误:', error);
    return NextResponse.json(
      { error: 'Token测试失败，请检查网络连接' },
      { status: 500 }
    );
  }
}
