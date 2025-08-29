"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Star, TrendingUp } from "lucide-react"

const exampleResumes = [
  {
    id: "software-engineer",
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    company: "Google",
    template: "Tech Innovator",
    industry: "Technology",
    experience: "5+ years",
    image: "image.png",
    highlights: ["Led team of 8 developers", "Increased performance by 40%", "Built scalable microservices"],
    skills: ["React", "Node.js", "Python", "AWS", "Docker"],
    rating: 4.9,
    downloads: "15K+",
  },
  {
    id: "marketing-director",
    name: "Michael Rodriguez",
    role: "Marketing Director",
    company: "Meta",
    template: "Executive Pro",
    industry: "Marketing",
    experience: "8+ years",
    image: "image (1).png",
    highlights: ["Grew user base by 300%", "Managed $2M budget", "Led global campaigns"],
    skills: ["Digital Marketing", "Analytics", "Strategy", "Leadership"],
    rating: 4.8,
    downloads: "12K+",
  },
  {
    id: "product-designer",
    name: "Emily Johnson",
    role: "Senior Product Designer",
    company: "Apple",
    template: "Creative Portfolio",
    industry: "Design",
    experience: "6+ years",
    image: "image (2).png",
    highlights: ["Designed award-winning apps", "Improved UX metrics by 60%", "Led design system"],
    skills: ["Figma", "Sketch", "Prototyping", "User Research"],
    rating: 4.9,
    downloads: "18K+",
  },
  {
    id: "data-scientist",
    name: "David Park",
    role: "Senior Data Scientist",
    company: "Netflix",
    template: "Modern Gradient",
    industry: "Data Science",
    experience: "4+ years",
    image: "image (3).png",
    highlights: ["Built ML models", "Improved recommendations by 25%", "Published 5 papers"],
    skills: ["Python", "TensorFlow", "SQL", "Statistics"],
    rating: 4.7,
    downloads: "10K+",
  },
  {
    id: "sales-manager",
    name: "Lisa Thompson",
    role: "Regional Sales Manager",
    company: "Salesforce",
    template: "Sales Champion",
    industry: "Sales",
    experience: "7+ years",
    image: "image (4).png",
    highlights: ["Exceeded quota by 150%", "Managed 50+ accounts", "Generated $5M revenue"],
    skills: ["CRM", "Negotiation", "Strategy", "Team Leadership"],
    rating: 4.8,
    downloads: "8K+",
  },
  {
    id: "healthcare-professional",
    name: "Dr. James Wilson",
    role: "Emergency Medicine Physician",
    company: "Mayo Clinic",
    template: "Healthcare Pro",
    industry: "Healthcare",
    experience: "10+ years",
    image: "image (5).png",
    highlights: ["Board certified", "Led trauma team", "Published researcher"],
    skills: ["Emergency Medicine", "Leadership", "Research", "Patient Care"],
    rating: 4.9,
    downloads: "6K+",
  },
]

const industries = ["All", "Technology", "Marketing", "Design", "Data Science", "Sales", "Healthcare"]

export default function ExamplesPage() {
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
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/templates" className="text-gray-300 hover:text-white transition-colors">
                Templates
              </Link>
              <Link href="/create" className="text-gray-300 hover:text-white transition-colors">
                Create
              </Link>
              <Link href="/examples" className="text-blue-400 font-medium">
                Examples
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Success
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                {" "}
                Stories
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get inspired by real resumes from professionals who landed their dream jobs. See how they structured their
              experience and what made them stand out.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {[
                { number: "500K+", label: "Success Stories" },
                { number: "95%", label: "Interview Rate" },
                { number: "50+", label: "Industries" },
                { number: "4.9/5", label: "Average Rating" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {industries.map((industry) => (
              <Button
                key={industry}
                variant="outline"
                size="sm"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                {industry}
              </Button>
            ))}
          </div>

          {/* Examples Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exampleResumes.map((resume, index) => (
              <Card
                key={resume.id}
                className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={resume.image || "/placeholder.svg"}
                    alt={`${resume.name} resume example`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{resume.template}</Badge>
                    <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                      {resume.industry}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-white text-xs">{resume.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {resume.downloads}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">{resume.name}</CardTitle>
                  <div className="text-blue-400 font-medium">{resume.role}</div>
                  <div className="text-gray-300 text-sm">
                    {resume.company} • {resume.experience}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-4">
                    <h4 className="font-medium text-white mb-2 text-sm">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {resume.highlights.slice(0, 2).map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="text-gray-300 text-sm flex items-start">
                          <span className="text-green-400 mr-2">▸</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-white mb-2 text-sm">Top Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {resume.skills.slice(0, 4).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs border-white/30 text-gray-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-sm"
                    >
                      <Eye className="h-3 w-3 mr-2" />
                      View
                    </Button>
                    <Link href="/create" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm">
                        Use Template
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Success Stories?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Start building your professional resume today and join thousands of professionals who've landed their
              dream jobs with ResumeAI.
            </p>
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
              >
                <FileText className="h-5 w-5 mr-2" />
                Start Building Your Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>

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
