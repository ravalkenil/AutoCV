"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Printer, Edit, Palette, Share2 } from 'lucide-react'

interface FormData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
    github: string
  }
  summary: string
  education: Array<{
    degree: string
    institution: string
    year: string
    gpa?: string
    honors?: string
  }>
  experience: Array<{
    company: string
    role: string
    from: string
    to: string
    description: string
    achievements: string[]
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
    certifications: string[]
  }
  projects: Array<{
    title: string
    description: string
    technologies: string
    link?: string
    github?: string
  }>
}

const sampleData: FormData = {
  personalInfo: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
  },
  summary:
    "Innovative Full-Stack Developer with 5+ years of experience building scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact solutions that drive business growth. Passionate about emerging technologies and committed to writing clean, maintainable code.",
  education: [
    {
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      year: "2018-2020",
      gpa: "3.9/4.0",
      honors: "Magna Cum Laude",
    },
  ],
  experience: [
    {
      company: "TechCorp Inc.",
      role: "Senior Full-Stack Developer",
      from: "Jan 2021",
      to: "Present",
      description: "Lead development of enterprise-scale applications serving 1M+ users",
      achievements: [
        "Increased application performance by 40% through optimization",
        "Led team of 6 developers in agile environment",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
      ],
    },
  ],
  skills: {
    technical: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
    soft: ["Leadership", "Problem Solving", "Communication", "Team Collaboration"],
    languages: ["English (Native)", "Spanish (Fluent)", "French (Conversational)"],
    certifications: ["AWS Solutions Architect", "Google Cloud Professional"],
  },
  projects: [
    {
      title: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with real-time inventory management and payment processing",
      technologies: "React, Node.js, MongoDB, Stripe API",
      link: "https://ecommerce-demo.com",
      github: "github.com/alexjohnson/ecommerce",
    },
  ],
}

type Template =
  | "modern-professional"
  | "enhancecv-professional"
  | "classic-corporate"
  | "modern-boxed"
  | "timeline"
  | "creative"
  | "minimal"
  | "modern-gradient"
  | "tech-innovator"

const templates = {
  "modern-professional": {
    name: "Modern Professional",
    color: "from-gray-600 to-gray-700",
    description: "Left sidebar layout",
  },
  "classic-corporate": {
    name: "Classic Corporate",
    color: "from-gray-800 to-gray-900",
    description: "Traditional single-column",
  },
  "modern-boxed": {
    name: "Modern Boxed",
    color: "from-gray-500 to-gray-600",
    description: "Boxed sections",
  },
  timeline: {
    name: "Two-Column Timeline",
    color: "from-gray-500 to-gray-600",
    description: "Timeline layout",
  },
  creative: {
    name: "Creative Resume",
    color: "from-gray-600 to-gray-700",
    description: "Modern design",
  },
  minimal: {
    name: "Minimal Resume",
    color: "from-gray-600 to-gray-700",
    description: "Clean black & white",
  },
  "enhancecv-professional": {
    name: "enhancecv Resume",
    color: "from-gray-600 to-gray-700",
    description: "Clean black & white",
  },

}

export default function PreviewPage() {
  const [formData, setFormData] = useState<FormData>(sampleData)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>("modern-professional")
  const [isDownloading, setIsDownloading] = useState(false)

  // Ensure skills arrays are properly initialized
  const ensureSkillsArrays = (data: FormData): FormData => {
    return {
      ...data,
      skills: {
        technical: Array.isArray(data.skills?.technical) ? data.skills.technical : [],
        soft: Array.isArray(data.skills?.soft) ? data.skills.soft : [],
        languages: Array.isArray(data.skills?.languages) ? data.skills.languages : [],
        certifications: Array.isArray(data.skills?.certifications) ? data.skills.certifications : [],
      },
      experience: Array.isArray(data.experience)
        ? data.experience.map((exp) => ({
          ...exp,
          achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
        }))
        : [],
      education: Array.isArray(data.education) ? data.education : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
    }
  }

  useEffect(() => {
    const savedData = localStorage.getItem("resumeData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(ensureSkillsArrays(parsedData))
      } catch (error) {
        console.error("Error parsing saved data:", error)
        setFormData(sampleData)
      }
    }
  }, [])

