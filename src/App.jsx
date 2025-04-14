"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { format, formatDistanceToNow } from "date-fns"
import { Download, Globe, ImageIcon, ZoomIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

interface Wallpaper {
  id: string
  title: string
  fullUrl: string
  imageUrl: string
  date: string
  copyright?: string
  description?: string
}

const countries = [
  { value: "ca", label: "Canada" },
  { value: "us", label: "United States" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "nz", label: "New Zealand" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "br", label: "Brazil" },
  { value: "in", label: "India" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "mx", label: "Mexico" },
  { value: "ru", label: "Russia" },
  { value: "ch", label: "Switzerland" },
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "nl", label: "Netherlands" },
  { value: "no", label: "Norway" },
  { value: "se", label: "Sweden" },
]

export default function WallpaperShowcase() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [country, setCountry] = useState("ca")
  const [loading, setLoading] = useState(true)
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const fetchWallpapers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`https://peapix.com/bing/feed?country=${country}`)
      setWallpapers(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching wallpapers:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWallpapers()
  }, [country])

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewDetails = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setOpenModal(true)
  }

  const getCountryName = (code: string) => {
    const country = countries.find((c) => c.value === code)
    return country ? country.label : code.toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <ImageIcon className="h-6 w-6 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-800">Bing Wallpapers</h1>
          </div>

          <div className="w-full md:w-auto">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full md:w-[220px]">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <SelectValue placeholder="Select a country" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800">Discover Beautiful Wallpapers</h2>
          <p className="text-slate-600 mt-2">Weekly Bing wallpapers from {getCountryName(country)}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallpapers.map((wallpaper) => (
              <Card
                key={wallpaper.id || wallpaper.title}
                className="overflow-hidden group transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={wallpaper.fullUrl || "/placeholder.svg"}
                    alt={wallpaper.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="mr-2"
                      onClick={() => handleViewDetails(wallpaper)}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleDownload(wallpaper.imageUrl, wallpaper.title)}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-slate-800 line-clamp-1">{wallpaper.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(wallpaper.date), { addSuffix: true })}
                  </p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(wallpaper)}>
                    View Details
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleDownload(wallpaper.imageUrl, wallpaper.title)}
                  >
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {wallpapers.length === 0 && !loading && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-700">No wallpapers found</h3>
            <p className="mt-1 text-slate-500">Try selecting a different country</p>
          </div>
        )}
      </main>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>{selectedWallpaper?.title}</DialogTitle>
            <DialogDescription>
              {format(new Date(selectedWallpaper?.date || new Date()), "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video overflow-hidden rounded-md">
            {selectedWallpaper && (
              <img
                src={selectedWallpaper.fullUrl || "/placeholder.svg"}
                alt={selectedWallpaper.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {selectedWallpaper?.copyright && <p className="text-sm text-slate-500 mt-2">{selectedWallpaper.copyright}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button
              onClick={() => selectedWallpaper && handleDownload(selectedWallpaper.imageUrl, selectedWallpaper.title)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>Bing Wallpaper Showcase &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
