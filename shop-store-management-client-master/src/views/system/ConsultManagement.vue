<template>
  <div>
    <!-- 添加新增按钮 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAddConsult">新增资讯</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        prop="date"
        label="序号"
        style="width: 100px;"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="标题"
        style="width: 100px;"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="内容"
        style="width: 200px;"
        align="center"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="handleClick(scope)"
            class="content"
          >
            {{ scope.row.content }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="发布时间" style="width: 100px;" align="center">
        <template slot-scope="scope">
          {{ scope.row.publish_time }}
        </template>
      </el-table-column>
      <el-table-column label="状态" style="width: 100px;" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
            {{ scope.row.status === 1 ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" style="width: 100px;" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEditConsult(scope)"
            >编辑</el-button
          >
          <el-button
            :type="scope.row.status === 1 ? 'warning' : 'success'"
            size="mini"
            @click="handleToggleStatus(scope)"
          >
            {{ scope.row.status === 1 ? "禁用" : "启用" }}
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDeleteConsult(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="留言详情"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      custom-class="content-detail"
    >
      <span>{{ detailContent }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="编辑留言"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleEditClose"
    >
      <el-form
        :model="editForm"
        :rules="formRules"
        ref="editForm"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :rows="5"
            v-model="editForm.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加新增资讯对话框 -->
    <el-dialog
      title="新增资讯"
      :visible.sync="addDialogVisible"
      width="40%"
      :before-close="handleAddClose"
    >
      <el-form
        :model="addForm"
        :rules="formRules"
        ref="addForm"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :rows="5"
            v-model="addForm.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getConsultList,
  deleteConsult,
  editConsult,
  addConsult
} from "@/api/consult.js";
export default {
  created() {
    this.init();
  },
  methods: {
    handleClick(scope) {
      this.dialogVisible = true;
      this.detailContent = scope.row.content;
    },
    handleDeleteConsult(scope) {
      this.$confirm("确认删除？")
        .then(_ => {
          console.log("删除");
          deleteConsult({ id: scope.row.id })
            .then(res => {
              if (res.errorCode === 200) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.init();
              } else {
                this.$message({
                  message: res.errorMsg,
                  type: "error"
                });
              }
            })
            .catch(_ => {});
        })
        .catch(_ => {});
    },
    handleEditConsult(scope) {
      this.editDialogVisible = true;
      // 回显数据
      this.editForm = {
        id: scope.row.id,
        title: scope.row.title,
        content: scope.row.content
      };
    },
    // 编辑对话框关闭处理
    handleEditClose(done) {
      this.$refs["editForm"].resetFields();
      done();
    },
    // 提交编辑
    submitEdit() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          editConsult({
            id: this.editForm.id,
            title: this.editForm.title,
            content: this.editForm.content
          })
            .then(res => {
              if (res.errorCode === 200) {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.editDialogVisible = false;
                this.init(); // 重新加载数据
              } else {
                this.$message({
                  message: res.errorMsg || "编辑失败",
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$message({
                message: "操作失败",
                type: "error"
              });
            });
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    async init() {
      try {
        let res = await getConsultList();
        if (res.errorCode === 200) {
          this.tableData = res.data;
        } else {
          this.$message({
            message: res.errorMsg,
            type: "error"
          });
        }
      } catch (error) {}
    },
    // 添加新增资讯方法
    handleAddConsult() {
      this.addDialogVisible = true;
      // 重置表单
      this.$nextTick(() => {
        this.$refs["addForm"] && this.$refs["addForm"].resetFields();
      });
    },
    // 新增表单关闭处理
    handleAddClose(done) {
      this.$refs["addForm"].resetFields();
      done();
    },
    // 提交新增资讯
    submitAdd() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          addConsult(this.addForm)
            .then(res => {
              if (res.errorCode === 200) {
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
                this.addDialogVisible = false;
                this.init(); // 重新加载数据
              } else {
                this.$message({
                  message: res.errorMsg || "新增失败",
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$message({
                message: "操作失败",
                type: "error"
              });
            });
        }
      });
    },
    // 处理启用/禁用状态切换
    handleToggleStatus(scope) {
      const { id, status } = scope.row;
      const newStatus = status === 1 ? 0 : 1;

      const statusText = status === 1 ? "启用" : "禁用";
      editConsult({ id, status: newStatus })
        .then(res => {
          if (res.errorCode === 200) {
            this.$message({
              message: `${statusText}成功`,
              type: "success"
            });
            // 更新本地状态，避免重新加载整个列表
            scope.row.status = newStatus;
            // 如果需要刷新整个列表，可以使用:
            // this.init();
          } else {
            this.$message({
              message: res.errorMsg || `${statusText}失败`,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    }
  },
  data() {
    // 创建通用的表单验证规则
    const formRules = {
      title: [
        { required: true, message: "请输入标题", trigger: "blur" },
        { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
      ],
      content: [{ required: true, message: "请输入内容", trigger: "blur" }]
    };

    return {
      tableData: [
        {
          id: 1,
          title: "标题",
          content: "王小虎",
          status: 1,
          publish_time: "2025-03-18"
        },
        {
          id: 1,
          title: "标题",
          content: "王小虎",
          status: 1,
          publish_time: "2025-03-18"
        },
        {
          id: 1,
          title: "标题",
          content: "王小虎",
          status: 1,
          publish_time: "2025-03-18"
        }
      ],
      dialogVisible: false,
      detailContent: "",
      // 添加编辑相关数据
      editDialogVisible: false,
      editForm: {
        id: "",
        title: "",
        content: ""
      },
      // 添加新增相关数据
      addDialogVisible: false,
      addForm: {
        title: "",
        content: ""
      },
      // 使用通用的表单验证规则
      formRules
    };
  }
};
</script>

<style>
.content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content-detail span {
  display: block;
  padding: 10px;
  word-break: break-all;
  white-space: pre-wrap;
}
.toolbar {
  margin-bottom: 20px;
}
</style>
