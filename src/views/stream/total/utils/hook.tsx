import "./reset.css";
// import dayjs from "dayjs";
import * as XLSX from "xlsx";

import {
  onBeforeUnmount,
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
// import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import croppingUpload from "../upload.vue";
import userAvatar from "@/assets/user.jpg";
// import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";

import hikvisionImage from "@/assets/vendor/hikvision.png";
import dahuaImage from "@/assets/vendor/dahua.png";
import univiewImage from "@/assets/vendor/uniview.png";
import tdyImage from "@/assets/vendor/tiandy.png";
import otherImage from "@/assets/vendor/other.png";
import Tag from "primevue/tag";
// import UserIcon from "@iconify-icons/ri/user-3-line";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  getKeyList,
  isAllEmpty,
  // hideTextAtIndex,
  deviceDetection
} from "@pureadmin/utils";
import {
  // getRoleIds,
  // getDeptList,
  getStreamInfo,
  addStreamInfo,
  delStreamInfo,
  batchAddStreamInfo,
  batchDelStreamInfo
  // getAllRoleList
} from "@/api/stream";
import {
  ElForm,
  ElInput,
  ElFormItem,
  ElProgress
  // ElMessageBox
} from "element-plus";

// import { retrieveColumnLayout } from "echarts/types/src/layout/barGrid.js";
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

const streamTypes = {
  0: "其他码流",
  1: "主码流",
  2: "子码流"
};
const detailInfo = reactive({
  name: { label: "视频流名称", value: "" },
  id: { label: "ID", value: "" },
  ip: { label: "IP", value: "" },
  vendor: { label: "设备厂商", value: -1 },
  streamMode: { label: "取流模式", value: 0 },
  streamType: { label: "码流类型", value: 0 },
  url: { label: "url", value: "" },
  rtsp: { label: "rtsp", value: "" },
  rtmp: { label: "rtmp", value: "" },
  http_flv: { label: "http-flv", value: "" },
  http_fmp4: { label: "http-fmp4", value: "" },
  hls: { label: "hls", value: "" },
  createTime: { label: "创建时间", value: "0000-00-00 00:00:00" },
  updateTime: { label: "更新时间", value: "0000-00-00 00:00:00" }
});

