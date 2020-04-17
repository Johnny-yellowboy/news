<template>
  <div class="add-goods">
    <el-steps :active="active" finish-status="success">
      <el-step :title="title1" description="基本信息"></el-step>
      <el-step :title="title2" description="商品图片"></el-step>
      <el-step :title="title3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="babsic">
        <el-form :model="addGoodsform" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsform.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsform.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsform.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsform.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addGoodsform.goods_cat"
              :options="options"
              :props="slectProps"
            ></el-cascader>
          </el-form-item>
          <el-button class="mt10" @click="babsic">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="productPic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-success="uploadSuccess"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <el-button class="mt10" @click="productPic">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="productCon">
        <template>
          <!-- bidirectional data binding（双向数据绑定） -->
          <quill-editor v-model="addGoodsform.goods_introduce"> </quill-editor>
          <el-button class="mt10" @click="addGoods">确定</el-button>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      title1: '进行中',
      title2: '步骤 2',
      title3: '步骤 3',
      activeName: 'babsic',
      addGoodsform: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: ''
      },
      // selectValue: [],
      options: [],
      slectProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    async getCateGory() {
      let res = await this.axios.get('categories', {
        params: {
          type: 3
        }
      })
      console.log(res)

      if (res.meta.status === 200) {
        this.options = res.data
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
      this.active = +tab.index
      if (this.active === 0) {
        this.title1 = '进行中'
        this.title2 = '步骤 2'
        this.title3 = '步骤 3'
      } else if (this.active === 1) {
        this.title1 = '已完成'
        this.title2 = '进行中'
        this.title3 = '步骤 3'
      } else if (this.active === 2) {
        this.title1 = '已完成'
        this.title2 = '已完成'
        this.title3 = '进行中'
      }
    },
    babsic() {
      this.active = 1
      this.activeName = 'productPic'
      this.title1 = '已完成'
      this.title2 = '进行中'
    },
    productPic() {
      this.active = 2
      this.title2 = '已完成'
      this.activeName = 'productCon'
    },
    uploadSuccess(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      let {
        meta: { status, msg },
        data: { tmp_path: tmpPath }
      } = response
      if (status === 200) {
        this.$message.success(msg)
        this.addGoodsform.pics.push({
          pic: tmpPath
        })
      } else {
        this.$message.error(msg)
      }
    },
    async addGoods() {
      let res = await this.axios.post('goods', {
        ...this.addGoodsform,
        goods_cat: this.addGoodsform.goods_cat.join()
      })
      console.log(res)
      let {
        meta: { status, msg }
      } = res
      if (status === 201) {
        this.$message.success(msg)
        this.$router.push('goods')
      } else {
        this.$message.error(msg)
      }
    }
  },
  created() {
    this.getCateGory()
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  background-color: #fff;
  /deep/.ql-editor {
    height: 300px;
  }
}
</style>
