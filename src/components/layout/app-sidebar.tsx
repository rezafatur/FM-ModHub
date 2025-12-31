"use client"

import * as React from "react";

import {
  Castle,
  CircleQuestionMark,
  Earth,
  Flag,
  House,
  Medal,
  Settings,
  Shield,
  Shirt,
  Trophy,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/layout/nav-main";
import { NavOthers } from "@/components/layout/nav-others";
import { NavUser } from "@/components/layout/nav-user";

// This is sample data.
const data = {
  user: {
    name: "rezafatur",
    email: "rezafatur.work@gmail.com",
    avatar: "/avatars/rezafatur.png",
  },
  navMain: [
    {
      title: "Portal",
      url: "/",
      icon: House,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/",
        },
      ],
    },
    {
      title: "People",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Clubs",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "National Teams",
      url: "#",
      icon: Flag,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Kits",
      url: "#",
      icon: Shirt,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Continents",
      url: "#",
      icon: Earth,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Competitions",
      url: "#",
      icon: Medal,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Stadiums",
      url: "#",
      icon: Castle,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Trophies",
      url: "#",
      icon: Trophy,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
  ],
  others: [
    {
      name: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      name: "Get Help",
      url: "#",
      icon: CircleQuestionMark,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarSeparator className="hidden group-data-[collapsible=icon]:block mx-0 w-auto -my-2" />
        <NavOthers others={data.others} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
