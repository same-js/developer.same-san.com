<template>
  <img :src="'/images/article/' + src" style="width: 100%;">
</template>
<script>
  export default {
      // alt については受取はできる状態にしておくが、現時点では反映imgタグに反映しない（altテキストをどう表示するか、というデザインの実装をしてから）
      props: ['src', 'alt']
  }
</script>