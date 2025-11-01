# 🔧 Supabase 데이터베이스 복구 가이드

## 📋 문제 상황

`profiles`/`users` 테이블에서 일부 데이터를 삭제했을 때, **CASCADE 제약조건** 때문에 `org_profiles`와 `tasks` 테이블의 모든 데이터가 함께 삭제되었습니다.

### 원인
- `org_profiles` 또는 `tasks` 테이블이 `users` 테이블과 외래 키로 연결되어 있음
- 외래 키 설정이 `ON DELETE CASCADE`로 되어 있어 부모 데이터 삭제 시 자식 데이터도 함께 삭제됨

## ✅ 해결 방법

### 1단계: SQL 파일 준비

제공된 `SUPABASE_FIX_SCHEMA.sql` 파일을 사용합니다.

이 파일은 다음을 수행합니다:
- ✅ 불필요한 외래 키 제약조건 제거
- ✅ org_profiles 데이터 복구 (13개 회사)
- ✅ tasks 데이터 복구 (19개 태스크)
- ✅ org_display_name 자동 업데이트

### 2단계: Supabase에서 SQL 실행

1. **Supabase Dashboard 접속**
   ```
   https://supabase.com/dashboard/project/amxahxywruuulqvelpil
   ```

2. **SQL Editor 열기**
   - 왼쪽 메뉴에서 `SQL Editor` 클릭
   - 또는 직접 접속: https://supabase.com/dashboard/project/amxahxywruuulqvelpil/sql

3. **SQL 실행**
   - `New query` 버튼 클릭
   - `SUPABASE_FIX_SCHEMA.sql` 파일 내용 전체 복사
   - 에디터에 붙여넣기
   - `Run` 버튼 클릭 (또는 Cmd/Ctrl + Enter)

4. **실행 결과 확인**
   ```
   ✅ 스키마 수정 및 데이터 복구 완료!
   📊 org_profiles: 13개 회사
   📋 tasks: 19개 태스크
   ```

### 3단계: 프론트엔드 확인

SQL 실행 후 바로 프론트엔드에서 확인하세요:

```bash
# 개발 서버가 실행 중이 아니면
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속하여:
- ✅ 홈 화면에 추천 태스크 2건 표시
- ✅ 태스크 화면에 전체 태스크 목록 표시
- ✅ 각 태스크의 실제 회사 이름 표시 (예: "(주)관운2공장", "안산 시니어 파트너스" 등)

## 📊 복구되는 데이터

### org_profiles (13개 회사)
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

### tasks (19개 태스크)
다양한 회사의 품질관리, 검사, 컨설팅 관련 태스크들:
- 사무실 데이터 입력 및 정리
- 가벼운 포장 작업
- 사출 금형 부품 검수
- 제조 공정 품질 모니터링
- 신입 직원 품질관리 교육
- 의료용 부품 품질 검사
- ... 등 19건

각 태스크에는 다음 정보가 포함됩니다:
- ✅ 회사 정보 (org_id, org_display_name)
- ✅ 예상 작업 시간 (2-5시간)
- ✅ 예상 수입 (45,000원 - 90,000원)
- ✅ 신체 부담 수준 (낮음/중간)
- ✅ 기술 수준 (낮음/중간/높음)
- ✅ 태그 및 스킬 정보
- ✅ 작업 시작/종료 예정일

## 🔐 수정된 스키마 구조

### 변경 전 (문제 있음)
```
users ----[CASCADE]----> org_profiles
  |
  +-------[CASCADE]----> tasks
```
👎 users 삭제 시 모든 데이터 삭제됨

### 변경 후 (안전함)
```
users (독립)

org_profiles (독립)
  |
  +-----> tasks (org_id 참조만 유지)
```
✅ users와 profiles 삭제해도 org_profiles와 tasks는 영향받지 않음

## 🚨 주의사항

### 앞으로 데이터 삭제 시
1. **테스트 데이터 삭제**는 신중하게
2. **CASCADE 확인**: 삭제 전 영향받는 테이블 확인
3. **백업**: 중요한 작업 전 데이터 백업 권장

### profiles/users 테이블 관리
```sql
-- ❌ 위험: 모든 데이터 삭제
DELETE FROM users;

-- ✅ 안전: 특정 사용자만 삭제
DELETE FROM users WHERE user_id = 'specific-id';

-- ✅ 더 안전: 조건부 삭제
DELETE FROM users 
WHERE user_id NOT IN (
  '11111111-1111-1111-1111-111111111111'  -- 테스트 사용자
);
```

## 📞 문제 발생 시

SQL 실행 중 오류가 발생하면:

1. **권한 오류**: Service Role Key로 실행 필요
2. **제약조건 오류**: 이미 실행되었거나 스키마가 다를 수 있음
3. **데이터 중복 오류**: `ON CONFLICT DO NOTHING` 때문에 정상 (무시됨)

오류 메시지를 확인하고 필요시 문의하세요.

## ✅ 확인 체크리스트

- [ ] SQL 파일 전체 복사
- [ ] Supabase SQL Editor에서 실행
- [ ] 성공 메시지 확인
- [ ] 프론트엔드 새로고침
- [ ] 홈 화면에 태스크 2건 표시 확인
- [ ] 태스크 화면에 전체 목록 표시 확인
- [ ] 회사 이름이 제대로 표시되는지 확인 (멘턴 파트너사 ❌)

---

**실행 후 즉시 프론트엔드에서 데이터를 확인할 수 있습니다!** 🎉

