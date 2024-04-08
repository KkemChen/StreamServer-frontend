import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import croppingUpload from "../upload.vue";
import userAvatar from "@/assets/user.jpg";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";

import hikvisionImage from "@/assets/vendor/hikvision.png";
import dahuaImage from "@/assets/vendor/dahua.png";
import univiewImage from "@/assets/vendor/uniview.png";
import tdyImage from "@/assets/vendor/tiandy.png";
import otherImage from "@/assets/vendor/other.png";
import Tag from "primevue/tag";
import UserIcon from "@iconify-icons/ri/user-3-line";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const vendorImages = {
  0: { image: otherImage, name: "其他" },
  1: { image: hikvisionImage, name: "海康" },
  2: { image: dahuaImage, name: "大华" },
  3: { image: univiewImage, name: "宇视" },
  4: { image: tdyImage, name: "天地伟业" }
};

const streamModes = {
  0: { tagType: null, mode: "DirectProxy" }, // 蓝色
  1: { tagType: "warning", mode: "SPCC" }, // 黄色
  2: { tagType: "success", mode: "FFmpegCli" } // 绿色
};

const detailInfo = reactive({
  name: { label: "名称", value: "" },
  id: { label: "ID", value: "" },
  ip: { label: "IP", value: "" },
  vendor: { label: "设备厂商", value: -1 },
  streamMode: { label: "取流模式", value: 0 },
  url: { label: "url", value: "" },
  rtsp: { label: "rtsp", value: "" },
  rtmp: { label: "rtmp", value: "" },
  http_flv: { label: "http-flv", value: "" },
  http_fmp4: { label: "http-fmp4", value: "" },
  hls: { label: "hls", value: "" },
  createTime: { label: "创建时间", value: "0000-00-00 00:00:00" },
  updateTime: { label: "更新时间", value: "0000-00-00 00:00:00" }
});

