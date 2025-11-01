"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Home,
  Briefcase,
  User,
  HelpCircle,
  Clock,
  DollarSign,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  Users,
  MapPin,
  CheckCircle2,
  ClipboardList,
} from "lucide-react"

type Screen = "home" | "tasks" | "profile" | "help" | "mytasks"

type TaskItem = {
  id: string
  company: string
  title: string
  time: string
  pay: string
  physical: string
  skill: string
  tags: string[]
  status: "applied" | "reviewing" | "approved"
}

export default function MenturnApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [appliedTasks, setAppliedTasks] = useState<TaskItem[]>([])

  return (
    <div className="min-h-screen bg-background flex items-start justify-center">
      <div
        className="w-full max-w-[390px] bg-card overflow-hidden flex flex-col border-l border-r border-border"
        style={{ minHeight: "100vh" }}
      >
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {currentScreen === "home" && <HomeScreen setScreen={setCurrentScreen} appliedTasks={appliedTasks} setAppliedTasks={setAppliedTasks} />}
          {currentScreen === "tasks" && <TasksScreen setScreen={setCurrentScreen} appliedTasks={appliedTasks} setAppliedTasks={setAppliedTasks} />}
          {currentScreen === "mytasks" && <MyTasksScreen appliedTasks={appliedTasks} setAppliedTasks={setAppliedTasks} />}
          {currentScreen === "profile" && <ProfileScreen />}
          {currentScreen === "help" && <HelpScreen />}
        </div>

        {/* Bottom Navigation */}
        <nav className="border-t border-primary/10 bg-card/95 backdrop-blur-lg shadow-lg">
          <div className="flex items-center justify-around py-3">
            <NavButton
              icon={<Home size={24} />}
              label="홈"
              active={currentScreen === "home"}
              onClick={() => setCurrentScreen("home")}
            />
            <NavButton
              icon={<Briefcase size={24} />}
              label="태스크"
              active={currentScreen === "tasks"}
              onClick={() => setCurrentScreen("tasks")}
            />
            <NavButton
              icon={<ClipboardList size={24} />}
              label="내 태스크"
              active={currentScreen === "mytasks"}
              onClick={() => setCurrentScreen("mytasks")}
            />
            <NavButton
              icon={<User size={24} />}
              label="내 정보"
              active={currentScreen === "profile"}
              onClick={() => setCurrentScreen("profile")}
            />
            <NavButton
              icon={<HelpCircle size={24} />}
              label="도움말"
              active={currentScreen === "help"}
              onClick={() => setCurrentScreen("help")}
            />
          </div>
        </nav>
      </div>
    </div>
  )
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-4 py-2 transition-all relative ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {active && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-linear-to-r from-primary to-primary/80 rounded-full" />
      )}
      <div className={`transition-transform ${active ? "scale-110" : ""}`}>{icon}</div>
      <span className={`text-xs font-bold transition-all ${active ? "scale-105" : ""}`}>{label}</span>
    </button>
  )
}

