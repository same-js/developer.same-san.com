<template>
  <div>
    <article>
      <h1>{{ page.title }}</h1>
      <!-- パンくずリスト -->
      <v-card outlined class="breadcrumbs">
        <ol itemscope itemtype="https://schema.org/BreadcrumbList">
          <li
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem">
            <NuxtLink itemprop="item" to="/">
              <span itemprop="name">TOP</span>
            </NuxtLink>
            <meta itemprop="position" content="1" />
          </li>
          ›
          <li
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem">
            <NuxtLink
              itemscope
              itemtype="https://schema.org/WebPage"
              itemprop="item"
              itemid="https://example.com/books/sciencefiction"
              :to="'/tag/'+page.hashtag[0]">
              <span itemprop="name">{{ page.hashtag[0] }}</span>
            </NuxtLink>
            <meta itemprop="position" content="2" />
          </li>
          ›
          <li
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem">
            <span itemprop="name">{{page.title}}</span>
            <meta itemprop="position" content="3" />
          </li>
        </ol>
      </v-card>
      <!-- 本文 -->
      <v-card outlined class="my-8 px-2 py-10">
          <nuxt-content :document="page" />
      </v-card>
    </article>
    <v-card outlined class="my-8 px-2">
      <!-- 日付 -->
      <v-container>
        <v-row no-gutters>
            <div class="text-center mx-2 pa-2 rounded-lg">
              執筆日：<time :datetime="formatDate(page.createdAt)">{{ formatDate(page.createdAt) }}</time>
            </div>
        </v-row>
      </v-container>
      <v-divider />
      <!-- タグ -->
      <v-container>
        <v-card-title>本記事のタグ</v-card-title>
        <v-row no-gutters>
          <div
            v-for="hashtag of page.hashtag"
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
  </div>
</template>
<script>
export default {
  head () {
    return {
      title: this.page.title,
      meta: this.makeMeta(this.page)
    }
  },
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
    },
    makeMeta (page) {
      const meta = []
      // 執筆日
      meta.push(
        {
          name: 'date',
          content: this.formatDate(page.createdAt)
        }
      )
      // noindex 判定
      if (page.metas && Array.isArray(page.metas) && page.metas.includes('noindex')) {
        meta.push(
          {
            name: 'robots',
            content: 'noindex'
          }
        )
      }
      return meta
    }
  }
}
</script>
