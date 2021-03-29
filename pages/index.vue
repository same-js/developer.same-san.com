<template>
  <div>
    <input v-model="query" type="search" autocomplete="off" />
    <template  v-if="articles.length" >
    <v-card v-for="article of articles" :key="article.slug" class="ma-6 ">
      <v-card-title>
          <NuxtLink :to="'/'+article.slug">{{ article.title }}</NuxtLink>
      </v-card-title>
        <v-container>
          <v-row no-gutters>
            <v-col
              v-for="tag of article.tag"
              :key="tag"
              cols="12"
              sm="2"
            >
              <div
                class="text-center ma-2 pa-2 rounded-lg teal darken-2"
                outlined
                tile
              >
                {{tag}}
              </div>
            </v-col>
          </v-row>
        </v-container>
    </v-card>
  </template>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const articles = await $content('articles').fetch()

    return {
      articles
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
