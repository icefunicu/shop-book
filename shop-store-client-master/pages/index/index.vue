<template>
  <div class="home">
    <van-nav-bar title="校园二手书籍交易平台" />
    <van-search
      @search="onSearch"
      placeholder="请输入搜索关键词"
      show-action
      v-model="searchValue"
    >
      <div @click="onSearch" slot="action">搜索</div>
    </van-search>
    <van-notice-bar scrollable>
      {{ campusData.title }}：{{ campusData.content }}
    </van-notice-bar>
    <div class="home-swipe">
      <div class="home-swipe-head">
        <span class="recommend">今日推荐</span>
        <span class="tips">每天都有新发现</span>
        <span class="swipe-num">
          <span class="indexPage">{{ indexPage + 1 }}</span>
          <span class="pageNum">/4</span>
        </span>
      </div>
      <van-swipe :autoplay="3000" @change="changeSwipe">
        <van-swipe-item
          :key="index"
          @click="linkSwipe(item.id)"
          v-for="(item, index) in images"
        >
          <img v-lazy="item.url" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <good-item describe="每日热销指南" moreLink="/more/hotSell" title="热销榜">
      <ul class="hot-ul">
        <li
          :key="item.id"
          @click="showGood(item.id)"
          class="sale-item"
          v-for="item in hotGoods"
        >
          <img :src="item.imageUrl" alt="" class="img" />
          <div class="sale-name">{{ item.name }}</div>
          <div class="sale-price">{{ item.salePrice | money }}</div>
        </li>
      </ul>
    </good-item>
    <good-item
      describe="前所未有的折扣"
      moreLink="/more/saleSell"
      title="低价促销"
    >
      <ul class="sale-ul">
        <li
          :key="item.id"
          @click="showGood(item.id)"
          class="li-item"
          v-for="item in saleGoods"
        >
          <div class="img">
            <img :src="item.imageUrl" />
          </div>
          <div class="title">
            {{ item.name }}
          </div>
          <div class="price">
            <span class="new-price">
              {{ item.salePrice | money }}
            </span>
            <span class="old-price">
              <del>
                {{ item.price | money }}
              </del>
            </span>
          </div>
        </li>
      </ul>
    </good-item>
    <good-item describe="发现更多优质好货" title="发现">
      <ul class="discover-ul">
        <background-img
          :class="index === 0 ? 'discover-img' : ''"
          :desc="item.description"
          :imgSrc="item.imageUrl"
          :key="item.id"
          :topic="item.name"
          @click.native="showGood(item.id)"
          class="discover-li"
          v-for="(item, index) in discoverGoods.slice(0, 2)"
        ></background-img>
      </ul>
      <ul class="discover-ul">
        <background-img
          :desc="item.description"
          :imgSrc="item.imageUrl"
          :key="item.id"
          :topic="item.name"
          @click.native="showGood(item.id)"
          class="discover-li"
          v-for="item in discoverGoods.slice(2, 5)"
        ></background-img>
      </ul>
    </good-item>
    <div class="recommend">
      <div class="recommend-title">
        <div class="border"></div>
        <div class="title">精选分类</div>
        <div class="border"></div>
      </div>
      <van-tabs>
        <van-tab
          :key="item.id"
          :title="item.title"
          v-for="item in classifyGoods"
        >
          <tab-item :data="item.data" @showGood="showGood"></tab-item>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { handleServerError } from "../../utils/utils";

import goodItem from "~/components/goodItem";
import backgroundImg from "~/components/backgroundImg";
import tabItem from "~/components/tabItem";

