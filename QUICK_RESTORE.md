# ⚡ 빠른 복구 가이드

## 🚀 3단계로 즉시 복구

### 1️⃣ 파일 열기
`SUPABASE_FIX_SCHEMA.sql` 파일을 텍스트 에디터로 열고 **전체 내용 복사** (Cmd+A → Cmd+C)

### 2️⃣ Supabase에서 실행
1. https://supabase.com/dashboard/project/amxahxywruuulqvelpil/sql
2. 붙여넣기 (Cmd+V)
3. **Run** 버튼 클릭

### 3️⃣ 확인
브라우저 새로고침 → 태스크 목록에 19개 태스크 표시됨 ✅

---

## 📊 복구 결과

```
✅ org_profiles: 13개 회사
✅ tasks: 19개 태스크
✅ 외래 키 CASCADE 제거
```

**이제 profiles/users를 삭제해도 org_profiles/tasks는 안전합니다!**

---

## 🎯 핵심 포인트

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| profiles 삭제 시 | ❌ tasks도 삭제됨 | ✅ tasks 유지됨 |
| 데이터 독립성 | ❌ 강한 의존성 | ✅ 완전 독립 |
| 회사 이름 표시 | ❌ 멘턴 파트너사 | ✅ 실제 회사명 |

---

**문제 발생 시 → `SUPABASE_복구가이드.md` 참고**