const handleDownload = async () => {
  setIsDownloading(true);
  try {
    // Lazy-load libs and normalize their exports
    const jsPDFMod = await import("jspdf");
    const html2canvasMod = await import("html2canvas");
    const jsPDF = (jsPDFMod as any).jsPDF || (jsPDFMod as any).default;
    const html2canvas = (html2canvasMod as any).default || (html2canvasMod as any);

    const srcEl = document.getElementById("resume-content");
    if (!srcEl) throw new Error("#resume-content not found");

    // Clone off-screen to avoid layout shifts and hidden/overflow styling issues
    const clone = srcEl.cloneNode(true) as HTMLElement;
    clone.id = "resume-content-print";
    Object.assign(clone.style, {
      position: "fixed",
      top: "-10000px",
      left: "-10000px",
      width: srcEl.offsetWidth + "px",
      display: "block",
      visibility: "visible"
    });
    document.body.appendChild(clone);

    // Ensure fonts are ready
    // (supported in modern browsers; safe no-op otherwise)
    // @ts-ignore
    if (document.fonts?.ready) await (document as any).fonts.ready;

    // Ensure images are loaded & try to set CORS to avoid tainting
    const imgs = Array.from(clone.querySelectorAll("img")) as HTMLImageElement[];
    await Promise.all(
      imgs.map(async (img) => {
        try {
          // Skip inlined images
          if (img.src.startsWith("data:")) return;
          const src = img.getAttribute("src") || "";
          if (!src) return;
          // Need crossOrigin set BEFORE src for CORS-enabled hosts
          const tmp = new Image();
          tmp.crossOrigin = "anonymous";
          tmp.src = src;
          await new Promise<void>((res, rej) => {
            tmp.onload = () => res();
            tmp.onerror = () => rej(new Error(`Image failed: ${src}`));
          });
          img.crossOrigin = "anonymous";
          img.src = tmp.src;
        } catch {
          // Ignore per-image failures; we’ll retry without images if needed
        }
      })
    );

    // Render to canvas (try with images)
    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(clone, {
        scale: Math.max(2, window.devicePixelRatio || 2),
        useCORS: true,
        backgroundColor: "#FFFFFF",
        logging: false
      });
    } catch (e) {
      // Likely a CORS/taint issue — retry with images hidden so user still gets a PDF
      imgs.forEach((img) => (img.style.visibility = "hidden"));
      canvas = await html2canvas(clone, {
        scale: Math.max(2, window.devicePixelRatio || 2),
        useCORS: true,
        backgroundColor: "#FFFFFF",
        logging: false
      });
    } finally {
      document.body.removeChild(clone);
    }

    // Convert to PDF and paginate if taller than one page
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    const pageCanvas = document.createElement("canvas");
    const ctx = pageCanvas.getContext("2d")!;
    pageCanvas.width = canvas.width;

    const pageHeightPx = Math.floor((pageH * canvas.width) / pageW);
    let y = 0;
    let pageIndex = 0;

    while (y < canvas.height) {
      const sliceH = Math.min(pageHeightPx, canvas.height - y);
      pageCanvas.height = sliceH;
      ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0, y, canvas.width, sliceH,
        0, 0, pageCanvas.width, pageCanvas.height
      );

      const pageImg = pageCanvas.toDataURL("image/jpeg", 0.98);
      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(
        pageImg,
        "JPEG",
        0,
        0,
        imgW,
        (sliceH * imgW) / pageCanvas.width
      );

      y += sliceH;
      pageIndex++;
    }

    const safeName =
      (formData?.personalInfo?.name || "Resume").replace(/\s+/g, "_") + "_Resume.pdf";
    pdf.save(safeName);
  } catch (err: any) {
    console.error("PDF generation failed:", err);
    alert(`PDF generation failed: ${err?.message || err}`);
  } finally {
    setIsDownloading(false);
  }
};


