<template>
  <section>
    <el-row class="topcard" :gutter="20">
      <el-col :span="6" :offset="1" class='littecard' >
        <el-card>
            <div slot="header" class="clearfix">
            <span>CNY
            </span>
            <img src = "https://otcbtc.io/images/arrow-right-selloffer.png"></img>
            <span>BTC</span>
          </div>
          <div  class="text item">{{'最新成交均价 ' }}</div>
          <div  class="textprice">{{'25,893.98 CNY ' }}</div>
          <div  class="text item">{{'市场价 ' }}</div>
          <div  class="textprice">{{'25,619.06 CNY ' }}</div>
          <div id="chartLine" style="width:100%; height:300px;"></div>
        </el-card>
        
      </el-col>
      <el-col :span="16"  class='littecard' >
        <el-card :body-style="{ padding: '5px 20px'}" style="background-color:#bce8f1">
          <div  class="textnews">{{'* '+'关于 OTCBTC 服务器升级维护的公告（1-10） ' }}</div>
          <div  class="textnews">{{'* '+'OTCBTC 支持 ETH 君士坦丁堡硬分叉升级的公告（1-3） ' }}</div>
          <div  class="textnews">{{'* '+'OTCBTC 场外区广告持续免费六个月（12-31） ' }}</div>
        </el-card>
      </el-col>
      <el-col :span="16"  class='littecard'>
        <el-card>
        <div slot="header" class="clearfix">
            <span>最新交易 </span>
        </div>
                  <el-table     :data="tableData"    stripe
    style="width: 100%">
    <el-table-column
      prop="date"
      label="金额(CNY)"
      width="180">
    </el-table-column>
    <el-table-column
      prop="flag"
      label="进出"
      width="90">
       <template slot-scope="scope">
        <span v-color='scope.row.flag' >{{ scope.row.flag }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="数量"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="币种">
    </el-table-column>
  </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col> -->

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="name" label="昵称" width="120" sortable></el-table-column>
      <el-table-column prop="sex" label="信用" width="100" :formatter="formatSex" sortable></el-table-column>
      <el-table-column prop="age" label="交易方式" width="150" sortable></el-table-column>
      <el-table-column prop="birth" label="交易限额" width="120" sortable></el-table-column>
      <el-table-column prop="addr" label="浮动单价" min-width="180" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small"  type="success" @click="handleEdit(scope.$index, scope.row)">购买BTC</el-button>
          <!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="addForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import echarts from 'echarts'
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser
} from "../../api/api";

export default {
    
  data() {
    return {
     currentDate: new Date(),
     tableData: [{
            date: '1,000',
            flag:"=>",
            name: '61.0501',
            address: 'EOS'
          }, {
            date: '2,000',
            flag:"=>",
            name: '122.0357',
            address: 'EOS'
          }, {
            date: '2,433.44',
            flag:"<=",
            name: '0.1000',
            address: 'BTC'
          }, {
            date: '17,038.86',
            flag:"=>",
            name: '1050.0000',
            address: 'EOS'
      }],
      filters: {
        name: ""
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      }
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        name: this.filters.name
      };
      this.listLoading = true;
      //NProgress.start();
      getUserListPage(para).then(res => {
        // this.total = res.data.total;
        // this.users = res.data.users;
        this.total = 3;
        this.users = [
            {
            name: "123",
            sex: -1,
            age: 0,
            birth: "234",
            addr: "234"
            },  {
            name: "345",
            sex: -1,
            age: 0,
            birth: "432",
            addr: "234"
            },  {
            name: "234",
            sex: -1,
            age: 0,
            birth: "234",
            addr: "234"
            },
        ];
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          removeUser(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            editUser(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            addUser(para).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: 'Line Chart',
                        show: false
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['邮件营销', '联盟广告', '搜索引擎'],
                        show: false
                    },
                    grid: {
                        left: '-35',
                        right: '3%',
                        bottom: '0%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value',
                        show: false
                    },
                    series: [
                        {
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '联盟广告',
                            type: 'line',
                            stack: '总量',
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '搜索引擎',
                            type: 'line',
                            stack: '总量',
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                });
            }
  
  
  
  
  
  
  },
  directives: {
        'color':{
            bind:function (el, binding) {
                // console.log(binding.value);
                if(binding.value=='=>'){
                    el.style.color = 'green';
                }
                else{
                    el.style.color = 'red';
                }
        }
        }
    },
  mounted() {
    this.getUsers();
    this.drawLineChart();
  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.time {
  font-size: 13px;
  color: #999;
}
/*
  
  */
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.clearfix span{
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    padding:10px 10px;
}
.clearfix img{
    width: 40px;
    height: 20px;
}
.textprice{
    margin: 15px 15px;
    font-size: 20px;
    color: #43CB83;
    line-height: 1.2em;
    text-align: center;
}
.textnews{
    margin: 15px 15px;
    font-size: 15px;
    color: black;
    line-height: 1.2em
}

/**/
.topcard{
    padding-top: 15px;
}
.littecard{
     padding:10px 0;
}
</style>