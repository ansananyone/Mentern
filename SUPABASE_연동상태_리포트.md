# 📊 Supabase 연동 상태 분석 리포트

**분석 일시**: 2025년 11월 1일  
**분석 대상**: Menturn 프론트엔드 ↔ Supabase DB 연동 상태  
**현재 USER_ID**: `11111111-1111-1111-1111-111111111111` (테스트용 고정값)

---

## 🚨 심각한 문제: 핵심 데이터 누락

### ❌ **users 테이블: 데이터 없음 (0건)**
```json
[]
```
**영향도**: 🔴 **치명적**  
**문제**: 프론트엔드에서 사용하는 `CURRENT_USER_ID`가 DB에 존재하지 않음

### ❌ **profiles 테이블: 데이터 없음 (0건)**
```json
[]
```
**영향도**: 🔴 **치명적**  
**문제**: 
- 홈 화면의 사용자 프로필 정보 전체 표시 불가
- "김철수님" 이름 표시 불가
- 경력, 평점, 인증 상태 등 모든 정보 누락

### ❌ **applications 테이블: 데이터 없음 (0건)**
```json
[]
```
**영향도**: 🟡 **중간**  
**문제**: "내 태스크" 화면에 지원 내역 표시 불가

---

## ✅ 정상 작동 중인 테이블

### ✅ **org_profiles 테이블: 1건**
```json
{
  "org_id": "22222222-2222-2222-2222-222222222222",
  "display_name": "안산 시니어 파트너스 품질관리센터",
  "contact_email": "contact@ansan-qc.org",
  "contact_phone": "031-500-6000",
  "address": "경기도 안산시 단원구 산업로 101",
  "industry": "제조 / 품질관리",
  "employee_count": 25,
  "rating": 4.8,
  "is_verified": true
}
```
✅ **정상**: org_profiles 데이터 존재

### ✅ **tasks 테이블: 3건**

**Task 1: 사출 부품 최종 육안 검사**
- 회사: 안산 시니어 파트너스 품질관리센터
- 예상 시간: 16시간 (주 2회, 회당 4시간)
- 예상 수입: 420,000원
- 신체 부담: 중간 (42kg)
- 기술 수준: 높음
- 태그: `["정밀검사", "사출", "육안검사"]`
- 스킬: `["품질검사", "사출부품", "육안검사", "치수측정"]`
- 근무일: 화, 목
- 근무지: 안산시 단원구 산업로 101

**Task 2: 금형 시제품 품질 점검**
- 회사: 안산 시니어 파트너스 품질관리센터
- 예상 시간: 20시간 (주 2회, 회당 5시간)
- 예상 수입: 520,000원
- 신체 부담: 중간 (48kg)
- 기술 수준: 높음
- 태그: `["금형", "정밀검사", "시제품"]`
- 스킬: `["금형검사", "시제품평가", "도면해독", "품질관리"]`
- 근무일: 월, 수

**Task 3: 플라스틱 금형 출고 검사**
- 회사: 안산 시니어 파트너스 품질관리센터
- 예상 시간: 18시간 (주 2회, 회당 4.5시간)
- 예상 수입: 480,000원
- 신체 부담: 중간 (45kg)
- 기술 수준: 높음
- 태그: `["금형", "육안검사", "품질보고"]`
- 스킬: `["금형검사", "육안검사", "게이지사용", "품질보고"]`
- 근무일: 월, 목

✅ **정상**: tasks 데이터 3건 존재, 모든 필수 필드 완비

---

## 🔍 프론트엔드 코드 연동 상태 분석

### 1. **HomeScreen (홈 화면)**

#### 📍 코드 위치: `app/page.tsx:146-349`

#### 🔴 **문제점**
```typescript
// 프로필 조회 (Line 166-173)
const { data: profileData, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', CURRENT_USER_ID)  // ❌ DB에 없는 ID
  .single()

// ❌ profileError 발생 예상: "JSON object requested, multiple (or no) rows returned"
```