function HomeScreen({ 
  setScreen, 
  appliedTasks,
  setAppliedTasks 
}: { 
  setScreen: (screen: Screen) => void
  appliedTasks: TaskItem[]
  setAppliedTasks: (tasks: TaskItem[]) => void
}) {
  return (
    <div className="min-h-full p-6 space-y-8 bg-linear-to-b from-primary/5 via-primary/3 to-background">
      <div className="pt-6">
        <div className="mb-4">
          <Image
            src="/menturn_logo.png"
            alt="멘턴"
            width={180}
            height={60}
            className="h-auto"
            priority
          />
        </div>
        <p className="text-2xl font-bold leading-relaxed" style={{ color: '#0f172a' }}>안녕하세요, 김철수님!</p>
        <p className="text-lg text-muted-foreground leading-relaxed">안산시가 당신의 새로운 여정을 응원합니다.</p>
      </div>

      <Card className="relative overflow-hidden border border-primary/20 shadow-xl shadow-primary/10 bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/15 rounded-full blur-2xl translate-y-16 -translate-x-16" />

        <div className="relative px-8 pt-5 pb-8 space-y-5">
          <Badge className="bg-transparent text-primary text-sm px-2.5 py-1 font-bold border border-primary/40 rounded-md flex items-center gap-1.5 -ml-2">
            <Star className="text-primary fill-primary" size={14} />
            전문가 인증 완료
          </Badge>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }} className="-ml-2">
            <h2 className="text-2xl font-bold text-foreground leading-relaxed">김철수님의 30년 경험은</h2>
            <p className="text-2xl font-bold text-foreground leading-relaxed">돈으로 살 수 없는 자산입니다</p>
          </div>

          <div className="pt-2">
            <div className="flex flex-col gap-4 p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-lg">
              <div className="space-y-1">
                <p className="text-lg font-bold text-foreground">김철수님은</p>
                <p className="text-2xl font-bold text-primary">품질관리 전문가</p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-primary/10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="text-primary" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">경력 30년</p>
                  <p className="text-sm text-muted-foreground">제조업 품질관리 및 부품검사</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-primary/10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="text-primary fill-primary" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">평점 4.9 / 5.0</p>
                  <p className="text-sm text-muted-foreground">12건 완료 · 100% 만족도</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className="bg-primary/10 text-primary text-sm px-3 py-1.5 font-medium border border-primary/30 hover:bg-primary/20 transition-colors">
                  ISO 9001 자격증
                </Badge>
                <Badge className="bg-primary/10 text-primary text-sm px-3 py-1.5 font-medium border border-primary/30 hover:bg-primary/20 transition-colors">
                  품질관리기사
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex flex-col gap-2 mb-5">
          <Badge className="bg-transparent text-primary text-sm px-2.5 py-1 font-bold border border-primary/40 rounded-md flex items-center gap-1.5 w-fit">
            <Sparkles size={14} />
            AI
          </Badge>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground">오늘의 추천 업무</h3>
            <span className="text-2xl font-bold text-primary ml-6">총 2건</span>
          </div>
        </div>

        <div className="space-y-4">
          <TaskCard
            id="task-1"
            company="(주)한국정밀"
            title="완제품 품질검사"
            time="4시간"
            pay="80,000원"
            physical="낮음"
            skill="높음"
            tags={["앉아서 근무", "품질관리"]}
            appliedTasks={appliedTasks}
            setAppliedTasks={setAppliedTasks}
            setScreen={setScreen}
          />
          <TaskCard
            id="task-2"
            company="대한산업(주)"
            title="제어판 모니터링"
            time="2시간"
            pay="45,000원"
            physical="낮음"
            skill="중간"
            tags={["앉아서 근무", "모니터링"]}
            appliedTasks={appliedTasks}
            setAppliedTasks={setAppliedTasks}
            setScreen={setScreen}
          />
        </div>

        <Button 
          className="w-full mt-6 h-16 text-lg font-bold bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors rounded-xl group" 
          style={{ color: '#1e3a8a' }}
          onClick={() => setScreen("tasks")}
        >
          <span className="flex items-center justify-center gap-2">
            <span>모든 태스크 보기</span>
            <ChevronRight className="transition-transform group-hover:translate-x-1" size={24} />
          </span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="flex flex-col gap-3 pb-6">
        <StatCard icon={<Briefcase size={24} />} label="완료한 태스크" value="12건" />
        <StatCard icon={<Clock size={24} />} label="누적시간" value="48시간" />
        <StatCard icon={<TrendingUp size={24} />} label="누적수입" value="960,000원" />
      </div>
    </div>
  )
}

