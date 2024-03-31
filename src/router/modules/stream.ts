const Layout = () => import("@/layout/index.vue");

export default {
  path: "/stream",
  redirect: "/stream/total",
  meta: {
    icon: "ri:folder-video-fill",
    title: "视频流",
    rank: 2,
    showLink: true
  },
  component: Layout,
  children: [
    {
      path: "/stream/total",
      name: "Total",
      component: () => import("@/views/stream/total/index.vue"),
      meta: {
        icon: "ri:folder-video-fill",
        title: "视频流"
      }
    }
  ]
} satisfies RouteConfigsTable;
