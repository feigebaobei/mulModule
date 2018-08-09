<template>
  <div class="block">
    <el-pagination
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      :current-page="currentPage"
      >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'PaginationTwo',
    props: ['total', 'pageSize', 'currentPage'],
    methods: {
      handleCurrentChange (pageNum) {
        this.$emit('pageChange', pageNum)
      }
    }
  }
</script>

<style lang="less">
  .block{
    text-align: center;
    .el-pagination .btn-next, .el-pagination .btn-prev,.el-dialog, .el-pager li,.el-pagination button.disabled,.el-pager li.btn-quicknext, .el-pager li.btn-quickprev{
      background: #e0e0e0;
      color: #ffffff;
      font-size: 14px;
      height: 39px;
      width: 45px;
      line-height: 39px;
      margin-left: 1px;
    }
    .el-pagination button.disabled {
      cursor: default;
    }
    .el-pagination .btn-next{
      border-radius: 0 3px 3px 0;
    }
    .el-pagination .btn-prev{
      border-radius: 3px 0 0 3px;
    }
    .el-pagination .btn-next, .el-pagination .btn-prev{
      margin: 0 2px;
    }
    .el-pager li.active{
      color: #ffffff;
      background: #f13232;
      font-size: 14px;
    }
    .el-pager li:hover,.el-pagination .btn-next:hover, .el-pagination .btn-prev:hover{
      color: #ffffff;
      background: #f13232;
    }
    .el-pagination .disabled:hover{
      background: #e0e0e0;
    }
    .el-pagination .btn-next .el-icon, .el-pagination .btn-prev .el-icon{
      font-weight: 900;
      font-size: 14px;
    }
  }
</style>
