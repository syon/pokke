<template>
  <div
    class="v-entry"
    :data-eid="obj.eid"
    :data-wid="obj.wid"
    :class="compoClasses"
    @click="activate(obj)"
  >
    <div class="pnl">
      <div class="pnl-thumb">
        <v-img
          :src="imgSrc"
          width="100"
          height="80"
          @error="handleLoadImageError"
        />
        <div class="text-caption grey--text font-weight-light">
          {{ obj.updated }}
        </div>
        <!-- <div class="meta">
          <span v-if="obj.site_name" class="site">{{ obj.site_name }}</span>
        </div> -->
      </div>
      <div class="pnl-body">
        <div class="link">
          <a :href="obj.url" target="_blank">{{ linkTitle }}</a>
        </div>
        <div class="description">{{ obj.description || obj.excerpt }}</div>
        <template v-if="Object.keys(obj.tags).length > 0">
          <div class="tags">
            <span v-for="tag in Object.keys(obj.tags)" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </template>
      </div>
      <div class="pnl-action">
        <div class="hatebu">
          <a :href="loungeUrl" target="_blank">
            <div class="hatebu-cnt" :style="hatebuCntStyle">
              {{ obj.hatebuCnt }}
            </div>
          </a>
        </div>
        <div class="favorite">
          <template v-if="obj.favorite">
            <v-icon small color="orange">mdi-star</v-icon>
          </template>
        </div>
        <div class="archive">
          <v-btn
            icon
            x-small
            :loading="ingArchive"
            :disabled="isArchived"
            class="c-archive"
            @click="mArchive(obj.eid)"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: { obj: { type: Object, required: true } },
  data() {
    return {
      DEBUG: process.env.NODE_ENV === 'development',
      imgSrc: this.obj.image_s3_url,
      ingArchive: false,
      nowArchived: false,
    }
  },
  computed: {
    ...mapState('stream/filter', {
      activeEid: (state) => state.activeEid,
    }),
    compoClasses() {
      return {
        archived: this.isArchived || this.nowArchived,
        active: this.obj.eid === this.activeEid,
      }
    },
    linkTitle() {
      return this.obj.title ? this.obj.title : this.obj.url
    },
    isArchived() {
      const { archived, status } = this.obj
      if (archived) {
        return true
      } else if (status === '0') {
        if (this.nowArchived) {
          return true
        }
        return false
      } else if (status === '1') {
        return true
      }
      return false
    },
    loungeUrl() {
      const { wid } = this.obj
      return `https://lobine.app/lounge/${wid}`
    },
    hatebuCntStyle() {
      const cnt = this.obj.hatebuCnt
      let style
      switch (true) {
        case cnt >= 500:
          style = { color: '#F50057', fontWeight: 900 }
          break
        case cnt >= 100:
          style = { color: '#FF4081', fontWeight: 600 }
          break
        case cnt >= 10:
          style = { color: '#FF4081', fontWeight: 100 }
          break
        default:
          style = { color: '#9E9E9E' }
      }
      return style
    },
  },
  methods: {
    ...mapActions({
      activate: 'stream/filter/activate',
    }),
    async handleLoadImageError() {
      const etag = await this.$store.dispatch('chase/fetchLibraThumb', this.obj)
      const imgUrl = this.imgSrc.replace(/\?etag=.*/, '')
      this.imgSrc = `${imgUrl}?etag=${etag}`
    },
    async mArchive(eid) {
      this.ingArchive = true
      await this.$store.dispatch('stream/filter/archive', eid)
      this.nowArchived = true
      this.ingArchive = false
    },
  },
}
</script>

<style lang="scss" scoped>
.pnl {
  display: flex;
  height: 100%;

  .pnl-thumb {
    width: 100px;
    margin: 10px 10px 0;
    line-height: 1.3;

    figure {
      display: flex;
      width: 100px;
      height: 80px;
      overflow: hidden;
      align-items: center;
      justify-content: center;
    }
  }

  .pnl-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 10px 0 0;
    overflow: hidden;
  }

  .pnl-action {
    width: 60px;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .pnl-action > div {
    padding: 3px 0;
  }
}

.v-entry {
  height: 120px;
  overflow: hidden;
  // min-height: 111px;
  // padding: 10px 0;
  color: #757575;
  border-bottom: 1px solid #f5f5f5;
  &.active {
    background-color: #fffacd;
  }

  &.archived {
    background-color: #eee;
  }

  .loading {
    font-size: 1.5rem;
  }

  .thumb {
    width: 100px;
    height: 80px;
  }

  .link {
    font-size: 15px;
    margin: 0 0 0.25em;
    line-height: 1.3;
    word-break: break-word;
  }

  .link a {
    font-weight: bold;
    text-decoration: none;
    color: #24292e;
  }

  .link a:hover {
    text-decoration: underline;
  }

  .meta {
    font-size: 0.67em;
  }

  .meta span {
    margin-right: 1em;
  }

  .excerpt,
  .description {
    font-size: 0.67em;
    // -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  .tags .tag {
    display: inline-flex;
    margin: 0 0.5em 0 0;
    padding: 0 0.5em;
    font-weight: bold;
    font-size: 0.67em;
    border-radius: 2px;
    align-items: center;
    line-height: 1.5;
    border: 1px solid #9ea8b3;
    color: #fff;
    background-color: #9ea8b3;
  }

  .pnl-action button {
    color: inherit;
    font: inherit;
    margin: 0;
    padding: 0;
    text-align: inherit;
    line-height: inherit;
    display: inline;
    background: none;
    overflow: visible;
    border: none;
    cursor: pointer;
  }

  .hatebu .hatebu-cnt {
    line-height: 1;
    font-size: 0.75rem;
    letter-spacing: -0.05em;
  }

  .fav {
    line-height: 1;
  }

  .fav .v-clickable button {
    padding: 3px;
    line-height: 1;
  }

  .fav span {
    font-size: 1.25rem;
    cursor: pointer;
  }

  .archive {
    line-height: 1;
  }

  .archive .v-clickable button {
    padding: 3px;
    line-height: 1;
  }

  .archive span {
    font-size: 1.25rem;
    cursor: pointer;
    color: #9ea8b3;
  }
}
</style>
