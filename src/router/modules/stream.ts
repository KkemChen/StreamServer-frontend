export default {
  path: "/stream/total",
  meta: {
    icon: "ri:folder-video-fill",
    title: "视频流",
    rank: 2,
    showLink: true
  },
  component: () => import("@/views/stream/total/index.vue")
  // children: [
  //   {
  //     path: "/system/user/index",
  //     name: "System",
  //     component: () => import("@/views/system/user/index.vue"),
  //     meta: {
  //       icon: "ri:admin-line",
  //       title: "Stream",
  //       showLink: true
  //     }
  //   }
  // ]
} satisfies RouteConfigsTable;
