const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/logs",
  name: "Logs",
  component: Layout,
  redirect: "/log",
  meta: {
    icon: "ri:blogger-fill",
    title: "日志",
    rank: 3
  },
  children: [
    {
      path: "/log",
      name: "Log",
      component: () => import("@/views/log/index.vue"),
      meta: {
        title: "日志",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} satisfies RouteConfigsTable;
