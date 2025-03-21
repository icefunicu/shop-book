<template>
  <div class="user">
    <nuxt-link class="user-info" tag="div" to="/user">
      <div class="avatar">
        <img
          :src="
            userInfo.avatarUrl
              ? userInfo.avatarUrl + getTimeUrl()
              : defaultAvatarUrl
          "
          alt=""
        />
      </div>
      <div class="title">
        <p>欢迎</p>
        <p class="name">{{ userInfo.name }}</p>
      </div>
      <van-icon name="arrow" />
    </nuxt-link>
    <div class="order">
      <nuxt-link tag="div" to="/order?type=0">
        <van-icon name="pending-payment" />
        待付款
      </nuxt-link>
      <nuxt-link tag="div" to="/order?type=1">
        <van-icon name="records" />
        待接单
      </nuxt-link>
      <nuxt-link tag="div" to="/order?type=2">
        <van-icon name="tosend" />
        待发货
      </nuxt-link>
      <nuxt-link tag="div" to="/order?type=3">
        <van-icon name="logistics" />
        已发货
      </nuxt-link>
      <nuxt-link tag="div" to="/order?type=4">
        <van-icon name="sign" />
        待收货
      </nuxt-link>
    </div>
    <van-cell-group>
      <van-cell icon="records" is-link title="全部订单" to="/order" />
      <van-cell icon="apps-o" is-link title="收货地址管理" to="/address/list" />
      <van-cell icon="cash-on-deliver" is-link title="安全设置" to="/safe" />
    </van-cell-group>
    <van-cell-group>
      <van-cell
        icon="info-o"
        is-link
        title="我要留言"
        @click="handleLeaveMessage"
      />
      <van-cell icon="info-o" is-link title="关于我们" to="/about" />
    </van-cell-group>
    <!-- 输入框 -->
    <van-dialog
      v-model="show"
      title="留言板"
      show-cancel-button
      :lazy-render="false"
      show-confirm-button
      @confirm="handleConfirm"
    >
      <van-field
        type="textarea"
        v-model="message"
        rows="2"
        autosize
        autofocus
        maxlength="10240"
        placeholder="请输入留言"
        show-word-limit
        class="message"
      />
    </van-dialog>
  </div>
</template>

<script>
import { handleServerError } from "../../utils/utils";
import { mapGetters } from "vuex";

export default {
  async fetch({ $axios, error, redirect, store }) {
    if (!store.getters.userInfo.name) {
      try {
        let res = await $axios.$post("/user/getUserInfo");
        if (res.errorCode === 200) {
          store.commit("SET_USERINFO", res.data);
        } else {
          handleServerError("", error, redirect);
        }
      } catch (err) {
        handleServerError(err, error, redirect);
      }
    }
  },
  data() {
    return {
      defaultAvatarUrl: this.baseUrl + "/images/admin/default.jpg",
      show: false,
      message: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    // url加上时间参数
    getTimeUrl() {
      return `?t=${new Date().getTime()}`;
    },
    handleLeaveMessage() {
      this.show = true;
    },
    async handleConfirm() {
      if (!this.message) {
        this.$toast("请输入留言");
        return;
      }
      try {
        let res = await this.$axios.$post("/message/addMessage", {
          message: this.message
        });
        if (res.errorCode === 200) {
          this.$toast("留言成功");
        } else {
          this.$toast(res.errorMessage);
        }
      } catch (err) {
        this.$toast("留言失败");
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.user {
  background-color #f8f8f8
  height 100vh
}

.user-info {
  height 120px
  display flex
  position relative
  align-items center
  background-color #20a1ff
  color #fff

  .avatar {
    margin-left 20px

    img {
      border-radius 50%
      width 60px
      border 1px solid #fff
    }
  }

  .title {
    font-weight 700
    font-size 18px
    margin-left 16px

    .name {
      font-size 16px
      font-weight normal
    }
  }

  .van-icon-arrow {
    position absolute
    right 20px
    top 57px
    font-size 20px
    font-weight bold
  }
}

.order {
  display flex
  text-align center
  font-size 12px
  padding 15px 0
  background-color #fff

  > div {
    flex 1

    .van-icon {
      display block
      margin-bottom 4px
      font-size 24px
    }
  }
}

.van-cell-group {
  margin-bottom 10px
}
</style>
