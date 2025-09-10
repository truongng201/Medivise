"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, User, Calendar, BarChart3, Settings, LogOut, ChevronUp, Stethoscope, UserPlus } from "lucide-react"

interface DoctorSidebarProps {
  user: any
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  selectedPatient?: any
}

export function DoctorSidebar({ user, activeTab, onTabChange, onLogout, selectedPatient }: DoctorSidebarProps) {
  const menuItems = [
    { id: "patients", label: "Patient List", icon: Users },
    { id: "patient-requests", label: "Patient Requests", icon: UserPlus },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-3 p-4">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Medivise</h2>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    className="w-full justify-start cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {selectedPatient && (
          <SidebarGroup>
            <SidebarGroupLabel>Current Patient</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "patient-details"}
                    onClick={() => onTabChange("patient-details")}
                    className="w-full justify-start cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span>{selectedPatient.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 space-y-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profile_picture_url || "/placeholder.svg"} alt={user?.fullname} />
              <AvatarFallback className="text-xs">
                {user?.fullname
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullname}</p>
              <p className="text-xs text-gray-500 truncate">{user?.specialty}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="cursor-pointer text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-3 w-3 mr-1" />
              Sign out
            </Button>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
