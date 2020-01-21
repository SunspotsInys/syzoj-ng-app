module.exports = {
  title: "题目",
  meta_labels: {
    non_public: "未公开",
    no_display_id: "未设置 ID"
  },
  show_tags: "显示标签",
  hide_tags: "隐藏标签",
  type: {
    TRADITIONAL: "传统"
  },
  statistic: {
    submissions: "提交",
    accepted: "通过"
  },
  action: {
    submit: "提交",
    submission: "提交记录",
    statistics: "统计",
    files: "文件",
    discussion: "讨论",
    edit: "编辑",
    manage_judge_info: "评测管理",
    set_display_id: "设置题目 ID",
    set_display_id_new: "新 ID（留空或为 0 则清除 ID）",
    set_display_id_submit: "设置",
    set_public: "设为公开",
    set_non_public: "取消公开",
    set_public_confirm: "确认公开",
    set_non_public_confirm: "确认取消公开",
    delete: "删除"
  },
  action_error: {
    set_public: {
      PERMISSION_DENIED: "权限不足。",
      NO_SUCH_PROBLEM: "无此题目。",
      NO_DISPLAY_ID: "请先设置题目 ID。"
    },
    set_display_id: {
      INVALID_DISPLAY_ID: "ID 必须为整数。",
      PERMISSION_DENIED: "权限不足。",
      NO_SUCH_PROBLEM: "当前题目不存在。",
      PUBLIC_PROBLEM_MUST_HAVE_DISPLAY_ID: "已公开的题目必须拥有 ID。",
      DUPLICATE_DISPLAY_ID: "ID {displayId} 已被使用。"
    }
  },
  sample: {
    input: "输入",
    output: "输出",
    copy: "复制",
    copied: "已复制",
    failed_to_copy: "复制失败"
  }
};