**예상 동작**:
- ❌ `profileError` throw → catch 블록으로 이동
- ❌ `profile` 상태가 `null`로 유지
- ❌ 화면에 "로딩 중..." 표시 후 빈 데이터 표시

**영향받는 UI 요소**:
- ❌ 사용자 이름: `{profile?.name || '사용자'}` → "사용자" 표시
- ❌ 경력: `{profile?.years_of_experience || 0}년` → "0년" 표시
- ❌ 직함: `{profile?.kg_title?.[0] || '전문가'}` → "전문가" 표시
- ❌ 평점: `{profile?.rating || 0}` → "0" 표시
- ❌ 완료 태스크: `{profile?.total_completed_tasks || 0}건` → "0건" 표시
- ❌ 인증 배지: `{profile?.is_verified}` → 표시 안됨
- ❌ 자격증: `{profile?.certifications}` → 표시 안됨

#### ✅ **정상 작동 부분**
```typescript
// 태스크 조회 (Line 176-202)
const { data: tasksData } = await supabase
  .from('tasks')
  .select('*')
  .eq('status', 'open')
  .limit(2)

// ✅ 3건 중 2건 조회 성공
// ✅ org_profiles 조인으로 회사 이름 정상 표시
```

**정상 작동하는 UI**:
- ✅ 추천 태스크 2건 표시
- ✅ 회사 이름: "안산 시니어 파트너스 품질관리센터"
- ✅ 예상 시간, 수입, 태그 정상 표시

---

### 2. **TasksScreen (태스크 화면)**

#### 📍 코드 위치: `app/page.tsx:677-778`

#### ✅ **정상 작동**
```typescript
// 태스크 조회 (Line 706-738)
const { data: tasksData } = await supabase
  .from('tasks')
  .select('*')
  .eq('status', 'open')
  .limit(10)  // ✅ 3건 모두 조회 가능
```

**정상 작동**:
- ✅ 전체 오픈 태스크 3건 표시
- ✅ org_profiles 조인으로 회사 이름 정상 표시
- ✅ 태스크 상세 정보 모두 표시

---

### 3. **MyTasksScreen (내 태스크 화면)**

#### 📍 코드 위치: `app/page.tsx:780-975`

#### 🔴 **문제점**
```typescript
// 지원 내역 조회 (Line 796-814)
const { data, error } = await supabase
  .from('applications')
  .select(`
    *,
    tasks (...)
  `)
  .eq('user_id', CURRENT_USER_ID)  // ❌ 데이터 없음
```

**예상 동작**:
- ✅ 에러는 발생하지 않음 (빈 배열 반환)
- ❌ `myApplications.length === 0` → "신청한 태스크가 없습니다" 표시

---

### 4. **TaskCard (태스크 지원)**

#### 📍 코드 위치: `app/page.tsx:383-431`

#### 🟡 **부분 작동**
```typescript
// 지원하기 (Line 387-420)
const { data, error } = await supabase
  .from('applications')
  .insert({
    task_id: id,
    user_id: CURRENT_USER_ID,  // ⚠️ users 테이블에 없는 ID
    state: 'applied'
  })
```

**예상 동작**:
- ⚠️ RLS 정책에 따라 INSERT 성공 또는 실패 가능
- ⚠️ 외래 키 제약조건에 따라 실패 가능
- ✅ 실패 시 toast 에러 메시지 표시

---

### 5. **ProfileScreen (프로필 화면)**

#### 📍 코드 위치: `app/page.tsx:977-1275`

#### 🔴 **문제점**
```typescript
// 프로필 조회 (Line 989-1002)
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', CURRENT_USER_ID)
  .single()

// ❌ 데이터 없음 → error 발생
```

**예상 동작**:
- ❌ 에러 발생 → "로딩 중..." 후 빈 화면
- ❌ 모든 프로필 정보 표시 불가
- ❌ 프로필 수정 불가

---

## 📋 데이터 매핑 분석

### profiles 테이블 ↔ 프론트엔드 필드 매핑

