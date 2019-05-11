<template lang="pug">
  #app
    .block
      el-carousel(trigger="click" height="250px")
        el-carousel-item(v-for="url in imageUrls" :key="url")
          img(:src="url")
      el-card.box-card
        .clearfix(slot="header")
          span 景点介绍
        span(v-html="sceneIntro")
      el-card.box-card
        .clearfix(slot="header")
          span 路线与时长
        span(v-html="itinerary")
      el-card.box-card
        .clearfix(slot="header")
          span 收费
        el-row
          el-col(:span="12")
            el-table(:data="quotes.slice(0, 4)")
              el-table-column(prop="membersCount" label="人数" width="60px")
              el-table-column(prop="price" label="价格（¥）")
          el-col(:span="12")
            el-table(:data="quotes.slice(4, 8)")
              el-table-column(prop="membersCount" label="人数" width="60px")
              el-table-column(prop="price" label="价格（¥）")
      el-card.box-card.no-padding
        el-calendar(v-model="selectedDate")
          template(
            slot="dateCell"
            slot-scope="{date, data}"
          )
            span {{ date | date('D') }}
      el-card.box-card
        .clearfix(slot="header")
          span 预订
        el-form(ref="form" :model="booking" :rules="formRules" label-position="left" label-width="60px")
          el-form-item(label="日期" prop="date" disabled)
            el-date-picker(
              v-model="booking.date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              disabled
            )
          el-form-item(label="时间" prop="ampm")
            el-radio-group(v-model="booking.ampm")
              el-radio(label="am") 上午
              el-radio(label="pm") 下午
          el-form-item(label="人数" prop="membersCount")
            el-select(v-model="booking.membersCount")
              el-option(v-for="n in 8" :key="n" :value="n" :label="n")
          el-form-item(label="邮箱" prop="userEmail")
            el-input(type="email" v-model="booking.userEmail" placeholder="接收邮件完成下面的步骤")
      el-button.block-button(type="primary" size="medium" @click="submitBooking")
        span 发送付款邮件
        span(v-if="booking.price")  ¥{{ booking.price }}
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { Config } from "./resources.ts";

export default {
  name: "app",
  data() {
    return {
      imageUrls: [],
      sceneIntro: "",
      itinerary: "",
      quotes: [[]],
      booking: {},
      userEmail: null,
      selectedDate: null,
      formRules: {
        userEmail: [
          { required: true, message: "请填写邮箱" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        membersCount: { required: true, message: "请选择人数" },
        date: { required: true, message: "请选择日期", trigger: ["blur"] },
        ampm: { required: true, message: "请选择时间" }
      }
    };
  },
  methods: {
    submitBooking() {
      this.$refs.form.validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    async initConfigs() {
      return (await Promise.all(
        ["bannerUrls", "sceneIntro", "itinerary", "quotes"].map(key =>
          Config.get({ key })
        )
      )).map(r => r.body.value);
    }
  },
  watch: {
    "booking.membersCount"(count) {
      const quote = this.quotes.filter(q => q.membersCount === count)[0];
      if (!quote) return;
      this.booking.price = quote.price;
    },
    selectedDate(date) {
      this.booking.date = moment(date).format("YYYY-MM-DD");
    }
  },
  filters: {
    date(input, format) {
      return moment(input).format(format);
    }
  },
  async created() {
    Vue.http.options.root = process.env.VUE_APP_API_BASE;
    Vue.http.interceptors.push(interceptor(this));
    // this.$user = await this.auth();
  },
  async mounted() {
    const [
      bannerUrls,
      sceneIntro,
      itinerary,
      quotes
    ] = await this.initConfigs();
    this.quotes = quotes.map(i => ({ membersCount: i[0], price: i[1] }));
    this.imageUrls = bannerUrls;
    this.itinerary = itinerary;
    this.sceneIntro = sceneIntro;
  }
};

const interceptor = vm => {
  return request => {
    vm.isLoading = true;

    const token = window.localStorage.getItem("token");

    if (token) {
      request.headers.set("Authorization", token);
    }
    // stop request and return 401 response when no token exist except for login request
    // if (request.url !== "auth/login" && !window.localStorage.getItem("token")) {
    //   return request.respondWith(null, { status: 401 });
    // }
    return response => {
      vm.isLoading = false;

      if (response.status >= 500) {
        const message = "服务器内部错误";

        vm.$notify({
          message,
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "bottom",
          type: "danger"
        });

        return Promise.reject(message);
      } else if (response.status >= 400) {
        // redirect to login page on any 401 response
        if (response.status === 401) {
          window.location.hash = "#/login";
          window.localStorage.removeItem("token");
        }
        const message = response.body.message || response.statusText;
        alert(message);
        // vm.$notify({
        //   message,
        //   icon: "add_alert",
        //   horizontalAlign: "center",
        //   verticalAlign: "bottom",
        //   type: "warning"
        // });

        return Promise.reject(message);
      }
      return response;
    };
  };
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

.el-carousel__item {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.box-card {
  width: 90%;
  margin: 20px auto;
  border-radius: 10px;
  &.no-padding {
    .el-card__body {
      padding: 0;
    }
  }
  &.no-padding-bottom {
    .el-card__body {
      padding-bottom: 0;
    }
  }
}

.el-form {
  padding: 10px 25px;
  .el-form-item__content {
    // width: 70%;
    > .el-input,
    .el-select {
      width: 100% !important;
    }
  }
}

.el-calendar-table .el-calendar-day {
  height: 50px;
}

.block-button {
  width: 90%;
  margin: 20px auto;
  display: block;
  height: 45px;
  font-size: 16px;
}

.text-right {
  text-align: right;
}
</style>
