import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../api/supabaseClient";
import { projectCategories, type Category } from "../../type/category";
import type { Project } from "../../type/project";
import type { RootState } from "../../store/store";
import styles from "./ProjectFormPage.module.css";
import { useForm } from "react-hook-form";

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

type Skill = {
  id: number;
  skill_name: string;
  category_name: string;
};

type ProjectSkill = {
  skillId: number;
  skillName: string;
  categoryName: string;
  isNew: boolean;
  reason: string;
};

type ProjectSkillRow = {
  skill_id: number;
  skill_reason: string | null;
  skills:
    | { id: number; skill_name: string; category_name: string }
    | { id: number; skill_name: string; category_name: string }[]
    | null;
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

const fetchSkills = async (): Promise<Skill[]> => {
  const { data, error } = await supabase
    .from("skills")
    .select("id, skill_name, category_name")
    .order("category_name", { ascending: true })
    .order("skill_name", { ascending: true });

  if (error) throw error;
  return (data as Skill[]) ?? [];
};

const fetchProjectBySlug = async (slug: string): Promise<Project> => {
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, role, duration, contribution, readme_md, overview, category_name, img_url, github_url",
    )
    .eq("slug", slug)
    .single();

  if (error || !data) throw error ?? new Error("프로젝트를 찾을 수 없습니다.");
  return toProjectState(data);
};

const fetchProjectSkills = async (projectId: number): Promise<ProjectSkill[]> => {
  const { data: projectSkillsData, error } = await supabase
    .from("project_skills")
    .select("skill_id, skill_reason, skills ( id, skill_name, category_name )")
    .eq("project_id", projectId);

  if (error) throw error;

  return ((projectSkillsData as ProjectSkillRow[]) ?? [])
    .map((row) => {
      const skill = Array.isArray(row.skills) ? row.skills[0] : row.skills;

      if (!skill?.id || !skill?.skill_name) return null;

      return {
        skillId: Number(skill.id),
        skillName: skill.skill_name,
        categoryName: skill.category_name ?? "",
        isNew: false,
        reason: row.skill_reason ?? "",
      } as ProjectSkill;
    })
    .filter((value): value is ProjectSkill => Boolean(value));
};

const ProjectFormPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) return;
    navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  const { slug } = useParams();
  const location = useLocation();
  const isEditMode = Boolean(slug);
  const passedProject = location.state as Project | undefined;
  const pageTitle = isEditMode ? "프로젝트 수정" : "프로젝트 추가";

  const { register, handleSubmit, reset } = useForm<ProjectFormState>({
    defaultValues: EMPTY_FORM,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const [selectedSkills, setSelectedSkills] = useState<ProjectSkill[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<string>("Frontend");
  const [skillError, setSkillError] = useState("");

  const { data: availableSkills = [] } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const {
    data: projectFromSlug,
    isLoading: isProjectLoading,
    isError: isProjectLoadError,
  } = useQuery({
    queryKey: ["project", slug],
    enabled: isEditMode && !passedProject && Boolean(slug),
    queryFn: () => fetchProjectBySlug(slug as string),
    retry: false,
  });

  const editProject = passedProject ?? projectFromSlug;
  const editProjectId = editProject?.id;

  const { data: projectSkills = [] } = useQuery<ProjectSkill[]>({
    queryKey: ["projectSkills", editProjectId],
    enabled: isEditMode && Boolean(editProjectId),
    queryFn: () => fetchProjectSkills(editProjectId as number),
  });

  const filteredSkillOptions = useMemo(() => {
    const selectedNameSet = new Set(
      selectedSkills.map((skill) => normalize(skill.skillName)),
    );

    const query = normalize(skillQuery);

    return availableSkills.filter((skill) => {
      const isAlreadySelected = selectedNameSet.has(
        normalize(skill.skill_name),
      );

      if (isAlreadySelected) return false;
      if (!query) return true;
      return normalize(skill.skill_name).includes(query);
    });
  }, [availableSkills, selectedSkills, skillQuery]);

  useEffect(() => {
    if (!isEditMode) {
      reset(EMPTY_FORM);
      setSelectedSkills([]);
      return;
    }

    if (passedProject) {
      reset(toFormState(passedProject));
      setErrorMessage("");
      return;
    }

    if (editProject) {
      reset(toFormState(editProject));
      return;
    }

    if (isProjectLoadError && !passedProject) {
      setErrorMessage("수정할 프로젝트를 불러오지 못했습니다.");
    }
  }, [isEditMode, passedProject, editProject, isProjectLoadError, reset]);

  useEffect(() => {
    if (isEditMode) {
      setSelectedSkills(projectSkills);
    }
  }, [isEditMode, projectSkills]);

  const saveProjectMutation = useMutation({
    mutationFn: async (formValues: ProjectFormState) => {
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

      let savedProject: any = null;

      if (isEditMode) {
        const { data, error } = await supabase
          .from("projects")
          .update(payload)
          .eq("slug", slug)
          .select(
            "id, slug, title, role, duration, contribution, readme_md, overview, category_name, img_url, github_url",
          )
          .single();

        if (error) throw error;
        savedProject = data;
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert(payload)
          .select(
            "id, slug, title, role, duration, contribution, readme_md, overview, category_name, img_url, github_url",
          )
          .single();

        if (error) throw error;
        savedProject = data;
      }

      const savedProjectId = Number(savedProject.id);

      const newSkillsPayload = selectedSkills
        .filter((skill) => skill.isNew)
        .map((skill) => ({
          skill_name: skill.skillName,
          category_name: skill.categoryName,
        }));

      if (newSkillsPayload.length > 0) {
        const { error: insertSkillError } = await supabase
          .from("skills")
          .insert(newSkillsPayload);

        if (insertSkillError && insertSkillError.code !== "23505") {
          throw insertSkillError;
        }
      }

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
        selectedSkillRows = (skillsData as Skill[]) ?? [];
      }

      const skillIdByName = new Map<string, number>();
      selectedSkillRows.forEach((skill) => {
        skillIdByName.set(normalize(skill.skill_name), skill.id);
      });

      await supabase.from("project_skills").delete().eq("project_id", savedProjectId);

      const projectSkillRows = selectedSkills
        .map((skill) => {
          const resolvedSkillId = skillIdByName.get(normalize(skill.skillName));
          if (!resolvedSkillId) return null;

          return {
            project_id: savedProjectId,
            skill_id: resolvedSkillId,
            skill_reason: skill.reason.trim() || null,
          };
        })
        .filter(
          (
            row,
          ): row is {
            project_id: number;
            skill_id: number;
            skill_reason: string | null;
          } => Boolean(row),
        );

      if (projectSkillRows.length > 0) {
        const { error: relationError } = await supabase
          .from("project_skills")
          .insert(projectSkillRows);
        if (relationError) throw relationError;
      }

      const savedProjectState = toProjectState(savedProject);
      savedProjectState.tags = selectedSkills.map((skill) => skill.skillName);
      savedProjectState.skillReasons = selectedSkills
        .filter((skill) => skill.reason.trim().length > 0)
        .map((skill) => ({
          skillName: skill.skillName,
          reason: skill.reason,
        }));

      return savedProjectState;
    },
    onSuccess: (savedProjectState) => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      if (savedProjectState.slug) {
        queryClient.invalidateQueries({ queryKey: ["project", savedProjectState.slug] });
      }
      navigate(`/projects/${savedProjectState.slug}`, {
        state: savedProjectState,
      });
    },
    onError: (error: any) => {
      if (error?.code === "23505") {
        setErrorMessage("이미 사용 중인 slug입니다. 다른 slug를 입력해주세요.");
      } else {
        setErrorMessage(
          "프로젝트 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
    },
  });

  const handleAddExistingSkill = (option: Skill) => {
    const exists = selectedSkills.some(
      (skill) => normalize(skill.skillName) === normalize(option.skill_name),
    );

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

    setSkillQuery("");
    setSkillError("");
  };

  const handleAddNewSkill = () => {
    const name = newSkillName.trim();
    if (!name) {
      setSkillError("새 스킬 이름을 입력해주세요.");
      return;
    }

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

  const handleRemoveSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.filter(
        (skill) => normalize(skill.skillName) !== normalize(skillName),
      ),
    );
  };

  const handleSkillReasonChange = (skillName: string, reason: string) => {
    setSelectedSkills((prev) =>
      prev.map((skill) =>
        normalize(skill.skillName) === normalize(skillName)
          ? { ...skill, reason }
          : skill,
      ),
    );
  };

  const onSubmit = (formValues: ProjectFormState) => {
    if (saveProjectMutation.isPending) return;

    if (!formValues.title.trim() || !formValues.slug.trim()) {
      setErrorMessage("프로젝트 제목과 slug는 필수입니다.");
      return;
    }

    setErrorMessage("");
    saveProjectMutation.mutate(formValues);
  };

  if (isEditMode && isProjectLoading && !passedProject) {
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
                  {...register("title")}
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
              disabled={saveProjectMutation.isPending}
            >
              {saveProjectMutation.isPending
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
