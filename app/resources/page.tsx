"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  BookOpen,
  Video,
  Headphones,
  ExternalLink,
  Search,
  Star,
  Clock,
  Users,
  Play,
  Download,
  Bookmark,
  Eye,
  Hand,
  TrendingUp,
} from "lucide-react"

interface Resource {
  id: number
  title: string
  description: string
  type: "book" | "video" | "podcast" | "course" | "article"
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  rating: number
  learningStyle: "Visual" | "Auditory" | "Kinesthetic" | "All"
  author: string
  thumbnail: string
  url: string
  price: "Free" | "Paid"
  tags: string[]
}

const sampleResources: Resource[] = [
  {
    id: 1,
    title: "JavaScript: The Complete Guide",
    description: "Comprehensive guide covering modern JavaScript from basics to advanced concepts",
    type: "course",
    category: "Programming",
    difficulty: "Beginner",
    duration: "40 hours",
    rating: 4.8,
    learningStyle: "Visual",
    author: "John Smith",
    thumbnail: "/placeholder.svg?height=200&width=300&text=JS+Course",
    url: "#",
    price: "Paid",
    tags: ["JavaScript", "ES6", "Web Development"],
  },
  {
    id: 2,
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    description: "Learn to write clean, maintainable code with practical examples",
    type: "book",
    category: "Programming",
    difficulty: "Intermediate",
    duration: "8 hours",
    rating: 4.9,
    learningStyle: "All",
    author: "Robert C. Martin",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Clean+Code",
    url: "#",
    price: "Paid",
    tags: ["Clean Code", "Best Practices", "Software Engineering"],
  },
  {
    id: 3,
    title: "React Fundamentals Explained",
    description: "Visual guide to understanding React components, hooks, and state management",
    type: "video",
    category: "Frontend",
    difficulty: "Beginner",
    duration: "3 hours",
    rating: 4.7,
    learningStyle: "Visual",
    author: "Sarah Johnson",
    thumbnail: "/placeholder.svg?height=200&width=300&text=React+Video",
    url: "#",
    price: "Free",
    tags: ["React", "Components", "Hooks"],
  },
  {
    id: 4,
    title: "The Developer's Podcast",
    description: "Weekly discussions on programming trends, career advice, and industry insights",
    type: "podcast",
    category: "Career",
    difficulty: "All",
    duration: "45 min/episode",
    rating: 4.6,
    learningStyle: "Auditory",
    author: "Tech Talk Network",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Podcast",
    url: "#",
    price: "Free",
    tags: ["Career", "Industry Trends", "Interviews"],
  },
  {
    id: 5,
    title: "Hands-on Machine Learning",
    description: "Practical approach to ML with real-world projects and implementations",
    type: "course",
    category: "AI/ML",
    difficulty: "Advanced",
    duration: "60 hours",
    rating: 4.9,
    learningStyle: "Kinesthetic",
    author: "Dr. Emily Chen",
    thumbnail: "/placeholder.svg?height=200&width=300&text=ML+Course",
    url: "#",
    price: "Paid",
    tags: ["Machine Learning", "Python", "Projects"],
  },
  {
    id: 6,
    title: "UI/UX Design Principles",
    description: "Visual guide to creating beautiful and functional user interfaces",
    type: "article",
    category: "Design",
    difficulty: "Beginner",
    duration: "30 min",
    rating: 4.5,
    learningStyle: "Visual",
    author: "Design Studio",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Design+Article",
    url: "#",
    price: "Free",
    tags: ["UI/UX", "Design", "Principles"],
  },
]

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedLearningStyle, setSelectedLearningStyle] = useState("All")
  const [bookmarkedResources, setBookmarkedResources] = useState<number[]>([])

  const categories = ["All", "Programming", "Frontend", "Backend", "AI/ML", "Design", "Career"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]
  const types = ["All", "book", "video", "podcast", "course", "article"]
  const learningStyles = ["All", "Visual", "Auditory", "Kinesthetic"]

  const filteredResources = sampleResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || resource.difficulty === selectedDifficulty
    const matchesType = selectedType === "All" || resource.type === selectedType
    const matchesLearningStyle =
      selectedLearningStyle === "All" ||
      resource.learningStyle === selectedLearningStyle ||
      resource.learningStyle === "All"

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType && matchesLearningStyle
  })

  const toggleBookmark = (resourceId: number) => {
    setBookmarkedResources((prev) =>
      prev.includes(resourceId) ? prev.filter((id) => id !== resourceId) : [...prev, resourceId],
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "podcast":
        return <Headphones className="h-4 w-4" />
      case "course":
        return <Play className="h-4 w-4" />
      case "article":
        return <BookOpen className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case "Visual":
        return <Eye className="h-4 w-4" />
      case "Auditory":
        return <Headphones className="h-4 w-4" />
      case "Kinesthetic":
        return <Hand className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "Advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">EduPath AI</span>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Learning Resources
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalized Learning Resources</h1>
          <p className="text-gray-600">Discover curated content tailored to your learning style and goals</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search resources, topics, or authors..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Difficulty</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      >
                        {difficulties.map((difficulty) => (
                          <option key={difficulty} value={difficulty}>
                            {difficulty}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Type</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        {types.map((type) => (
                          <option key={type} value={type}>
                            {type === "All" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Learning Style</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedLearningStyle}
                        onChange={(e) => setSelectedLearningStyle(e.target.value)}
                      >
                        {learningStyles.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={resource.thumbnail || "/placeholder.svg"}
                      alt={resource.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleBookmark(resource.id)}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          bookmarkedResources.includes(resource.id)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 mb-2">
                        {getTypeIcon(resource.type)}
                        <Badge variant="outline" className="text-xs">
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </Badge>
                        <Badge className={getDifficultyColor(resource.difficulty) + " text-xs"}>
                          {resource.difficulty}
                        </Badge>
                        {resource.price === "Free" && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            Free
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                    <CardDescription className="text-sm">{resource.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{resource.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{resource.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{resource.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getLearningStyleIcon(resource.learningStyle)}
                          <span className="text-xs text-gray-600">{resource.learningStyle}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button className="flex-1" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Resource
                        </Button>
                        {resource.type === "course" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Based on your learning style (Visual), progress, and goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredResources
                    .filter((r) => r.learningStyle === "Visual" || r.learningStyle === "All")
                    .slice(0, 4)
                    .map((resource) => (
                      <div key={resource.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={resource.thumbnail || "/placeholder.svg"}
                          alt={resource.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-600">{resource.author}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {resource.type}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{resource.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm">View</Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarked" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bookmark className="h-5 w-5 mr-2 text-yellow-600" />
                  Your Bookmarked Resources
                </CardTitle>
                <CardDescription>Resources you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                {bookmarkedResources.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
                    <p className="text-gray-600">Start bookmarking resources to access them quickly</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sampleResources
                      .filter((r) => bookmarkedResources.includes(r.id))
                      .map((resource) => (
                        <div key={resource.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <img
                            src={resource.thumbnail || "/placeholder.svg"}
                            alt={resource.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {resource.type}
                              </Badge>
                              <Badge className={getDifficultyColor(resource.difficulty) + " text-xs"}>
                                {resource.difficulty}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{resource.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toggleBookmark(resource.id)}>
                              <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Trending This Week
                </CardTitle>
                <CardDescription>Most popular resources among learners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleResources
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5)
                    .map((resource, index) => (
                      <div key={resource.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <img
                          src={resource.thumbnail || "/placeholder.svg"}
                          alt={resource.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-600">{resource.author}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {resource.type}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{resource.rating}</span>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              Trending
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm">View</Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recently Added</CardTitle>
                <CardDescription>Latest resources added to our platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {sampleResources.slice(0, 4).map((resource) => (
                    <div key={resource.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={resource.thumbnail || "/placeholder.svg"}
                        alt={resource.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-gray-600">{resource.author}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            New
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
