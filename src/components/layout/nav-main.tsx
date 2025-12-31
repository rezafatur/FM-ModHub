import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { isMobile, setOpenMobile, state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  const isParentActive = (item: typeof items[0]) => {
    return item.items?.some(subItem => subItem.url === location.pathname);
  };
  
  const handleIconClick = (e: React.MouseEvent, item: typeof items[0]) => {
    const isCollapsed = state === "collapsed";
    
    // Jika collapsed dan ada submenu, navigasi ke submenu pertama
    if (isCollapsed && item.items && item.items.length > 0) {
      e.preventDefault();
      navigate(item.items[0].url);
      if (isMobile) {
        setOpenMobile(false);
      }
    }
  };
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveChild = isParentActive(item);
          const isCollapsed = state === "collapsed";
          
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || hasActiveChild}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={hasActiveChild}
                    onClick={(e) => handleIconClick(e, item)}
                    className={`
                      ${hasActiveChild && isCollapsed ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                      ${isCollapsed ? "cursor-pointer" : ""}
                    `}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isActive = location.pathname === subItem.url;
                      
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isActive}>
                            <Link to={subItem.url} onClick={handleNavClick}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
