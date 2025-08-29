"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Star, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const templates = [
  {
    id: "modern-gradient",
    name: "Modern Gradient",
    category: "Modern",
    description: "Eye-catching gradient design perfect for creative professionals",
    image: "image.png",
    features: ["Gradient header", "Modern fonts", "Skill bars", "Creative layout"],
    rating: 4.9,
    downloads: "50K+",
    premium: false,
    color: "from-blue-500 to-purple-600",
  },
  {
    id: "executive-pro",
    name: "Executive Pro",
    category: "Executive",
    description: "Sophisticated design for senior-level positions and executives",
    image: "image (1).png",
    features: ["Executive styling", "Premium fonts", "Leadership focus", "Professional layout"],
    rating: 4.8,
    downloads: "35K+",
    premium: true,
    color: "from-gray-700 to-gray-900",
  },
  {
    id: "tech-innovator",
    name: "Tech Innovator",
    category: "Technology",
    description: "Perfect for developers, engineers, and tech professionals",
    image: "image (2).png",
    features: ["Code-friendly", "Tech icons", "Project showcase", "GitHub integration"],
    rating: 4.9,
    downloads: "75K+",
    premium: false,
    color: "from-green-500 to-blue-500",
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    category: "Creative",
    description: "Showcase your creativity with this artistic design",
    image: "image (3).png",
    features: ["Portfolio section", "Creative layout", "Color customization", "Visual elements"],
    rating: 4.7,
    downloads: "40K+",
    premium: true,
    color: "from-pink-500 to-orange-500",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    category: "Minimal",
    description: "Clean and simple design focusing on content clarity",
    image: "image (4).png",
    features: ["Minimal design", "Clean typography", "Content focus", "ATS-friendly"],
    rating: 4.8,
    downloads: "60K+",
    premium: false,
    color: "from-gray-400 to-gray-600",
  },
  {
    id: "academic-scholar",
    name: "Academic Scholar",
    category: "Academic",
    description: "Designed for researchers, professors, and academic professionals",
    image: "image (5).png",
    features: ["Publication list", "Research focus", "Academic styling", "Citation ready"],
    rating: 4.6,
    downloads: "25K+",
    premium: false,
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "sales-champion",
    name: "Sales Champion",
    category: "Sales",
    description: "Dynamic design for sales professionals and business development",
    image: "image (6).png",
    features: ["Achievement focus", "Metrics display", "Dynamic layout", "Results-oriented"],
    rating: 4.7,
    downloads: "30K+",
    premium: true,
    color: "from-red-500 to-pink-600",
  },
  {
    id: "healthcare-pro",
    name: "Healthcare Pro",
    category: "Healthcare",
    description: "Professional design for medical and healthcare professionals",
    image: "image (8).png",
    features: ["Medical styling", "Certification focus", "Professional layout", "Trust-building"],
    rating: 4.8,
    downloads: "20K+",
    premium: false,
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: "startup-founder",
    name: "Startup Founder",
    category: "Entrepreneurial",
    description: "Bold design for entrepreneurs and startup founders",
    image: "image (9).png",
    features: ["Entrepreneurial focus", "Bold design", "Vision statement", "Innovation highlight"],
    rating: 4.9,
    downloads: "15K+",
    premium: true,
    color: "from-purple-600 to-pink-600",
  },
]

const categories = [
  "All",
  "Modern",
  "Executive",
  "Technology",
  "Creative",
  "Minimal",
  "Academic",
  "Sales",
  "Healthcare",
  "Entrepreneurial",
]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
              <Link href="/templates" className="text-blue-400 font-medium">
                Templates
              </Link>
              <Link href="/create" className="text-gray-300 hover:text-white transition-colors">
                Create
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
              Professional
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {" "}
                Templates
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose from our collection of professionally designed, ATS-optimized resume templates. Each template is
              crafted by design experts and optimized for modern hiring practices.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`${
                      selectedCategory === category
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-transparent border-white/30 text-white hover:bg-white/10"
                    } backdrop-blur-sm`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <Card
                key={template.id}
                className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-20`}></div>
                  <img
                    src={template.image || "/placeholder.svg"}
                    alt={`${template.name} template preview`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {template.premium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
                        Premium
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-white text-xs">{template.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                      {template.downloads}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-white">{template.name}</CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-300 mb-4 text-sm">{template.description}</p>

                  <div className="mb-6">
                    <h4 className="font-medium text-white mb-2 text-sm">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="outline" className="text-xs border-white/30 text-gray-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href="/preview" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </Link>
                    <Link href="/create" className="flex-1">
                      <Button
                        className={`w-full bg-gradient-to-r ${template.color} hover:opacity-90 transition-opacity`}
                      >
                        Use Template
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No templates found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Can't Find the Perfect Template?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Our AI-powered customization engine can help you create a unique design that perfectly matches your
              industry and style preferences.
            </p>
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
              >
                <FileText className="h-5 w-5 mr-2" />
                Create Custom Resume
              </Button>
            </Link>
          </div>

          {/* Tips Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Template Selection Tips</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Match Your Industry",
                  description: "Choose templates that align with your field's expectations and culture",
                  icon: "🎯",
                },
                {
                  title: "Consider ATS Compatibility",
                  description: "Ensure your chosen template works well with applicant tracking systems",
                  icon: "🤖",
                },
                {
                  title: "Highlight Your Strengths",
                  description: "Pick designs that emphasize your key skills and achievements",
                  icon: "💪",
                },
                {
                  title: "Keep It Professional",
                  description: "Balance creativity with professionalism for maximum impact",
                  icon: "👔",
                },
                {
                  title: "Test Different Versions",
                  description: "Try multiple templates to see which gets the best response",
                  icon: "🧪",
                },
                {
                  title: "Update Regularly",
                  description: "Refresh your resume design periodically to stay current",
                  icon: "🔄",
                },
              ].map((tip, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{tip.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                    <p className="text-gray-300 text-sm">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
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
