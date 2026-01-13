'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, AlertCircle } from 'lucide-react';

// Admin password - in production, use environment variable
const ADMIN_PASSWORD = 'Khanh2003@';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check session storage on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('admin_auth');
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_auth', 'true');
      }
    } else {
      setError('Mật khẩu không đúng');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_auth');
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="flex justify-end p-4 border-b border-[#2a2a3e]">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-[#2a2a3e] hover:bg-[#2a2a3e]"
          >
            Đăng xuất
          </Button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1a2e] border-[#2a2a3e]">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#00d4ff]/20 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-[#00d4ff]" />
          </div>
          <CardTitle className="text-white">Admin Dashboard</CardTitle>
          <CardDescription className="text-[#a0a0b0]">
            Nhập mật khẩu để truy cập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0a0a0f] border-[#2a2a3e] text-white placeholder:text-[#a0a0b0]"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0a0f] font-semibold"
            >
              Đăng nhập
            </Button>
          </form>
          
          <p className="mt-4 text-center text-xs text-[#a0a0b0]">
            Liên hệ admin nếu quên mật khẩu
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Export for testing
export { ADMIN_PASSWORD };
