<template>
  <div class="root">
    <iframe name="docs" frameborder="1"
            :src="docSrc"
            :srcdoc="srcCode"
            v-permission="apis.ads"></iframe>
  </div>
</template>

<script>

import { baseUrl } from '../../utils/HttpAxios.js'

/*  https://www.w3school.com.cn/tags/tag_iframe.asp */
export default {
  name: 'Docs',
  data () {
    return {
      apis: this.$route.meta.apis,
      docSrc: baseUrl + '/app/docs',
      srcCode: '<h3>获取文档数据失败</h3>'
    }
  },
  mounted () {
    this.$data.apis.ads().then(res => {
      this.$data.srcCode = res
    }).catch(error => {
      console.log(JSON.stringify(error))
    })
  }
}
</script>

<style scoped>
  iframe {
    width: 100%;
    height: 100%;
  }
</style>
