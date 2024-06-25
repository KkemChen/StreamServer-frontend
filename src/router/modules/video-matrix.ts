const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/video-matrix",
  name: "VideoMatrix",
  component: Layout,
  redirect: "/video-matrix",
  meta: {
    icon: "ri:layout-grid-fill",
    title: "视频矩阵",
    rank: 3
  },
  children: [
    {
      path: "/video-matrix",
      name: "VideoMatrix",
      component: () => import("@/views/video-matrix/index.vue"),
      meta: {
        title: "视频矩阵"
      }
    }
  ]
} satisfies RouteConfigsTable;
