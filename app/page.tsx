"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
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
import { Spinner } from "@/components/ui/spinner"

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

// 테스트용 고정 user_id (실제로는 인증 후 받아야 함)
const CURRENT_USER_ID = '11111111-1111-1111-1111-111111111111'

export default function MenturnApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [appliedTasks, setAppliedTasks] = useState<TaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [preloadedData, setPreloadedData] = useState<any>(null)
  const { toast } = useToast()

  // 인트로 영상 재생 중 데이터 미리 로딩
  useEffect(() => {
    const preloadData = async () => {
      try {
        // 프로필 조회
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', CURRENT_USER_ID)
          .single()

        if (profileError) {
          console.error('프로필 로딩 실패:', profileError)
          return
        }

        // 추천 태스크 조회
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('status', 'open')
          .not('org_id', 'eq', '22222222-2222-2222-2222-222222222222')
          .limit(2)

        if (tasksError) {
          console.error('태스크 로딩 실패:', tasksError)
          return
        }

        // org_profiles 조회
        const orgIds = [...new Set((tasksData || []).map(task => task.org_id).filter(Boolean))]
        
        if (orgIds.length > 0) {
          const { data: orgProfilesData } = await supabase
            .from('org_profiles')
            .select('org_id, display_name, contact_phone')
            .in('org_id', orgIds)

          // 데이터 매칭
          const orgMap = new Map(
            (orgProfilesData || []).map(org => [org.org_id, org])
          )

          const tasksWithOrgData = (tasksData || [])
            .map(task => {
              const orgData = orgMap.get(task.org_id)
              if (!orgData) return null
              
              return {
                ...task,
                org_display_name: orgData.display_name?.trim() || '멘턴 파트너사',
                org_phone: orgData.contact_phone?.trim() || null
              }
            })
            .filter(Boolean)

          setPreloadedData({
            profile: profileData,
            tasks: tasksWithOrgData
          })
        } else {
          setPreloadedData({
            profile: profileData,
            tasks: []
          })
        }

        setLoading(false)
        console.log('[Preload] 데이터 로딩 완료')
      } catch (error) {
        console.error('[Preload] 데이터 로딩 실패:', error)
        setLoading(false)
      }
    }

    // 인트로 영상 재생 시작 시 데이터 로딩 시작
    if (showIntro) {
      preloadData()
    }
  }, [showIntro])

  // 인트로 영상이 끝나면 메인 앱 표시
  const handleVideoEnd = () => {
    setShowIntro(false)
  }

  // 인트로 영상 표시 중
  if (showIntro) {
  return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E6E6E6' }}>
        <div className="w-full max-w-[390px] flex items-center justify-center">
          <video
            autoPlay
            playsInline
            muted
            onEnded={handleVideoEnd}
            className="w-[390px]"
            style={{ pointerEvents: 'none', height: 'auto' }}
          >
            <source src="/intro.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-start justify-center">
      <div
        className="w-full max-w-[390px] bg-card overflow-hidden flex flex-col border-l border-r border-border relative"
        style={{ minHeight: "100vh" }}
      >
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-20">
          {currentScreen === "home" && <HomeScreen setScreen={setCurrentScreen} appliedTasks={appliedTasks} setAppliedTasks={setAppliedTasks} preloadedData={preloadedData} />}
          {currentScreen === "tasks" && <TasksScreen setScreen={setCurrentScreen} appliedTasks={appliedTasks} setAppliedTasks={setAppliedTasks} />}
          {currentScreen === "mytasks" && <MyTasksScreen appliedTasks={appliedTasks} setAppliedTasks={setAppliedTasks} />}
          {currentScreen === "profile" && <ProfileScreen />}
          {currentScreen === "help" && <HelpScreen />}
        </div>

        {/* Bottom Navigation - Fixed */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto border-t border-primary/10 bg-white/80 backdrop-blur-xl shadow-2xl z-50 rounded-t-3xl">
          <div className="flex items-center justify-around py-4">
            <NavButton
              icon={<Home size={28} />}
              label="홈"
              active={currentScreen === "home"}
              onClick={() => setCurrentScreen("home")}
            />
            <NavButton
              icon={<Briefcase size={28} />}
              label="태스크"
              active={currentScreen === "tasks"}
              onClick={() => setCurrentScreen("tasks")}
            />
            <NavButton
              icon={<ClipboardList size={28} />}
              label="내 태스크"
              active={currentScreen === "mytasks"}
              onClick={() => setCurrentScreen("mytasks")}
            />
            <NavButton
              icon={<User size={28} />}
              label="내 정보"
              active={currentScreen === "profile"}
              onClick={() => setCurrentScreen("profile")}
            />
            <NavButton
              icon={<HelpCircle size={28} />}
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
      className={`flex flex-col items-center gap-2 px-5 py-2 transition-all relative ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <div className={`transition-transform ${active ? "scale-110" : ""}`}>{icon}</div>
      <span className={`text-sm font-bold transition-all ${active ? "scale-105" : ""}`}>{label}</span>
    </button>
  )
}

function HomeScreen({ 
  setScreen, 
  appliedTasks,
  setAppliedTasks,
  preloadedData
}: { 
  setScreen: (screen: Screen) => void
  appliedTasks: TaskItem[]
  setAppliedTasks: (tasks: TaskItem[]) => void
  preloadedData?: any
}) {
  const [profile, setProfile] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // preloadedData가 있으면 바로 사용
    if (preloadedData) {
      console.log('[HomeScreen] Preloaded 데이터 사용')
      setProfile(preloadedData.profile)
      setTasks(preloadedData.tasks)
      setLoading(false)
    } else {
      fetchProfileAndTasks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProfileAndTasks = async () => {
    try {
      // 프로필 조회
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', CURRENT_USER_ID)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      // 추천 태스크 조회 (더미 제외를 위해 더 많이 조회)
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'open')
        .not('org_id', 'eq', '22222222-2222-2222-2222-222222222222')  // 더미 제외
        .limit(2)

      if (tasksError) throw tasksError

      console.log('[HomeScreen] 조회된 tasks:', tasksData?.length || 0)

      // org_id가 있는 tasks만 필터링
      const validTasks = (tasksData || []).filter(task => task.org_id)

      // 유효한 tasks에서 사용된 모든 org_id 추출
      const orgIds = [...new Set(validTasks.map(task => task.org_id))]
      
      if (orgIds.length === 0) {
        console.warn('[HomeScreen] 유효한 org_id가 없습니다.')
        setTasks([])
        return
      }

      // 모든 org_profiles를 한 번에 조회
      const { data: orgProfilesData, error: orgError } = await supabase
        .from('org_profiles')
        .select('org_id, display_name, contact_phone')
        .in('org_id', orgIds)

      if (orgError) {
        console.error('[HomeScreen] org_profiles 조회 실패:', orgError)
        setTasks([])
        return
      }

      // org_id를 key로 하는 맵 생성
      const orgMap = new Map(
        (orgProfilesData || []).map(org => [org.org_id, org])
      )

      console.log('[HomeScreen] ✅ org_profiles 조회 성공:', {
        총_회사수: orgMap.size,
        회사_목록: Array.from(orgMap.entries()).map(([id, org]) => ({
          org_id: id,
          display_name: org.display_name?.trim(),
          contact_phone: org.contact_phone?.trim()
        }))
      })

      // tasks와 org_profiles 매칭 (org_profiles에 있는 것만)
      const tasksWithOrgData = validTasks
        .map(task => {
          const orgData = orgMap.get(task.org_id)
          
          if (!orgData) {
            console.warn(`[HomeScreen] ⚠️ org_profiles에 없는 org_id: ${task.org_id} (task: ${task.title})`)
            return null
          }
          
          return {
            ...task,
            org_display_name: orgData.display_name?.trim() || '멘턴 파트너사',
            org_phone: orgData.contact_phone?.trim() || null
          }
        })
        .filter(Boolean) // null 제거

      console.log('[HomeScreen] ✅ 최종 tasks 데이터:', tasksWithOrgData.map(t => ({
        id: t.id,
        title: t.title,
        org_display_name: t.org_display_name,
        org_phone: t.org_phone
      })))

      setTasks(tasksWithOrgData)
    } catch (error) {
      console.error('데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
  return (
      <div className="min-h-full p-6 flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="min-h-full p-6 space-y-6 bg-linear-to-b from-primary/5 via-primary/3 to-background">
      {/* 헤더 */}
      <div className="pt-6">
        <div className="mb-4">
          <Image
            src="/Group 20.png"
            alt="멘턴"
            width={180}
            height={60}
            className="h-auto"
            priority
          />
          </div>
        <p className="text-2xl font-bold leading-relaxed" style={{ color: '#0f172a' }}>
          안녕하세요, {profile?.name || '사용자'}님!
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">안산시가 당신의 새로운 여정을 응원합니다.</p>
      </div>

      {/* 프로필 카드 - 개선된 레이아웃 */}
      <Card className="relative overflow-hidden border border-primary/20 shadow-xl bg-white">
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl translate-y-16 -translate-x-16" />

        <div className="relative p-6 space-y-5">
          {/* 인증 배지 */}
          {profile?.is_verified && (
            <Badge className="bg-primary/10 text-primary text-xs px-2.5 py-1 font-bold border border-primary/30 rounded-lg flex items-center gap-1.5 w-fit">
              <CheckCircle2 size={12} />
              전문가 인증
            </Badge>
          )}

          {/* 메인 메시지 */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {profile?.name}님의 <span className="text-primary">{profile?.years_of_experience || 0}년</span> 경험은
            </h2>
            <p className="text-2xl font-bold text-foreground leading-tight">돈으로 살 수 없는 자산입니다</p>
          </div>

          {/* 프로필 정보 카드 */}
          <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl p-5 border border-primary/20 shadow-md">
            {/* 직무 */}
            <div className="mb-4 pb-4 border-b border-primary/20">
              <p className="text-sm font-medium text-muted-foreground mb-1">{profile?.name}님은</p>
              <p className="text-2xl font-bold text-primary">
                {profile?.kg_title?.[0] ? `${profile.kg_title[0]} 전문가` : '전문가'}
              </p>
              </div>

            {/* 통계 그리드 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-xl p-3 text-center border border-primary/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Award className="text-primary" size={16} />
                </div>
                <p className="text-xs text-muted-foreground mb-1">경력</p>
                <p className="text-lg font-bold text-foreground">{profile?.years_of_experience || 0}년</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-primary/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Star className="text-primary fill-primary" size={16} />
                </div>
                <p className="text-xs text-muted-foreground mb-1">평점</p>
                <p className="text-lg font-bold text-foreground">{profile?.rating || 0}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-primary/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Briefcase className="text-primary" size={16} />
                </div>
                <p className="text-xs text-muted-foreground mb-1">완료</p>
                <p className="text-lg font-bold text-foreground">{profile?.total_completed_tasks || 0}건</p>
                </div>
              </div>

            {/* 전문분야 */}
            <div className="bg-white rounded-xl p-3 border border-primary/10 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="text-primary" size={14} />
                <p className="text-xs font-medium text-muted-foreground">전문분야</p>
                </div>
              <p className="text-sm font-semibold text-foreground">
                {profile?.experience_summary || '경력 정보 없음'}
              </p>
              </div>

            {/* 자격증 */}
            {profile?.certifications && profile.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map((cert: string, i: number) => (
                  <Badge key={i} className="bg-white text-primary text-xs px-3 py-1.5 font-medium border border-primary/30 hover:bg-primary/5 transition-colors">
                    {cert}
                </Badge>
                ))}
              </div>
            )}
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
            <span className="text-2xl font-bold text-primary ml-6">총 {tasks.length}건</span>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map((task, index) => (
          <TaskCard
              key={task.id}
              id={task.id}
              company={task.org_display_name || '멘턴 파트너사'}
              title={task.title}
              time={`${task.expected_hours}시간`}
              pay={`${task.expected_income_net?.toLocaleString()}원`}
              physical={task.physical_demand_level || '중간'}
              skill={task.skill_level_required || '중간'}
              tags={task.tags || task.skills || []}
              phone={task.org_phone}
              isTopRecommended={index === 0}
              appliedTasks={appliedTasks}
              setAppliedTasks={setAppliedTasks}
              setScreen={setScreen}
          />
          ))}
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

      {/* Quick Stats - 개선된 그리드 레이아웃 */}
      <div className="pb-6">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary" size={22} />
          나의 활동 통계
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <Card className="p-4 border border-primary/20 shadow-md bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30 shrink-0">
                <Briefcase className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-0.5">완료한 태스크</p>
                <p className="text-2xl font-bold text-foreground">{profile?.total_completed_tasks || 0}건</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border border-primary/20 shadow-md bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30 shrink-0">
                <Clock className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-0.5">누적 근무시간</p>
                <p className="text-2xl font-bold text-foreground">{profile?.total_hours_worked || 0}시간</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border border-primary/20 shadow-md bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30 shrink-0">
                <DollarSign className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-0.5">누적 수입</p>
                <p className="text-2xl font-bold text-primary">{(profile?.total_income || 0).toLocaleString()}원</p>
              </div>
            </div>
          </Card>
        </div>
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
  phone,
  isTopRecommended,
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
  phone?: string
  isTopRecommended?: boolean
  appliedTasks: TaskItem[]
  setAppliedTasks: (tasks: TaskItem[]) => void
  setScreen?: (screen: Screen) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [applying, setApplying] = useState(false)
  const applicants = Math.floor(Math.random() * 8) + 3 // 3-10명 랜덤
  const isApplied = appliedTasks.some(task => task.id === id)
  const { toast } = useToast()

  const handleApply = async () => {
    console.log('=== 바로 지원하기 시작 ===')
    console.log('Task ID:', id)
    console.log('User ID:', CURRENT_USER_ID)
    
    setApplying(true)
    try {
      // Supabase에 지원 내역 INSERT
      const insertData = {
        task_id: id,
        user_id: CURRENT_USER_ID,
        state: 'applied',
        match_score: 95,
        match_reason: '김철수님의 경력과 95% 매칭됩니다'
      }
      
      console.log('INSERT 데이터:', insertData)
      
      const { data, error } = await supabase
        .from('applications')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase INSERT 에러:', error)
        throw error
      }

      console.log('✅ INSERT 성공:', data)

      // 로컬 상태 업데이트
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
      
      toast({
        title: "지원 완료!",
        description: "태스크 지원이 성공적으로 접수되었습니다.",
      })
    } catch (error: any) {
      console.error('❌ 지원 실패:', error)
      console.error('에러 상세:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      })
      
      toast({
        title: "지원 실패",
        description: error?.message || "다시 시도해주세요.",
        variant: "destructive"
      })
    } finally {
      setApplying(false)
      console.log('=== 바로 지원하기 종료 ===')
    }
  }

  return (
    <>
      <Card 
        className="p-6 transition-all hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] cursor-pointer border border-primary/20 hover:border-primary/40 bg-white shadow-md group relative"
        onClick={() => setIsOpen(true)}
      >
        {/* 최고 추천 뱃지 (오늘의 추천 업무 첫 번째) */}
        {isTopRecommended && !isApplied && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <circle cx="12" cy="8" r="6"/>
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
              <span className="text-xs font-bold text-amber-700">매우 적합</span>
            </div>
          </div>
        )}
        
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
        <DialogContent className="sm:max-w-[360px] border border-primary/10 p-0 max-h-[85vh] flex flex-col gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-3 shrink-0">
            <DialogTitle className="text-2xl font-bold text-foreground mb-1">{title}</DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground">
              {company}
            </DialogDescription>
          </DialogHeader>
          
          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="overflow-y-auto flex-1 px-6 py-2" style={{ maxHeight: 'calc(85vh - 220px)' }}>
            <div className="space-y-4">
              {/* 근무 정보 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">근무 시간</p>
                    <p className="text-base font-bold text-foreground">{time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <DollarSign size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">급여</p>
                    <p className="text-base font-bold text-primary">{pay}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Users size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">현재 지원자</p>
                    <p className="text-base font-bold text-foreground">{applicants}명</p>
                  </div>
                </div>
              </div>

              {/* 조건 배지 */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-sm px-2.5 py-1.5 font-medium border-primary/20">
                    신체부담: {physical}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-2.5 py-1.5 font-medium border-primary/20">
                    기술수준: {skill}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <Badge
                      key={i}
                      className="bg-primary/10 text-primary text-sm px-2.5 py-1.5 font-medium border border-primary/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI 추천 이유 */}
              <Card className="p-3 bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground mb-1">AI 추천 이유</p>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      김철수님의 품질관리 30년 경력과 95% 매칭되며, 신체 부담이 낮아 적합합니다.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 하단 고정 CTA 영역 */}
          <div className="shrink-0 px-6 pb-6 pt-3 border-t border-primary/10 space-y-3">
            {/* 전화 문의 */}
            {phone && (
              <a href={`tel:${phone}`} className="block">
                <Card className="p-3 bg-white border border-primary/20 hover:bg-primary/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">전화 문의</p>
                      <p className="text-base font-bold text-primary">{phone}</p>
                    </div>
                  </div>
                </Card>
              </a>
            )}

            {/* 바로 지원하기 버튼 */}
            {isApplied ? (
              <Button 
                className="w-full h-12 text-base font-bold bg-primary/5 border border-primary/20 rounded-xl opacity-60 cursor-not-allowed"
                style={{ color: '#1e3a8a' }}
                disabled
              >
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>지원 완료</span>
                </span>
              </Button>
            ) : (
              <Button 
                className="w-full h-12 text-base font-bold bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-all rounded-xl group"
                style={{ color: '#1e3a8a' }}
                onClick={handleApply}
                disabled={applying}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{applying ? '지원 중...' : '바로 지원하기'}</span>
                  {!applying && <ChevronRight className="transition-transform group-hover:translate-x-1" size={20} />}
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


function TasksScreen({ 
  setScreen,
  appliedTasks,
  setAppliedTasks 
}: { 
  setScreen: (screen: Screen) => void
  appliedTasks: TaskItem[]
  setAppliedTasks: (tasks: TaskItem[]) => void
}) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetchTasksAndProfile()
  }, [])

  const fetchTasksAndProfile = async () => {
    try {
      // 프로필 조회
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', CURRENT_USER_ID)
        .single()
      
      setProfile(profileData)

      // 모든 오픈 태스크 조회 (더미 제외)
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'open')
        .not('org_id', 'eq', '22222222-2222-2222-2222-222222222222')  // 더미 제외
        .limit(20)

      if (error) throw error

      console.log('[TasksScreen] 조회된 tasks:', tasksData?.length || 0)

      // org_id가 있는 tasks만 필터링
      const validTasks = (tasksData || []).filter(task => task.org_id)

      // 유효한 tasks에서 사용된 모든 org_id 추출
      const orgIds = [...new Set(validTasks.map(task => task.org_id))]
      
      if (orgIds.length === 0) {
        console.warn('[TasksScreen] 유효한 org_id가 없습니다.')
        setTasks([])
        return
      }

      // 모든 org_profiles를 한 번에 조회
      const { data: orgProfilesData, error: orgError } = await supabase
        .from('org_profiles')
        .select('org_id, display_name, contact_phone')
        .in('org_id', orgIds)

      if (orgError) {
        console.error('[TasksScreen] org_profiles 조회 실패:', orgError)
        setTasks([])
        return
      }

      // org_id를 key로 하는 맵 생성
      const orgMap = new Map(
        (orgProfilesData || []).map(org => [org.org_id, org])
      )

      console.log('[TasksScreen] ✅ org_profiles 조회 성공:', {
        총_회사수: orgMap.size,
        회사_목록: Array.from(orgMap.entries()).map(([id, org]) => ({
          org_id: id,
          display_name: org.display_name?.trim(),
          contact_phone: org.contact_phone?.trim()
        }))
      })

      // tasks와 org_profiles 매칭 (org_profiles에 있는 것만)
      const tasksWithOrgData = validTasks
        .map(task => {
          const orgData = orgMap.get(task.org_id)
          
          if (!orgData) {
            console.warn(`[TasksScreen] ⚠️ org_profiles에 없는 org_id: ${task.org_id} (task: ${task.title})`)
            return null
          }
          
          return {
            ...task,
            org_display_name: orgData.display_name?.trim() || '멘턴 파트너사',
            org_phone: orgData.contact_phone?.trim() || null
          }
        })
        .filter(Boolean) // null 제거

      console.log('[TasksScreen] ✅ 최종 tasks 데이터:', tasksWithOrgData.map(t => ({
        id: t.id,
        title: t.title,
        org_display_name: t.org_display_name,
        org_phone: t.org_phone
      })))

      setTasks(tasksWithOrgData)
    } catch (error) {
      console.error('태스크 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
  return (
      <div className="min-h-full p-6 flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
  )
}

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
          <p className="text-lg text-muted-foreground leading-relaxed">
            {profile?.name || '사용자'}님의 경력을 바탕으로 선별된 일자리입니다
          </p>
      </div>

        <Card className="p-4 bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Award className="text-primary" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{profile?.name || '사용자'}님의 전문성과 매칭률</p>
              <p className="text-xs text-muted-foreground">아래 태스크는 95% 이상의 적합도를 보입니다</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4 pb-6">
        {tasks.map((task) => (
        <TaskCard
            key={task.id}
            id={task.id}
            company={task.org_display_name || '멘턴 파트너사'}
            title={task.title}
            time={`${task.expected_hours}시간`}
            pay={`${task.expected_income_net?.toLocaleString()}원`}
            physical={task.physical_demand_level || '중간'}
            skill={task.skill_level_required || '중간'}
            tags={task.tags || task.skills || []}
            phone={task.org_phone}
            appliedTasks={appliedTasks}
            setAppliedTasks={setAppliedTasks}
            setScreen={setScreen}
        />
        ))}
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
  const [myApplications, setMyApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMyApplications()
  }, [])

  const fetchMyApplications = async () => {
    try {
      // 내 지원 내역 조회 (태스크 정보 조인)
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          tasks (
            id,
            title,
            org_display_name,
            expected_hours,
            expected_income_net,
            physical_demand_level,
            skill_level_required,
            tags,
            skills
          )
        `)
        .eq('user_id', CURRENT_USER_ID)
        .order('applied_at', { ascending: false })

      if (error) throw error
      setMyApplications(data || [])
    } catch (error) {
      console.error('지원 내역 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)

      if (error) throw error

      setMyApplications(myApplications.filter(app => app.id !== applicationId))
      toast({
        title: "지원 취소 완료",
        description: "태스크 지원이 취소되었습니다.",
      })
    } catch (error) {
      console.error('지원 취소 실패:', error)
      toast({
        title: "취소 실패",
        description: "다시 시도해주세요.",
        variant: "destructive"
      })
    }
  }

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
      case "accepted":
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

  if (loading) {
    return (
      <div className="min-h-full p-6 flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="min-h-full p-6 space-y-6 bg-linear-to-b from-primary/5 via-primary/3 to-background">
      <div className="pt-6">
        <h2 className="text-3xl font-bold text-foreground mb-3">내 태스크</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">신청 및 배정된 태스크 목록</p>
      </div>

      {myApplications.length === 0 ? (
        <Card className="p-12 border border-primary/20 shadow-md text-center bg-white">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/5 flex items-center justify-center">
            <ClipboardList size={40} className="text-primary/40" />
          </div>
          <p className="text-lg font-bold text-foreground mb-2">신청한 태스크가 없습니다</p>
          <p className="text-sm text-muted-foreground">추천 태스크를 확인하고 지원해보세요</p>
        </Card>
      ) : (
        <div className="space-y-4 pb-6">
          {myApplications.map((application) => {
            const task = application.tasks
            if (!task) return null
            
            return (
              <Card key={application.id} className="p-6 border border-primary/20 shadow-md bg-white">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-base text-muted-foreground mb-2">
                        {task.org_display_name || '멘턴 파트너사'}
                      </p>
                      <h4 className="text-xl font-bold text-foreground leading-relaxed">{task.title}</h4>
                    </div>
                    {getStatusBadge(application.state)}
                  </div>

                  <div className="flex items-center gap-5 text-lg">
                    <div className="flex items-center gap-2 text-foreground">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock size={20} className="text-primary" />
                      </div>
                      <span className="font-bold">{task.expected_hours}시간</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DollarSign size={20} className="text-primary" />
                      </div>
                      <span>{task.expected_income_net?.toLocaleString()}원</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(task.tags || task.skills || []).map((tag: string, i: number) => (
                      <Badge
                        key={i}
                        className="bg-primary/10 text-primary text-sm px-3 py-1.5 font-medium border border-primary/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {application.state === "applied" && (
                    <div className="pt-3 border-t border-primary/10 space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        기업 검토 후 배정 여부를 알려드립니다
                      </p>
                      <Button 
                        className="w-full h-12 text-base font-medium bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-all rounded-xl"
                        onClick={() => handleWithdraw(application.id)}
                      >
                        신청 취소하기
                      </Button>
                    </div>
                  )}

                  {(application.state === "approved" || application.state === "accepted") && (
                    <Button 
                      className="w-full h-12 text-base font-bold bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-all rounded-xl mt-2"
                      style={{ color: '#1e3a8a' }}
                    >
                      근무 준비사항 확인하기
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editedProfile, setEditedProfile] = useState<any>({})
  const { toast } = useToast()

  // 요일 영문 -> 한글 변환
  const translateDay = (day: string) => {
    const dayMap: { [key: string]: string } = {
      'mon': '월', 'tue': '화', 'wed': '수', 'thu': '목',
      'fri': '금', 'sat': '토', 'sun': '일'
    }
    return dayMap[day.toLowerCase()] || day
  }

  // 이동성 영문 -> 한글 변환
  const translateMobility = (mobility: string) => {
    const mobilityMap: { [key: string]: string } = {
      'excellent': '우수',
      'good': '양호',
      'fair': '보통',
      'limited': '제한적'
    }
    return mobilityMap[mobility?.toLowerCase()] || mobility
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', CURRENT_USER_ID)
        .single()

      if (error) throw error
      setProfile(data)
      setEditedProfile(data)
    } catch (error) {
      console.error('프로필 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(editedProfile)
        .eq('user_id', CURRENT_USER_ID)

      if (error) throw error

      setProfile(editedProfile)
      setIsEditOpen(false)
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      })
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
      toast({
        title: "업데이트 실패",
        description: "다시 시도해주세요.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
  return (
      <div className="min-h-full p-6 flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="min-h-full p-6 space-y-6 bg-linear-to-b from-primary/5 via-primary/3 to-background">
      <div className="pt-6">
        <h2 className="text-3xl font-bold text-foreground mb-3">내 프로필</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">경력과 조건을 관리하세요</p>
      </div>

      {/* 프로필 헤더 카드 */}
      <Card className="p-5 border border-primary/10 shadow-md bg-white">
        <div className="space-y-4">
          {/* 상단: 프로필 정보 */}
          <div className="flex items-center gap-4">
            {/* 프로필 이미지 */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User size={40} className="text-primary" />
          </div>
              {profile?.is_verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-primary/10">
                  <CheckCircle2 size={16} className="text-primary" />
          </div>
              )}
        </div>

            {/* 이름 및 직무 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-foreground mb-1 truncate">{profile?.name}</h3>
              <p className="text-base text-primary font-semibold truncate">
                {profile?.kg_title?.[0] ? `${profile.kg_title[0]} 전문가` : '전문가'}
              </p>
            </div>
          </div>

          {/* 평점 및 완료 건수 */}
          <div className="flex items-center gap-3 pb-4 border-b border-primary/10">
            <div className="flex items-center gap-2 bg-primary/5 px-4 py-2.5 rounded-lg border border-primary/10">
              <Star className="text-primary fill-primary" size={20} />
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{profile?.rating || 0}</span>
                <span className="text-sm text-muted-foreground">/5</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 px-4 py-2.5 rounded-lg border border-primary/10">
              <Briefcase className="text-primary" size={20} />
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{profile?.total_completed_tasks || 0}</span>
                <span className="text-sm text-muted-foreground">건</span>
              </div>
            </div>
          </div>

          {/* 통계 그리드 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/10">
              <Award className="text-primary mx-auto mb-2" size={20} />
              <p className="text-2xl font-bold text-foreground mb-0.5">{profile?.years_of_experience || 0}</p>
              <p className="text-xs text-muted-foreground font-medium">년 경력</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/10">
              <Clock className="text-primary mx-auto mb-2" size={20} />
              <p className="text-2xl font-bold text-foreground mb-0.5">{profile?.total_hours_worked || 0}</p>
              <p className="text-xs text-muted-foreground font-medium">누적시간</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/10">
              <TrendingUp className="text-primary mx-auto mb-2" size={20} />
              <p className="text-2xl font-bold text-foreground mb-0.5">{profile?.satisfaction_rate || 0}</p>
              <p className="text-xs text-muted-foreground font-medium">만족도 %</p>
            </div>
          </div>

          {/* 자격증 */}
          {profile?.certifications && profile.certifications.length > 0 && (
            <div className="bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="text-primary" size={14} />
                </div>
                <span className="text-sm font-bold text-foreground">보유 자격증</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map((cert: string, i: number) => (
                  <Badge key={i} className="bg-primary/10 text-primary text-xs px-3 py-1.5 font-medium border border-primary/30 hover:bg-primary/20 transition-colors">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 경력 정보 */}
      <Card className="p-5 border border-primary/10 shadow-md bg-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="text-primary" size={18} />
          </div>
          <h4 className="text-lg font-bold text-foreground">경력 정보</h4>
        </div>
        <div className="space-y-3">
          <div className="bg-primary/5 rounded-lg p-3.5 border border-primary/10">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">직무</p>
            <p className="text-sm font-bold text-foreground leading-relaxed">{profile?.kg_title?.join(', ') || '-'}</p>
          </div>
          <div className="bg-primary/5 rounded-lg p-3.5 border border-primary/10">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">전문분야</p>
            <p className="text-sm font-bold text-foreground leading-relaxed">{profile?.experience_summary || '-'}</p>
          </div>
        </div>
      </Card>

      {/* 신체 조건 & 희망 근무 조건 */}
      <div className="grid grid-cols-1 gap-4">
        {/* 신체 조건 */}
        <Card className="p-5 border border-primary/10 shadow-md bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="text-primary" size={18} />
            </div>
            <h4 className="text-lg font-bold text-foreground">신체 조건</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">서기 가능</p>
              <p className="text-sm font-bold text-foreground">
                {profile?.physical_constraints?.standing_hours_max ? `최대 ${profile.physical_constraints.standing_hours_max}시간` : '-'}
              </p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">이동성</p>
              <p className="text-sm font-bold text-foreground">
                {profile?.physical_constraints?.mobility ? translateMobility(profile.physical_constraints.mobility) : '-'}
              </p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">무거운 물건</p>
              <p className="text-sm font-bold text-foreground">
                {profile?.physical_constraints?.lifting === false ? '불가' : profile?.physical_constraints?.lifting === true ? '가능' : '-'}
              </p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">풀타임</p>
              <p className="text-sm font-bold text-foreground">
                {profile?.physical_constraints?.fulltime_difficult === true ? '어려움' : profile?.physical_constraints?.fulltime_difficult === false ? '가능' : '-'}
              </p>
            </div>
        </div>
      </Card>

        {/* 희망 근무 조건 */}
        <Card className="p-5 border border-primary/10 shadow-md bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="text-primary" size={18} />
            </div>
            <h4 className="text-lg font-bold text-foreground">희망 근무 조건</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <span className="text-xs font-medium text-muted-foreground">하루 최대</span>
              <span className="text-sm font-bold text-foreground">
                {profile?.work_prefs?.max_hours_per_day ? `${profile.work_prefs.max_hours_per_day}시간` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <span className="text-xs font-medium text-muted-foreground">주당 최대</span>
              <span className="text-sm font-bold text-foreground">
                {profile?.work_prefs?.max_hours_per_week ? `${profile.work_prefs.max_hours_per_week}시간` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <span className="text-xs font-medium text-muted-foreground">선호시간대</span>
              <span className="text-sm font-bold text-foreground">
                {profile?.work_prefs?.preferred_hours ? `${profile.work_prefs.preferred_hours[0]}시 - ${profile.work_prefs.preferred_hours[1]}시` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <span className="text-xs font-medium text-muted-foreground">선호요일</span>
              <span className="text-sm font-bold text-foreground">
                {profile?.work_prefs?.preferred_days?.map((day: string) => translateDay(day)).join(', ') || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3.5 border border-primary/10">
              <span className="text-xs font-medium text-muted-foreground">원격근무</span>
              <span className="text-sm font-bold text-foreground">
                {profile?.work_prefs?.remote_ok === true ? '가능' : profile?.work_prefs?.remote_ok === false ? '불가' : '-'}
              </span>
            </div>
        </div>
      </Card>
      </div>

      <Button 
        className="w-full h-16 text-lg font-bold bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-all rounded-xl mb-6 shadow-md"
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
                <Label htmlFor="experience_summary" className="text-sm font-medium text-foreground">전문분야</Label>
                <Input
                  id="experience_summary"
                  value={editedProfile?.experience_summary || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, experience_summary: e.target.value})}
                  className="h-11 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_of_experience" className="text-sm font-medium text-foreground">경력 (년)</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  value={editedProfile?.years_of_experience || 0}
                  onChange={(e) => setEditedProfile({...editedProfile, years_of_experience: parseInt(e.target.value) || 0})}
                  className="h-11 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-foreground">자기소개</Label>
                <Input
                  id="bio"
                  value={editedProfile?.bio || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
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
                <Label htmlFor="standing_hours" className="text-sm font-medium text-foreground">서기 가능 시간 (최대)</Label>
                <Input
                  id="standing_hours"
                  type="number"
                  value={editedProfile?.physical_constraints?.standing_hours_max || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile, 
                    physical_constraints: {
                      ...editedProfile?.physical_constraints,
                      standing_hours_max: parseInt(e.target.value) || 0
                    }
                  })}
                  className="h-11 border-primary/20"
                  placeholder="예: 4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobility" className="text-sm font-medium text-foreground">이동성</Label>
                <Select
                  value={editedProfile?.physical_constraints?.mobility || 'good'}
                  onValueChange={(value) => setEditedProfile({
                    ...editedProfile,
                    physical_constraints: {
                      ...editedProfile?.physical_constraints,
                      mobility: value
                    }
                  })}
                >
                  <SelectTrigger className="h-11 border-primary/20">
                    <SelectValue placeholder="이동성 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">우수</SelectItem>
                    <SelectItem value="good">양호</SelectItem>
                    <SelectItem value="fair">보통</SelectItem>
                    <SelectItem value="limited">제한적</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifting" className="text-sm font-medium text-foreground">무거운 물건 들기</Label>
                <Select
                  value={editedProfile?.physical_constraints?.lifting === true ? 'yes' : editedProfile?.physical_constraints?.lifting === false ? 'no' : 'no'}
                  onValueChange={(value) => setEditedProfile({
                    ...editedProfile,
                    physical_constraints: {
                      ...editedProfile?.physical_constraints,
                      lifting: value === 'yes'
                    }
                  })}
                >
                  <SelectTrigger className="h-11 border-primary/20">
                    <SelectValue placeholder="가능 여부" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">가능</SelectItem>
                    <SelectItem value="no">불가</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fulltime" className="text-sm font-medium text-foreground">풀타임 근무</Label>
                <Select
                  value={editedProfile?.physical_constraints?.fulltime_difficult === true ? 'difficult' : editedProfile?.physical_constraints?.fulltime_difficult === false ? 'ok' : 'difficult'}
                  onValueChange={(value) => setEditedProfile({
                    ...editedProfile,
                    physical_constraints: {
                      ...editedProfile?.physical_constraints,
                      fulltime_difficult: value === 'difficult'
                    }
                  })}
                >
                  <SelectTrigger className="h-11 border-primary/20">
                    <SelectValue placeholder="풀타임 가능 여부" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ok">가능</SelectItem>
                    <SelectItem value="difficult">어려움</SelectItem>
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
                <Label htmlFor="max_hours_day" className="text-sm font-medium text-foreground">하루 최대 근무시간</Label>
                <Input
                  id="max_hours_day"
                  type="number"
                  value={editedProfile?.work_prefs?.max_hours_per_day || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    work_prefs: {
                      ...editedProfile?.work_prefs,
                      max_hours_per_day: parseInt(e.target.value) || 0
                    }
                  })}
                  className="h-11 border-primary/20"
                  placeholder="예: 5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_hours_week" className="text-sm font-medium text-foreground">주당 최대 근무시간</Label>
                <Input
                  id="max_hours_week"
                  type="number"
                  value={editedProfile?.work_prefs?.max_hours_per_week || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    work_prefs: {
                      ...editedProfile?.work_prefs,
                      max_hours_per_week: parseInt(e.target.value) || 0
                    }
                  })}
                  className="h-11 border-primary/20"
                  placeholder="예: 20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="days" className="text-sm font-medium text-foreground">선호 요일 (쉼표로 구분)</Label>
                <Input
                  id="days"
                  value={editedProfile?.work_prefs?.preferred_days?.join(', ') || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    work_prefs: {
                      ...editedProfile?.work_prefs,
                      preferred_days: e.target.value.split(',').map(s => s.trim())
                    }
                  })}
                  placeholder="예: mon, tue, wed, thu, fri"
                  className="h-11 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_hours_start" className="text-sm font-medium text-foreground">선호 시작 시간</Label>
                <Input
                  id="preferred_hours_start"
                  type="number"
                  value={editedProfile?.work_prefs?.preferred_hours?.[0] || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    work_prefs: {
                      ...editedProfile?.work_prefs,
                      preferred_hours: [
                        parseInt(e.target.value) || 9,
                        editedProfile?.work_prefs?.preferred_hours?.[1] || 17
                      ]
                    }
                  })}
                  className="h-11 border-primary/20"
                  placeholder="예: 9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_hours_end" className="text-sm font-medium text-foreground">선호 종료 시간</Label>
                <Input
                  id="preferred_hours_end"
                  type="number"
                  value={editedProfile?.work_prefs?.preferred_hours?.[1] || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    work_prefs: {
                      ...editedProfile?.work_prefs,
                      preferred_hours: [
                        editedProfile?.work_prefs?.preferred_hours?.[0] || 9,
                        parseInt(e.target.value) || 17
                      ]
                    }
                  })}
                  className="h-11 border-primary/20"
                  placeholder="예: 13"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remote_ok" className="text-sm font-medium text-foreground">원격근무</Label>
                <Select
                  value={editedProfile?.work_prefs?.remote_ok === true ? 'yes' : editedProfile?.work_prefs?.remote_ok === false ? 'no' : 'no'}
                  onValueChange={(value) => setEditedProfile({
                    ...editedProfile,
                    work_prefs: {
                      ...editedProfile?.work_prefs,
                      remote_ok: value === 'yes'
                    }
                  })}
                >
                  <SelectTrigger className="h-11 border-primary/20">
                    <SelectValue placeholder="원격근무 가능 여부" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">가능</SelectItem>
                    <SelectItem value="no">불가</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              className="w-full h-14 text-lg font-bold bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-all rounded-xl"
              style={{ color: '#1e3a8a' }}
              onClick={handleSaveProfile}
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

      {/* 고객센터 카드 */}
      <Card className="p-6 bg-white border border-primary/10 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <HelpCircle className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">고객센터</h3>
            <p className="text-base text-muted-foreground">
              궁금한 점을 문의하세요
        </p>
          </div>
        </div>
        <Button className="w-full h-16 text-lg font-bold bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 rounded-xl transition-colors">
          1:1 문의하기
        </Button>
      </Card>

      {/* 자주 묻는 질문 */}
      <div className="space-y-4 pb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">자주 묻는 질문</h3>

        <FAQItem
          question="태스크는 어떻게 신청하나요?"
          answer="추천된 태스크 카드를 클릭하고 '신청하기' 버튼을 누르시면 됩니다. 기업 검토 후 배정 여부를 알려드립니다."
        />
        <FAQItem 
          question="급여는 언제 받나요?" 
          answer="태스크 완료 후 7일 이내에 등록하신 계좌로 입금됩니다." 
        />
        <FAQItem
          question="4대 보험은 어떻게 되나요?"
          answer="산재보험은 시간과 소득에 관계없이 의무 가입 대상입니다. 고용보험 및 주휴수당은 원칙적으로 가입 제외입니다."
        />
        <FAQItem
          question="프로필은 어떻게 수정하나요?"
          answer="하단 메뉴에서 '내 정보'를 누르고 '프로필 수정하기' 버튼을 누르시면 경력과 근무 조건을 변경하실 수 있습니다."
        />
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="bg-white border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left p-5"
      >
        <div className="flex justify-between items-start gap-4">
          <h4 className="text-lg font-bold text-foreground leading-relaxed flex-1">
            {question}
          </h4>
          <ChevronRight
            size={24}
            className={`text-primary transition-transform shrink-0 mt-0.5 ${isOpen ? "rotate-90" : ""}`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="pt-4 border-t border-primary/10">
            <p className="text-base text-foreground leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
