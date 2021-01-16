<template>
    <div>


        <!-- 面包屑导入 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图区 -->
        <el-card>123

            <!-- 2:为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>


        </el-card>



    </div>
</template>


<script>

// 导入 lodash
import _ from 'lodash'

// 1:导入 echarts
// import echarts from 'echarts'----这个方法不行，一直报错
var echarts = require('echarts')



export default {
    data(){
        return {
            // 需要与 axios得到的数据 合并的数据
            options: {
                title: {
                  text: '用户来源'
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    label: {
                      backgroundColor: '#E9EEF3'
                    }
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    boundaryGap: false
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ]
            },
        }
    },

     created(){

    },

    // 生命周期函数，此时页面上元素已经被渲染完毕了
    async mounted(){

        // 3:基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 获取要求描绘图的数据
        const { data:res } = await this.$http.get(`reports/type/1`)

        if(res.meta.status!==200){
            return this.$message.error('获取绘图数据失败')
        }
        
        // 4:准备数据和配置对象
        // 通过 lodash 的对象合并方法，将俩种数据进行合并
        const result = _.merge(res.data,this.options)



        // 获取成功就绘制图
        // 5：使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
    },

}
</script>


<style lang="less" scoped>

</style>