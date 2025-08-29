"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Palette, Star, Zap, Shield, ArrowRight, Play } from "lucide-react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Michael Chen",
      role: "Marketing Director",
      company: "Meta",
      text: "The AI suggestions feature saved me hours. My resume looks incredibly professional now.",
      avatar: "https://www.findtherightclick.com/wp-content/uploads/2017/07/Matt-T-Testimonial-pic.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      company: "Netflix",
      text: "Love the variety of templates! Found the perfect one that matches my industry.",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBIWygadYa9MmF18ujooAYtZwr3PPFU-KisA&s",
    },
  ]

  const stats = [
    { number: "500K+", label: "Resumes Created" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Templates" },
    { number: "4.9/5", label: "User Rating" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <FileText className="h-6 w-6 md:h-8 md:w-8 text-blue-400 transform hover:rotate-12 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl md:text-2xl font-bold text-white">ResumeAI</span>
          </div>
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
              Home
            </Link>
            <Link href="/templates" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
              Templates
            </Link>
            <Link href="/create" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
              Create
            </Link>
            <Link href="/examples" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
              Examples
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <div
          className={`text-center max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mb-6 md:mb-8">
            <span className="inline-block px-3 py-1 md:px-4 md:py-2 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 backdrop-blur-sm border border-blue-500/30">
              🚀 AI-Powered Resume Builder
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight">
            Build Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
              {" "}
              Dream
            </span>
            <br />
            Resume
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Create stunning, ATS-optimized resumes with our AI-powered builder. Choose from 50+ professional templates
            and land your dream job faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4">
            <Link href="/create">
              <Button
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl w-full sm:w-auto"
              >
                Start Building Free
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16 px-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-xs md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 3D Resume Preview */}
          <div className="relative max-w-4xl mx-auto mb-12 md:mb-16 px-4">
            <div className="relative transform hover:rotate-y-12 transition-transform duration-700 preserve-3d">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20">
                <div className="aspect-[4/5] bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-inner relative overflow-hidden">
                  <img
                    src="demo.png"
                    alt="Resume preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
              {/* 3D Shadow */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-black/20 rounded-2xl -z-10 blur-xl"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-12 md:py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              Why Choose ResumeAI?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced features powered by AI to give you the competitive edge
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6 md:h-8 md:w-8" />,
                title: "AI-Powered",
                description: "Smart suggestions and content optimization",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: <Shield className="h-6 w-6 md:h-8 md:w-8" />,
                title: "ATS-Optimized",
                description: "Pass through applicant tracking systems",
                color: "from-green-400 to-blue-500",
              },
              {
                icon: <Palette className="h-6 w-6 md:h-8 md:w-8" />,
                title: "50+ Templates",
                description: "Professional designs for every industry",
                color: "from-purple-400 to-pink-500",
              },
              {
                icon: <Download className="h-6 w-6 md:h-8 md:w-8" />,
                title: "Multiple Formats",
                description: "PDF, DOCX, and print-ready exports",
                color: "from-blue-400 to-purple-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
              >
                <CardContent className="p-4 md:p-6 text-center">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-white shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              Success Stories
            </h2>
            <p className="text-lg md:text-xl text-gray-300">Join thousands who landed their dream jobs</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 md:p-8 transform hover:scale-105 transition-all duration-300">
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl lg:text-2xl text-white mb-4 md:mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                  />
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm md:text-base">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-300 text-xs md:text-sm">
                      {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-12 md:py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Ready to Build Your Future?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join over 500,000 professionals who've built their careers with ResumeAI
          </p>
          <Link href="/create">
            <Button
              size="lg"
              className="text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
            >
              Start Building Now - It's Free!
              <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-sm py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
            <span className="text-lg md:text-xl font-bold text-white">ResumeAI</span>
          </div>
          <p className="text-gray-400 text-sm md:text-base">&copy; 2024 ResumeAI. Build your future with confidence.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-12 { transform: rotateY(12deg); }
      `}</style>
    </div>
  )
}
