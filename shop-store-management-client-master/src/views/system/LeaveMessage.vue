<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        prop="date"
        label="留言用户"
        style="with: 100px;"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="留言"
        style="with: 200px;"
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

      <el-table-column label="留言时间" style="with: 100px;" align="center">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column label="留言时间" style="with: 100px;" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="handleDeleteMessage(scope)"
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
  </div>
</template>

<script>
import { getMessages, deleteMessage } from "@/api/message.js";
export default {
  created() {
    this.init();
  },
  methods: {
    handleClick(scope) {
      this.dialogVisible = true;
      this.detailContent = scope.row.content;
    },
    handleDeleteMessage(scope) {
      this.$confirm("确认删除？")
        .then(_ => {
          console.log("删除");
          deleteMessage({ id: scope.row.id })
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
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    async init() {
      try {
        let res = await getMessages();
        if (res.errorCode === 200) {
          this.tableData = res.data;
        } else {
          this.$message({
            message: res.errorMsg,
            type: "error"
          });
        }
      } catch (error) {}
    }
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          nickname: "王小虎",
          date: "2016-05-02",
          content: "王小虎"
        },
        { id: 1, nickname: "王小虎", date: "2016-05-04", content: "王小虎" },
        { id: 1, nickname: "王小虎", date: "2016-05-01", content: "王小虎" },
        { id: 1, nickname: "王小虎", date: "2016-05-03", content: "王小虎" }
      ],
      dialogVisible: false,
      detailContent: ""
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
</style>
