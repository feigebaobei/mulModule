<template>
	<div class="find-password">
	  <div class="header">
        <a href='http://www.xueersi.com' class="logo"></a>
    </div>
		<div class="password_wrap">
			<set-one v-if="stepFlag==1" @showSetPass="showSetPass" ></set-one>
			<set-two v-if="stepFlag==2" @showSetSuess="showSetPass"></set-two>
			<set-success v-if="stepFlag==3"></set-success>
		</div>
		<set-footer></set-footer>
	</div>
</template>

<style lang='less'>

</style>

<script>
import SetFooter from '@/components/sub/setFooter.vue'
import SetOne from '@/components/setOne.vue'
import SetTwo from '@/components/setTwo.vue'
import SetSuccess from '@/components/setSuccess.vue'
export default {
	components: {
		SetOne,
		SetTwo,
		SetSuccess,
		SetFooter
	},
	data () {
		return {
			stepFlag: 1
		}
	},
	methods: {
		showSetPass (val) {
			this.stepFlag = val
		}
	} 
}
</script>	
<style lang='less'>
html{
	 overflow: hidden;
}
.find-password{
	width: 1200px;
	margin:0 auto;
	overflow:hidden;
	.header {
		padding:20px 0;
		position: relative;
		.logo{
			display:inline-block; 
			width:200px;
			height:35px;
			background-image: url(https://res14.xesimg.com/public/logo_pb.svg?1017);
			background-repeat: no-repeat;
			text-indent: -999999em;
			background-size: 200px 35px;
		}
	}
	.password_wrap {
		border:1px solid #ccc;
		min-height: 600px;
		background: #fff;
		border-top:3px solid #ff3333;
		border-radius: 2px;
		.step{
			overflow: hidden;
			text-align: center;
			margin:90px 0;
		}
	}
}
</style>