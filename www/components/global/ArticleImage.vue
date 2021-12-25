<template>
  <a :href="imgPath">
    <img :src="imgPath" style="width: 100%;">
  </a>
</template>
<script>
  export default {
      // alt については受取はできる状態にしておくが、現時点では反映imgタグに反映しない（altテキストをどう表示するか、というデザインの実装をしてから）
      props: ['src', 'alt'],
      data () {
        return {
            imgPath: ''
        }
      },
      mounted () {
          this.imgPath = `/images/article/${this.src}`
      }
  }
</script>