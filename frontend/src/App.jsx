import { useEffect, useMemo, useState } from "react";
import LandingPage from "./LandingPage";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const THEME_STORAGE_KEY = "project-atlas-theme";

const defaultFilters = {
  difficulty: "",
  category: "",
  impact: "",
  trending: false,
  techStack: ""
};

const categories = [
  "BACKEND",
  "FULL_STACK",
  "DATA_ENGINEERING",
  "DEVOPS",
  "MICROSERVICES",
  "API_SERVICE",
  "TOOL_UTILITY",
  "LEARNING_PROJECT"
];

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }
  return response.json();
}

function formatLabel(value) {
  if (!value) return "";
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value || 0);
}

function tagsFor(project) {
  const stack = project?.techStack
    ? project.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  return [formatLabel(project?.category), ...stack].filter(Boolean);
}

function emptyBreakdown() {
  return {
    project: null,
    detail: null,
    levels: [],
    upgradeSuggestions: [],
    evaluation: null,
    standoutReasons: []
  };
}

function numberOrDash(value) {
  return value ?? "-";
}

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function ProjectListItem({ project, onOpen }) {
  return (
    <article 
      className="card p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center cursor-pointer hover:border-atlas-accent/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
      onClick={() => onOpen(project.projectId)}
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-atlas-accent transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {project.shortHook || project.description || "No summary available yet."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {tagsFor(project).map((tag) => (
            <span key={`${project.projectId}-${tag}`} className="tag">{tag}</span>
          ))}
          <span className="tag px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 font-medium">{formatLabel(project.difficulty)}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:min-w-[100px] shrink-0">
        <div className="text-center sm:text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{numberOrDash(project.impactScore)}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Impact</div>
        </div>
        {project.isTrending ? (
           <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-xs font-semibold uppercase tracking-wide">Trending</span>
        ) : (
           <div className="text-[10px] text-slate-400 font-medium">{formatCompactNumber(project.viewCount)} views</div>
        )}
      </div>
    </article>
  );
}

function FeedSection({ title, helper, projects, onOpen, onViewMore }) {
  return (
    <section className="card p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{helper}</p>
        </div>
        <button className="button-secondary whitespace-nowrap" onClick={onViewMore}>
          See more
        </button>
      </div>

      <div className="space-y-3">
        {projects.length ? (
          projects.map((project) => (
            <button
              key={project.projectId}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-atlas-accent dark:border-slate-700 dark:bg-slate-900"
              onClick={() => onOpen(project.projectId)}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-medium text-slate-900 dark:text-slate-100">{project.title}</span>
                <span className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  {formatLabel(project.difficulty)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {project.shortHook || project.description || "No summary available yet."}
              </p>
            </button>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No data is loaded for this section yet.
          </p>
        )}
      </div>
    </section>
  );
}

function InfoBlock({ title, content, fallback }) {
  return (
    <section className="card p-5">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{content || fallback}</p>
    </section>
  );
}

function ListBlock({ title, items, emptyText }) {
  return (
    <section className="card p-5">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item) => (
            <article key={`${title}-${item.heading}`} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="font-medium text-slate-900 dark:text-slate-100">{item.heading}</p>
              <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{item.body}</p>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">{emptyText}</p>
        )}
      </div>
    </section>
  );
}

function DetailDrawer({ breakdown, open, loading, onClose }) {
  const project = breakdown.project;
  const detail = breakdown.detail;
  const score = breakdown.evaluation;

  return (
    <div className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Project details</p>
            <h2 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {project?.title || (loading ? "Loading..." : "No project selected")}
            </h2>
          </div>
          <button className="button-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-52 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : project ? (
          <div className="space-y-6">
            <section className="card p-5">
              <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                {project.description || project.shortHook || "No description available yet."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tagsFor(project).map((tag) => (
                  <span key={`drawer-${tag}`} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              {[
                ["Overall score", score?.overallScore],
                ["Resume value", score?.resumeValue],
                ["Uniqueness", score?.uniquenessScore],
                ["Learning value", score?.learningPotential]
              ].map(([label, value]) => (
                <article key={label} className="card p-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{numberOrDash(value)}</p>
                </article>
              ))}
            </section>

            <InfoBlock title="Overview" content={detail?.overview} fallback="No overview has been added yet." />
            <InfoBlock title="Core logic" content={detail?.coreLogic} fallback="No core logic notes have been added yet." />
            <InfoBlock
              title="System architecture"
              content={detail?.systemArchitecture}
              fallback="No architecture notes have been added yet."
            />
            <InfoBlock
              title="What stands out"
              content={detail?.whatImpresses || score?.scoreFeedback}
              fallback="No standout notes have been added yet."
            />
            <InfoBlock title="Common mistakes" content={detail?.commonMistakes} fallback="No common mistakes are listed yet." />
            <InfoBlock title="Key learnings" content={detail?.keyLearnings} fallback="No key learnings are listed yet." />

            <ListBlock
              title="Project levels"
              items={(breakdown.levels || []).map((level) => ({
                heading: `${formatLabel(level.levelType)} - ${level.estimatedHours || "?"} hrs`,
                body: level.description || level.features || level.requirements || "No notes yet."
              }))}
              emptyText="No level breakdown has been added yet."
            />

            <ListBlock
              title="Upgrade ideas"
              items={(breakdown.upgradeSuggestions || []).map((item) => ({
                heading: item.title,
                body: item.description || item.implementationTips || "No notes yet."
              }))}
              emptyText="No upgrade ideas have been added yet."
            />
          </div>
        ) : (
          <div className="card p-6 text-sm leading-7 text-slate-600 dark:text-slate-400">Choose a project to see the full details.</div>
        )}
      </aside>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [results, setResults] = useState([]);
  const [resultsTitle, setResultsTitle] = useState("All projects");
  const [activeChips, setActiveChips] = useState([]);
  const [interpretation, setInterpretation] = useState(
    "Search with a sentence or use the filters to narrow the list."
  );
  const [stats, setStats] = useState({ total: 0, trending: 0, impact: 0 });
  const [feeds, setFeeds] = useState({
    trending: [],
    impact: [],
    backend: [],
    underrated: []
  });
  const [spotlight, setSpotlight] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [panelError, setPanelError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [breakdown, setBreakdown] = useState(emptyBreakdown());
  const [view, setView] = useState("landing");

  const hasStructuredFilters = Boolean(filters.difficulty || filters.category || filters.impact || filters.trending);

  const allLoadedProjects = useMemo(
    () => [...results, ...feeds.trending, ...feeds.impact, ...feeds.backend, ...feeds.underrated].filter(Boolean),
    [results, feeds]
  );

  const uniqueProjects = useMemo(() => {
    const seen = new Map();
    allLoadedProjects.forEach((project) => {
      if (project?.projectId && !seen.has(project.projectId)) {
        seen.set(project.projectId, project);
      }
    });
    return Array.from(seen.values());
  }, [allLoadedProjects]);

  const topViewedProject = useMemo(() => {
    return uniqueProjects.reduce((best, project) => {
      if (!best) return project;
      return (project.viewCount || 0) > (best.viewCount || 0) ? project : best;
    }, null);
  }, [uniqueProjects]);

  const averageImpact = useMemo(() => {
    const scores = uniqueProjects.map((project) => project.impactScore).filter((value) => typeof value === "number");
    if (!scores.length) return null;
    return (scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1);
  }, [uniqueProjects]);

  const topStacks = useMemo(() => {
    const counts = new Map();
    uniqueProjects.forEach((project) => {
      tagsFor(project)
        .slice(1)
        .forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [uniqueProjects]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      setPageLoading(true);
      setPanelError("");

      try {
        const [allProjects, trending, impact, backend, underrated, randomProject] = await Promise.all([
          request("/projects?page=0&size=9"),
          request("/discovery/trending?page=0&size=4"),
          request("/discovery/high-impact?page=0&size=4"),
          request("/discovery/backend-focused?page=0&size=4"),
          request("/discovery/underrated?page=0&size=4"),
          request("/projects/random")
        ]);

        if (cancelled) return;

        setResults(allProjects.content || []);
        setResultsTitle("All projects");
        setFeeds({
          trending: trending.content || [],
          impact: impact.content || [],
          backend: backend.content || [],
          underrated: underrated.content || []
        });
        setSpotlight(randomProject || null);
        setStats({
          total: allProjects.totalElements || 0,
          trending: (trending.content || []).length,
          impact: (impact.content || []).length
        });
      } catch (error) {
        if (!cancelled) {
          setPanelError("Could not load data. Make sure Spring Boot and MySQL are running.");
        }
      } finally {
        if (!cancelled) {
          setPageLoading(false);
        }
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  async function openBreakdown(projectId) {
    setDrawerOpen(true);
    setDrawerLoading(true);

    try {
      const data = await request(`/projects/${projectId}/breakdown`);
      setBreakdown(data);
    } catch (error) {
      setBreakdown(emptyBreakdown());
      setPanelError("Could not load that project.");
    } finally {
      setDrawerLoading(false);
    }
  }

  async function loadSpotlight() {
    try {
      const data = await request("/projects/random");
      setSpotlight(data);
    } catch (error) {
      setPanelError("Could not load a random project.");
    }
  }

  async function loadFeed(feedKey, endpoint, label) {
    try {
      const data = await request(`${endpoint}?page=0&size=9`);
      setResults(data.content || []);
      setResultsTitle(label);
      setActiveChips([label]);
      setInterpretation(`Showing ${label.toLowerCase()}.`);
    } catch (error) {
      setPanelError(`Could not load ${feedKey}.`);
    }
  }

  async function searchByTag(tag) {
    setPageLoading(true);
    setPanelError("");
    setView("explorer");

    const payload = {
      techStack: tag,
      page: 0,
      pageSize: 20
    };

    try {
      const data = await request("/search/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      setResults(data.content || []);
      setResultsTitle(`Projects using ${tag}`);
      setActiveChips([`Stack: ${tag}`]);
      setInterpretation(`Showing projects that use ${tag}.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setPanelError("Could not filter by tag.");
    } finally {
      setPageLoading(false);
    }
  }

  async function applyFilters() {
    setPanelError("");

    const payload = {
      keyword: query.trim() || null,
      difficulty: filters.difficulty || null,
      category: filters.category || null,
      techStack: filters.techStack || null,
      minImpactScore: filters.impact ? Number(filters.impact) : null,
      isTrending: filters.trending || null,
      page: 0,
      pageSize: 20
    };

    try {
      const data = await request("/search/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const chips = [];
      if (payload.keyword) chips.push(`Keyword: ${payload.keyword}`);
      if (payload.techStack) chips.push(`Stack: ${payload.techStack}`);
      if (payload.difficulty) chips.push(formatLabel(payload.difficulty));
      if (payload.category) chips.push(formatLabel(payload.category));
      if (payload.minImpactScore) chips.push(`Impact >= ${payload.minImpactScore}`);
      if (payload.isTrending) chips.push("Trending");

      setResults(data.content || []);
      setResultsTitle("Filtered projects");
      setActiveChips(chips);
      setInterpretation(chips.length ? "Filters applied." : "Showing all projects.");
    } catch (error) {
      setPanelError("Could not apply filters.");
    }
  }

  async function runSmartSearch(event) {
    event.preventDefault();
    setPanelError("");

    if (query.trim()) {
      try {
        const data = await request(`/search/smart?query=${encodeURIComponent(query.trim())}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters)
        });
        const applied = data.appliedFilters || {};
        const chips = [];

        if (applied.difficulty) chips.push(formatLabel(applied.difficulty));
        if (applied.category) chips.push(formatLabel(applied.category));
        if (applied.techStack) chips.push(applied.techStack);
        if (applied.minImpactScore) chips.push(`Impact >= ${applied.minImpactScore}`);
        if (applied.isTrending) chips.push("Trending");

        setResults(data.results?.content || []);
        setResultsTitle(`Search results for "${query.trim()}"`);
        setActiveChips(chips);
        setInterpretation(data.interpretation || "Search complete.");
        return;
      } catch (error) {
        setPanelError("Could not run that search.");
        return;
      }
    }

    if (hasStructuredFilters) {
      await applyFilters();
      return;
    }

    await loadFeed("projects", "/projects", "All projects");
    setActiveChips([]);
  }

  async function handleGithubImport() {
    setPanelError("");
    try {
      const data = await request("/import/github?limit=15", { method: "POST" });
      if (data.success) {
        setInterpretation(`Import result: ${data.message}`);
        await loadFeed("projects", "/projects", "All projects");
      }
    } catch (error) {
      setPanelError("Could not trigger GitHub import.");
    }
  }

  function resetFilters() {
    setQuery("");
    setFilters(defaultFilters);
    setActiveChips([]);
    setInterpretation("Search with a sentence or use the filters to narrow the list.");
    setResultsTitle("All projects");
    request("/projects?page=0&size=9")
      .then((data) => setResults(data.content || []))
      .catch(() => setPanelError("Could not reload the list."));
  }

  return (
    <div className="min-h-screen bg-atlas-bg transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-slate-200 pb-8 dark:border-slate-800">
          <button 
            onClick={() => setView("landing")}
            className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
          >
            Project<span className="text-atlas-accent">Atlas</span>
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView(view === "landing" ? "explorer" : "landing")}
              className="text-sm font-semibold text-slate-600 hover:text-atlas-accent dark:text-slate-400"
            >
              {view === "landing" ? "Browse Explorer" : "Back to Home"}
            </button>
            <button
              className="button-secondary"
              type="button"
              onClick={() => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </header>

        <main className="mt-12">
          {view === "landing" ? (
            <LandingPage 
              onExplore={() => setView("explorer")}
              trendingProjects={feeds.trending}
              highImpactProjects={feeds.impact}
              onOpenProject={openBreakdown}
              topStacks={topStacks}
              onSearchTag={searchByTag}
            />
          ) : (
            <div className="space-y-10">
              <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_360px]">
                  <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">
                      Find a project worth building.
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700 dark:text-slate-300">
                      This list comes from your backend. You can search it, filter it, and open a full breakdown for each idea.
                    </p>

                    <form className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900" onSubmit={runSmartSearch}>
                      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                        <input
                          className="field"
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Example: backend Java project with queues and medium difficulty"
                        />
                        <button className="button-primary" type="submit">
                          Search
                        </button>
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <select
                          className="field"
                          value={filters.difficulty}
                          onChange={(event) => setFilters((current) => ({ ...current, difficulty: event.target.value }))}
                        >
                          <option value="">Any difficulty</option>
                          <option value="BEGINNER">Beginner</option>
                          <option value="INTERMEDIATE">Intermediate</option>
                          <option value="ADVANCED">Advanced</option>
                        </select>

                        <input 
                          type="text"
                          className="field"
                          placeholder="Technology"
                          value={filters.techStack || ""}
                          onChange={(event) => setFilters((current) => ({ ...current, techStack: event.target.value }))}
                        />

                        <select
                          className="field"
                          value={filters.category}
                          onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
                        >
                          <option value="">Any category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {formatLabel(category)}
                            </option>
                          ))}
                        </select>

                        <select
                          className="field"
                          value={filters.impact}
                          onChange={(event) => setFilters((current) => ({ ...current, impact: event.target.value }))}
                        >
                          <option value="">Any impact</option>
                          <option value="8">8 and up</option>
                          <option value="7">7 and up</option>
                          <option value="6">6 and up</option>
                        </select>

                        <label className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                          <span>Trending only</span>
                          <input
                            type="checkbox"
                            checked={filters.trending}
                            onChange={(event) => setFilters((current) => ({ ...current, trending: event.target.checked }))}
                          />
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          <button className="button-secondary" type="button" onClick={applyFilters}>
                            Apply
                          </button>
                          <button className="button-secondary" type="button" onClick={resetFilters}>
                            Reset
                          </button>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">{interpretation}</p>
                    </form>
                  </div>

                  <aside className="card p-6">
                    <p className="text-sm font-medium text-atlas-accent">Random pick</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      {spotlight?.title || "Loading project"}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
                      {spotlight?.shortHook || spotlight?.description || "No project loaded yet."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tagsFor(spotlight).map((tag) => (
                        <span key={`spotlight-${tag}`} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 grid gap-3">
                      <button className="button-primary" onClick={() => spotlight && openBreakdown(spotlight.projectId)}>
                        Open project
                      </button>
                      <button className="button-secondary" onClick={loadSpotlight}>
                        Load another
                      </button>
                    </div>
                  </aside>

                  <aside className="card p-6 border-atlas-accent/30 bg-atlas-accent/5">
                    <p className="text-sm font-medium text-atlas-accent">Mass Context Expansion</p>
                    <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Deep Context Sync
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      Widen the context by automatically crawling 15+ industry domains on GitHub's decentralized index for hundreds of projects.
                    </p>
                    <div className="mt-5">
                      <button 
                        className="button-primary w-full" 
                        onClick={handleGithubImport}
                        title="Search GitHub for high-quality project inspirations at scale"
                      >
                        Start Deep Context Sync
                      </button>
                    </div>
                  </aside>
                </div>
              </header>

              <div className="space-y-10">
                {panelError ? (
                  <section className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    {panelError}
                  </section>
                ) : null}

                <section className="bg-atlas-accent/5 border border-atlas-accent/20 rounded-2xl p-4 flex flex-wrap gap-x-8 gap-y-4 items-center justify-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Projects:</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCompactNumber(stats.total)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Trending Loaded:</span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-500">{formatCompactNumber(stats.trending)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg Impact:</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{averageImpact || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Top project:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 max-w-[150px] truncate">{topViewedProject?.title || "-"}</span>
                  </div>
                </section>


                <section>
                  <div className="mb-5">
                    <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-100">Lists from the API</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      These sections are not marketing cards. They show real results from each backend endpoint.
                    </p>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    <FeedSection
                      title="Trending"
                      helper="Projects from /api/discovery/trending"
                      projects={feeds.trending}
                      onOpen={openBreakdown}
                      onViewMore={() => loadFeed("trending", "/discovery/trending", "Trending projects")}
                    />
                    <FeedSection
                      title="High impact"
                      helper="Projects from /api/discovery/high-impact"
                      projects={feeds.impact}
                      onOpen={openBreakdown}
                      onViewMore={() => loadFeed("high impact", "/discovery/high-impact", "High impact projects")}
                    />
                    <FeedSection
                      title="Backend focused"
                      helper="Projects from /api/discovery/backend-focused"
                      projects={feeds.backend}
                      onOpen={openBreakdown}
                      onViewMore={() => loadFeed("backend focused", "/discovery/backend-focused", "Backend focused projects")}
                    />
                    <FeedSection
                      title="Underrated"
                      helper="Projects from /api/discovery/underrated"
                      projects={feeds.underrated}
                      onOpen={openBreakdown}
                      onViewMore={() => loadFeed("underrated", "/discovery/underrated", "Underrated projects")}
                    />
                  </div>
                </section>

                <section>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-100">{resultsTitle}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">Use this area to inspect the full list, filtered list, or search results.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeChips.map((chip) => (
                        <span key={chip} className="tag">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {pageLoading ? (
                    <div className="flex flex-col gap-4">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="card h-28 animate-pulse bg-slate-100 dark:bg-slate-800" />
                      ))}
                    </div>
                  ) : results.length ? (
                    <div className="flex flex-col gap-4">
                      {results.map((project) => (
                        <ProjectListItem key={project.projectId} project={project} onOpen={openBreakdown} />
                      ))}
                    </div>

                  ) : (
                    <div className="card p-8 text-center">
                      <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">No projects found.</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">Try adjusting your filters or search query.</p>
                    </div>
                  )}
                </section>
              </div>

              {/* Sidebar */}
              <aside className="w-full lg:w-80 space-y-6 shrink-0 lg:sticky lg:top-8">
                <div className="card p-6 border-atlas-accent/30 bg-atlas-accent/5">
                  <p className="text-sm font-medium text-atlas-accent">Mass Context Expansion</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">Deep Context Sync</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    Widen the context by automatically crawling 15+ industry domains on GitHub's decentralized index for hundreds of projects.
                  </p>
                  <button className="button-primary w-full mt-5" onClick={handleGithubImport}>Start Deep Context Sync</button>
                </div>

                <div className="card p-6">
                  <p className="text-sm font-medium text-atlas-accent">Random pick</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{spotlight?.title || "Loading project"}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300 line-clamp-3">
                    {spotlight?.shortHook || spotlight?.description || "No project loaded yet."}
                  </p>
                  <button className="button-primary w-full mt-5" onClick={() => spotlight && openBreakdown(spotlight.projectId)}>Open project</button>
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Common tech tags</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topStacks.length ? (
                      topStacks.map(([tag, count]) => (
                        <button key={tag} onClick={() => searchByTag(tag)} className="tag hover:border-atlas-accent transition cursor-pointer">
                          {tag} <span className="opacity-60 ml-1">{count}</span>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">None yet.</p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </main>

      </div>

      <DetailDrawer
        breakdown={breakdown}
        open={drawerOpen}
        loading={drawerLoading}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
