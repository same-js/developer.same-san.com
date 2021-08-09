<template>
  <div>
    <h1>tag: {{tag}}</h1>
    <ArticleList :hashtag="tag" />
  </div>
</template>

<script>
import ArticleList from '~/components/ArticleList.vue'
export default {
  components: {
    ArticleList
  },
  data () {
    return {
      tag: this.$route.params.id
    }
  }
}
</script>
