<template>
  <div>
    <h1>tag: {{tag}}</h1>
    <template  v-if="articles.length" >
    <v-card v-for="article of articles" :key="article.slug" class="ma-6 ">
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
                color="chip"
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
  async asyncData ({ params, $content }) {
    const articles = await $content('articles').where({ hashtag: { $contains: params.id } }).sortBy('createdAt', 'desc').fetch()

    return {
      articles
    }
  },
  data () {
    return {
      tag: this.$route.params.id
    }
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