const EnhancedCVProfessionalTemplate = () => (
    <div className="bg-white shadow-lg mx-auto overflow-hidden flex font-sans a4-container">
      {/* Left Sidebar - EnhancedCV Style */}
      <div className="w-2/5 bg-gray-800 text-white p-6">
        {/* Profile Photo Area */}
        <div className="mb-6 flex justify-center">
          <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-3xl font-light">
              {formData.personalInfo.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3 border-b border-gray-600 pb-2 uppercase tracking-wide text-gray-300">Contact</h3>
          <div className="space-y-3 text-xs">
            {formData.personalInfo.email && (
              <div className="flex items-start">
                <svg className="w-3.5 h-3.5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div className="break-all">{formData.personalInfo.email}</div>
              </div>
            )}
            {formData.personalInfo.phone && (
              <div className="flex items-start">
                <svg className="w-3.5 h-3.5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>{formData.personalInfo.phone}</div>
              </div>
            )}
            {formData.personalInfo.location && (
              <div className="flex items-start">
                <svg className="w-3.5 h-3.5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>{formData.personalInfo.location}</div>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {formData.skills.technical.some((skill) => skill.trim()) && (
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3 border-b border-gray-600 pb-2 uppercase tracking-wide text-gray-300">Skills</h3>
            <div className="space-y-2">
              {formData.skills.technical
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <div key={index} className="text-xs">
                    <div className="mb-1 font-medium">{skill}</div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${70 + (index % 3) * 10}%` }}></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {formData.skills.languages && formData.skills.languages.some((lang) => lang.trim()) && (
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3 border-b border-gray-600 pb-2 uppercase tracking-wide text-gray-300">Languages</h3>
            <div className="space-y-2">
              {formData.skills.languages
                .filter((lang) => lang.trim())
                .map((lang, index) => (
                  <div key={index} className="text-xs">
                    <div className="mb-1 font-medium">{lang}</div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${80 + (index % 2) * 10}%` }}></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div>
          <h3 className="text-base font-semibold mb-3 border-b border-gray-600 pb-2 uppercase tracking-wide text-gray-300">Links</h3>
          <div className="space-y-2 text-xs">
            {formData.personalInfo.linkedin && (
              <div className="flex items-center">
                <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                </svg>
                <div className="break-all">{formData.personalInfo.linkedin}</div>
              </div>
            )}
            {formData.personalInfo.github && (
              <div className="flex items-center">
                <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 00-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.20 2.4.10 2.65.64.70 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0010 0z" />
                </svg>
                <div className="break-all">{formData.personalInfo.github}</div>
              </div>
            )}
            {formData.personalInfo.website && (
              <div className="flex items-center">
                <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                <div className="break-all">{formData.personalInfo.website}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Main Section */}
      <div className="w-3/5 bg-white p-6">
        {/* Name & Title */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{formData.personalInfo.name}</h1>
        </div>

        {/* Summary */}
        {formData.summary && (
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-2 uppercase tracking-wide border-l-4 border-blue-500 pl-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{formData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {formData.experience.some((exp) => exp.company || exp.role) && (
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wide border-l-4 border-blue-500 pl-1">
              Work Experience
            </h2>
            {formData.experience.map(
              (exp, index) =>
                (exp.company || exp.role) && (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{exp.role}</h3>
                        <p className="text-gray-600 text-sm font-medium">{exp.company}</p>
                      </div>
                      <span className="text-gray-500 text-xs font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                        {exp.from} - {exp.to}
                      </span>
                    </div>
                    {exp.description && <p className="text-gray-700 mb-2 text-xs">{exp.description}</p>}
                    {exp.achievements && exp.achievements.some((ach) => ach.trim()) && (
                      <ul className="list-none space-y-0.5 text-gray-700 text-xs">
                        {exp.achievements
                          .filter((ach) => ach.trim())
                          .map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start">
                              <span className="text-blue-500 mr-1 mt-0.5">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ),
            )}
          </section>
        )}

        {/* Education */}
        {formData.education.some((edu) => edu.degree || edu.institution) && (
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wide border-l-4 border-blue-500 pl-1">
              Education
            </h2>
            {formData.education.map(
              (edu, index) =>
                (edu.degree || edu.institution) && (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">{edu.degree}</h3>
                        <p className="text-gray-600 text-xs">{edu.institution}</p>
                        {edu.honors && <p className="text-gray-600 text-xs italic">{edu.honors}</p>}
                        {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-gray-500 text-xs font-medium">{edu.year}</span>
                    </div>
                  </div>
                ),
            )}
          </section>
        )}

        {/* Projects */}
        {formData.projects.some((project) => project.title || project.description) && (
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wide border-l-4 border-blue-500 pl-1">
              Projects
            </h2>
            {formData.projects.map(
              (project, index) =>
                (project.title || project.description) && (
                  <div key={index} className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5">{project.title}</h3>
                    {project.technologies && (
                      <p className="text-gray-600 text-xs mb-1">
                        <span className="font-medium">Technologies: </span>
                        {project.technologies}
                      </p>
                    )}
                    {project.description && <p className="text-gray-700 text-xs">{project.description}</p>}
                    {project.link && (
                      <a href={project.link} className="text-blue-500 text-xs hover:underline">
                        View Project
                      </a>
                    )}
                  </div>
                ),
            )}
          </section>
        )}

        {/* Certifications */}
        {formData.skills.certifications && formData.skills.certifications.some((cert) => cert.trim()) && (
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wide border-l-4 border-blue-500 pl-1">
              Certifications
            </h2>
            <div className="space-y-1">
              {formData.skills.certifications
                .filter((cert) => cert.trim())
                .map((cert, index) => (
                  <div key={index} className="text-gray-700 text-xs flex items-start">
                    <span className="text-blue-500 mr-1 mt-0.5">•</span>
                    <span>{cert}</span>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  const ModernProfessionalTemplate = () => (
    <div className="bg-gray-100 shadow-2xl mx-auto overflow-hidden flex a4-container">
      {/* Left Sidebar */}
      <div className="w-1/3 text-gray-800 p-5">
        {/* Contact Info */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3 border-b border-gray-600 pb-1">CONTACT</h3>
          <div className="space-y-2 text-xs">
            {formData.personalInfo.email && ( 
              <div>
                <div className="font-medium">Email</div>
                <div className="break-all">{formData.personalInfo.email}</div>
              </div>
            )}
            {formData.personalInfo.phone && (
              <div>
                <div className="font-medium">Phone</div>
                <div>{formData.personalInfo.phone}</div>
              </div>
            )}
            {formData.personalInfo.location && (
              <div>
                <div className="font-medium">Location</div>
                <div>{formData.personalInfo.location}</div>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {formData.skills.technical.some((skill) => skill.trim()) && (
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3 border-b border-gray-600 pb-1">SKILLS</h3>
            <div className="space-y-1">
              {formData.skills.technical
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <div key={index} className="text-xs">
                    <div className="mb-0.5">{skill}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div>
          <h3 className="text-base font-semibold mb-3 border-b border-gray-600 pb-1">LINKS</h3>
          <div className="space-y-2 text-xs">
            {formData.personalInfo.linkedin && (
              <div>
                <div className="font-medium">LinkedIn</div>
                <div className="break-all">{formData.personalInfo.linkedin}</div>
              </div>
            )}
            {formData.personalInfo.github && (
              <div>
                <div className="font-medium">GitHub</div>
                <div className="break-all">{formData.personalInfo.github}</div>
              </div>
            )}
            {formData.personalInfo.website && (
              <div>
                <div className="font-medium">Website</div>
                <div className="break-all">{formData.personalInfo.website}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Main Section */}
      <div className="w-2/3 bg-white p-6">
        {/* Name & Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{formData.personalInfo.name}</h1>
          <p className="text-lg text-gray-600 font-medium">Full-Stack Developer</p>
        </div>

        {/* Summary */}
        {formData.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-800 pb-1">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{formData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {formData.experience.some((exp) => exp.company || exp.role) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-800 pb-1">WORK EXPERIENCE</h2>
            {formData.experience.map(
              (exp, index) =>
                (exp.company || exp.role) && (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{exp.role}</h3>
                        <p className="text-gray-600 text-sm font-medium">{exp.company}</p>
                      </div>
                      <span className="text-gray-600 text-xs font-medium">
                        {exp.from} - {exp.to}
                      </span>
                    </div>
                    {exp.description && <p className="text-gray-700 mb-1 text-sm">{exp.description}</p>}
                    {exp.achievements && exp.achievements.some((ach) => ach.trim()) && (
                      <ul className="list-disc list-inside space-y-0.5 text-gray-700 text-xs">
                        {exp.achievements
                          .filter((ach) => ach.trim())
                          .map((achievement, achIndex) => (
                            <li key={achIndex}>{achievement}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ),
            )}
          </section>
        )}

        {/* Education */}
        {formData.education.some((edu) => edu.degree || edu.institution) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-800 pb-1">EDUCATION</h2>
            {formData.education.map(
              (edu, index) =>
                (edu.degree || edu.institution) && (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">{edu.degree}</h3>
                        <p className="text-gray-600 text-xs">{edu.institution}</p>
                        {edu.honors && <p className="text-gray-600 text-xs italic">{edu.honors}</p>}
                      </div>
                      <span className="text-gray-600 text-xs font-medium">{edu.year}</span>
                    </div>
                  </div>
                ),
            )}
          </section>
        )}

        {/* Projects */}
        {formData.projects.some((project) => project.title || project.description) && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-800 pb-1">PROJECTS</h2>
            {formData.projects.map(
              (project, index) =>
                (project.title || project.description) && (
                  <div key={index} className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5">{project.title}</h3>
                    {project.technologies && <p className="text-gray-600 text-xs mb-1">{project.technologies}</p>}
                    {project.description && <p className="text-gray-700 text-xs">{project.description}</p>}
                  </div>
                ),
            )}
          </section>
        )}
      </div>
    </div>
  )

  const ClassicCorporateTemplate = () => (
    <div className="bg-white shadow-2xl mx-auto overflow-hidden p-8 a4-container">
      {/* Name - Centered */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-1">{formData.personalInfo.name}</h1>

        {/* Contact Info - Inline */}
        <div className="flex justify-center items-center space-x-4 text-gray-700 text-xs">
          {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
          {formData.personalInfo.phone && <span>•</span>}
          {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
          {formData.personalInfo.location && <span>•</span>}
          {formData.personalInfo.location && <span>{formData.personalInfo.location}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {formData.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed font-serif">{formData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {formData.experience.some((exp) => exp.company || exp.role) && (
        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {formData.experience.map(
            (exp, index) =>
              (exp.company || exp.role) && (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-gray-800">{exp.role}</h3>
                      <p className="text-base text-gray-700 font-serif italic">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 font-serif text-xs">
                      {exp.from} - {exp.to}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-700 mb-2 text-sm font-serif">{exp.description}</p>}
                  {exp.achievements && exp.achievements.some((ach) => ach.trim()) && (
                    <ul className="list-disc list-inside space-y-0.5 text-gray-700 text-sm font-serif">
                      {exp.achievements
                        .filter((ach) => ach.trim())
                        .map((achievement, achIndex) => (
                          <li key={achIndex}>{achievement}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ),
          )}
        </section>
      )}

      {/* Education */}
      {formData.education.some((edu) => edu.degree || edu.institution) && (
        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">EDUCATION</h2>
          {formData.education.map(
            (edu, index) =>
              (edu.degree || edu.institution) && (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-serif font-semibold text-gray-800">{edu.degree}</h3>
                      <p className="text-gray-700 text-sm font-serif italic">{edu.institution}</p>
                      {edu.honors && <p className="text-gray-600 text-xs font-serif">{edu.honors}</p>}
                      {edu.gpa && <p className="text-gray-600 text-xs font-serif">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-gray-600 font-serif text-xs">{edu.year}</span>
                  </div>
                </div>
              ),
          )}
        </section>
      )}

      {/* Skills */}
      {formData.skills.technical.some((skill) => skill.trim()) && (
        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {formData.skills.technical
              .filter((skill) => skill.trim())
              .map((skill, index) => (
                <span key={index} className="text-gray-700 font-serif">
                  • {skill}
                </span>
              ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {formData.skills.certifications.some((cert) => cert.trim()) && (
        <section>
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
            CERTIFICATIONS
          </h2>
          <div className="space-y-1 text-xs">
            {formData.skills.certifications
              .filter((cert) => cert.trim())
              .map((cert, index) => (
                <p key={index} className="text-gray-700 font-serif">
                  • {cert}
                </p>
              ))}
          </div>
        </section>
      )}
    </div>
  )

  const ModernBoxedTemplate = () => (
    <div className="bg-gray-100 shadow-2xl mx-auto overflow-hidden p-6 a4-container">
      {/* Name & Contact Box */}
      <div className="bg-white rounded-lg shadow-lg p-5 mb-6 border border-gray-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{formData.personalInfo.name}</h1>
          <p className="text-lg text-gray-600 mb-3">Full-Stack Developer</p>
          <div className="flex justify-center items-center space-x-3 text-gray-600 text-xs">
            {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
            {formData.personalInfo.phone && <span>•</span>}
            {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
            {formData.personalInfo.location && <span>•</span>}
            {formData.personalInfo.location && <span>{formData.personalInfo.location}</span>}
          </div>
        </div>
      </div>

      {/* Summary Box */}
      {formData.summary && (
        <div className="bg-white rounded-lg shadow-lg p-5 mb-5 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{formData.summary}</p>
        </div>
      )}

      {/* Experience Box */}
      {formData.experience.some((exp) => exp.company || exp.role) && (
        <div className="bg-white rounded-lg shadow-lg p-5 mb-5 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-3">WORK EXPERIENCE</h2>
          {formData.experience.map(
            (exp, index) =>
              (exp.company || exp.role) && (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">{exp.role}</h3>
                      <p className="text-gray-600 text-sm font-medium">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {exp.from} - {exp.to}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-700 mb-1 text-sm">{exp.description}</p>}
                  {exp.achievements && exp.achievements.some((ach) => ach.trim()) && (
                    <ul className="list-disc list-inside space-y-0.5 text-gray-700 text-xs">
                      {exp.achievements
                        .filter((ach) => ach.trim())
                        .map((achievement, achIndex) => (
                          <li key={achIndex}>{achievement}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ),
          )}
        </div>
      )}

      {/* Skills & Education Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Skills Box */}
        {formData.skills.technical.some((skill) => skill.trim()) && (
          <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">SKILLS</h2>
            <div className="space-y-1">
              {formData.skills.technical
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></div>
                    <span className="text-gray-700 text-sm">{skill}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Education Box */}
        {formData.education.some((edu) => edu.degree || edu.institution) && (
          <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">EDUCATION</h2>
            {formData.education.map(
              (edu, index) =>
                (edu.degree || edu.institution) && (
                  <div key={index} className="mb-3 last:mb-0">
                    <h3 className="text-sm font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600 text-xs">{edu.institution}</p>
                    <p className="text-gray-600 text-xs">{edu.year}</p>
                    {edu.honors && <p className="text-gray-600 text-xs italic">{edu.honors}</p>}
                  </div>
                ),
            )}
          </div>
        )}
      </div>
    </div>
  )

  const TimelineTemplate = () => (
    <div className="bg-white shadow-2xl mx-auto overflow-hidden flex a4-container">
      {/* Left Column */}
      <div className="w-2/5 bg-gray-100 p-6">
        {/* Name */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{formData.personalInfo.name}</h1>
          <p className="text-base text-gray-600">Full-Stack Developer</p>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1">CONTACT</h3>
          <div className="space-y-1 text-xs text-gray-700">
            {formData.personalInfo.email && (
              <div>
                <div className="font-medium">Email</div>
                <div>{formData.personalInfo.email}</div>
              </div>
            )}
            {formData.personalInfo.phone && (
              <div>
                <div className="font-medium">Phone</div>
                <div>{formData.personalInfo.phone}</div>
              </div>
            )}
            {formData.personalInfo.location && (
              <div>
                <div className="font-medium">Location</div>
                <div>{formData.personalInfo.location}</div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {formData.summary && (
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1">SUMMARY</h3>
            <p className="text-gray-700 text-xs leading-relaxed">{formData.summary}</p>
          </div>
        )}

        {/* Skills */}
        {formData.skills.technical.some((skill) => skill.trim()) && (
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1">SKILLS</h3>
            <div className="space-y-1">
              {formData.skills.technical
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <div key={index} className="text-xs text-gray-700">
                    • {skill}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-3/5 p-6">
        {/* Experience Timeline */}
        {formData.experience.some((exp) => exp.company || exp.role) && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">EXPERIENCE</h2>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              {formData.experience.map(
                (exp, index) =>
                  (exp.company || exp.role) && (
                    <div key={index} className="relative mb-6 ml-6">
                      <div className="absolute -left-2.5 top-1.5 w-2 h-2 bg-gray-600 rounded-full border-2 border-white"></div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="text-base font-semibold text-gray-800">{exp.role}</h3>
                            <p className="text-gray-600 text-sm font-medium">{exp.company}</p>
                          </div>
                          <span className="text-gray-600 text-xs">
                            {exp.from} - {exp.to}
                          </span>
                        </div>
                        {exp.description && <p className="text-gray-700 text-xs mb-1">{exp.description}</p>}
                        {exp.achievements && exp.achievements.some((ach) => ach.trim()) && (
                          <ul className="list-disc list-inside space-y-0.5 text-gray-700 text-xs">
                            {exp.achievements
                              .filter((ach) => ach.trim())
                              .map((achievement, achIndex) => (
                                <li key={achIndex}>{achievement}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </section>
        )}

        {/* Education Timeline */}
        {formData.education.some((edu) => edu.degree || edu.institution) && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">EDUCATION</h2>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              {formData.education.map(
                (edu, index) =>
                  (edu.degree || edu.institution) && (
                    <div key={index} className="relative mb-4 ml-6">
                      <div className="absolute -left-2.5 top-1.5 w-2 h-2 bg-gray-600 rounded-full border-2 border-white"></div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800">{edu.degree}</h3>
                            <p className="text-gray-600 text-xs">{edu.institution}</p>
                            {edu.honors && <p className="text-gray-600 text-xs italic">{edu.honors}</p>}
                          </div>
                          <span className="text-gray-600 text-xs">{edu.year}</span>
                        </div>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </section>
        )}

        {/* Projects */}
        {formData.projects.some((project) => project.title || project.description) && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">PROJECTS</h2>
            {formData.projects.map(
              (project, index) =>
                (project.title || project.description) && (
                  <div key={index} className="mb-3 bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5">{project.title}</h3>
                    {project.technologies && <p className="text-gray-600 text-xs mb-1">{project.technologies}</p>}
                    {project.description && <p className="text-gray-700 text-xs">{project.description}</p>}
                  </div>
                ),
            )}
          </section>
        )}
      </div>
    </div>
  )

  const CreativeTemplate = () => (
    <div className="bg-white shadow-2xl mx-auto overflow-hidden a4-container">
      {/* Header */}
      <div className="text-gray-800 p-6 text-center">
        <h1 className="text-3xl font-bold mb-1 font-sans">{formData.personalInfo.name}</h1>
        <p className="text-xl font-light mb-3">Full-Stack Developer</p>
        <div className="flex justify-center items-center space-x-4 text-gray-600 text-xs">
          {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
          {formData.personalInfo.phone && <span>•</span>}
          {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
          {formData.personalInfo.location && <span>•</span>}
          {formData.personalInfo.location && <span>{formData.personalInfo.location}</span>}
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        {formData.summary && (
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800 mr-3">ABOUT ME</h2>
              <div className="flex-1 h-0.5 bg-gray-800"></div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed font-sans">{formData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {formData.experience.some((exp) => exp.company || exp.role) && (
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800 mr-3">EXPERIENCE</h2>
              <div className="flex-1 h-0.5 bg-gray-800"></div>
            </div>
            {formData.experience.map(
              (exp, index) =>
                (exp.company || exp.role) && (
                  <div key={index} className="mb-4 bg-gray-50 p-4 rounded-lg border-l-4 border-gray-800">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{exp.role}</h3>
                        <p className="text-gray-600 font-semibold text-sm">{exp.company}</p>
                      </div>
                      <span className="text-gray-600 bg-white px-2 py-0.5 rounded-full text-xs font-medium">
                        {exp.from} - {exp.to}
                      </span>
                    </div>
                    {exp.description && <p className="text-gray-700 mb-2 text-sm">{exp.description}</p>}
                    {exp.achievements && exp.achievements.some((ach) => ach.trim()) && (
                      <ul className="space-y-0.5">
                        {exp.achievements
                          .filter((ach) => ach.trim())
                          .map((achievement, achIndex) => (
                            <li key={achIndex} className="text-gray-700 text-sm flex items-start">
                              <span className="text-gray-800 mr-1 text-sm">•</span>
                              {achievement}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ),
            )}
          </section>
        )}

        {/* Skills */}
        {formData.skills.technical.some((skill) => skill.trim()) && (
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800 mr-3">SKILLS</h2>
              <div className="flex-1 h-0.5 bg-gray-800"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {formData.skills.technical
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-800 font-medium text-sm">{skill}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-800 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Education */}
        {formData.education.some((edu) => edu.degree || edu.institution) && (
          <section>
            <div className="flex items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800 mr-3">EDUCATION</h2>
              <div className="flex-1 h-0.5 bg-gray-800"></div>
            </div>
            {formData.education.map(
              (edu, index) =>
                (edu.degree || edu.institution) && (
                  <div key={index} className="mb-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-gray-800">{edu.degree}</h3>
                        <p className="text-gray-600 font-semibold text-sm">{edu.institution}</p>
                        {edu.honors && <p className="text-gray-600 italic text-xs">{edu.honors}</p>}
                      </div>
                      <span className="text-gray-600 bg-white px-2 py-0.5 rounded-full text-xs font-medium">
                        {edu.year}
                      </span>
                    </div>
                  </div>
                ),
            )}
          </section>
        )}
      </div>
    </div>
  )

  const MinimalTemplate = () => (
    <div className="bg-white shadow-2xl mx-auto overflow-hidden p-8 a4-container">
      {/* Name + Role */}
      <div className="text-center mb-6 border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-light text-black mb-1">{formData.personalInfo.name}</h1>
        <p className="text-lg text-gray-600">Full-Stack Developer</p>
      </div>

      {/* Two-column split */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary */}
          {formData.summary && (
            <section>
              <h2 className="text-base font-semibold text-black mb-2 uppercase tracking-wide">Summary</h2>
              <p className="text-gray-700 text-xs leading-relaxed">{formData.summary}</p>
            </section>
          )}

          {/* Skills */}
          {formData.skills.technical.some((skill) => skill.trim()) && (
            <section>
              <h2 className="text-base font-semibold text-black mb-2 uppercase tracking-wide">Skills</h2>
              <div className="space-y-0.5">
                {formData.skills.technical
                  .filter((skill) => skill.trim())
                  .map((skill, index) => (
                    <div key={index} className="text-gray-700 text-xs">
                      • {skill}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Contact */}
          <section>
            <h2 className="text-base font-semibold text-black mb-2 uppercase tracking-wide">Contact</h2>
            <div className="space-y-0.5 text-xs text-gray-700">
              {formData.personalInfo.email && <div>{formData.personalInfo.email}</div>}
              {formData.personalInfo.phone && <div>{formData.personalInfo.phone}</div>}
              {formData.personalInfo.location && <div>{formData.personalInfo.location}</div>}
              {formData.personalInfo.linkedin && <div>{formData.personalInfo.linkedin}</div>}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="md:col-span-3 space-y-6">
          {/* Work History */}
          {formData.experience.some((exp) => exp.company || exp.role) && (
            <section>
              <h2 className="text-base font-semibold text-black mb-3 uppercase tracking-wide">Experience</h2>
              {formData.experience.map(
                (exp, index) =>
                  (exp.company || exp.role) && (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-0.5">
                        <div>
                          <h3 className="font-semibold text-black text-sm">{exp.role}</h3>
                          <p className="text-gray-700 text-xs">{exp.company}</p>
                        </div>
                        <span className="text-gray-600 text-xs">
                          {exp.from} - {exp.to}
                        </span>
                      </div>
                      {exp.description && <p className="text-gray-700 text-xs mb-1">{exp.description}</p>}
                      {exp.achievements && exp.achievements.some((ach) => ach.trim()) && (
                        <ul className="list-disc list-inside space-y-0.5 text-gray-700 text-xs">
                          {exp.achievements
                            .filter((ach) => ach.trim())
                            .map((achievement, achIndex) => (
                              <li key={achIndex}>{achievement}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ),
              )}
            </section>
          )}

          {/* Education */}
          {formData.education.some((edu) => edu.degree || edu.institution) && (
            <section>
              <h2 className="text-base font-semibold text-black mb-3 uppercase tracking-wide">Education</h2>
              {formData.education.map(
                (edu, index) =>
                  (edu.degree || edu.institution) && (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-black text-sm">{edu.degree}</h3>
                          <p className="text-gray-700 text-xs">{edu.institution}</p>
                          {edu.honors && <p className="text-gray-600 text-xs">{edu.honors}</p>}
                        </div>
                        <span className="text-gray-600 text-xs">{edu.year}</span>
                      </div>
                    </div>
                  ),
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "modern-professional":
        return <ModernProfessionalTemplate />
      case "classic-corporate":
        return <ClassicCorporateTemplate />
      case "modern-boxed":
        return <ModernBoxedTemplate />
      case "timeline":
        return <TimelineTemplate />
      case "creative":
        return <CreativeTemplate />
      case "minimal":
        return <MinimalTemplate />
      case "enhancecv-professional":
        return <EnhancedCVProfessionalTemplate />
      default:
        return <ModernProfessionalTemplate />
    }
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10 print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">ResumeAI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/create">
                <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="bg-transparent border-white/30 text-white hover:bg-white/10"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8 print:p-0">
        {/* Template Selector */}
        <Card className="mb-8 print:hidden bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Palette className="h-5 w-5 text-purple-400" />
                <span className="font-medium text-white">Choose Template:</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">ATS Optimized</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {Object.entries(templates).map(([key, template]) => (
                <Button
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTemplate(key as Template)}
                  className={`${selectedTemplate === key
                      ? `bg-gradient-to-r ${template.color} text-white`
                      : "bg-transparent border-white/30 text-white hover:bg-white/10"
                    } backdrop-blur-sm flex flex-col h-auto p-3`}
                >
                  <span className="font-medium text-xs">{template.name}</span>
                  <span className="text-xs opacity-80">{template.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resume Preview */}
        <div id="resume-content" className="print:shadow-none flex justify-center">
          {renderTemplate()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8 print:hidden">
          <Link href="/create">
            <Button
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Resume
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="bg-transparent border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Resume
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Link
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { 
            margin: 0; 
            background: white !important; 
            width: 210mm;
            height: 297mm;
          }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          
          /* A4 size container */
          .a4-container {
            width: 210mm;
            min-height: 297mm;
            max-height: 297mm;
            margin: 0 auto;
            overflow: hidden;
          }
        }
        
        /* Screen styles */
        .a4-container {
          width: 210mm;
          min-height: 297mm;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  )
}
