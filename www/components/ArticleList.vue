<template>
  <div>
    <template v-if="articles.length">
    <v-card outlined v-for="article of articles" :key="article.slug" class="ma-6">
      <v-card-title>
          <NuxtLink :to="'/detail/'+article.slug">{{ article.title }}</NuxtLink>
      </v-card-title>
        <v-container>
          <v-row no-gutters>
            <div
              v-for="hashtag of article.hashtag"
              :key="hashtag"
            >
              <v-chip
                class="text-center mx-2 mb-2 px-2 rounded-lg"
                color="accent"
                :to="'/tag/'+hashtag"
                tile
              >
                {{hashtag}}
              </v-chip>
            </div>
          </v-row>
        </v-container>
    </v-card>
  </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      articles: []
    }
  },
  async fetch () {
    this.articles = await this.$content('articles').sortBy('createdAt', 'desc').fetch()
  },
  methods: {
    // 日付を返す
    formatDate (date) {
      const test = new Date(date)
      return this.zeroPadding(test.getFullYear(), 4) +
      '-' +
      this.zeroPadding(test.getMonth(), 2) +
      '-' +
      this.zeroPadding(test.getDate(), 2)
    },
    // ゼロ埋め（共通関数化を検討）
    zeroPadding (value, length) {
      return ('0000000000' + value).slice(-length)
    }
  }
}
</script>
