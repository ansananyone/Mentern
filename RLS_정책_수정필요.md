# 🔒 RLS 정책 수정 필요 (백엔드 작업)

## 현재 문제

`applications` 테이블에 데이터를 INSERT하려고 하면 다음 오류가 발생합니다:

```
{
  "code": "42501",
  "message": "new row violates row-level security policy for table \"applications\""
}
```

## 원인

현재 `applications` 테이블의 RLS 정책이 **너무 제한적**이어서, 프론트엔드에서 태스크 지원 시 데이터를 삽입할 수 없습니다.

## 해결 방법

Supabase SQL Editor에서 다음 SQL을 실행하세요:

### 1단계: 기존 RLS 정책 확인 및 삭제

```sql
-- 현재 applications 테이블의 RLS 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'applications';

-- 기존 제한적인 정책이 있다면 삭제 (정책 이름은 위 쿼리 결과에서 확인)
-- DROP POLICY IF EXISTS "정책이름" ON applications;
```

### 2단계: 새로운 RLS 정책 생성 (테스트용)

```sql
-- 테스트 환경을 위한 모든 작업 허용 정책
CREATE POLICY "Allow all operations for authenticated users"
ON applications
FOR ALL
USING (true)
WITH CHECK (true);
```

### 3단계 (선택사항): 프로덕션용 보안 정책

테스트가 완료되면, 보다 안전한 정책으로 교체하세요:

```sql
-- 1. 테스트 정책 삭제
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON applications;

-- 2. 사용자 본인의 지원 내역만 접근 가능
CREATE POLICY "Users can manage their own applications"
ON applications
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 3. 조직은 자신의 태스크에 대한 지원 내역 조회 가능
CREATE POLICY "Organizations can view applications for their tasks"
ON applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tasks
    WHERE tasks.id = applications.task_id
    AND tasks.org_id IN (
      SELECT org_id FROM org_profiles
      WHERE org_id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    )
  )
);
```

## 프론트엔드 영향

RLS 정책이 수정되면 다음 기능이 정상적으로 작동합니다:

1. ✅ **태스크 지원하기** - 사용자가 태스크에 지원할 수 있음
2. ✅ **내 태스크 보기** - 사용자가 자신의 지원 내역을 조회할 수 있음
3. ✅ **지원 취소** - 사용자가 자신의 지원을 취소할 수 있음

## 확인 방법

SQL 실행 후, 프론트엔드에서 다음을 테스트하세요:

```bash
# 태스크 지원 API 테스트
curl -X POST 'https://amxahxywruuulqvelpil.supabase.co/rest/v1/applications' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "task_id": "TASK_UUID",
    "user_id": "11111111-1111-1111-1111-111111111111",
    "state": "applied",
    "match_score": 95,
    "match_reason": "테스트 지원"
  }'
```

성공 시 응답:
```json
[
  {
    "id": "UUID",
    "task_id": "TASK_UUID",
    "user_id": "11111111-1111-1111-1111-111111111111",
    "state": "applied",
    ...
  }
]
```

## 우선순위

🔥 **높음** - 이 작업이 완료되어야 프론트엔드의 "태스크 지원" 기능이 작동합니다.

