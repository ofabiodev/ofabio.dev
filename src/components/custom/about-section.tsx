import { SiTypescript, SiReact, SiNodedotjs, SiPython } from "react-icons/si"

const tools = [
  { name: "TypeScript", Icon: SiTypescript },
  { name: "React", Icon: SiReact },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "Python", Icon: SiPython },
]

const workHistory = [
  {
    company: "Sympla",
    role: "Software Developer",
    period: "Present",
  },
]

export function AboutSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#27272A] rounded-xl p-6 border border-zinc-800">
          <h2 className="text-lg font-semibold text-neutral-100 mb-4">
            Tools I Use
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
              >
                <tool.Icon className="w-5 h-5 text-neutral-400" />
                <span className="text-sm text-neutral-300">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#27272A] rounded-xl p-6 border border-zinc-800">
          <h2 className="text-lg font-semibold text-neutral-100 mb-4">
            Work History
          </h2>
          <div className="space-y-4">
            {workHistory.map((work) => (
              <div key={work.company} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-neutral-100">
                    {work.company}
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {work.period}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">{work.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
