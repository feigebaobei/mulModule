<template>
	<section class="clearfix container mainbox">
		<Left></Left>
		<Right></Right>
	</section>
</template>

<style lang='less'>
	html{
		padding-bottom: 20px !important;
	}
	.mainbox {
		display: flex;
		margin: 20px auto;
	}
    .loading {
      .el-loading-spinner {
        .el-icon-loading {
          font-size: 20px;
          color: #f45a61;
        }
        .el-loading-text {
          color: #f45a61; 
        }
      }
    }
</style>

<script>
import Left from '~common/components/Left.vue'
import Right from '~common/components/Right.vue'
export default {
	components: {
		Left,
		Right
	}  
}
</script>	