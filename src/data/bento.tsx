import type { BentoCardProps } from "@/components/custom/bento-grid"

import { FaShield } from "react-icons/fa6"
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiPython,
  SiGo,
  SiTailwindcss,
  SiGit,
} from "react-icons/si"
import { VscVscode } from "react-icons/vsc"
import { HiUser } from "react-icons/hi"

const techStack = [
  { name: "TypeScript", Icon: SiTypescript, color: "bg-[#3178C6]" },
  { name: "JavaScript", Icon: SiJavascript, color: "bg-[#F7DF1E]" },
  { name: "Python", Icon: SiPython, color: "bg-[#00C950]" },
  { name: "Go", Icon: SiGo, color: "bg-[#00ADD8]" },
  { name: "React", Icon: SiReact, color: "bg-[#61DAFB]" },
  { name: "Tailwind", Icon: SiTailwindcss, color: "bg-[#38BDF8]" },
  { name: "Git", Icon: SiGit, color: "bg-[#F05032]" },
  { name: "VSCode", Icon: VscVscode, color: "bg-[#007ACC]" },
]

const experiences = [
  {
    role: "Digital Transformation Assistant",
    company: "Sympla",
    period: "Sep 2025 - Present",
    current: true,
  },
  {
    role: "Finance Apprentice",
    company: "Sympla",
    period: "Aug 2024 - Sep 2025",
    current: false,
  },
]

export const projects: BentoCardProps[] = [
  {
    name: "",
    description:
      "I’m 18, I’m a full-stack developer, and I build simple things that work really well.",
    Icon: HiUser,
    className: "col-span-3 lg:col-span-1",
    badges: [
      {
        text: "About",
        className: "bg-zinc-800/90 text-zinc-400 border border-zinc-700/50",
      },
    ],
    background: <div className="absolute inset-0 bg-zinc-800/90" />,
  },
  {
    name: "Tech Stack",
    description: "",
    Icon: () => null,
    className: "col-span-3 lg:col-span-1",
    badges: [
      {
        text: "Skills",
        className: "bg-zinc-800/90 text-zinc-400 border border-zinc-700/50",
      },
    ],
    background: (
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="grid grid-cols-4 gap-2 w-full">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className={`flex items-center justify-center ${tech.color} rounded aspect-square`}
            >
              <tech.Icon className="w-7 h-7 text-white" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "Experience",
    description: "",
    Icon: () => null,
    className: "col-span-3 lg:col-span-1 lg:row-span-2",
    badges: [
      {
        text: "Work History",
        className: "bg-zinc-800/90 text-zinc-400 border border-zinc-700/50",
      },
    ],
    background: (
      <div className="absolute inset-0 pt-12 px-6 pb-6 flex flex-col gap-4">
        {experiences.map((exp, idx) => (
          <div key={`${exp.role}-${exp.company}`}>
            {idx > 0 && experiences[idx - 1].current && (
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-zinc-700" />
                <span className="text-xs text-zinc-500">Previous</span>
                <div className="h-px flex-1 bg-zinc-700" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-neutral-200">
                {exp.role}
              </h3>
              <p className="text-xs text-neutral-400">{exp.company}</p>
              <span className="text-xs text-neutral-500">{exp.period}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "Resafe",
    description:
      "A library that checks if regex patterns are vulnerable to ReDoS attacks.",
    href: "https://resafe.js.org",
    cta: "View Project",
    Icon: FaShield,
    className: "col-span-3 lg:col-span-2",
    badges: [
      {
        text: "Project",
        className: "bg-zinc-800/90 text-zinc-400 border border-zinc-700/50",
      },
    ],
    background: (
      <img
        src="/projects/resafe.svg"
        alt="Resafe project preview"
        className="absolute inset-0 h-full w-full object-cover"
      />
    ),
  },
]
