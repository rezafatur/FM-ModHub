import { type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavOthers({
  others,
}: {
  others: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile, setOpenMobile, state } = useSidebar();
  const location = useLocation();
  
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  const isCollapsed = state === "collapsed";
  
  return (
    <SidebarGroup className={isCollapsed ? "" : "group-data-[collapsible=icon]:hidden"}>
      <SidebarGroupLabel>Others</SidebarGroupLabel>
      <SidebarMenu>
        {others.map((item) => {
          const isActive = location.pathname === item.url;
          
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.name}
              >
                <Link to={item.url} onClick={handleNavClick}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
