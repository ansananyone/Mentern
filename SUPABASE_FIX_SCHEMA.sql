-- ================================================================
-- Supabase 스키마 수정 및 데이터 복구 SQL
-- 문제: profiles/users 삭제 시 org_profiles/tasks까지 CASCADE 삭제됨
-- 해결: 외래 키 제약조건 제거 및 데이터 복구
-- ================================================================

-- ================================================================
-- 1단계: 외래 키 제약조건 확인 및 제거
-- ================================================================

-- org_profiles 테이블의 외래 키 제거 (있다면)
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    FOR constraint_name IN 
        SELECT con.conname
        FROM pg_constraint con
        INNER JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = 'org_profiles' 
        AND con.contype = 'f'
    LOOP
        EXECUTE format('ALTER TABLE org_profiles DROP CONSTRAINT IF EXISTS %I CASCADE', constraint_name);
    END LOOP;
END $$;

-- tasks 테이블의 불필요한 외래 키 제거 (org_id는 유지, users 관련만 제거)
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    FOR constraint_name IN 
        SELECT con.conname
        FROM pg_constraint con
        INNER JOIN pg_class rel ON rel.oid = con.conrelid
        INNER JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = ANY(con.conkey)
        WHERE rel.relname = 'tasks' 
        AND con.contype = 'f'
        AND att.attname IN ('created_by', 'updated_by', 'cancelled_by')
    LOOP
        EXECUTE format('ALTER TABLE tasks DROP CONSTRAINT IF EXISTS %I CASCADE', constraint_name);
    END LOOP;
END $$;

-- ================================================================
-- 2단계: org_profiles 데이터 복구
-- ================================================================

-- 기존 데이터 확인 후 없으면 INSERT
INSERT INTO org_profiles (org_id, display_name, created_at, updated_at)
VALUES
    ('22222222-2222-2222-2222-222222222222', '안산 시니어 파트너스', NOW(), NOW()),
    ('476e34b8-4969-5226-b2cf-e6cb2051ba7d', '(주)관운2공장', NOW(), NOW()),
    ('87084be5-990a-557b-b45a-c2dcb46240d2', '(주)왕성프라몰드', NOW(), NOW()),
    ('d9101cdf-54b1-51e3-ba84-899265ff64e5', '(주)정우몰드', NOW(), NOW()),
    ('c4dd6f7b-6c9f-57ba-9337-0f70e6692755', '(주)유진금속', NOW(), NOW()),
    ('e42e8843-843e-5143-a45e-d84275d959b3', '(주)이룸테크', NOW(), NOW()),
    ('19be4e58-8391-598e-a293-73570de6f139', '(주)디에스테크', NOW(), NOW()),
    ('250a804d-6ce8-59ea-ac6a-926c8283251a', '(주)대한테크', NOW(), NOW()),
    ('bd7d6df4-3b00-59d7-9bee-8be632fba38f', '(주)지아이티소프트기술', NOW(), NOW()),
    ('3b256564-92b6-5a1a-b4ec-fc8df99385ba', '(주)엠제이', NOW(), NOW()),
    ('9436eeca-c24a-5c27-9885-e7e0ff62e861', '(주)테라시스템', NOW(), NOW()),
    ('e50c6fc3-08f4-5a5d-a576-91184d467536', '(주)메디플라머터리얼스', NOW(), NOW()),
    ('346b3c16-d1e4-5807-b7c6-c516759f6bf7', '(주)세경스틸', NOW(), NOW())
ON CONFLICT (org_id) DO NOTHING;

-- ================================================================
-- 3단계: tasks 데이터 복구 (샘플 데이터 19건)
-- ================================================================