export default {
  async asyncData({ $axios, error, redirect }) {
    try {
      let promiseArr = [
        $axios.$post("/book/getHotGood"),
        $axios.$post("/book/getSaleGood"),
        $axios.$post("/book/getDiscoverGood"),
        $axios.$post("/book/getRandClassify"),
        $axios.$post("/campus/getCampusOne")
      ];
      let [
        hotData,
        saleData,
        discoverData,
        classifyGood,
        campusData
      ] = await Promise.all(promiseArr);
      if (
        hotData.errorCode === 200 &&
        saleData.errorCode === 200 &&
        discoverData.errorCode === 200 &&
        classifyGood.errorCode === 200 &&
        campusData.errorCode === 200
      ) {
        return {
          hotGoods: hotData.data || [],
          saleGoods: saleData.data || [],
          discoverGoods: discoverData.data || [],
          classifyGoods: classifyGood.data || [],
          campusData: campusData.data || []
        };
      } else {
        handleServerError("", error, redirect);
      }
    } catch (err) {
      handleServerError(err, error, redirect);
    }
  },
  data() {
    return {
      searchValue: "",
      indexPage: 1,
      images: [
        {
          id: 1,
          url:
            "https://gw.alicdn.com/imgextra/O1CN018PpodW1vTHflImAHb_!!6000000006173-2-yinhe.png_.webp"
        },
        {
          id: 2,
          url:
            "https://m.media-amazon.com/images/I/51ikSbyRU6L._AC_UF1000,1000_QL80_.jpg"
        },
        {
          id: 3,
          url:
            "https://www.book5.cc/wp-content/uploads/2024/01/photo_2022-11-14_23-50-05.jpg"
        },
        {
          id: 4,
          url:
            "https://deerlib.s3.eu-west-3.amazonaws.com/book/9787559663283/9787559663283-pc-1.jpg"
        }
      ]
    };
  },
  mounted() {},
  computed: {
    goodItems() {
      return {};
    }
  },
  methods: {
    showGood(id) {
      this.$router.push({
        path: "/good/detail",
        query: {
          id
        }
      });
    },
    // 搜索
    onSearch() {
      localStorage.setItem("search", this.searchValue);
      this.$router.push("/search");
    },
    // 轮播图index
    changeSwipe(index) {
      this.indexPage = index;
    },
    // 轮播图跳转
    linkSwipe(id) {
      // TODO: 轮播图
      console.log(id);
    }
  },
  components: {
    goodItem,
    backgroundImg,
    tabItem
  }
};
</script>

<style lang="stylus" scoped>
.home {
  background-color #eee
  margin-bottom 50px

  .van-search {
    border-bottom 1px solid #dedede
  }
  .image {
    width 100%
    height 100%
  }
}

.home-swipe {
  box-sizing border-box
  padding 4px 6px
  background-color #fff
  border-bottom 1px solid #dedede

  .home-swipe-head {
    padding 4px 0

    .recommend {
      font-weight 700
    }

    .tips {
      font-size 12px
      margin-left 6px
      color #8f8f8f
    }

    .swipe-num {
      float right

      .indexPage {
        font-weight 700
      }

      .pageNum {
        font-size 12px
        color #8f8f8f
      }
    }
  }

  .van-swipe {
    height 136px

    img {
      width 100%
      height 100%
      object-fit contain
    }
  }
}

.hot-ul {
  display flex

  .sale-item {
    flex-grow 1
    width 25%
    overflow hidden
    padding 2px 4px
    text-align center

    img {
      height 100px
    }

    .sale-name {
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    }

    .sale-price {
      color #ff4c0a
      font-size 16px
    }
  }
}

.sale-ul {
  display flex
  margin-bottom 4px

  .li-item {
    flex-grow 1
    width 25%
    overflow hidden
    padding 2px 4px

    img {
      height 100px
    }

    .title {
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    }

    .new-price {
      color #ff4c0a
    }

    .old-price {
      font-size 12px
      color #333
      margin-left 6px
    }
  }
}

.discover-ul {
  display flex
  height 100px
  margin-bottom 4px

  .discover-img {
    width 100px
  }

  .discover-li {
    flex-grow 1
    margin-right 4px

    &:last-child {
      margin-right 0
    }
  }
}

.recommend-title {
  display flex
  justify-content center
  align-items center
  text-align center
  font-size 14px
  height 30px

  .border {
    width 12px
    height 1px
    margin 0 8px
    background-color #000
  }
}
</style>