| DB 컬럼 | 프론트엔드 사용처 | 상태 | 비고 |
|---------|------------------|------|------|
| `user_id` | CURRENT_USER_ID | ❌ 누락 | PK, 필수 |
| `name` | 사용자 이름 표시 | ❌ 누락 | 필수 |
| `kg_title` | 직함/직무 표시 | ❌ 누락 | 배열 |
| `years_of_experience` | 경력 표시 | ❌ 누락 | 필수 |
| `rating` | 평점 표시 | ❌ 누락 | 필수 |
| `total_completed_tasks` | 완료 태스크 수 | ❌ 누락 | 필수 |
| `total_hours_worked` | 누적 시간 | ❌ 누락 | - |
| `total_income` | 누적 수입 | ❌ 누락 | - |
| `is_verified` | 인증 배지 | ❌ 누락 | Boolean |
| `certifications` | 자격증 표시 | ❌ 누락 | 배열 |
| `experience_summary` | 전문분야 | ❌ 누락 | - |
| `p_stand_limit` | 서기 가능 시간 | ❌ 누락 | - |
| `p_sit_limit` | 앉기 가능 시간 | ❌ 누락 | - |
| `p_load_required` | 무거운 물건 | ❌ 누락 | - |
| `preference_work_hours` | 희망 근무시간 | ❌ 누락 | - |
| `preference_days` | 선호 요일 | ❌ 누락 | 배열 |
| `preference_time_range` | 선호 시간대 | ❌ 누락 | - |

### tasks 테이블 ↔ 프론트엔드 필드 매핑

| DB 컬럼 | 프론트엔드 사용처 | 상태 | 값 예시 |
|---------|------------------|------|---------|
| `id` | 태스크 ID | ✅ 정상 | UUID |
| `title` | 태스크 제목 | ✅ 정상 | "사출 부품 최종 육안 검사" |
| `org_display_name` | 회사 이름 | ✅ 정상 | "안산 시니어 파트너스..." |
| `expected_hours` | 예상 시간 | ✅ 정상 | 16 |
| `expected_income_net` | 예상 수입 | ✅ 정상 | 420000 |
| `physical_demand_level` | 신체 부담 | ✅ 정상 | "중간" |
| `skill_level_required` | 기술 수준 | ✅ 정상 | "높음" |
| `tags` | 태그 배열 | ✅ 정상 | ["정밀검사", "사출", ...] |
| `skills` | 스킬 배열 | ✅ 정상 | ["품질검사", ...] |
| `status` | 상태 | ✅ 정상 | "open" |

---

## 🎯 연동 가능성 평가

### 현재 상태 요약

| 화면 | 연동 가능 여부 | 평가 | 이유 |
|------|--------------|------|------|
| **홈 (HomeScreen)** | 🟡 **부분 가능** | 50% | 태스크는 표시, 프로필은 불가 |
| **태스크 (TasksScreen)** | ✅ **완전 가능** | 100% | 모든 데이터 정상 |
| **내 태스크 (MyTasksScreen)** | ❌ **불가능** | 0% | applications 데이터 없음 |
| **프로필 (ProfileScreen)** | ❌ **불가능** | 0% | profiles 데이터 없음 |
| **태스크 지원 (TaskCard)** | ⚠️ **불확실** | 50% | RLS 정책에 따라 다름 |

---

## 🔧 수정 필요 사항

### 🔴 긴급 (Critical)

#### 1. **users 테이블 데이터 생성**
```sql
INSERT INTO users (id, auth_uid, role, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'senior',
    NOW(),
    NOW()
);
```