INSERT INTO tasks (
    id, org_id, title, description, status,
    expected_hours, expected_income_net,
    physical_demand_level, skill_level_required,
    tags, skills,
    work_date_start, work_date_end,
    created_at, updated_at
)
VALUES
    -- 안산 시니어 파트너스 태스크
    (
        '33333333-3333-3333-3333-333333333334',
        '22222222-2222-2222-2222-222222222222',
        '사무실 데이터 입력 및 정리',
        '엑셀 데이터 입력 및 문서 정리 작업',
        'open',
        3, 45000,
        '낮음', '낮음',
        ARRAY['사무직', '데이터입력', '엑셀']::text[],
        ARRAY['엑셀', '문서작성']::text[],
        NOW() + INTERVAL '3 days', NOW() + INTERVAL '10 days',
        NOW(), NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333335',
        '22222222-2222-2222-2222-222222222222',
        '가벼운 포장 작업',
        '앉아서 하는 제품 포장 작업',
        'open',
        4, 60000,
        '낮음', '낮음',
        ARRAY['포장', '앉아서근무']::text[],
        ARRAY['기본작업']::text[],
        NOW() + INTERVAL '2 days', NOW() + INTERVAL '15 days',
        NOW(), NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333336',
        '22222222-2222-2222-2222-222222222222',
        '창고 물류 정리',
        '창고 내 물품 정리 및 분류',
        'open',
        5, 75000,
        '중간', '낮음',
        ARRAY['물류', '정리정돈']::text[],
        ARRAY['기본작업']::text[],
        NOW() + INTERVAL '5 days', NOW() + INTERVAL '20 days',
        NOW(), NOW()
    ),

    -- (주)관운2공장
    (
        '33333333-3333-3333-3333-333333333337',
        '476e34b8-4969-5226-b2cf-e6cb2051ba7d',
        '사출 금형 부품 검수',
        '완성된 사출 부품의 외관 및 치수 검사',
        'open',
        4, 80000,
        '낮음', '중간',
        ARRAY['품질검사', '제조업', '앉아서근무']::text[],
        ARRAY['품질관리', '검사']::text[],
        NOW() + INTERVAL '1 days', NOW() + INTERVAL '7 days',
        NOW(), NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333338',
        '476e34b8-4969-5226-b2cf-e6cb2051ba7d',
        '금형 부품 최종 검수 및 품질 확인',
        '제조 완료된 금형 부품의 최종 품질 검사',
        'open',
        3, 70000,
        '낮음', '높음',
        ARRAY['품질관리', '검사', '제조업']::text[],
        ARRAY['품질관리', '정밀검사']::text[],
        NOW() + INTERVAL '2 days', NOW() + INTERVAL '10 days',
        NOW(), NOW()
    ),

    -- (주)왕성프라몰드
    (
        '33333333-3333-3333-3333-333333333339',
        '87084be5-990a-557b-b45a-c2dcb46240d2',
        '제조 공정 품질 모니터링 및 개선 자문',
        '생산 라인 모니터링 및 품질 개선 조언',
        'open',
        4, 90000,
        '낮음', '높음',
        ARRAY['품질관리', '컨설팅', '제조업']::text[],
        ARRAY['품질관리', '공정개선']::text[],
        NOW() + INTERVAL '3 days', NOW() + INTERVAL '14 days',
        NOW(), NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333340',
        '87084be5-990a-557b-b45a-c2dcb46240d2',
        '플라스틱 사출품 검사',
        '사출 완료 제품의 품질 검사',
        'open',
        3, 65000,
        '낮음', '중간',
        ARRAY['품질검사', '제조업']::text[],
        ARRAY['품질관리']::text[],
        NOW() + INTERVAL '4 days', NOW() + INTERVAL '12 days',
        NOW(), NOW()
    ),

    -- (주)정우몰드
    (
        '33333333-3333-3333-3333-333333333341',
        'd9101cdf-54b1-51e3-ba84-899265ff64e5',
        '신입 직원 품질관리 교육',
        '신규 입사자 대상 품질관리 기초 교육',
        'open',
        2, 60000,
        '낮음', '높음',
        ARRAY['교육', '멘토링', '품질관리']::text[],
        ARRAY['교육', '품질관리']::text[],
        NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days',
        NOW(), NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333342',
        'd9101cdf-54b1-51e3-ba84-899265ff64e5',
        '금형 제작 품질 점검',
        '금형 제작 과정 품질 모니터링',
        'open',
        4, 85000,
        '낮음', '높음',
        ARRAY['품질관리', '금형', '제조업']::text[],
        ARRAY['품질관리', '금형']::text[],
        NOW() + INTERVAL '5 days', NOW() + INTERVAL '15 days',
        NOW(), NOW()
    ),

    -- (주)유진금속
    (
        '33333333-3333-3333-3333-333333333343',
        'c4dd6f7b-6c9f-57ba-9337-0f70e6692755',
        '금속 부품 외관 검사',
        '완성된 금속 부품의 표면 및 치수 검사',
        'open',
        3, 70000,
        '낮음', '중간',
        ARRAY['품질검사', '금속가공']::text[],
        ARRAY['품질관리', '검사']::text[],
        NOW() + INTERVAL '2 days', NOW() + INTERVAL '9 days',
        NOW(), NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333344',
        'c4dd6f7b-6c9f-57ba-9337-0f70e6692755',
        '금속 가공 공정 자문',
        '가공 공정 효율화 및 품질 개선 자문',
        'open',
        3, 80000,
        '낮음', '높음',
        ARRAY['컨설팅', '품질관리', '금속가공']::text[],
        ARRAY['품질관리', '공정개선']::text[],
        NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days',
        NOW(), NOW()
    ),

    -- (주)이룸테크
    (
        '33333333-3333-3333-3333-333333333345',
        'e42e8843-843e-5143-a45e-d84275d959b3',
        '전자부품 조립 검수',
        '조립 완료된 전자부품 품질 검사',
        'open',
        4, 75000,
        '낮음', '중간',
        ARRAY['품질검사', '전자부품', '앉아서근무']::text[],
        ARRAY['품질관리', '전자']::text[],
        NOW() + INTERVAL '3 days', NOW() + INTERVAL '11 days',
        NOW(), NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333346',
        'e42e8843-843e-5143-a45e-d84275d959b3',
        '제조 라인 품질 모니터링',
        '생산 라인 실시간 품질 모니터링',
        'open',
        5, 85000,
        '중간', '중간',
        ARRAY['품질관리', '모니터링', '제조업']::text[],
        ARRAY['품질관리']::text[],
        NOW() + INTERVAL '4 days', NOW() + INTERVAL '18 days',
        NOW(), NOW()
    ),

    -- (주)디에스테크
    (
        '33333333-3333-3333-3333-333333333347',
        '19be4e58-8391-598e-a293-73570de6f139',
        '정밀 부품 최종 검사',
        '정밀 가공 부품의 최종 품질 검사',
        'open',
        3, 75000,
        '낮음', '높음',
        ARRAY['품질검사', '정밀가공', '앉아서근무']::text[],
        ARRAY['품질관리', '정밀검사']::text[],
        NOW() + INTERVAL '2 days', NOW() + INTERVAL '8 days',
        NOW(), NOW()
    ),

    -- (주)대한테크
    (
        '33333333-3333-3333-3333-333333333348',
        '250a804d-6ce8-59ea-ac6a-926c8283251a',
        '기계부품 품질 검증',
        '기계 부품 완성품 품질 검증',
        'open',
        4, 80000,
        '낮음', '중간',
        ARRAY['품질검사', '기계부품']::text[],
        ARRAY['품질관리', '검사']::text[],
        NOW() + INTERVAL '5 days', NOW() + INTERVAL '13 days',
        NOW(), NOW()
    ),

    -- (주)지아이티소프트기술
    (
        '33333333-3333-3333-3333-333333333349',
        'bd7d6df4-3b00-59d7-9bee-8be632fba38f',
        '제품 테스트 및 검증',
        '소프트웨어 내장 제품 테스트',
        'open',
        3, 70000,
        '낮음', '중간',
        ARRAY['테스트', '검증', '앉아서근무']::text[],
        ARRAY['테스트', '품질관리']::text[],
        NOW() + INTERVAL '4 days', NOW() + INTERVAL '10 days',
        NOW(), NOW()
    ),

    -- (주)엠제이
    (
        '33333333-3333-3333-3333-333333333350',
        '3b256564-92b6-5a1a-b4ec-fc8df99385ba',
        '완제품 최종 포장 검사',
        '포장 전 최종 제품 품질 검사',
        'open',
        3, 65000,
        '낮음', '낮음',
        ARRAY['품질검사', '포장', '앉아서근무']::text[],
        ARRAY['품질관리']::text[],
        NOW() + INTERVAL '3 days', NOW() + INTERVAL '12 days',
        NOW(), NOW()
    ),

    -- (주)테라시스템
    (
        '33333333-3333-3333-3333-333333333351',
        '9436eeca-c24a-5c27-9885-e7e0ff62e861',
        '시스템 제품 품질 점검',
        '완성 시스템 제품의 품질 점검',
        'open',
        4, 85000,
        '낮음', '중간',
        ARRAY['품질검사', '시스템']::text[],
        ARRAY['품질관리', '시스템']::text[],
        NOW() + INTERVAL '6 days', NOW() + INTERVAL '15 days',
        NOW(), NOW()
    ),

    -- (주)메디플라머터리얼스
    (
        '33333333-3333-3333-3333-333333333352',
        'e50c6fc3-08f4-5a5d-a576-91184d467536',
        '의료용 부품 품질 검사',
        '의료용 정밀 부품 품질 검사',
        'open',
        3, 90000,
        '낮음', '높음',
        ARRAY['품질검사', '의료', '정밀가공', '앉아서근무']::text[],
        ARRAY['품질관리', '정밀검사']::text[],
        NOW() + INTERVAL '2 days', NOW() + INTERVAL '7 days',
        NOW(), NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 4단계: org_display_name 업데이트
-- ================================================================

UPDATE tasks
SET org_display_name = org_profiles.display_name
FROM org_profiles
WHERE tasks.org_id = org_profiles.org_id;

-- ================================================================
-- 5단계: 확인
-- ================================================================

-- org_profiles 확인
SELECT COUNT(*) as org_profiles_count FROM org_profiles;

-- tasks 확인
SELECT COUNT(*) as tasks_count FROM tasks;

-- tasks와 org 정보 확인
SELECT 
    t.id, 
    t.title, 
    t.org_display_name,
    o.display_name as actual_org_name,
    t.expected_income_net,
    t.status
FROM tasks t
LEFT JOIN org_profiles o ON t.org_id = o.org_id
ORDER BY t.created_at DESC
LIMIT 10;

-- ================================================================
-- 완료 메시지
-- ================================================================
DO $$ 
BEGIN
    RAISE NOTICE '✅ 스키마 수정 및 데이터 복구 완료!';
    RAISE NOTICE '📊 org_profiles: 13개 회사';
    RAISE NOTICE '📋 tasks: 19개 태스크';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 외래 키 CASCADE 제약조건이 제거되어';
    RAISE NOTICE '   profiles/users 삭제 시 org_profiles/tasks가 영향받지 않습니다.';
END $$;

