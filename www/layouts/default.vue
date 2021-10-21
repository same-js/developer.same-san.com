<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-icon @click.stop="miniVariant = !miniVariant">mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in leftManuItems"
          :key="i"
          :to="item.to"
          :href="item.href"
          :target="item.target"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" :to="item.to" :href="item.href" />
          </v-list-item-content>
          <v-icon v-if="item.href">mdi-open-in-new</v-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- ＜ ボタン -->
      <!-- <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <!-- □ ボタン -->
      <!-- <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- ー ボタン -->
      <!-- <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <NuxtLink :to="title.to" class="blog-title-href">
        <v-toolbar-title v-text="title.title" :class="titleColor"/>
      </NuxtLink>
      <v-spacer />
      <v-btn icon  @click="theme = nextTheme">
        <v-icon>{{themeIcon}}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <!-- TODO ここに darkmode 切り替えトグルを設置したい -->
    <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      theme: '',
      themeIcon: '',
      titleColor: 'grey--text text--lighten-4',
      nextTheme: '',
      clipped: false,
      drawer: false,
      fixed: false,
      leftManuItems: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-github',
          title: 'GitHub',
          href: 'https://github.com/same-js',
          target: '_blank'
        }
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: {
        title: this.$config.sitename,
        to: '/'
      }
    }
  },
  mounted () {
    if (sessionStorage.theme) {
      this.theme = sessionStorage.theme
    } else {
      this.theme = 'os'
    }
  },
  watch: {
    theme (newValue) {
      const lightTitleText = 'grey--text text--darken-4'
      const darkTitleText = 'grey--text text--lighten-4'
      if (!newValue) {
        newValue = sessionStorage.theme ? 'dark' : 'light'
      }
      sessionStorage.theme = newValue
      this.theme = newValue
      if (newValue === 'os') {
        this.$vuetify.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      } else {
        this.$vuetify.theme.dark = (newValue === 'dark')
      }
      if (newValue === 'os') {
        this.themeIcon = 'mdi-laptop'
        this.nextTheme = 'light'
        this.titleColor = this.$vuetify.theme.dark ? darkTitleText : lightTitleText
      } else if (newValue === 'light') {
        this.themeIcon = 'mdi-white-balance-sunny'
        this.nextTheme = 'dark'
        this.titleColor = lightTitleText
      } else if (newValue === 'dark') {
        this.themeIcon = 'mdi-moon-waxing-crescent'
        this.nextTheme = 'os'
        this.titleColor = darkTitleText
      }
    }
  }
}
</script>
