import { useEffect, useMemo, useState, useRef } from "react";
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

const BOOKMARK_STORAGE_KEY = "atlas_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(BOOKMARK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const addBookmark = (id) => {
    setBookmarks((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      window.localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeBookmark = (id) => {
    setBookmarks((prev) => {
      const updated = prev.filter((bookmarkId) => bookmarkId !== id);
      window.localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const toggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      removeBookmark(id);
    } else {
      addBookmark(id);
    }
  };

  const isBookmarked = (id) => bookmarks.includes(id);

  return { bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked };
}

function ProjectListItem({ project, onOpen, isBookmarked, onToggleBookmark }) {
  return (
    <article 
      className="card p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center cursor-pointer hover:border-atlas-accent/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
      onClick={() => onOpen(project.projectId)}
    >
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-atlas-accent transition-colors pr-4">
            {project.title}
          </h3>
          {onToggleBookmark && (
            <button
              type="button"
              className={`shrink-0 p-2 rounded-full transition-colors ${
                isBookmarked
                  ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10"
                  : "text-slate-400 hover:text-yellow-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(project.projectId);
              }}
              title={isBookmarked ? "Remove bookmark" : "Bookmark this project"}
            >
              <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>
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

function ProjectCard({ project, onOpen, isBookmarked, onToggleBookmark }) {
  return (
    <article 
      className="card p-5 flex flex-col h-full cursor-pointer hover:border-atlas-accent/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
      onClick={() => onOpen(project.projectId)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-atlas-accent transition-colors line-clamp-2 pr-4">
          {project.title}
        </h3>
        {onToggleBookmark && (
          <button
            type="button"
            className={`shrink-0 p-1.5 rounded-full transition-colors ${
              isBookmarked
                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10"
                : "text-slate-400 hover:text-yellow-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(project.projectId);
            }}
            title={isBookmarked ? "Remove bookmark" : "Bookmark this project"}
          >
            <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
        {project.shortHook || project.description || "No summary available yet."}
      </p>
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 text-xs">
          {tagsFor(project).slice(0, 3).map((tag) => (
            <span key={`${project.projectId}-${tag}`} className="tag px-1.5 py-0.5 text-[10px]">{tag}</span>
          ))}
          {tagsFor(project).length > 3 && (
             <span className="tag px-1.5 py-0.5 text-[10px]">+{tagsFor(project).length - 3}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
             <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{numberOrDash(project.impactScore)}</span>
             <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Impact</span>
          </div>
          {project.isTrending ? (
             <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] font-semibold uppercase tracking-wide">Trending</span>
          ) : (
             <div className="text-[10px] text-slate-400 font-medium">{formatCompactNumber(project.viewCount)} views</div>
          )}
        </div>
      </div>
    </article>
  );
}

function AllProjectsView({ bookmarks, removeBookmark, toggleBookmark, isBookmarked, onOpenBreakdown }) {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProjects = async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/projects?page=${pageNum}&size=24`);
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      
      if (pageNum === 0) {
        setProjects(data.content || []);
      } else {
        setProjects(prev => [...prev, ...(data.content || [])]);
      }
      
      setHasMore(!data.last);
    } catch (err) {
      setError("Could not load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  return (
    <div className="space-y-8">
      <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">All Projects</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Browse the entire marketplace of projects on the platform.</p>
      </header>

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={`all-proj-${project.projectId}`} 
            project={project} 
            onOpen={onOpenBreakdown}
            isBookmarked={isBookmarked(project.projectId)}
            onToggleBookmark={toggleBookmark}
          />
        ))}
        {loading && Array.from({ length: page === 0 ? 12 : 4 }).map((_, index) => (
          <div key={`skel-${index}`} className="card h-64 animate-pulse bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
      
      {!loading && projects.length === 0 && !error && (
        <div className="card p-12 text-center text-slate-500">No projects found.</div>
      )}

      {hasMore && !error && (
        <div className="mt-10 flex justify-center pb-12">
          <button 
            className="button-secondary px-8 py-3"
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Projects"}
          </button>
        </div>
      )}
    </div>
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

function DetailDrawer({ breakdown, open, loading, onClose, isBookmarked, onToggleBookmark }) {
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
          <div className="flex items-center gap-3">
            {project && onToggleBookmark && (
              <button 
                className={`button-secondary flex items-center gap-2 ${isBookmarked ? 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20 dark:text-yellow-500' : ''}`}
                onClick={() => onToggleBookmark(project.projectId)}
              >
                <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
            )}
            <button className="button-secondary" onClick={onClose}>
              Close
            </button>
          </div>
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

function Dashboard({ bookmarks, removeBookmark, onOpenBreakdown }) {
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookmarks.length === 0) {
      setBookmarkedProjects([]);
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const ids = bookmarks.join(",");
        const res = await fetch(`http://localhost:8080/api/projects/bulk?ids=${ids}`);
        if (!res.ok) throw new Error("Failed to load bookmarks");
        const data = await res.json();
        setBookmarkedProjects(data);
      } catch (err) {
        setError("Could not load bookmarked projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [bookmarks]);

  return (
    <div className="space-y-8">
      <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Your Dashboard</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Projects you've saved for later.</p>
      </header>

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </section>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`dash-skeleton-${index}`} className="card h-28 animate-pulse bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : bookmarkedProjects.length > 0 ? (
        <div className="flex flex-col gap-4">
          {bookmarkedProjects.map((project) => (
            <ProjectListItem 
              key={project.projectId} 
              project={project} 
              onOpen={onOpenBreakdown}
              isBookmarked={true}
              onToggleBookmark={removeBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">No bookmarks yet</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm">
            You haven't saved any projects to your dashboard. Explore the feeds and click the bookmark icon to save projects you want to build.
          </p>
        </div>
      )}
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
  const [view, setView] = useState("landing"); // "landing", "explorer", "dashboard"
  const { bookmarks, toggleBookmark, isBookmarked, removeBookmark } = useBookmarks();

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
              onClick={() => setView("explorer")}
              className={`text-sm font-semibold transition-colors ${view === 'explorer' ? 'text-atlas-accent' : 'text-slate-600 hover:text-atlas-accent dark:text-slate-400'}`}
            >
              Explorer
            </button>
            <button
              onClick={() => setView("all")}
              className={`text-sm font-semibold transition-colors ${view === 'all' ? 'text-atlas-accent' : 'text-slate-600 hover:text-atlas-accent dark:text-slate-400'}`}
            >
              All Projects
            </button>
            <button
              onClick={() => setView("dashboard")}
              className={`text-sm font-semibold transition-colors flex items-center gap-1 ${view === 'dashboard' ? 'text-atlas-accent' : 'text-slate-600 hover:text-atlas-accent dark:text-slate-400'}`}
            >
              Dashboard
              {bookmarks.length > 0 && (
                <span className="bg-atlas-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {bookmarks.length}
                </span>
              )}
            </button>
            <button
              className="button-secondary ml-2"
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
          ) : view === "dashboard" ? (
            <Dashboard 
              bookmarks={bookmarks} 
              removeBookmark={removeBookmark} 
              onOpenBreakdown={openBreakdown} 
            />
          ) : view === "all" ? (
            <AllProjectsView 
              bookmarks={bookmarks} 
              removeBookmark={removeBookmark} 
              toggleBookmark={toggleBookmark}
              isBookmarked={isBookmarked}
              onOpenBreakdown={openBreakdown} 
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

                    <div className="mt-8 flex items-center gap-2 mb-2">
                       <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                       <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">AI-Powered Smart Search</span>
                    </div>
                    <form className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500/20" onSubmit={runSmartSearch}>
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
                        <ProjectListItem 
                          key={project.projectId} 
                          project={project} 
                          onOpen={openBreakdown} 
                          isBookmarked={isBookmarked(project.projectId)}
                          onToggleBookmark={toggleBookmark}
                        />
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
        isBookmarked={breakdown.project ? isBookmarked(breakdown.project.projectId) : false}
        onToggleBookmark={toggleBookmark}
      />

      <MentorChat 
        onOpenBreakdown={openBreakdown}
      />
    </div>
  );
}

function MentorChat({ onOpenBreakdown }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    { role: 'assistant', content: "Hi! I'm your Project Mentor. Tell me about your career goals—like 'I want to work at a big bank' or 'I want to be a DevOps engineer'—and I'll find the best projects for you." }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setMessage("");
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        content: data.message, 
        recommendations: data.recommendations 
      }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-bottom-4 duration-300">
          <header className="flex items-center justify-between border-b border-slate-100 bg-atlas-accent/5 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-atlas-accent text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Project Mentor</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-atlas-accent text-white shadow-sm' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Recommended Projects:</p>
                      {msg.recommendations.map(p => (
                        <div key={p.projectId} className="rounded-xl border border-white/20 bg-white/10 p-2 hover:bg-white/20 cursor-pointer transition-colors" onClick={() => onOpenBreakdown(p.projectId)}>
                          <p className="font-semibold text-xs">{p.title}</p>
                          <p className="text-[10px] opacity-80 line-clamp-1">{p.shortHook}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-100 p-4 dark:border-slate-800">
            <div className="flex gap-2">
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask your mentor..." className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-atlas-accent focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" />
              <button type="submit" disabled={loading} className="flex h-9 w-9 items-center justify-center rounded-xl bg-atlas-accent text-white hover:bg-atlas-accent/90 disabled:opacity-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </form>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="flex h-14 w-14 items-center justify-center rounded-full bg-atlas-accent text-white shadow-xl hover:scale-110 transition-transform active:scale-95 group relative">
        {!isOpen && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">1</span>}
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
}
