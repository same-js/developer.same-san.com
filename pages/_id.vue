<template>
    <article>
      <h1>{{ page.title }}</h1>
      <!-- 日付 -->
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="4">
            <div class="text-center ma-2 pa-2 rounded-lg teal darken-2">
              執筆：{{ formatDate(page.createdAt) }}
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="text-center ma-2 pa-2 rounded-lg teal darken-2">
              更新：{{ formatDate(page.updatedAt) }}
            </div>
          </v-col>
        </v-row>
      </v-container>
      <nuxt-content :document="page" />
      <hr>
      <dl>
        <div>
          <dt>作成日</dt>
          <dd>
          {{ formatDate(page.createdAt) }}
          </dd>
        </div>
        <div>
          <dt>更新日</dt>
          <dd>
          {{ formatDate(page.updatedAt) }}
          </dd>
        </div>
      </dl>
    </article>
</template>
<script>
export default {
  async asyncData ({ params, $content }) {
    const page = await $content('articles', params.id).fetch()

    return {
      page
    }
  },
  data () {
    return {
      id: this.$route.params.id
    }
  },
  methods: {
    // 日付を返す
    formatDate (date) {
      const test = new Date(date)
      return this.zeroPadding(test.getFullYear(), 4) +
      '-' +
      this.zeroPadding(test.getMonth() + 1, 2) +
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
