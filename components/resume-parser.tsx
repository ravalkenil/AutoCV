"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface ParsedData {
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

interface ResumeParserProps {
  onDataParsed: (data: ParsedData) => void
  onClose: () => void
}

export default function ResumeParser({ onDataParsed, onClose }: ResumeParserProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [parseStatus, setParseStatus] = useState<'idle' | 'uploading' | 'parsing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supportedFormats = ['.pdf', '.docx', '.txt']
  const maxFileSize = 10 * 1024 * 1024 // 10MB

  // Mock parsing function - in a real app, this would call an API
  const parseResumeContent = async (text: string): Promise<ParsedData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock parsing logic - in reality, this would use NLP/AI to extract data
    const lines = text.split('\n').filter(line => line.trim())
    
    // Extract name (usually first line or after "Name:")
    const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m) || 
                     text.match(/Name:?\s*([A-Z][a-z]+ [A-Z][a-z]+)/i)
    const name = nameMatch ? nameMatch[1] : ''

    // Extract email
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)
    const email = emailMatch ? emailMatch[0] : ''

    // Extract phone
    const phoneMatch = text.match(/^(\+?1[-.\s]?)?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/g)
    const phone = phoneMatch ? phoneMatch[0] : ''

    // Extract location
    const locationMatch = text.match(/(.*(?:CA|NY|TX|FL|WA|IL|PA|OH|GA|NC|MI|NJ|VA|WV|AZ|MA|TN|IN|MO|MD|WI|CO|MN|SC|AL|LA|KY|OR|OK|CT|IA|MS|AR|KS|UT|NV|NM|WV|NE|ID|NH|HI|ME|MT|RI|DE|SD|ND|AK|VT|WY))/i)
    const location = locationMatch ? locationMatch[1].trim() : ''

    // Extract LinkedIn
    const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9-]+)/i)
    const linkedin = linkedinMatch ? linkedinMatch[0] : ''

    // Extract GitHub
    const githubMatch = text.match(/(github\.com\/[a-zA-Z0-9-]+)/i)
    const github = githubMatch ? githubMatch[0] : ''

    // Extract website
    const websiteMatch = text.match(/(https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g)
    const website = websiteMatch ? websiteMatch.find(url => !url.includes('linkedin') && !url.includes('github')) || '' : ''

    // Extract summary (usually after "Summary", "Profile", or "Objective")
    const summaryMatch = text.match(/(?:Summary|Profile|Objective|About)[:\s]*\n?(.*?)(?=\n\n|\n[A-Z]|$)/is)
    const summary = summaryMatch ? summaryMatch[1].trim() : ''

    // Extract skills
    const skillsMatch = text.match(/(?:Skills|Technical Skills|Core Competencies)[:\s]*\n?(.*?)(?=\n\n|\n[A-Z]|$)/is)
    const skillsText = skillsMatch ? skillsMatch[1] : ''
    const technical = skillsText ? skillsText.split(/[,\n•-]/).map(s => s.trim()).filter(s => s && s.length > 1) : []

    // Extract experience
    const experienceSection = text.match(/(?:Experience|Work Experience|Employment)[:\s]*\n?(.*?)(?=\n(?:Education|Skills|Projects)|$)/is)
    const experienceText = experienceSection ? experienceSection[1] : ''
    
    const experience = []
    if (experienceText) {
      // Simple parsing - look for company/role patterns
      const jobMatches = experienceText.match(/([A-Z][a-zA-Z\s&,.-]+)\s*[-–—]\s*([A-Z][a-zA-Z\s&,.-]+)\s*\n?([0-9]{4}.*?[0-9]{4}|Present)/g)
      if (jobMatches) {
        jobMatches.forEach(match => {
          const parts = match.split(/[-–—]/)
          if (parts.length >= 2) {
            experience.push({
              role: parts[0].trim(),
              company: parts[1].split('\n')[0].trim(),
              from: 'Jan 2020',
              to: 'Present',
              description: 'Extracted from uploaded resume',
              achievements: ['Achievement extracted from resume']
            })
          }
        })
      }
    }

    // Extract education
    const educationSection = text.match(/(?:Education|Academic Background)[:\s]*\n?(.*?)(?=\n(?:Experience|Skills|Projects)|$)/is)
    const educationText = educationSection ? educationSection[1] : ''
    
    const education = []
    if (educationText) {
      const degreeMatch = educationText.match(/([A-Z][a-zA-Z\s]+(?:Bachelor|Master|PhD|Doctorate|Associate).*?)\n?([A-Z][a-zA-Z\s&,.-]+University|College|Institute)/i)
      if (degreeMatch) {
        education.push({
          degree: degreeMatch[1].trim(),
          institution: degreeMatch[2].trim(),
          year: '2020-2024',
          gpa: '',
          honors: ''
        })
      }
    }

    return {
      personalInfo: {
        name,
        email,
        phone,
        location,
        website,
        linkedin,
        github
      },
      summary,
      education: education.length > 0 ? education : [{
        degree: '',
        institution: '',
        year: '',
        gpa: '',
        honors: ''
      }],
      experience: experience.length > 0 ? experience : [{
        company: '',
        role: '',
        from: '',
        to: '',
        description: '',
        achievements: ['']
      }],
      skills: {
        technical,
        soft: [],
        languages: [],
        certifications: []
      },
      projects: [{
        title: '',
        description: '',
        technologies: '',
        link: '',
        github: ''
      }]
    }
  }

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'text/plain') {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error('Failed to read text file'))
        reader.readAsText(file)
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'd normally use a library like pdf-parse
        // For this demo, we'll simulate PDF text extraction
        setTimeout(() => {
          resolve(`John Doe
john.doe@email.com
+1 (555) 123-4567
San Francisco, CA
linkedin.com/in/johndoe
github.com/johndoe

PROFESSIONAL SUMMARY
Experienced Full-Stack Developer with 5+ years of experience building scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact solutions.

TECHNICAL SKILLS
JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL, Git, Agile

WORK EXPERIENCE
Senior Software Engineer - TechCorp Inc.
Jan 2021 - Present
• Led development of enterprise applications serving 1M+ users
• Increased application performance by 40% through optimization
• Implemented CI/CD pipeline reducing deployment time by 60%

Software Developer - StartupXYZ
Jun 2019 - Dec 2020
• Built responsive web applications using React and Node.js
• Collaborated with design team to implement user-friendly interfaces
• Participated in code reviews and maintained high code quality standards

EDUCATION
Bachelor of Science in Computer Science
Stanford University
2015-2019
Magna Cum Laude, GPA: 3.8/4.0`)
        }, 1000)
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For DOCX files, we'd normally use a library like mammoth
        // For this demo, we'll simulate DOCX text extraction
        setTimeout(() => {
          resolve(`Sarah Johnson
sarah.johnson@email.com
+1 (555) 987-6543
New York, NY
linkedin.com/in/sarahjohnson

SUMMARY
Creative Marketing Director with 8+ years of experience driving brand growth and customer engagement through innovative digital marketing strategies.

CORE COMPETENCIES
Digital Marketing, SEO/SEM, Social Media Strategy, Content Marketing, Analytics, Brand Management, Team Leadership

PROFESSIONAL EXPERIENCE
Marketing Director - Digital Agency Pro
Mar 2020 - Present
• Managed marketing campaigns with budgets exceeding $2M annually
• Increased client ROI by 150% through data-driven strategies
• Led team of 12 marketing professionals across multiple disciplines

Senior Marketing Manager - BrandCorp
Jan 2018 - Feb 2020
• Developed and executed integrated marketing campaigns
• Grew social media following by 300% in 18 months
• Collaborated with sales team to generate qualified leads

EDUCATION
Master of Business Administration (MBA)
Harvard Business School
2016-2018

Bachelor of Arts in Marketing
University of California, Berkeley
2012-2016`)
        }, 1000)
      } else {
        reject(new Error('Unsupported file format'))
      }
    })
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file size
    if (file.size > maxFileSize) {
      setErrorMessage('File size must be less than 10MB')
      setParseStatus('error')
      return
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!supportedFormats.includes(fileExtension)) {
      setErrorMessage(`Unsupported file format. Please upload ${supportedFormats.join(', ')} files only.`)
      setParseStatus('error')
      return
    }

    try {
      setParseStatus('uploading')
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Extract text from file
      const text = await extractTextFromFile(file)
      setUploadProgress(100)
      clearInterval(progressInterval)

      // Parse the extracted text
      setParseStatus('parsing')
      const parsed = await parseResumeContent(text)
      setParsedData(parsed)
      setParseStatus('success')

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to parse resume')
      setParseStatus('error')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleUseData = () => {
    if (parsedData) {
      onDataParsed(parsedData)
      onClose()
    }
  }

  const renderUploadArea = () => (
    <div
      className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="h-12 w-12 text-white/60 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Upload Your Resume</h3>
      <p className="text-gray-300 mb-4">
        Drag and drop your resume here, or click to browse
      </p>
      <div className="flex justify-center space-x-2 mb-4">
        {supportedFormats.map(format => (
          <Badge key={format} variant="outline" className="border-white/30 text-white">
            {format}
          </Badge>
        ))}
      </div>
      <p className="text-sm text-gray-400">Maximum file size: 10MB</p>
      <input
        ref={fileInputRef}
        type="file"
        accept={supportedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )

  const renderProgress = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        {parseStatus === 'uploading' && (
          <>
            <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-white mb-2">Uploading Resume...</h3>
            <Progress value={uploadProgress} className="w-full max-w-md mx-auto mb-2" />
            <p className="text-sm text-gray-300">{uploadProgress}% complete</p>
          </>
        )}
        {parseStatus === 'parsing' && (
          <>
            <FileText className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-white mb-2">Parsing Resume...</h3>
            <p className="text-gray-300">Extracting information from your resume...</p>
          </>
        )}
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="py-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Resume Parsed Successfully!</h3>
        <p className="text-gray-300">We've extracted the following information:</p>
      </div>

      {parsedData && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Personal Info */}
          {parsedData.personalInfo.name && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {parsedData.personalInfo.name && (
                  <div><span className="text-gray-400">Name:</span> <span className="text-white">{parsedData.personalInfo.name}</span></div>
                )}
                {parsedData.personalInfo.email && (
                  <div><span className="text-gray-400">Email:</span> <span className="text-white">{parsedData.personalInfo.email}</span></div>
                )}
                {parsedData.personalInfo.phone && (
                  <div><span className="text-gray-400">Phone:</span> <span className="text-white">{parsedData.personalInfo.phone}</span></div>
                )}
                {parsedData.personalInfo.location && (
                  <div><span className="text-gray-400">Location:</span> <span className="text-white">{parsedData.personalInfo.location}</span></div>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {parsedData.summary && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Professional Summary</h4>
              <p className="text-gray-300 text-sm">{parsedData.summary}</p>
            </div>
          )}

          {/* Skills */}
          {parsedData.skills.technical.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.technical.slice(0, 10).map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-white/30 text-white text-xs">
                    {skill}
                  </Badge>
                ))}
                {parsedData.skills.technical.length > 10 && (
                  <Badge variant="outline" className="border-white/30 text-white text-xs">
                    +{parsedData.skills.technical.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Experience */}
          {parsedData.experience.some(exp => exp.company || exp.role) && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Work Experience</h4>
              {parsedData.experience.filter(exp => exp.company || exp.role).slice(0, 2).map((exp, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="text-sm">
                    <span className="text-white font-medium">{exp.role}</span>
                    {exp.company && <span className="text-gray-400"> at {exp.company}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {parsedData.education.some(edu => edu.degree || edu.institution) && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Education</h4>
              {parsedData.education.filter(edu => edu.degree || edu.institution).map((edu, index) => (
                <div key={index} className="text-sm">
                  <span className="text-white">{edu.degree}</span>
                  {edu.institution && <span className="text-gray-400"> from {edu.institution}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex space-x-4 mt-6">
        <Button
          onClick={handleUseData}
          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Use This Data
        </Button>
        <Button
          variant="outline"
          onClick={() => setParseStatus('idle')}
          className="bg-transparent border-white/30 text-white hover:bg-white/10"
        >
          Try Another File
        </Button>
      </div>
    </div>
  )

  const renderError = () => (
    <div className="text-center py-8">
      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Upload Failed</h3>
      <p className="text-gray-300 mb-6">{errorMessage}</p>
      <Button
        onClick={() => setParseStatus('idle')}
        variant="outline"
        className="bg-transparent border-white/30 text-white hover:bg-white/10"
      >
        Try Again
      </Button>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Import Resume
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {parseStatus === 'idle' && renderUploadArea()}
          {(parseStatus === 'uploading' || parseStatus === 'parsing') && renderProgress()}
          {parseStatus === 'success' && renderSuccess()}
          {parseStatus === 'error' && renderError()}
        </CardContent>
      </Card>
    </div>
  )
}
