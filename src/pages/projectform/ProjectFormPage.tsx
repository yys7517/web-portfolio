import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../../api/supabaseClient";
import { projectCategories, type Category } from "../../type/category";
import type { Project } from "../../type/project";
import type { RootState } from "../../store/store";
import styles from "./ProjectFormPage.module.css";
import { useForm } from "react-hook-form";

// 프로젝트 폼 데이터
type ProjectFormState = {
  slug: string;
  title: string;
  role: string;
  duration: string;
  contribution: string;
  description: string;
  category: Category;
  image: string;
  githubUrl: string;
  readmeMd: string;
};

// skills 테이블의 타입
type Skill = {
  id: number;
  skill_name: string;
  category_name: string;
};

// 프로젝트 - 스킬 관계 정보
type ProjectSkill = {
  skillId: number;
  skillName: string;
  categoryName: string;
  isNew: boolean; // 새로 추가해야할 스킬인지 여부 (기존에 DB에 존재하는 스킬이면 false, 새로 추가해야할 스킬이면 true)
  reason: string; // 해당 기술을 프로젝트에서 사용한 이유 (선택 사항)
};

const SKILL_CATEGORIES = [
  "Language",
  "Frontend",
  "Backend",
  "Mobile",
  "DevOps",
];

const EMPTY_FORM: ProjectFormState = {
  slug: "",
  title: "",
  role: "",
  duration: "",
  contribution: "",
  description: "",
  category: "Frontend",
  image: "",
  githubUrl: "",
  readmeMd: "",
};

const toFormState = (project: Partial<Project>): ProjectFormState => ({
  slug: project.slug ?? "",
  title: project.title ?? "",
  role: project.role ?? "",
  duration: project.duration ?? "",
  contribution: project.contribution ?? "",
  description: project.description ?? "",
  category: (project.category as Category) ?? "Frontend",
  image: project.image ?? "",
  githubUrl: project.githubUrl ?? "",
  readmeMd: project.readmeMd ?? "",
});

const toProjectState = (row: any): Project => ({
  id: row.id,
  slug: row.slug ?? "",
  title: row.title ?? "",
  role: row.role ?? "",
  duration: row.duration ?? "",
  contribution: row.contribution ?? "",
  readmeMd: row.readme_md ?? "",
  description: row.overview ?? "",
  category: (row.category_name as Category) ?? "Frontend",
  image: row.img_url ?? "",
  githubUrl: row.github_url ?? "",
  tags: [],
  skillReasons: [],
});

const normalize = (value: string) => value.trim().toLowerCase();

const ProjectFormPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // 로그인 여부 확인 후 로그인되어있지 않다면 리다이렉트
  useEffect(() => {
    if (isLoggedIn) return;
    navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  const { slug } = useParams(); // URL 파라미터에서 slug 추출 (수정 모드일 때 필요)
  const location = useLocation(); // 프로젝트 상세 페이지로부터 전달된 state(project data) 확인

  const isEditMode = Boolean(slug); // slug가 있으면 수정 모드, 없으면 추가 모드
  const passedProject = location.state as Project | undefined; // 프로젝트 상세 페이지로부터 프로젝트 정보를 전달받을 수 있음
  const pageTitle = isEditMode ? "프로젝트 수정" : "프로젝트 추가";

  // React Hook Form을 사용하여 폼 상태 관리
  const { register, handleSubmit, reset } = useForm<ProjectFormState>({
    defaultValues: EMPTY_FORM,
  });
  // handleSubmit은 폼 제출 시 유효성 검사를 수행 + 사용자 정의 onSubmit 함수를 호출
  // reset - 폼을 초기 상태로 리셋하는 데 사용
  // register 함수는 각 폼 필드에 대한 레퍼런스를 생성하여 React Hook Form이 해당 필드의 상태를 관리할 수 있도록 합니다.
  // name, onChange, onBlur, ref 등 속성들을 자동으로 완성 후 객체로 반환하여 input 요소에 전달

  // 로딩, 저장 상태 및 에러 메시지 관리를 위한 상태 값들
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]); // 선택 가능한 기존 스킬들 (supabase skills 테이블에 저장된 스킬 목록)
  const [selectedSkills, setSelectedSkills] = useState<ProjectSkill[]>([]);
  const [skillQuery, setSkillQuery] = useState(""); // 스킬 검색어

  // 신규 스킬 추가를 위한 상태 값들
  const [newSkillName, setNewSkillName] = useState(""); // 신규 추가 스킬 이름
  const [newSkillCategory, setNewSkillCategory] = useState<string>("Frontend"); // 신규 추가 스킬 카테고리
  const [skillError, setSkillError] = useState(""); // 신규 스킬 추가 관련 에러 메시지

  // useMemo hook - 메모이제이션을 사용하는 React Hook
  // 이미 저장된 값을 재사용한다면, 연산 없이 그대로 사용 (Re-렌더링 시 유리)
  // ex) 다크모드 전환, 부모 컴포넌트 or 전체 페이지 리렌더링이 발생할 때, 기존에 검색된 리스트를 유지.
  const filteredSkillOptions = useMemo(() => {
    // 이미 프로젝트에 사용 중인 스킬들은 검색 결과에서 제외하기 위해, selectedSkills에서 스킬 이름만 추출하여 Set으로 관리
    const selectedNameSet = new Set(
      selectedSkills.map((skill) => normalize(skill.skillName)),
    );

    const query = normalize(skillQuery); // 스킬 검색어

    return availableSkills.filter((skill) => {
      const isAlreadySelected = selectedNameSet.has(
        normalize(skill.skill_name),
      );

      if (isAlreadySelected) return false; // 이미 선택된 스킬은 검색 결과에서 제외
      if (!query) return true; // 검색어가 없으면 모든 스킬을 보여줌
      return normalize(skill.skill_name).includes(query); // 검색어를 포함하는 스킬만 리턴
    });
  }, [availableSkills, selectedSkills, skillQuery]);

  // 페이지 첫 실행 시, 스킬 정보 가져오기
  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("id, skill_name, category_name")
        .order("category_name", { ascending: true })
        .order("skill_name", { ascending: true });

      if (error || !data) return;
      setAvailableSkills(data as Skill[]); // 선택 가능한 기존에 저장된 스킬들 (supabase skills 테이블의 데이터)
    };

    void fetchSkills();
  }, []);

  useEffect(() => {
    // 추가 모드라면 폼 초기화 후 종료
    if (!isEditMode) {
      reset(EMPTY_FORM);
      setSelectedSkills([]);
      setLoading(false);
      return;
    }

    // 수정 모드

    // 수정하려는 프로젝트에 연결된 기술 스택 정보들 가져오기
    const fetchProjectSkills = async (targetProjectId: number) => {
      const { data: projectSkillsData, error } = await supabase
        .from("project_skills")
        .select(
          "skill_id, skill_reason, skills ( id, skill_name, category_name )",
        )
        .eq("project_id", targetProjectId);

      if (error) {
        console.error("프로젝트 스킬 정보를 불러오는 데 실패했습니다.", error);
        return;
      }

      const mapped = ((projectSkillsData as any[]) ?? [])
        .map((row) => {
          const skill = Array.isArray(row.skills) ? row.skills[0] : row.skills; // Supabase의 관계형 쿼리 결과는 항상 배열 형태이므로 첫 번째 요소를 사용

          if (!skill?.id || !skill?.skill_name) return null;

          return {
            skillId: Number(skill.id),
            skillName: skill.skill_name,
            categoryName: skill.category_name ?? "",
            isNew: false, // 기존에 저장된 스킬이므로 isNew는 false
            reason: row.skill_reason ?? "",
          } as ProjectSkill;
        })
        .filter((v): v is ProjectSkill => Boolean(v)); // null이 아닌 값만 남기도록 필터링

      setSelectedSkills(mapped);
    };

    // 수정 시, 프로젝트 데이터를 state를 통해 전달받았다면
    if (passedProject) {
      reset(toFormState(passedProject));
      setLoading(false);
      void fetchProjectSkills(passedProject.id); // 프로젝트에 연결된 스킬 정보들 가져오기
      return;
    }

    // slug 값이 일치하는 프로젝트 데이터를 supabase에서 가져온다
    const fetchProject = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, slug, title, role, duration, contribution, readme_md, overview, category_name, img_url, github_url",
        )
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setErrorMessage("수정할 프로젝트를 불러오지 못했습니다.");
        setLoading(false);
        return;
      }

      const project = toProjectState(data);
      reset(toFormState(project));
      await fetchProjectSkills(project.id);
      setLoading(false);
    };

    void fetchProject();
  }, []);
  // React는 현재 페이지를 재사용한다. 따라서, 이전에 프로젝트 수정 작업을 하다가, 추가 작업을 할 수도 있고
  // 반대로 추가 작업을 하다가, 수정 작업을 할 수도 있다.
  // 그리고 다른 프로젝트를 수정하게 되면, passedProject, slug 값이 변경되기도한다.
  // 그 때마다, 폼 데이터를 초기화하거나, 새로 프로젝트 데이터를 불러오는 등의 작업이 필요하기 때문에, isEditMode, passedProject, slug 값을 의존성 배열에 추가하여 useEffect가 실행되도록 함

  // Skill Chip button 클릭 핸들러 (프로젝트 사용 기술 추가 핸들링)
  const handleAddExistingSkill = (option: Skill) => {
    const exists = selectedSkills.some(
      (skill) => normalize(skill.skillName) === normalize(option.skill_name),
    );

    // 이미 선택된 스킬이 아닌 것만
    if (!exists) {
      setSelectedSkills((prev) => [
        ...prev,
        {
          skillId: option.id,
          skillName: option.skill_name,
          categoryName: option.category_name,
          isNew: false,
          reason: "",
        },
      ]);
    }

    // 스프레드 연산자를 통해, 기존 스킬들 + 다음 객체로 추가

    setSkillQuery(""); // 검색어 초기화
    setSkillError("");
  };

  // skills 테이블에는 없는, 기존에 사용된 적 없는 새로운 스킬을 추가하는 핸들러
  const handleAddNewSkill = () => {
    const name = newSkillName.trim();
    if (!name) {
      setSkillError("새 스킬 이름을 입력해주세요.");
      return;
    }

    // 이미 선택된 스킬은 목록에 안 나옴

    const existsInAvailable = availableSkills.some(
      (skill) => normalize(skill.skill_name) === normalize(name),
    );

    if (existsInAvailable) {
      setSkillError("스킬 목록에 존재하는 스킬입니다. 목록에서 선택해주세요.");
      return;
    }

    setSelectedSkills((prev) => [
      ...prev,
      {
        skillId: -Date.now(),
        skillName: name,
        categoryName: newSkillCategory,
        isNew: true,
        reason: "",
      },
    ]);

    setNewSkillName("");
    setSkillError("");
  };

  // 선택된 스킬 제거 핸들러
  const handleRemoveSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.filter(
        (skill) => normalize(skill.skillName) !== normalize(skillName),
      ),
    );
  };

  // 스킬 사용 이유 변경 핸들러
  const handleSkillReasonChange = (skillName: string, reason: string) => {
    setSelectedSkills((prev) =>
      prev.map((skill) =>
        normalize(skill.skillName) === normalize(skillName)
          ? { ...skill, reason } // 스프레드 연산자를 사용, 변경된 이유(reason)만 업데이트
          : skill,
      ),
    );
  };

  // 폼 제출 핸들러
  const onSubmit = async (formValues: ProjectFormState) => {
    if (saving) return; // 중복 제출 방지

    if (!formValues.title.trim() || !formValues.slug.trim()) {
      setErrorMessage("프로젝트 제목과 slug는 필수입니다.");
      return;
    }

    // 제출 동작의 안정성을 위해
    setSaving(true);
    setErrorMessage("");

    // 전달할 데이터를 객체로 구성
    const payload = {
      slug: formValues.slug.trim(),
      title: formValues.title.trim(),
      role: formValues.role.trim(),
      duration: formValues.duration.trim(),
      contribution: formValues.contribution.trim(),
      overview: formValues.description.trim(),
      category_name: formValues.category,
      img_url: formValues.image.trim(),
      github_url: formValues.githubUrl.trim(),
      readme_md: formValues.readmeMd,
    };

    try {
      let savedProject: any = null; // 업데이트 또는 삽입 후 반환된 프로젝트 row

      if (isEditMode) {
        // 수정 모드
        const { data, error } = await supabase
          .from("projects")
          .update(payload) // 현재 제출된 데이터로 업데이트
          .eq("slug", slug)
          .select(
            "id, slug, title, role, duration, contribution, readme_md, overview, category_name, img_url, github_url",
          )
          .single(); // select는 항상 배열 형태로 반환, single()을 사용하여 첫 번째 단일 객체로 반환받도록 함
        if (error) throw error;
        savedProject = data; // 기존에 저장된 row
      } else {
        // 추가 모드
        const { data, error } = await supabase
          .from("projects")
          .insert(payload) // 제출된 데이터 insert
          .select(
            "id, slug, title, role, duration, contribution, readme_md, overview, category_name, img_url, github_url",
          )
          .single();
        if (error) throw error;
        savedProject = data;
      }

      // project_skills 테이블에 기술 스택 정보를 저장하기 위한 project_id 확보
      const savedProjectId = Number(savedProject.id);

      const newSkillsPayload = selectedSkills
        .filter((skill) => skill.isNew) // 새로 추가된 스킬만 골라서
        .map((skill) => ({
          skill_name: skill.skillName,
          category_name: skill.categoryName,
        })); // skills 테이블의 row 형식으로 매핑

      if (newSkillsPayload.length > 0) {
        const { error: insertSkillError } = await supabase
          .from("skills")
          .insert(newSkillsPayload); // Skills 테이블에 신규 스킬들 insert

        if (insertSkillError && insertSkillError.code !== "23505") {
          throw insertSkillError;
        }
      }

      // 프로젝트에 등록하는 스킬들의 이름만 배열로 만듦
      const requiredSkillNames = Array.from(
        new Set(selectedSkills.map((skill) => skill.skillName)),
      );

      let selectedSkillRows: Skill[] = [];

      if (requiredSkillNames.length > 0) {
        const { data: skillsData, error: skillsError } = await supabase
          .from("skills")
          .select("id, skill_name, category_name")
          .in("skill_name", requiredSkillNames);

        if (skillsError) throw skillsError;
        selectedSkillRows = (skillsData as Skill[]) ?? []; // 프로젝트에 연결된 모든 스킬 이름에 대한 DB의 스킬 정보 Skills(id, skill_name, category_name)
      }

      // 선택된 스킬 이름으로 스킬 ID를 모두 가져와서 [스킬이름 - 스킬ID] 매핑 정보 생성
      const skillIdByName = new Map<string, number>();
      selectedSkillRows.forEach((skill) => {
        skillIdByName.set(normalize(skill.skill_name), skill.id);
      });

      // 1. 현재 프로젝트 ID에 연결된 모든 스킬 관계를 제거
      await supabase
        .from("project_skills")
        .delete()
        .eq("project_id", savedProjectId);

      const projectSkillRows = selectedSkills
        .map((skill) => {
          const resolvedSkillId = skillIdByName.get(normalize(skill.skillName));
          if (!resolvedSkillId) return null;

          // 2. 새로 선택된 스킬들과 프로젝트 ID로 project_skills 테이블의 데이터에 맞는 새로운 row들을 생성
          return {
            project_id: savedProjectId,
            skill_id: resolvedSkillId,
            skill_reason: skill.reason.trim() || null,
          }; // project_skills 테이블의 row 형식(project_id, skill_id, skill_reason)
        })
        .filter(
          (
            row,
          ): row is {
            project_id: number;
            skill_id: number;
            skill_reason: string | null;
          } => Boolean(row),
        ); // null이 아닌 값만 남기도록 필터링

      // 3. project_skills 테이블에 새로 생성된 row들을 일괄 삽입
      if (projectSkillRows.length > 0) {
        const { error: relationError } = await supabase
          .from("project_skills")
          .insert(projectSkillRows);
        if (relationError) throw relationError;
      }

      // 수정 완료 후, 수정된, 또는 새로 추가된 프로젝트 데이터 세팅
      const savedProjectState = toProjectState(savedProject);
      savedProjectState.tags = selectedSkills.map((skill) => skill.skillName);
      savedProjectState.skillReasons = selectedSkills
        .filter((skill) => skill.reason.trim().length > 0)
        .map((skill) => ({
          skillName: skill.skillName,
          reason: skill.reason,
        }));

      navigate(`/projects/${savedProjectState.slug}`, {
        state: savedProjectState,
      }); // 프로젝트 상세 페이지로 이동하면서, 수정된 프로젝트 데이터도 함께 전달
    } catch (error: any) {
      if (error?.code === "23505") {
        setErrorMessage("이미 사용 중인 slug입니다. 다른 slug를 입력해주세요.");
      } else {
        setErrorMessage(
          "프로젝트 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>프로젝트 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </button>
        </div>

        <h1>{pageTitle}</h1>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.mainPanel}>
            <div className={styles.row2}>
              <label>
                <span>
                  프로젝트 제목 <em className={styles.requiredMark}>*</em>
                </span>
                <input
                  {...register("title")} // register 함수를 사용하여 "title" 속성에 대한, name, onChange, onBlur, ref 등 속성들을 자동으로 완성 후 객체로 반환하여 input 요소에 전달
                  placeholder="예: 리액트를 사용해 만든 게시판"
                  required
                />
              </label>

              <label>
                <span>
                  카테고리 <em className={styles.requiredMark}>*</em>
                </span>
                <select {...register("category")}>
                  {projectCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.row2}>
              <label>
                <span>
                  Slug <em className={styles.requiredMark}>*</em>
                </span>
                <input
                  {...register("slug")}
                  placeholder="예: react-board-project"
                  required
                />
              </label>

              <label>
                <span>깃허브 URL</span>
                <input
                  {...register("githubUrl")}
                  placeholder="https://github.com/..."
                />
              </label>
            </div>

            <div className={styles.row2}>
              <label>
                <span>Role</span>
                <input
                  {...register("role")}
                  placeholder="게시글, 댓글 CRUD, 로그인/회원가입 기능 구현 담당"
                />
              </label>

              <label>
                <span>Duration</span>
                <input
                  {...register("duration")}
                  placeholder="예: 2026.01 - 2026.02"
                />
              </label>
            </div>

            <label>
              <span>프로젝트 기여도</span>
              <input {...register("contribution")} placeholder="예: 40%" />
            </label>

            <label>
              <span>썸네일 이미지 URL</span>
              <input
                {...register("image")}
                placeholder="https://... 또는 /images/..."
              />
            </label>

            <label>
              <span>프로젝트 소개</span>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="프로젝트를 한 줄 이상으로 소개해 주세요"
              />
            </label>

            <label>
              <span>프로젝트 상세 내용(Markdown)</span>
              <textarea
                {...register("readmeMd")}
                rows={14}
                placeholder={
                  "## 프로젝트 소개\n\n내용을 마크다운으로 작성하세요."
                }
              />
            </label>
          </section>

          <aside className={styles.sidePanel}>
            <h2>기술 스택</h2>

            <div className={styles.skillBlock}>
              <p>기존 스킬 검색 후 선택</p>
              <input
                className={styles.skillSearchInput}
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
                placeholder="스킬명을 입력하세요 (예: React, Supabase)"
              />

              {/* 프로젝트 사용 기술 스택 추가 칩 버튼 영역 */}
              <div className={styles.chipPool}>
                {filteredSkillOptions.length === 0 && (
                  <p className={styles.chipEmpty}>검색 결과가 없습니다.</p>
                )}

                {filteredSkillOptions.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    className={styles.skillChipButton}
                    onClick={() => handleAddExistingSkill(skill)}
                  >
                    {skill.skill_name}
                    <span>{skill.category_name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.skillBlock}>
              <p>새 스킬 추가</p>
              <input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="예: Zustand"
              />
              <div className={styles.skillPickerRow}>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                >
                  {SKILL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.smallButton}
                  onClick={handleAddNewSkill}
                >
                  생성
                </button>
              </div>
            </div>

            {skillError && <p className={styles.skillError}>{skillError}</p>}

            <div className={styles.selectedSkills}>
              {selectedSkills.length === 0 && (
                <p className={styles.selectedEmpty}>선택된 스킬이 없습니다.</p>
              )}

              {selectedSkills.map((skill) => (
                <div
                  key={`${skill.skillName}-${skill.skillId}`}
                  className={styles.selectedCard}
                >
                  <div className={styles.selectedHead}>
                    <strong>{skill.skillName}</strong>
                    <button
                      type="button"
                      className={styles.removeSkillButton}
                      onClick={() => handleRemoveSkill(skill.skillName)}
                    >
                      제거
                    </button>
                  </div>
                  <span className={styles.selectedCategory}>
                    {skill.categoryName}
                  </span>
                  <textarea
                    rows={3}
                    value={skill.reason}
                    onChange={(e) =>
                      handleSkillReasonChange(skill.skillName, e.target.value)
                    }
                    placeholder="기술 사용 이유(선택)"
                  />
                </div>
              ))}
            </div>
          </aside>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <div className={styles.bottomActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate(-1)}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={saving}
            >
              {saving
                ? "저장 중..."
                : isEditMode
                  ? "수정 완료"
                  : "프로젝트 추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormPage;
