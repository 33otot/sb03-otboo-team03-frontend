import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const { signIn, loading, error, clearError } = useAuthStore();

  // 이메일 형식 검사
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 형식 검사 (최소 6자, 영문+숫자 조합)
  const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "아이디를 입력해주세요";
    } else if (!isValidEmail(formData.username)) {
      newErrors.username = "유효하지 않은 이메일입니다.";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = "올바르지 않은 비밀번호입니다.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 실시간 유효성 검사
    const newErrors: { username?: string; password?: string } = { ...errors };
    
    if (field === 'username') {
      if (value.trim() === '') {
        delete newErrors.username;
      } else if (!isValidEmail(value)) {
        newErrors.username = "유효하지 않은 이메일입니다.";
      } else {
        delete newErrors.username;
      }
    }
    
    if (field === 'password') {
      if (value.trim() === '') {
        delete newErrors.password;
      } else if (!isValidPassword(value)) {
        newErrors.password = "올바르지 않은 비밀번호입니다.";
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
    
    // 스토어 에러 클리어
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await signIn(formData.username, formData.password);
      // 로그인 성공 시 홈페이지로 이동
      navigate("/");
    } finally {
      console.debug("Login attempt finished");
    }
  };

  const isFormValid = formData.username.trim() && formData.password.trim() && 
    isValidEmail(formData.username) && isValidPassword(formData.password);

  return (
    <div className="flex flex-col gap-1 md:gap-1 w-full mt-0 mb-2">
    
          {/* 타이틀 */}
          <div className="text-center -translate-y-3 md:-translate-y-5 space-y-2">
  <h1 className="font-headline text-[44px] md:text-[56px] leading-none tracking-[-0.02em] text-[#2a167b] inline-block relative">
    옷장을 부탁해
    <span className="absolute left-0 right-0 -bottom-1 h-1.5 rounded-full bg-[#e9e4ff]" />
  </h1>

  <p className="mt-2 text-[14px] md:text-[15px] font-semibold text-gray-700">
  오늘 날씨에 맞춰 <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-400">옷</span>을 골라드려요
</p>
</div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-[26px] w-full">
        <div className="flex flex-col gap-[18px] w-full">
          <div className="flex flex-col gap-2.5 w-full">
            <label 
              htmlFor="username"
              className="text-[var(--color-gray-500)] text-[var(--font-size-body-3)] font-[var(--font-weight-bold)] tracking-[-0.35px]"
            >
              아이디
            </label>
            <Input
              id="username"
              type="email"
              placeholder="codeit@codeit.com"
              value={formData.username}
              onChange={handleInputChange("username")}
              error={errors.username}
            />
          </div>
          
          <div className="flex flex-col gap-2.5 w-full">
            <label 
              htmlFor="password"
              className="text-[var(--color-gray-500)] text-[var(--font-size-body-3)] font-[var(--font-weight-bold)] tracking-[-0.35px]"
            >
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={handleInputChange("password")}
              showPasswordToggle
              error={errors.password}
            />
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm font-semibold text-center">
            {error}
          </div>
        )}
        
        <Button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full"
        >
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </div>
  );
}