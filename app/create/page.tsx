"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, RotateCcw, Sparkles, Save, AlertCircle, CheckCircle, Lightbulb, Plus, Trash2, Upload } from 'lucide-react'
import ResumeParser from "@/components/resume-parser"

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

const initialFormData: FormData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  education: [{ degree: "", institution: "", year: "", gpa: "", honors: "" }],
  experience: [{ company: "", role: "", from: "", to: "", description: "", achievements: [""] }],
  skills: {
    technical: [],
    soft: [],
    languages: [],
    certifications: [],
  },
  projects: [{ title: "", description: "", technologies: "", link: "", github: "" }],
}

export default function CreatePage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(0)
  const [completionScore, setCompletionScore] = useState(0)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [showParser, setShowParser] = useState(false)

  const steps = [
    { title: "Personal Info", icon: "👤" },
    { title: "Summary", icon: "📝" },
    { title: "Experience", icon: "💼" },
    { title: "Education", icon: "🎓" },
    { title: "Skills", icon: "⚡" },
    { title: "Projects", icon: "🚀" },
  ]

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
            achievements: Array.isArray(exp.achievements) ? exp.achievements : [""],
          }))
        : [{ company: "", role: "", from: "", to: "", description: "", achievements: [""] }],
      education: Array.isArray(data.education)
        ? data.education
        : [{ degree: "", institution: "", year: "", gpa: "", honors: "" }],
      projects: Array.isArray(data.projects)
        ? data.projects
        : [{ title: "", description: "", technologies: "", link: "", github: "" }],
    }
  }

  // Handle parsed data from resume parser
  const handleParsedData = (parsedData: FormData) => {
    const cleanedData = ensureSkillsArrays(parsedData)
    setFormData(cleanedData)
    localStorage.setItem("resumeData", JSON.stringify(cleanedData))
  }

  // Auto-save functionality
  useEffect(() => {
    const saveData = () => {
      setIsAutoSaving(true)
      localStorage.setItem("resumeData", JSON.stringify(formData))
      setTimeout(() => setIsAutoSaving(false), 1000)
    }

    const timeoutId = setTimeout(saveData, 2000)
    return () => clearTimeout(timeoutId)
  }, [formData])

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(ensureSkillsArrays(parsedData))
      } catch (error) {
        console.error("Error parsing saved data:", error)
        setFormData(initialFormData)
      }
    }
  }, [])

  // Calculate completion score
  useEffect(() => {
    const calculateScore = () => {
      let score = 0
      const weights = {
        personalInfo: 20,
        summary: 15,
        experience: 25,
        education: 15,
        skills: 15,
        projects: 10,
      }

      // Personal Info
      const personalFields = Object.values(formData.personalInfo).filter((v) => v && v.trim()).length
      score += (personalFields / 7) * weights.personalInfo

      // Summary
      if (formData.summary && formData.summary.trim()) score += weights.summary

      // Experience
      const validExperience = formData.experience.filter((exp) => exp.company && exp.role).length
      score += Math.min(validExperience / 2, 1) * weights.experience

      // Education
      const validEducation = formData.education.filter((edu) => edu.degree && edu.institution).length
      score += Math.min(validEducation / 1, 1) * weights.education

      // Skills - safely handle arrays
      const skillsCount = [
        ...(Array.isArray(formData.skills.technical) ? formData.skills.technical : []),
        ...(Array.isArray(formData.skills.soft) ? formData.skills.soft : []),
        ...(Array.isArray(formData.skills.languages) ? formData.skills.languages : []),
      ].filter((s) => s && s.trim()).length
      score += Math.min(skillsCount / 8, 1) * weights.skills

      // Projects
      const validProjects = formData.projects.filter((proj) => proj.title && proj.description).length
      score += Math.min(validProjects / 2, 1) * weights.projects

      setCompletionScore(Math.round(score))
    }

    calculateScore()
  }, [formData])

  // AI Suggestions (mock)
  useEffect(() => {
    const suggestions = [
      "Add quantifiable achievements to your experience",
      "Include relevant keywords for your industry",
      "Consider adding a professional certification",
      "Highlight your leadership experience",
      "Add links to your portfolio or GitHub",
    ]
    setAiSuggestions(suggestions.slice(0, 3))
  }, [])

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", from: "", to: "", description: "", achievements: [""] },
      ],
    }))
  }

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "", gpa: "", honors: "" }],
    }))
  }

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addSkill = (category: keyof typeof formData.skills) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], ""],
      },
    }))
  }

  const removeSkill = (category: keyof typeof formData.skills, index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index),
      },
    }))
  }

  const updateSkill = (category: keyof typeof formData.skills, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((skill, i) => (i === index ? value : skill)),
      },
    }))
  }

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "", technologies: "", link: "", github: "" }],
    }))
  }

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  const updateProject = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) => (i === index ? { ...project, [field]: value } : project)),
    }))
  }

  const clearForm = () => {
    setFormData(initialFormData)
    localStorage.removeItem("resumeData")
    setCurrentStep(0)
  }

  const renderPersonalInfo = () => (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <span className="text-2xl mr-2">👤</span>
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Full Name *</label>
            <Input
              value={formData.personalInfo.name}
              onChange={(e) => updatePersonalInfo("name", e.target.value)}
              placeholder="John Doe"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email *</label>
            <Input
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
              placeholder="john@example.com"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
            <Input
              value={formData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Location</label>
            <Input
              value={formData.personalInfo.location}
              onChange={(e) => updatePersonalInfo("location", e.target.value)}
              placeholder="New York, NY"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Website/Portfolio</label>
            <Input
              value={formData.personalInfo.website}
              onChange={(e) => updatePersonalInfo("website", e.target.value)}
              placeholder="https://johndoe.com"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">LinkedIn</label>
            <Input
              value={formData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-300">GitHub</label>
            <Input
              value={formData.personalInfo.github}
              onChange={(e) => updatePersonalInfo("github", e.target.value)}
              placeholder="github.com/johndoe"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSummary = () => (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📝</span>
            Professional Summary
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-purple-400 text-purple-400 hover:bg-purple-400/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Enhance
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={formData.summary}
          onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
          placeholder="Write a compelling summary that highlights your key achievements, skills, and career objectives..."
          rows={6}
          className="bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none"
        />
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Lightbulb className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Pro Tip</h4>
              <p className="text-gray-300 text-sm">
                Keep your summary to 3-4 sentences. Focus on your unique value proposition and quantifiable
                achievements.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderExperience = () => (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <span className="text-2xl mr-2">💼</span>
            Work Experience
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={addExperience}
            className="bg-transparent border-white/30 text-white hover:bg-white/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.experience.map((exp, index) => (
          <div key={index} className="border rounded-lg p-4 relative bg-white/5">
            {formData.experience.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                onClick={() => removeExperience(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Company</label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                  placeholder="Tech Corp"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Role</label>
                <Input
                  value={exp.role}
                  onChange={(e) => updateExperience(index, "role", e.target.value)}
                  placeholder="Software Engineer"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">From</label>
                <Input
                  value={exp.from}
                  onChange={(e) => updateExperience(index, "from", e.target.value)}
                  placeholder="Jan 2022"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">To</label>
                <Input
                  value={exp.to}
                  onChange={(e) => updateExperience(index, "to", e.target.value)}
                  placeholder="Present"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  const renderEducation = () => (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <span className="text-2xl mr-2">🎓</span>
            Education
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={addEducation}
            className="bg-transparent border-white/30 text-white hover:bg-white/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.education.map((edu, index) => (
          <div key={index} className="border rounded-lg p-4 relative bg-white/5">
            {formData.education.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                onClick={() => removeEducation(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Degree</label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Institution</label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                  placeholder="University of Technology"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Year</label>
                <Input
                  value={edu.year}
                  onChange={(e) => updateEducation(index, "year", e.target.value)}
                  placeholder="2020-2024"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">GPA (Optional)</label>
                <Input
                  value={edu.gpa || ""}
                  onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                  placeholder="3.8/4.0"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-300">Honors (Optional)</label>
                <Input
                  value={edu.honors || ""}
                  onChange={(e) => updateEducation(index, "honors", e.target.value)}
                  placeholder="Magna Cum Laude, Dean's List"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  const renderSkills = () => (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <span className="text-2xl mr-2">⚡</span>
          Skills & Expertise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Technical Skills */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">Technical Skills</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSkill("technical")}
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {formData.skills.technical.length === 0 && (
              <div className="md:col-span-2 text-gray-400 text-sm">
                No technical skills added yet. Click "Add" to get started.
              </div>
            )}
            {formData.skills.technical.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill("technical", index, e.target.value)}
                  placeholder="JavaScript, React, Python..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill("technical", index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">Soft Skills</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSkill("soft")}
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {formData.skills.soft.length === 0 && (
              <div className="md:col-span-2 text-gray-400 text-sm">
                No soft skills added yet. Click "Add" to get started.
              </div>
            )}
            {formData.skills.soft.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill("soft", index, e.target.value)}
                  placeholder="Leadership, Communication..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill("soft", index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">Languages</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSkill("languages")}
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {formData.skills.languages.length === 0 && (
              <div className="md:col-span-2 text-gray-400 text-sm">
                No languages added yet. Click "Add" to get started.
              </div>
            )}
            {formData.skills.languages.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill("languages", index, e.target.value)}
                  placeholder="English (Native), Spanish (Fluent)..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill("languages", index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">Certifications</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSkill("certifications")}
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {formData.skills.certifications.length === 0 && (
              <div className="md:col-span-2 text-gray-400 text-sm">
                No certifications added yet. Click "Add" to get started.
              </div>
            )}
            {formData.skills.certifications.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill("certifications", index, e.target.value)}
                  placeholder="AWS Solutions Architect, PMP..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill("certifications", index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderProjects = () => (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <span className="text-2xl mr-2">🚀</span>
            Projects (Optional)
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={addProject}
            className="bg-transparent border-white/30 text-white hover:bg-white/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.projects.map((project, index) => (
          <div key={index} className="border rounded-lg p-4 relative bg-white/5">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-red-400 hover:text-red-300"
              onClick={() => removeProject(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Project Title</label>
                <Input
                  value={project.title}
                  onChange={(e) => updateProject(index, "title", e.target.value)}
                  placeholder="E-commerce Website"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Technologies</label>
                <Input
                  value={project.technologies}
                  onChange={(e) => updateProject(index, "technologies", e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  placeholder="Describe the project and your contributions..."
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Live Demo Link (Optional)</label>
                  <Input
                    value={project.link || ""}
                    onChange={(e) => updateProject(index, "link", e.target.value)}
                    placeholder="https://project-demo.com"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">GitHub Link (Optional)</label>
                  <Input
                    value={project.github || ""}
                    onChange={(e) => updateProject(index, "github", e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">ResumeAI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowParser(true)}
                variant="outline"
                className="bg-transparent border-green-500/30 text-green-400 hover:bg-green-500/10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Resume
              </Button>
              <div className="flex items-center space-x-2">
                {isAutoSaving ? (
                  <div className="flex items-center text-green-400 text-sm">
                    <Save className="h-4 w-4 mr-1 animate-pulse" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Saved
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={clearForm}
                className="bg-transparent border-white/30 text-white hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Link href="/preview">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-white">Create Your Resume</h1>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{completionScore}%</div>
                  <div className="text-sm text-gray-400">Complete</div>
                </div>
                <div className="w-32">
                  <Progress value={completionScore} className="h-2" />
                </div>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <Button
                  key={index}
                  variant={currentStep === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center space-x-2 whitespace-nowrap ${
                    currentStep === index
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-transparent border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  <span>{step.icon}</span>
                  <span>{step.title}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-3">
              {currentStep === 0 && renderPersonalInfo()}
              {currentStep === 1 && renderSummary()}
              {currentStep === 2 && renderExperience()}
              {currentStep === 3 && renderEducation()}
              {currentStep === 4 && renderSkills()}
              {currentStep === 5 && renderProjects()}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Suggestions */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20"
                    >
                      <AlertCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{suggestion}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Resume Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Completion</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {completionScore}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">ATS Score</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      85/100
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Word Count</span>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                      {formData.summary ? formData.summary.split(" ").length : 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Parser Modal */}
      {showParser && (
        <ResumeParser
          onDataParsed={handleParsedData}
          onClose={() => setShowParser(false)}
        />
      )}

      <style jsx>{`
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
