
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  value: string
  icon: LucideIcon
  content: React.ReactNode
}

interface TabNavProps {
  items: NavItem[]
  activeTab: string
  onValueChange: (value: string) => void
}

export function TabNav({ items, activeTab, onValueChange }: TabNavProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="w-full">
      <TabsList className="bg-white border border-gray-200 shadow-sm relative">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.value

          return (
            <TabsTrigger
              key={item.value}
              value={item.value}
              onClick={() => onValueChange(item.value)}
              className="data-[state=active]:text-black data-[state=active]:bg-white data-[state=active]:shadow-none font-bold relative text-black hover:bg-white group"
            >
              <Icon size={18} className="mr-2" />
              {!isMobile && item.name}
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 pointer-events-none"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <span 
                    className="absolute inset-0 opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                    style={{
                      background: "transparent",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude"
                    }}
                  />
                </motion.div>
              )}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </div>
  )
}