export function useUser(tableRef: Ref) {
  const form = reactive({
    //搜索条件
    id: "",
    ip: "",
    name: "",
    vendor: "",
    streamType: ""
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
  //列表的分页数据
  const dataList = computed(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    // 计算当前页的结束索引
    const endIndex = startIndex + pagination.pageSize;
    // 返回当前页的数据
    return streamInfo.list.slice(startIndex, endIndex);
  });
  const loading = ref(true);
  const uploadLoading = ref(false);
  // 导出选择字段
  const exportFiledsDialog = ref(false);
  // 上传头像信息
  const avatarInfo = ref();
  // const switchLoadMap = ref({});
  // const { switchStyle } = usePublicHooks();
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100, 500]
  });
  //需要隐藏的列
  let hideCol = JSON.parse(localStorage.getItem("streamHideCol") || "[]");

  let columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      noExport: true,
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "序号",
      type: "index",
      noExport: true,
      index(id) {
        return (pagination.currentPage - 1) * pagination.pageSize + id + 1;
      },
      width: 80
    },
    {
      label: "视频流名称",
      prop: "name",
      minWidth: 130,
      align: "left",
      sortable: "custom"
    },
    {
      label: "视频流ID",
      prop: "id",
      width: 300,
      align: "left",
      sortable: "custom",
      showOverflowTooltip: true
    },
    {
      label: "ip地址",
      prop: "ip",
      width: 200,
      align: "left",
      sortable: "custom"
    },
    {
      resizable: true,
      label: "取流地址",
      prop: "url",
      width: 300,
      align: "left",
      sortable: "custom",
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => (row && row.url ? row.url : "")
    },
    {
      label: "设备厂商", //1.海康 2.大华 3.宇视 4.天地伟业
      prop: "vendor",
      width: 150,
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
      hide: true,
      width: 200,
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
      label: "码流类型",
      prop: "streamType",
      width: 100,
      cellRenderer: ({ row }) => {
        let type = streamTypes[row.streamType] || streamTypes[0];
        return <span>{type}</span>;
      }
    },
    {
      label: "状态",
      noExport: true,
      prop: "playerCount",
      width: 150,
      sortable: "custom",
      cellRenderer: ({ row }) => {
        // const icon = useRenderIcon("ri:search-line");
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
            <span>
              &nbsp;
              {row.playerCount}
            </span>
          </Tag>
        );
      }
    },
    {
      hide: true,
      label: "创建时间",
      prop: "createTime",
      width: 160,
      disabled: true
    },
    {
      hide: true,
      label: "更新时间",
      prop: "updateTime",
      width: 160,
      disabled: true
    },
    {
      label: "操作",
      fixed: "right",
      width: 300,
      noExport: true,
      slot: "operation"
    }
  ];
  if (hideCol.length === 0) {
    hideCol = columns.filter(v => !v.hide).map(v => v.label);
  }
  //需要导出的字段
  const exportFileds: any = ref(columns.filter(v => !v.noExport));
  //导出弹窗里的,有prop的都勾上
  const checkedFileds: any = ref(
    exportFileds.value.map(v => v.prop).concat(["rtsp"])
  );
  // disabled字段默认false
  exportFileds.value.push(
    {
      label: "hls",
      prop: "hls",
      disabled: true
    },
    {
      label: "http_fmp4",
      prop: "http_fmp4",
      disabled: true
    },
    {
      label: "http_flv",
      prop: "http_flv",
      disabled: true
    },
    {
      label: "rtmp",
      prop: "rtmp",
      disabled: true
    },
    {
      label: "rtsp",
      prop: "rtsp",
      disabled: true
    }
  );

  columns = columns.map(v => {
    return {
      ...v,
      hide: !hideCol.includes(v.label)
    };
  });
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

  function handleUpdate() {}

  async function handleDelete(row) {
    message(`您删除了ID: ${row.id}的这条数据`, { type: "success" });
    tableRef.value.getTableRef().toggleRowSelection(row, false);
    await delStreamInfo(toRaw(row));
    fetchAll();
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
  async function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    await batchDelStreamInfo(curSelected);
    message(`已删除ID为${getKeyList(curSelected, "id")}的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    fetchAll();
  }

  async function fetchAll() {
    loading.value = true;
    const { data } = await getStreamInfo({});
    streamInfoCache.list = data.list
      .map(v => ({
        ...v,
        playerCount: `${(v?.runtime ?? []).reduce((total, item) => {
          return total + (item?.playerCount ?? 0);
        }, 0)}`
      }))
      .sort((a, b) => {
        return b.createTime?.localeCompare(a.createTime);
      });
    streamInfo.list = streamInfoCache.list;
    pagination.total = data.total;
    loading.value = false;
    cleanFormAndSort();
  }

  async function onSearch(form) {
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
        matchesCriteria(info.name, form.name) &&
        matchesCriteria(info.vendor?.toString(), form.vendor) &&
        matchesCriteria(info.streamType?.toString(), form.streamType)
    );
    streamInfo.list = filteredList;
    pagination.total = filteredList.length;
    loading.value = false;
    tableRef.value.getTableRef().clearSort();
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    // form.deptId = "";
    // treeRef.value.onTreeReset();
    // fetchAll();
    // loading.value = true;
    streamInfo.list = streamInfoCache.list;
    tableRef.value.getTableRef().clearSort();
    pagination.total = streamInfoCache.list.length;
    onSearch(form);
    // loading.value = false;
  };
  const sortChange = args => {
    let list;
    if (args.order === "ascending") {
      // 升序
      list = streamInfo.list.sort((a, b) => {
        return a[args.prop]?.localeCompare(b[args.prop]);
      });
    } else if (args.order === "descending") {
      //   降序
      list = streamInfo.list.sort((a, b) => {
        return b[args.prop]?.localeCompare(a[args.prop]);
      });
    } else {
      //默认按照创建时间排序
      list = streamInfoCache.list;
    }
    streamInfo.list = list;
  };

  function onTreeSelect() {
    // form.deptId = selected ? id : "";
    // fetchAll();
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function downloadTemplate() {
    window.open("/web/exportTemplate.xlsx", "_blank");
  }

  const fileType = [".xlsx", ".xls"];

  function selectFile() {
    let ipt = document.createElement("input");
    ipt.setAttribute("type", "file");
    ipt.setAttribute("accept", fileType.join());
    ipt.onchange = async (e: any) => {
      let files = [...e.target.files];
      let flag = validataFile(files, fileType, 1024 * 1024 * 100);
      if (flag) {
        analysisData(files.at(0))
          .then(async (data: Array<Object>) => {
            // 调接口
            uploadLoading.value = true;
            let formatDt = formatData(data);
            let res: any = await batchAddStreamInfo(formatDt);
            if (res.code === 0) {
              fetchAll();
            }
            uploadLoading.value = false;
          })
          .catch(err => {
            message(err.message, {
              type: "error"
            });
          });
      } else {
        message(`请选择后缀为${fileType.join()}且100M以内的文件`, {
          type: "error"
        });
      }
    };
    ipt.click();
  }

  function formatData(list: Array<Object>) {
    return list.map(v => {
      //表格内容
      let vendor = v["设备厂商"];
      let streamMode = v["取流模式"];
      let streamType = v["码流类型"];
      // 根据值来找key,对象不可以遍历
      let isFind = false;
      for (let key in streamModes) {
        if (streamMode === streamModes[key].mode) {
          streamMode = ~~key;
          isFind = true;
          break;
        }
      }
      if (!isFind) {
        streamMode = 0;
      }
      isFind = false;
      for (let key in streamTypes) {
        if (streamType === streamTypes[key]) {
          streamType = ~~key;
          isFind = true;
          break;
        }
      }
      if (!isFind) {
        streamType = 0;
      }
      for (let key in vendorImages) {
        if (vendor === vendorImages[key].name) {
          vendor = ~~key;
          isFind = true;
          break;
        }
      }
      if (!isFind) {
        vendor = 0;
      }
      return {
        // "title": "修改",
        id: `${v["视频流ID"] || ""}`,
        name: `${v["视频流名称"] || ""}`,
        streamMode: streamMode,
        vendor: vendor,
        streamType: streamType,
        ip: `${v["ip地址"] || ""}`,
        url: `${v["取流地址"] || ""}`
      };
    });
  }

  function downloadData() {
    // 返回当前选中的行
    let curSelected = tableRef.value.getTableRef().getSelectionRows();
    if (curSelected.length === 0) {
      curSelected = streamInfo.list;
    }
    const ip = `${import.meta.env.VITE_APP_BASE_IP ? import.meta.env.VITE_APP_BASE_IP : window.location.hostname}`;
    let expordData = curSelected.map(v => {
      let dt = {};
      checkedFileds.value.forEach(key => {
        if (key === "rtsp") {
          dt[key] = `rtsp://${ip}:554/live/${v.id}`;
        } else if (key === "rtmp") {
          dt[key] = `rtmp://${ip}:2935/live/${v.id}`;
        } else if (key === "http_flv") {
          dt[key] = `http://${ip}:8096/live/${v.id}.live.flv`;
        } else if (key === "http_fmp4") {
          dt[key] = `http://${ip}:8096/live/${v.id}.live.mp4`;
        } else if (key === "hls") {
          dt[key] = `http://${ip}:8096/live/${v.id}/hls.m3u8`;
        } else if (key === "streamMode") {
          dt["取流模式"] = streamModes[v[key]]?.mode || "";
        } else if (key === "streamType") {
          dt["码流类型"] = streamTypes[v[key]] || "";
        } else if (key === "vendor") {
          dt["设备厂商"] = vendorImages[v[key]]?.name || "";
        } else {
          let mapKey = exportFileds.value.find(item => item.prop === key);
          if (mapKey) {
            dt[mapKey.label] = v[key];
          }
        }
      });
      return dt;
    });
    let worksheet = XLSX.utils.json_to_sheet(expordData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `流媒体数据${Date.now()}.xlsx`);
    exportFiledsDialog.value = false;
  }

  //size单位为byte
  function validataFile(
    files: Array<File>,
    type: Array<String>,
    size: Number
  ): Boolean {
    return files.every((item: any) => {
      let fileType = item.name.match(/\.\w+$/g);
      return (
        item.size <= size && fileType.length > 0 && type.includes(fileType[0])
      );
      // if (fileType.length > 0) {
      //   return type.includes(fileType[0]);
      // } else {
      //   return false;
      // }
    });
  }

  function analysisData(file: File) {
    return new Promise((yes, no) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        // 只读取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        let flag: any = validateSheet(jsonData);
        if (flag >= 0) {
          no(new Error(`您的第${flag}条数据有误，请确认后重新导入`));
        } else {
          yes(jsonData);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  function validateSheet(list: Array<Object>): Number {
    let index: Number = -1;
    // let maps = {
    //   streamTypes: Object.values(streamTypes),
    //   streamModes: Object.values(streamModes).map(v => v.mode),
    //   vendors: Object.values(vendorImages).map(v => v.name)
    // };
    for (let i: any = 0; i < list.length; i++) {
      let item = list[i];
      // let streamType = item["码流类型"];
      // let streamMode = item["取流模式"];
      // let vendor = item["设备厂商"];
      let has =
        // maps.streamTypes.includes(streamType) &&
        // maps.streamModes.includes(streamMode) &&
        // maps.vendors.includes(vendor) &&
        /^[a-zA-Z0-9]+$/.test(`${item["视频流ID"] || ""}`) && item["取流地址"];
      if (!has) {
        index = i + 1;
        break;
      }
    }
    return index;
  }

  function cleanFormAndSort() {
    form.id = "";
    form.ip = "";
    form.name = "";
    form.vendor = "";
    form.streamType = "";
    tableRef.value.getTableRef().clearSort();
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
          streamMode: row?.streamMode ?? 0,
          vendor: row?.vendor ?? 0,
          streamType: row?.streamType ?? 0,
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
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(`您${title}了用户名称为${curData.id}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          fetchAll(); // 刷新表格数据
        }

        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              await addStreamInfo(curData);
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              await addStreamInfo(curData);
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
      beforeSure: done => {
        // const curData = options.props.formInline as RoleFormItemProps;
        // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
        done(); // 关闭弹框
      }
    });
  }

  const handleOpenDetail = row => {
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
    detailInfo["streamType"].value =
      streamTypes[row.streamType] || streamTypes[0];
    detailInfo["url"].value = row.url;

    detailInfo["rtsp"].value = `rtsp://${ip}:554/live/${row.id}`;
    detailInfo["rtmp"].value = `rtmp://${ip}:2935/live/${row.id}`;
    detailInfo["http_flv"].value = `http://${ip}:8096/live/${row.id}.live.flv`;
    detailInfo["http_fmp4"].value = `http://${ip}:8096/live/${row.id}.live.mp4`;
    detailInfo["hls"].value = `http://${ip}:8096/live/${row.id}/hls.m3u8`;

    detailInfo["createTime"].value = row.createTime ? row.createTime : "";
    detailInfo["updateTime"].value = row.updateTime ? row.updateTime : "";
    detailVisible.value = true;
  };

  let ws;

  async function connectWebSocket() {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5; // 最大重连尝试次数

    ws = new WebSocket(
      `ws://${import.meta.env.VITE_APP_BASE_IP ? import.meta.env.VITE_APP_BASE_IP : window.location.hostname}:8088/ws/stream/status`
    );

    ws.onopen = () => {
      reconnectAttempts = 0; // 重置重连尝试次数
    };

    ws.onerror = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(connectWebSocket, 5000 * reconnectAttempts); // 使用指数回退策略增加重连延迟
        reconnectAttempts++;
      } else {
      }
    };

    ws.onmessage = event => {
      const data = JSON.parse(event.data).data;
      let item = streamInfoCache.list.find(element => element.id === data.id);
      if (item) {
        item.runtime = data.runtime;
        item.playerCount = `${(item?.runtime ?? []).reduce((total, item) => {
          return total + (item?.playerCount ?? 0);
        }, 0)}`;
      }
    };
  }

  onMounted(async () => {
    // treeLoading.value = true;
    fetchAll();
    connectWebSocket();
  });

  onBeforeUnmount(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // 使用状态码 1000（正常关闭）和一个原因
      ws.close();
    }
  });
  return {
    sortChange,
    vendorImages,
    form,
    streamTypes,
    detailVisible,
    detailInfo,
    loading,
    uploadLoading,
    exportFileds,
    checkedFileds,
    exportFiledsDialog,
    columns,
    dataList,
    streamInfo,
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
    downloadTemplate,
    selectFile,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    // handleUpload,
    handleReset,
    handleRole,
    onSelectionCancel,
    handleSelectionChange,
    handleOpenDetail,
    downloadData
  };
}