import {
  getKeyList,
  isAllEmpty,
  hideTextAtIndex,
  deviceDetection
} from "@pureadmin/utils";
import {
  getRoleIds,
  // getDeptList,
  getStreamInfo,
  getAllRoleList
} from "@/api/stream";
import {
  ElForm,
  ElInput,
  ElFormItem,
  ElProgress,
  ElMessageBox
} from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";
import { retrieveColumnLayout } from "echarts/types/src/layout/barGrid.js";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    //搜索条件
    id: "",
    ip: "",
    name: ""
  });

  const streamInfo = reactive<{ list: any[] }>({
    list: []
  });

  const streamInfoCache = reactive<{ list: any[] }>({
    list: []
  });

  let detailVisible = ref(false);

  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const avatarInfo = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100]
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "名称",
      prop: "name",
      minWidth: 130
    },
    {
      label: "ID",
      prop: "id",
      width: 130
    },
    {
      label: "IP地址",
      prop: "ip",
      minWidth: 130
    },
    {
      hide: true,
      label: "Url",
      prop: "url",
      minWidth: 130,
      cellRenderer: ({ row }) => (
        <div
          style={{
            maxWidth: "130px", // 设置最大宽度
            whiteSpace: "nowrap", // 文本不换行
            overflow: "hidden", // 溢出部分隐藏
            textOverflow: "ellipsis" // 超出部分显示省略号
          }}
        >
          {row && row.url ? row.url : ""}
        </div>
      )
    },
    {
      label: "设备厂商", //1.海康 2.大华 3.宇视 4.天地伟业
      prop: "vendor",
      minWidth: 130,
      // align: "left",
      cellRenderer: ({ row }) => (
        <div>
          <el-image
            fit="cover"
            preview-teleported={true}
            src={
              row.vendor && vendorImages[row.vendor]
                ? vendorImages[row.vendor].image
                : vendorImages[0].image
            }
            preview-src-list={Array.of(
              row.vendor && vendorImages[row.vendor]
                ? vendorImages[row.vendor].image
                : vendorImages[0].image
            )}
            class="w-[22px] h-[22px] rounded-full align-middle"
          />
          <span>
            &nbsp;&nbsp;
            {row.vendor && vendorImages[row.vendor]
              ? vendorImages[row.vendor].name
              : vendorImages[0].name}
          </span>
        </div>
      )
    },
    {
      label: "取流模式",
      prop: "streamMode",
      minWidth: 130,
      cellRenderer: ({ row, props }) => {
        let tagType =
          streamModes[row.streamMode]?.tagType || streamModes[0].tagType;
        let mode = streamModes[row.streamMode]?.mode || streamModes[0].mode;

        return (
          <el-tag
            size={props.size}
            type={tagType}
            effect="dark"
            style="font-weight: 700;"
            round
          >
            {mode}
          </el-tag>
          // // <Tag severity="secondary" value={mode}></Tag>
        );
      }
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => {
        const icon = useRenderIcon("ri:search-line");
        return (
          <Tag severity="Primary" rounded style="height:1.5rem">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5zm-8-9a6 6 0 1 1 0-12a6 6 0 0 1 0 12m0-2a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
              />
            </svg>
            <span>&nbsp;0</span>
          </Tag>
        );
      }
    },
    // {
    //   label: "CreateTime",
    //   minWidth: 90,
    //   prop: "createTime",
    //   formatter: ({ createTime }) =>
    //     dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    // },
    // {
    //   label: "UpdateTime",
    //   minWidth: 90,
    //   prop: "updateTime",
    //   formatter: ({ createTime }) =>
    //     dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    // },
    {
      hide: true,
      label: "创建时间",
      prop: "createTime",
      minWidth: 130
    },
    {
      hide: true,
      label: "更新时间",
      prop: "updateTime",
      minWidth: 130
    },
    {
      label: "操作",
      fixed: "right",
      width: 300,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  const roleOptions = ref([]);

  /*   function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改用户状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  } */

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    message(`您删除了ID: ${row.id}的这条数据`, { type: "success" });
    fetchAll();
  }

  function handleSizeChange(val: number) {
    handlePagination();
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    handlePagination();
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    fetchAll();
  }

  function handlePagination() {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    // 计算当前页的结束索引
    const endIndex = startIndex + pagination.pageSize;
    // 返回当前页的数据
    dataList.value = streamInfo.list.slice(startIndex, endIndex);
  }

  async function fetchAll() {
    loading.value = true;
    const { data } = await getStreamInfo({});
    console.log(data);
    streamInfoCache.list = data.list;
    streamInfo.list = data.list;
    pagination.total = data.total;
    handlePagination();
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function onSearch(form) {
    streamInfo.list;
    loading.value = true;

    function matchesCriteria(
      value: string | undefined,
      criteria: string | undefined
    ): boolean {
      if (!criteria) return true; // 如果没有提供筛选条件，则视为匹配
      if (!value) return false; // 如果目标值不存在，直接返回不匹配
      return value.includes(criteria);
    }

    const filteredList = streamInfoCache.list.filter(
      info =>
        matchesCriteria(info.id, form.id) &&
        matchesCriteria(info.ip, form.ip) &&
        matchesCriteria(info.name, form.name)
    );
    streamInfo.list = filteredList;
    pagination.total = filteredList.length;
    handlePagination();
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    // form.deptId = "";
    // treeRef.value.onTreeReset();
    // fetchAll();
    loading.value = true;
    streamInfo.list = streamInfoCache.list;
    pagination.total = streamInfoCache.list.length;
    handlePagination();
    loading.value = false;
  };

  function onTreeSelect({ id, selected }) {
    // form.deptId = selected ? id : "";
    // fetchAll();
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title,
          higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
          id: row?.id ?? "",
          /** 用于判断是`新增`还是`修改` */
          name: row?.name,
          streamMode: row?.streamMode,
          vendor: row?.vendor,
          ip: row?.ip,
          url: row?.url,
          status: row?.status,
          remark: row?.remark
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了用户名称为${curData.id}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          fetchAll(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  const cropRef = ref();
  /** 上传头像 */
  function handleUpload(row) {
    addDialog({
      title: "裁剪、上传头像",
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () =>
        h(croppingUpload, {
          ref: cropRef,
          imgSrc: row.avatar || userAvatar,
          onCropper: info => (avatarInfo.value = info)
        }),
      beforeSure: done => {
        console.log("裁剪后的图片信息：", avatarInfo.value);
        // 根据实际业务使用avatarInfo.value和row里的某些字段去调用上传头像接口即可
        done(); // 关闭弹框
        fetchAll(); // 刷新表格数据
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            message(`已成功重置 ${row.username} 用户的密码`, {
              type: "success"
            });
            console.log(pwdForm.newPwd);
            // 根据实际业务使用pwdForm.newPwd和row里的某些字段去调用重置用户密码接口即可
            done(); // 关闭弹框
            fetchAll(); // 刷新表格数据
          }
        });
      }
    });
  }

  /** 分配角色 */
  async function handleRole(row) {
    // 选中的角色列表
    const ids = (await getRoleIds({ userId: row.id })).data ?? [];
    addDialog({
      title: `分配 ${row.username} 用户的角色`,
      props: {
        formInline: {
          username: row?.username ?? "",
          nickname: row?.nickname ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as RoleFormItemProps;
        console.log("curIds", curData.ids);
        // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
        done(); // 关闭弹框
      }
    });
  }

  const handleOpenDetail = row => {
    // console.log("click", columnsDetail);
    const ip = `${import.meta.env.VITE_APP_BASE_IP ? import.meta.env.VITE_APP_BASE_IP : window.location.hostname}`;
    detailInfo["name"].value = row.name;
    detailInfo["id"].value = row.id;
    detailInfo["ip"].value = row.ip;

    detailInfo["vendor"].value =
      row.vendor && vendorImages[row.vendor]
        ? vendorImages[row.vendor].name
        : vendorImages[0].name;
    detailInfo["streamMode"].value =
      streamModes[row.streamMode]?.mode || streamModes[0].mode;
    detailInfo["url"].value = row.url;

    detailInfo["rtsp"].value = `rtsp://${ip}:554/live/${row.id}`;
    detailInfo["rtmp"].value = `rtmp://${ip}:2935/live/${row.id}`;
    detailInfo["http_flv"].value = `http://${ip}:8096/live/${row.id}.live.flv`;
    detailInfo["http_fmp4"].value = `http://${ip}:8096/live/${row.id}.lvie.mp4`;
    detailInfo["hls"].value = `http://${ip}:8096/live/${row.id}/hls.m3u8`;

    detailInfo["createTime"].value = row.createTime ? row.createTime : "";
    detailInfo["updateTime"].value = row.updateTime ? row.updateTime : "";
    detailVisible.value = true;
  };

  onMounted(async () => {
    treeLoading.value = true;
    fetchAll();
  });

  return {
    form,
    detailVisible,
    detailInfo,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    fetchAll,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    handleUpload,
    handleReset,
    handleRole,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange,
    handleOpenDetail
  };
}
