import React from "react";

export default function LandingPage({ onExplore, trendingProjects, highImpactProjects, onOpenProject, topStacks = [], onSearchTag }) {
  const formatLabel = (value) => {
    if (!value) return "";
    return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-10">
        <div className="absolute -top-24 left-1/2 h-(500px) w-(800px) -translate-x-1/2 rounded-full bg-atlas-accent/5 blur-(120px) dark:bg-atlas-accent/10" />
        
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-atlas-accent/20 bg-atlas-accent/5 px-4 py-2 text-sm font-medium text-atlas-accent backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-atlas-accent opacity-75"></span>
              <span className="relative inline-flex h-full w-full rounded-full bg-atlas-accent"></span>
            </span>
            Discover Your Next High-Impact Project
          </div>
          
          <h1 className="mt-8 text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-7xl">
            Build projects that <br />
            <span className="bg-gradient-to-r from-atlas-accent to-orange-400 bg-clip-text text-transparent">
              matter to recruiters.
            </span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Stop building generic clones. ProjectAtlas uses data-driven scoring to help you find unique, 
            high-impact backend projects that showcase your true engineering potential.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-6">
            <button 
              onClick={onExplore}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-atlas-accent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-atlas-accent-dark hover:shadow-xl hover:shadow-atlas-accent/20"
            >
              Start Exploring
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="rounded-full border border-slate-200 bg-white/50 px-8 py-4 text-lg font-semibold text-slate-700 backdrop-blur-sm transition-all hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-900">
              How it works
            </button>
          </div>
        </div>
      </section>

      {/* Featured Projects Grid & Tech Tags */}
      <section className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <div className="flex items-end justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Trendsetting Projects</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Handpicked projects with high market demand.</p>
            </div>
            <button onClick={onExplore} className="text-sm font-semibold text-atlas-accent hover:underline">
              View All &rarr;
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {trendingProjects.slice(0, 4).map((project) => (
              <article 
                key={project.projectId}
                className="group card flex h-full flex-col p-6 hover:ring-2 hover:ring-atlas-accent/50"
              >
                <div className="flex items-start justify-between">
                  <span className="tag border-atlas-accent/20 bg-atlas-accent/5 text-atlas-accent">
                    {formatLabel(project.difficulty)}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {project.impactScore}
                  </div>
                </div>
                
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-slate-50">{project.title}</h3>
                <p className="mt-3 flex-grow text-sm leading-6 text-slate-600 dark:text-slate-400 line-clamp-2">
                  {project.shortHook || project.description}
                </p>
                
                <button 
                  onClick={() => onOpenProject(project.projectId)}
                  className="mt-6 flex items-center gap-2 text-sm font-bold text-atlas-accent transition-all group-hover:translate-x-1"
                >
                  See Breakdown
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Popular Tech</h3>
            <p className="mt-2 text-sm text-slate-500">Filter projects by your favorite stack.</p>
            
            <div className="mt-6 space-y-3">
              {topStacks.map(([tag, count]) => (
                <button 
                  key={tag}
                  onClick={() => onSearchTag(tag)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/50 px-4 py-3 text-sm font-medium transition-all hover:border-atlas-accent hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                >
                  <span className="text-slate-900 dark:text-slate-100">{tag}</span>
                  <span className="text-atlas-accent">{count}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={onExplore}
              className="mt-6 w-full rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 dark:bg-atlas-accent dark:hover:bg-atlas-accent-dark"
            >
              Browse All
            </button>
          </div>

          <div className="card bg-gradient-to-br from-atlas-accent/10 to-orange-400/10 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Custom Filter</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Need something specific? Use our advanced explorer.</p>
            <button 
              onClick={onExplore}
              className="mt-4 text-sm font-bold text-atlas-accent hover:underline"
            >
              Open Filters &rarr;
            </button>
          </div>
        </aside>
      </section>

      {/* Value Prop Section */}
      <section className="rounded-3xl bg-slate-900 p-8 text-white dark:bg-slate-900/50 sm:p-16">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              A data-driven approach to <br />
              <span className="text-atlas-accent">career growth.</span>
            </h2>
            <p className="mt-6 text-lg text-slate-400">
              ProjectAtlas isn't just a list of ideas. It's a platform designed to evaluate exactly 
              what makes a project worth your time.
            </p>
            
            <div className="mt-10 space-y-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-atlas-accent/20 text-atlas-accent">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold">Resume Impact Scoring</h4>
                  <p className="mt-2 text-slate-400">We quantify the impressiveness of each project to help you stand out in the hiring pool.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold">Learning Path Progression</h4>
                  <p className="mt-2 text-slate-400">Each project is broken down into Beginner, Intermediate, and Advanced stages.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center">
            <div className="absolute h-64 w-64 animate-pulse rounded-full bg-atlas-accent/20 blur-3xl"></div>
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-8 border-b border-white/10 pb-4">
                  <span className="text-slate-400">Resume Value</span>
                  <span className="font-mono text-2xl text-atlas-accent">9.8</span>
                </div>
                <div className="flex items-center justify-between gap-8 border-b border-white/10 pb-4">
                  <span className="text-slate-400">Uniqueness</span>
                  <span className="font-mono text-2xl text-orange-400">8.5</span>
                </div>
                <div className="flex items-center justify-between gap-8 pb-4">
                  <span className="text-slate-400">Complexity</span>
                  <span className="font-mono text-2xl text-emerald-400">9.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