#### 2. **profiles 테이블 데이터 생성**
```sql
INSERT INTO profiles (
    user_id, name, phone, birth_date, address,
    kg_title, experience_summary, years_of_experience,
    certifications, rating, total_completed_tasks, 
    total_hours_worked, total_income, satisfaction_rate,
    is_verified, bio,
    p_stand_limit, p_sit_limit, p_load_required,
    preference_work_hours, preference_days, preference_time_range,
    created_at, updated_at
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '김철수',
    '010-1234-5678',
    '1954-03-15',
    '경기도 안산시 단원구',
    ARRAY['품질관리 전문가', 'QC 전문가']::text[],
    '제조업 품질관리 및 부품검사',
    30,
    ARRAY['ISO 9001 자격증', '품질관리기사']::text[],
    4.9,
    12,
    48,
    960000,
    100,
    true,
    '30년 경력의 품질관리 전문가입니다.',
    '2시간',
    '제한없음',
    '불가',
    '하루 2-4시간',
    ARRAY['월', '수', '금']::text[],
    '오전 9시-오후 2시',
    NOW(),
    NOW()
);
```

---

### 🟡 중요 (Important)

#### 3. **applications 샘플 데이터 생성 (선택)**
테스트를 위해 1-2건의 샘플 지원 내역 추가
```sql
INSERT INTO applications (
    task_id, user_id, state, match_score, match_reason
)
VALUES (
    'd5f72356-09a4-53ed-b830-5eec3fbf567f',  -- Task 1
    '11111111-1111-1111-1111-111111111111',
    'applied',
    95,
    '김철수님의 30년 품질관리 경력과 95% 매칭됩니다'
);
```

---

### 🟢 권장 (Recommended)

#### 4. **프론트엔드 에러 처리 개선**
현재 코드는 데이터가 없을 때 에러를 throw하고 catch에서 로그만 찍습니다.
사용자에게 더 명확한 피드백이 필요합니다.

**현재**:
```typescript
catch (error) {
  console.error('데이터 로딩 실패:', error)  // ❌ 사용자 모름
}
```

**개선 제안** (코드 수정 시):
```typescript
catch (error) {
  console.error('데이터 로딩 실패:', error)
  toast({
    title: "데이터 로딩 실패",
    description: "프로필 정보를 불러올 수 없습니다.",
    variant: "destructive"
  })
}
```

---

## 📊 최종 결론

### ✅ 즉시 연동 가능 항목
1. ✅ **태스크 목록 표시** (HomeScreen, TasksScreen)
2. ✅ **태스크 상세 정보** (모든 필드 완비)
3. ✅ **회사 정보** (org_profiles 정상)

### ❌ 연동 불가 항목 (데이터 누락)
1. ❌ **사용자 프로필 전체** (profiles 테이블 비어있음)
2. ❌ **지원 내역** (applications 테이블 비어있음)
3. ❌ **사용자 통계** (완료 태스크, 누적 시간/수입)

### 🎯 연동 완료를 위한 필수 작업
1. 🔴 **users 테이블에 테스트 사용자 추가** (1건)
2. 🔴 **profiles 테이블에 김철수 프로필 추가** (1건)
3. 🟡 **applications 테이블에 샘플 지원 내역 추가** (선택, 1-2건)

### 📈 연동 완료 후 예상 결과
- ✅ 홈 화면: 프로필 + 추천 태스크 2건 완벽 표시
- ✅ 태스크 화면: 전체 3건 완벽 표시
- ✅ 내 태스크 화면: 지원 내역 표시
- ✅ 프로필 화면: 전체 정보 표시 및 수정 가능
- ✅ 태스크 지원: 정상 동작

---

## 🚀 다음 단계 권장 사항

1. **즉시 실행**: `SUPABASE_FIX_SCHEMA.sql` 파일 실행
2. **확인**: 브라우저 새로고침 후 모든 화면 테스트
3. **추가 데이터**: 필요시 org_profiles 및 tasks 추가 데이터 생성
4. **RLS 정책 확인**: applications INSERT 시 권한 확인

---

**작성자**: AI Assistant  
**참고 파일**: 
- `SUPABASE_FIX_SCHEMA.sql` (복구 SQL)
- `SUPABASE_복구가이드.md` (상세 가이드)
- `QUICK_RESTORE.md` (빠른 실행 가이드)

