# 🏢 Supabase 회사 이름 업데이트 가이드

## 문제 상황
`tasks` 테이블의 `org_display_name` 컬럼이 "멘턴 파트너사"로 잘못 저장되어 있어, 실제 회사 이름이 표시되지 않는 문제가 있습니다.

## 해결 방법

### 1. 백엔드 (Supabase) - 데이터 업데이트 (권장)

Supabase SQL Editor에서 아래 SQL을 실행하여 `tasks` 테이블의 `org_display_name`을 `org_profiles`의 실제 회사 이름으로 일괄 업데이트합니다.

```sql
-- tasks 테이블의 org_display_name을 org_profiles의 실제 display_name으로 업데이트
UPDATE tasks
SET org_display_name = org_profiles.display_name
FROM org_profiles
WHERE tasks.org_id = org_profiles.org_id;

-- 확인: 업데이트된 결과 확인
SELECT id, org_id, org_display_name, title 
FROM tasks 
LIMIT 10;
```

**실행 방법:**
1. Supabase Dashboard → SQL Editor
2. 위 SQL 복사 & 붙여넣기
3. `Run` 버튼 클릭

### 2. 프론트엔드 - 자동 보완 (이미 적용됨 ✅)

프론트엔드 코드는 이미 다음과 같이 수정되어, `org_display_name`이 없거나 "멘턴 파트너사"인 경우 자동으로 `org_profiles`에서 실제 회사 이름을 가져옵니다:

```typescript
// org_profiles에서 회사 이름 가져오기
const tasksWithOrgNames = await Promise.all(
  (tasksData || []).map(async (task) => {
    if (task.org_id && (!task.org_display_name || task.org_display_name === '멘턴 파트너사')) {
      const { data: orgData } = await supabase
        .from('org_profiles')
        .select('display_name')
        .eq('org_id', task.org_id)
        .single()
      
      if (orgData?.display_name) {
        return { ...task, org_display_name: orgData.display_name.trim() }
      }
    }
    return task
  })
)
```

### 3. 확인된 회사 목록

현재 `org_profiles` 테이블에 있는 회사들:

- 안산 시니어 파트너스
- (주)관운2공장
- (주)왕성프라몰드
- (주)정우몰드
- (주)유진금속
- (주)이룸테크
- (주)디에스테크
- (주)대한테크
- (주)지아이티소프트기술
- (주)엠제이
- (주)테라시스템
- (주)메디플라머터리얼스
- (주)세경스틸

## 결과

✅ **백엔드 SQL 실행 후:** 모든 태스크가 올바른 회사 이름으로 표시됩니다.  
✅ **프론트엔드만 사용 시:** 실시간으로 `org_profiles`에서 회사 이름을 가져와 표시합니다. (약간의 추가 API 호출 발생)

**권장사항:** 백엔드 SQL을 먼저 실행하여 데이터를 정규화하는 것이 성능상 유리합니다.