function TaskCard({
  id,
  company,
  title,
  time,
  pay,
  physical,
  skill,
  tags,
  appliedTasks,
  setAppliedTasks,
  setScreen,
}: {
  id: string
  company: string
  title: string
  time: string
  pay: string
  physical: string
  skill: string
  tags: string[]
  appliedTasks: TaskItem[]
  setAppliedTasks: (tasks: TaskItem[]) => void
  setScreen?: (screen: Screen) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const applicants = Math.floor(Math.random() * 8) + 3 // 3-10명 랜덤
  const isApplied = appliedTasks.some(task => task.id === id)

  const handleApply = () => {
    const newTask: TaskItem = {
      id,
      company,
      title,
      time,
      pay,
      physical,
      skill,
      tags,
      status: "applied"
    }
    setAppliedTasks([...appliedTasks, newTask])
    setIsOpen(false)
    setIsSuccessOpen(true)
  }

  return (
    <>
      <Card 
        className="p-6 transition-all hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] cursor-pointer border border-primary/20 hover:border-primary/40 bg-white shadow-md group relative"
        onClick={() => setIsOpen(true)}
      >
        {isApplied && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary/15 text-primary text-xs px-2 py-1 font-bold border border-primary/40 flex items-center gap-1">
              <CheckCircle2 size={12} />
              지원 완료
            </Badge>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <p className="text-base text-muted-foreground mb-2">{company}</p>
            <h4 className="text-xl font-bold text-foreground leading-relaxed group-hover:text-primary transition-colors">{title}</h4>
          </div>

          <div className="flex items-center gap-5 text-lg">
            <div className="flex items-center gap-2 text-foreground">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock size={20} className="text-primary" />
              </div>
              <span className="font-bold">{time}</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign size={20} className="text-primary" />
              </div>
              <span>{pay}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium border-primary/20 text-muted-foreground">
              신체부담: {physical}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium border-primary/20 text-muted-foreground">
              기술수준: {skill}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Badge
                key={i}
                className="bg-primary/10 text-primary hover:bg-primary/20 text-sm px-3 py-1.5 font-medium border border-primary/30 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[360px] border border-primary/20">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/10 text-primary text-xs px-2 py-0.5 font-bold border border-primary/30">
                <Sparkles size={12} className="mr-1" />
                추천
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">{title}</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {company}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">근무 시간</p>
                  <p className="text-base font-bold text-foreground">{time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">급여</p>
                  <p className="text-base font-bold text-primary">{pay}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">현재 지원자</p>
                  <p className="text-base font-bold text-foreground">{applicants}명</p>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium border-primary/20">
                  신체부담: {physical}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium border-primary/20">
                  기술수준: {skill}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <Badge
                    key={i}
                    className="bg-primary/10 text-primary text-sm px-3 py-1.5 font-medium border border-primary/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* AI 추천 이유 */}
          <Card className="p-4 bg-primary/5 border border-primary/20 mt-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground mb-1">AI 추천 이유</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  김철수님의 품질관리 30년 경력과 95% 매칭되며, 신체 부담이 낮아 적합합니다.
                </p>
              </div>
            </div>
          </Card>

          <div className="pt-2">
            {isApplied ? (
              <Button 
                className="w-full h-14 text-lg font-bold bg-primary/5 border border-primary/20 rounded-xl opacity-60 cursor-not-allowed"
                style={{ color: '#1e3a8a' }}
                disabled
              >
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} />
                  <span>지원 완료</span>
                </span>
              </Button>
            ) : (
              <Button 
                className="w-full h-14 text-lg font-bold bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-all rounded-xl group"
                style={{ color: '#1e3a8a' }}
                onClick={handleApply}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>바로 지원하기</span>
                  <ChevronRight className="transition-transform group-hover:translate-x-1" size={22} />
                </span>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[340px] border border-primary/20">
          <DialogHeader className="hidden">
            <DialogTitle>지원 완료</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-6">지원 완료!</h3>
            <Button 
              className="w-full h-14 text-lg font-bold bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-all rounded-xl"
              style={{ color: '#1e3a8a' }}
              onClick={() => {
                setIsSuccessOpen(false)
                if (setScreen) setScreen("mytasks")
              }}
            >
              확인하러 가기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="relative overflow-hidden p-5 border border-primary/20 shadow-md bg-white hover:shadow-xl hover:border-primary/40 transition-all duration-300 group">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:bg-primary/10 transition-colors duration-300"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-xl translate-y-8 -translate-x-8"></div>
      
      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <div className="text-primary">{icon}</div>
        </div>
        
        <div className="flex-1 text-left">
          <p className="text-sm text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary/90 group-hover:to-primary transition-all">{value}</p>
        </div>
        
        {/* Arrow indicator */}
        <ChevronRight className="text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" size={20} />
      </div>
    </Card>
  )
}

function TasksScreen({ 
  setScreen,
  appliedTasks,
  setAppliedTasks 
}: { 
  setScreen: (screen: Screen) => void
  appliedTasks: TaskItem[]
  setAppliedTasks: (tasks: TaskItem[]) => void
}) {
  return (
    <div className="min-h-full p-6 space-y-6 bg-linear-to-b from-primary/5 via-primary/3 to-background">
      <div className="pt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-transparent text-primary text-sm px-2.5 py-1 font-bold border border-primary/40 rounded-md flex items-center gap-1.5">
            <Sparkles size={14} />
            AI 맞춤
          </Badge>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">추천 태스크</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">김철수님의 경력을 바탕으로 선별된 일자리입니다</p>
        </div>
        
        <Card className="p-4 bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Award className="text-primary" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">김철수님의 전문성과 매칭률</p>
              <p className="text-xs text-muted-foreground">아래 태스크는 95% 이상의 적합도를 보입니다</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4 pb-6">
        <TaskCard
          id="task-1"
          company="(주)한국정밀"
          title="완제품 품질검사"
          time="4시간"
          pay="80,000원"
          physical="낮음"
          skill="높음"
          tags={["앉아서 근무", "품질관리"]}
          appliedTasks={appliedTasks}
          setAppliedTasks={setAppliedTasks}
          setScreen={setScreen}
        />
        <TaskCard
          id="task-2"
          company="대한산업(주)"
          title="제어판 모니터링"
          time="2시간"
          pay="45,000원"
          physical="낮음"
          skill="중간"
          tags={["앉아서 근무", "모니터링"]}
          appliedTasks={appliedTasks}
          setAppliedTasks={setAppliedTasks}
          setScreen={setScreen}
        />
        <TaskCard
          id="task-3"
          company="안산테크(주)"
          title="생산라인 자문"
          time="3시간"
          pay="90,000원"
          physical="낮음"
          skill="높음"
          tags={["컨설팅", "품질관리"]}
          appliedTasks={appliedTasks}
          setAppliedTasks={setAppliedTasks}
          setScreen={setScreen}
        />
        <TaskCard
          id="task-4"
          company="반월정밀(주)"
          title="신입사원 교육"
          time="2시간"
          pay="60,000원"
          physical="낮음"
          skill="높음"
          tags={["교육", "멘토링"]}
          appliedTasks={appliedTasks}
          setAppliedTasks={setAppliedTasks}
          setScreen={setScreen}
        />
      </div>
    </div>
  )
}

function MyTasksScreen({ 
  appliedTasks,
  setAppliedTasks 
}: { 
  appliedTasks: TaskItem[]
  setAppliedTasks?: (tasks: TaskItem[]) => void
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 font-bold border border-yellow-200">
            검토 중
          </Badge>
        )
      case "reviewing":
        return (
          <Badge className="bg-blue-50 text-blue-700 text-xs px-2 py-1 font-bold border border-blue-200">
            심사 중
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-primary/15 text-primary text-xs px-2 py-1 font-bold border border-primary/40">
            <CheckCircle2 size={12} className="mr-1" />
            배정 완료
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-full p-6 space-y-6 bg-linear-to-b from-primary/5 via-primary/3 to-background">
      <div className="pt-6">
        <h2 className="text-3xl font-bold text-foreground mb-3">내 태스크</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">신청 및 배정된 태스크 목록</p>
      </div>

      {appliedTasks.length === 0 ? (
        <Card className="p-12 border border-primary/20 shadow-md text-center bg-white">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/5 flex items-center justify-center">
            <ClipboardList size={40} className="text-primary/40" />
          </div>
          <p className="text-lg font-bold text-foreground mb-2">신청한 태스크가 없습니다</p>
          <p className="text-sm text-muted-foreground">추천 태스크를 확인하고 지원해보세요</p>
        </Card>
      ) : (
        <div className="space-y-4 pb-6">
          {appliedTasks.map((task) => (
            <Card key={task.id} className="p-6 border border-primary/20 shadow-md bg-white">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base text-muted-foreground mb-2">{task.company}</p>
                    <h4 className="text-xl font-bold text-foreground leading-relaxed">{task.title}</h4>
                  </div>
                  {getStatusBadge(task.status)}
                </div>

                <div className="flex items-center gap-5 text-lg">
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock size={20} className="text-primary" />
                    </div>
                    <span className="font-bold">{task.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign size={20} className="text-primary" />
                    </div>
                    <span>{task.pay}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      className="bg-primary/10 text-primary text-sm px-3 py-1.5 font-medium border border-primary/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {task.status === "applied" && (
                  <div className="pt-3 border-t border-primary/10 space-y-3">
                    <p className="text-sm text-muted-foreground text-center">
                      기업 검토 후 배정 여부를 알려드립니다
                    </p>
                    <Button 
                      className="w-full h-12 text-base font-medium bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-all rounded-xl"
                      onClick={() => {
                        if (setAppliedTasks) {
                          setAppliedTasks(appliedTasks.filter(t => t.id !== task.id))
                        }
                      }}
                    >
                      신청 취소하기
                    </Button>
                  </div>
                )}

                {task.status === "approved" && (
                  <Button 
                    className="w-full h-12 text-base font-bold bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-all rounded-xl mt-2"
                    style={{ color: '#1e3a8a' }}
                  >
                    근무 준비사항 확인하기
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileScreen() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [job, setJob] = useState("품질관리 (QC)")
  const [experience, setExperience] = useState("30년")
  const [specialty, setSpecialty] = useState("제조업, 부품검사")
  const [standingTime, setStandingTime] = useState("2시간")
  const [sitting, setSitting] = useState("제한없음")
  const [heavyLifting, setHeavyLifting] = useState("불가")
  const [workHours, setWorkHours] = useState("하루 2-4시간")
  const [preferredDays, setPreferredDays] = useState("월, 수, 금")
  const [preferredTime, setPreferredTime] = useState("오전 9시-오후 2시")

  return (
    <div className="min-h-full p-6 space-y-6 bg-linear-to-b from-primary/5 via-primary/3 to-background">
      <div className="pt-6">
        <h2 className="text-3xl font-bold text-foreground mb-3">내 프로필</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">경력과 조건을 관리하세요</p>
      </div>

      <Card className="p-6 border border-primary/20 shadow-lg bg-white">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30">
            <User size={40} className="text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">김철수</h3>
            <p className="text-lg text-primary mt-1">품질관리 전문가</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <Star className="text-primary fill-primary" size={24} />
          <span className="text-xl font-bold text-foreground">4.9</span>
          <span className="text-base text-muted-foreground">(12건 완료)</span>
        </div>
      </Card>

      {/* Career Info */}
      <Card className="p-6 border border-primary/20 shadow-md">
        <h4 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
          <Award className="text-primary" size={24} />
          경력 정보
        </h4>
        <div className="space-y-3">
          <InfoRow label="직무" value={job} />
          <InfoRow label="경력" value={experience} />
          <InfoRow label="전문분야" value={specialty} />
        </div>
      </Card>

      {/* Physical Conditions */}
      <Card className="p-6 border border-primary/20 shadow-md">
        <h4 className="text-xl font-bold text-foreground mb-5">신체 조건</h4>
        <div className="space-y-3">
          <InfoRow label="서기 가능" value={standingTime} />
          <InfoRow label="앉기 가능" value={sitting} />
          <InfoRow label="무거운 물건" value={heavyLifting} />
        </div>
      </Card>

      {/* Work Preferences */}
      <Card className="p-6 border border-primary/20 shadow-md">
        <h4 className="text-xl font-bold text-foreground mb-5">희망 근무 조건</h4>
        <div className="space-y-3">
          <InfoRow label="근무시간" value={workHours} />
          <InfoRow label="선호요일" value={preferredDays} />
          <InfoRow label="선호시간대" value={preferredTime} />
        </div>
      </Card>

      <Button 
        className="w-full h-16 text-lg font-bold bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-all rounded-xl mb-6"
        style={{ color: '#1e3a8a' }}
        onClick={() => setIsEditOpen(true)}
      >
        프로필 수정하기
      </Button>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[360px] border border-primary/20 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/10 text-primary text-xs px-2 py-0.5 font-bold border border-primary/30">
                <User size={12} className="mr-1" />
                프로필
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">프로필 수정</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              경력과 조건을 업데이트하세요
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            {/* Career Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="text-primary" size={16} />
                </div>
                <h4 className="text-lg font-bold text-foreground">경력 정보</h4>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job" className="text-sm font-medium text-foreground">직무</Label>
                <Input
                  id="job"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  className="h-11 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium text-foreground">경력</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger className="h-11 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20년">20년</SelectItem>
                    <SelectItem value="25년">25년</SelectItem>
                    <SelectItem value="30년">30년</SelectItem>
                    <SelectItem value="35년">35년</SelectItem>
                    <SelectItem value="40년 이상">40년 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-sm font-medium text-foreground">전문분야</Label>
                <Input
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="h-11 border-primary/20"
                />
              </div>
            </div>

            {/* Physical Conditions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <h4 className="text-lg font-bold text-foreground">신체 조건</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="standing" className="text-sm font-medium text-foreground">서기 가능 시간</Label>
                <Select value={standingTime} onValueChange={setStandingTime}>
                  <SelectTrigger className="h-11 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1시간">1시간</SelectItem>
                    <SelectItem value="2시간">2시간</SelectItem>
                    <SelectItem value="3시간">3시간</SelectItem>
                    <SelectItem value="4시간 이상">4시간 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sitting" className="text-sm font-medium text-foreground">앉기 가능</Label>
                <Select value={sitting} onValueChange={setSitting}>
                  <SelectTrigger className="h-11 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="제한없음">제한없음</SelectItem>
                    <SelectItem value="2시간">2시간</SelectItem>
                    <SelectItem value="4시간">4시간</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heavy" className="text-sm font-medium text-foreground">무거운 물건</Label>
                <Select value={heavyLifting} onValueChange={setHeavyLifting}>
                  <SelectTrigger className="h-11 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="가능">가능</SelectItem>
                    <SelectItem value="불가">불가</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Work Preferences */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock size={16} className="text-primary" />
                </div>
                <h4 className="text-lg font-bold text-foreground">희망 근무 조건</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="text-sm font-medium text-foreground">근무시간</Label>
                <Select value={workHours} onValueChange={setWorkHours}>
                  <SelectTrigger className="h-11 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="하루 2시간">하루 2시간</SelectItem>
                    <SelectItem value="하루 2-4시간">하루 2-4시간</SelectItem>
                    <SelectItem value="하루 4시간">하루 4시간</SelectItem>
                    <SelectItem value="유연">유연</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="days" className="text-sm font-medium text-foreground">선호 요일</Label>
                <Input
                  id="days"
                  value={preferredDays}
                  onChange={(e) => setPreferredDays(e.target.value)}
                  placeholder="예: 월, 수, 금"
                  className="h-11 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-foreground">선호 시간대</Label>
                <Input
                  id="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  placeholder="예: 오전 9시-오후 2시"
                  className="h-11 border-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              className="w-full h-14 text-lg font-bold bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-all rounded-xl"
              style={{ color: '#1e3a8a' }}
              onClick={() => setIsEditOpen(false)}
            >
              저장하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-primary/10 last:border-0">
      <span className="text-base text-muted-foreground font-medium">{label}</span>
      <span className="text-base font-bold text-foreground">{value}</span>
    </div>
  )
}

function HelpScreen() {
  return (
    <div className="min-h-full p-6 space-y-6 bg-linear-to-b from-primary/5 via-primary/3 to-background">
      <div className="pt-6">
        <h2 className="text-3xl font-bold text-foreground mb-3">도움말</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">자주 묻는 질문과 지원 정보</p>
      </div>

      <Card className="p-6 bg-linear-to-br from-primary to-primary/90 border border-primary/40 shadow-xl shadow-primary/30">
        <h3 className="text-xl font-bold text-primary-foreground mb-3">고객센터</h3>
        <p className="text-lg text-primary-foreground/90 mb-5 leading-relaxed">
          궁금한 점이 있으시면 언제든지 문의해주세요
        </p>
        <Button className="w-full h-14 text-lg font-bold bg-card text-foreground hover:bg-card/90 border border-primary/20 shadow-lg">
          1:1 문의하기
        </Button>
      </Card>

      <div className="space-y-4 pb-6">
        <h3 className="text-xl font-bold text-foreground">자주 묻는 질문</h3>

        <FAQItem
          question="태스크는 어떻게 신청하나요?"
          answer="추천된 태스크 카드를 클릭하고 '신청하기' 버튼을 누르시면 됩니다. 기업 검토 후 배정 여부를 알려드립니다."
        />
        <FAQItem question="급여는 언제 받나요?" answer="태스크 완료 후 7일 이내에 등록하신 계좌로 입금됩니다." />
        <FAQItem
          question="4대 보험은 어떻게 되나요?"
          answer="산재보험은 시간과 소득에 관계없이 의무 가입 대상입니다. 고용보험 및 주휴수당은 원칙적으로 가입 제외입니다."
        />
        <FAQItem
          question="기술 교육을 받을 수 있나요?"
          answer="경기테크노파크의 스마트공장 제조 데이터 분석 교육 등 맞춤형 재교육 과정을 제공합니다."
        />
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="p-5 border border-primary/20 hover:border-primary/40 shadow-md hover:shadow-lg transition-all">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left">
        <div className="flex justify-between items-center gap-3">
          <h4 className="text-base font-bold text-foreground leading-relaxed">{question}</h4>
          <ChevronRight
            size={20}
            className={`text-primary transition-transform shrink-0 ${isOpen ? "rotate-90" : ""}`}
          />
        </div>
      </button>
      {isOpen && <p className="mt-4 text-base text-muted-foreground leading-relaxed pl-1">{answer}</p>}
    </Card>
  )
}
