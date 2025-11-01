# 🏢 다양한 회사 및 태스크 추가 SQL

## 현재 문제

- `org_profiles` 테이블에 **회사가 1개만** 등록되어 있음
- 모든 태스크가 동일한 회사("안산 시니어 파트너스 품질관리센터")를 가리킴
- 프론트엔드에서 모든 태스크 카드에 같은 회사 이름이 표시됨

## 해결: 다양한 회사 및 태스크 추가

Supabase SQL Editor에서 다음 SQL을 실행하세요:

### 1단계: 추가 회사 등록 (org_profiles)

```sql
-- 기존 회사 1개: 안산 시니어 파트너스 품질관리센터

-- 추가 회사 삽입
INSERT INTO org_profiles (
  org_id,
  display_name,
  legal_name,
  org_type,
  industry,
  contact_phone,
  contact_email,
  created_at
) VALUES
-- 회사 2: 스마트 제조 협동조합
(
  '33333333-3333-3333-3333-333333333333',
  '스마트 제조 협동조합',
  '스마트 제조 협동조합',
  'client',
  'manufacturing',
  '031-987-6543',
  'contact@smartmfg.kr',
  NOW()
),
-- 회사 3: 안산 전자부품 주식회사
(
  '44444444-4444-4444-4444-444444444444',
  '안산 전자부품 주식회사',
  '안산 전자부품(주)',
  'client',
  'electronics',
  '031-555-7788',
  'hr@ansanelec.co.kr',
  NOW()
),
-- 회사 4: 글로벌 패키징 센터
(
  '55555555-5555-5555-5555-555555555555',
  '글로벌 패키징 센터',
  '글로벌 패키징 센터',
  'client',
  'logistics',
  '031-234-5678',
  'jobs@globalpack.kr',
  NOW()
),
-- 회사 5: 테크 어셈블리 파트너스
(
  '66666666-6666-6666-6666-666666666666',
  '테크 어셈블리 파트너스',
  '테크 어셈블리 파트너스(주)',
  'client',
  'manufacturing',
  '031-888-9999',
  'recruit@techassembly.kr',
  NOW()
);
```

### 2단계: 다양한 태스크 추가

```sql
-- 기존 태스크 3개는 모두 org_id '22222222-2222-2222-2222-222222222222' 사용

-- 새로운 태스크 삽입 (다른 회사들)
INSERT INTO tasks (
  id,
  org_id,
  org_display_name,
  title,
  description,
  status,
  physical_demand_level,
  skill_level_required,
  expected_hours,
  expected_income_net,
  tags,
  created_at
) VALUES
-- 스마트 제조 협동조합의 태스크
(
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  '스마트 제조 협동조합',
  'PCB 기판 납땜 검사',
  '전자제품 PCB 기판의 납땜 상태를 육안으로 검사하는 업무입니다.',
  'open',
  'light',
  'intermediate',
  12,
  300000,
  ARRAY['전자제품', '검사', '납땜']::text[],
  NOW()
),
(
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  '스마트 제조 협동조합',
  '제품 조립 보조',
  '소형 전자제품 조립 라인에서 부품 조립을 보조합니다.',
  'open',
  'light',
  'beginner',
  16,
  380000,
  ARRAY['조립', '전자제품', '보조']::text[],
  NOW()
),

-- 안산 전자부품 주식회사의 태스크
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444444',
  '안산 전자부품 주식회사',
  '부품 재고 정리 및 분류',
  '전자부품 창고에서 재고를 정리하고 분류하는 업무입니다.',
  'open',
  'medium',
  'beginner',
  20,
  450000,
  ARRAY['재고관리', '정리', '분류']::text[],
  NOW()
),
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444444',
  '안산 전자부품 주식회사',
  '출고 제품 포장 검수',
  '출고 예정 제품의 포장 상태를 검수하고 라벨링합니다.',
  'open',
  'light',
  'beginner',
  14,
  320000,
  ARRAY['포장', '검수', '라벨링']::text[],
  NOW()
),

-- 글로벌 패키징 센터의 태스크
(
  gen_random_uuid(),
  '55555555-5555-5555-5555-555555555555',
  '글로벌 패키징 센터',
  '포장재 품질 검사',
  '수입된 포장재의 품질을 검사하고 불량품을 분류합니다.',
  'open',
  'light',
  'intermediate',
  18,
  420000,
  ARRAY['품질검사', '포장재', '분류']::text[],
  NOW()
),
(
  gen_random_uuid(),
  '55555555-5555-5555-5555-555555555555',
  '글로벌 패키징 센터',
  '물류 라벨 부착 작업',
  '출고 제품에 배송 라벨을 부착하는 작업입니다.',
  'open',
  'light',
  'beginner',
  10,
  240000,
  ARRAY['라벨링', '물류', '포장']::text[],
  NOW()
),

-- 테크 어셈블리 파트너스의 태스크
(
  gen_random_uuid(),
  '66666666-6666-6666-6666-666666666666',
  '테크 어셈블리 파트너스',
  '정밀 나사 체결 작업',
  '정밀 기기의 나사를 체결하고 조립하는 작업입니다.',
  'open',
  'light',
  'intermediate',
  15,
  360000,
  ARRAY['조립', '정밀작업', '나사체결']::text[],
  NOW()
),
(
  gen_random_uuid(),
  '66666666-6666-6666-6666-666666666666',
  '테크 어셈블리 파트너스',
  '제품 최종 검사 및 포장',
  '완성된 제품의 최종 품질 검사 후 포장합니다.',
  'open',
  'medium',
  'intermediate',
  22,
  520000,
  ARRAY['품질검사', '포장', '최종검사']::text[],
  NOW()
);
```

### 3단계: 결과 확인

```sql
-- 회사 목록 확인 (총 5개)
SELECT org_id, display_name, industry
FROM org_profiles
ORDER BY display_name;

-- 태스크별 회사 확인 (다양한 회사들)
SELECT 
  t.title,
  t.org_display_name,
  t.expected_hours,
  t.expected_income_net,
  t.status
FROM tasks t
WHERE t.status = 'open'
ORDER BY t.created_at DESC;
```

## 예상 결과

### 회사 목록 (5개)
1. ✅ 안산 시니어 파트너스 품질관리센터 (기존)
2. ✅ 스마트 제조 협동조합 (신규)
3. ✅ 안산 전자부품 주식회사 (신규)
4. ✅ 글로벌 패키징 센터 (신규)
5. ✅ 테크 어셈블리 파트너스 (신규)

### 태스크 목록 (11개)
- **안산 시니어 파트너스**: 3건 (기존)
- **스마트 제조 협동조합**: 2건 (신규)
- **안산 전자부품**: 2건 (신규)
- **글로벌 패키징**: 2건 (신규)
- **테크 어셈블리**: 2건 (신규)

## 프론트엔드 영향

SQL 실행 후, 프론트엔드의 **모든 화면에서 다양한 회사 이름**이 표시됩니다:

- ✅ **HomeScreen** - "오늘의 추천 업무"에 다른 회사들의 태스크 표시
- ✅ **TasksScreen** - "모든 태스크" 목록에 여러 회사 표시
- ✅ **TaskCard** - 각 카드마다 다른 회사 이름 표시

## 우선순위

🔥 **중간** - 기능은 정상 작동하지만, UX 향상을 위해 다양한 샘플 데이터가 필요합니다.

