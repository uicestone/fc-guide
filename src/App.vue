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
            .date-cell(:class="{'am-booked': booked(date, 'am'), 'pm-booked': booked(date, 'pm'), 'booked': booked(date)}")
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
              el-radio(label="am" :disabled="booked(booking.date, 'am')") 上午
              el-radio(label="pm" :disabled="booked(booking.date, 'pm')") 下午
          el-form-item(label="人数" prop="membersCount")
            el-select(v-model="booking.membersCount")
              el-option(v-for="n in 8" :key="n" :value="n" :label="n")
          el-form-item(label="邮箱" prop="userEmail")
            el-input(type="email" v-model="booking.userEmail" placeholder="接收邮件完成下面的步骤")
      el-button.block-button(type="primary" size="medium" @click="submitBooking")
        span Send me payment email
        span(v-if="booking.price")  ¥{{ booking.price }}
      el-dialog(
        title="Payment email sent"
        :visible.sync="!!booking.user"
        fullscreen
        :show-close="false"
      )
        p Please accomplish payment in your email in 10 minites,
        p or your booking will be canceled.
</template>

<script lang="ts">
import { Prop, Vue, Watch, Component } from "vue-property-decorator";
import moment from "moment";
import { Config, Booking } from "./resources";
import { Form } from "element-ui";

@Component({
  filters: {
    date(input: any, format: string) {
      return moment(input).format(format);
    }
  }
})
export default class extends Vue {
  name = "app";
  imageUrls = [];
  sceneIntro = "";
  itinerary = "";
  quotes = [{ membersCount: 0, price: 0 }];
  booking = {
    date: "",
    ampm: "am",
    membersCount: 0,
    price: 0,
    status: "pending"
  };
  userEmail = null;
  selectedDate: Date | string = "";
  availability: { am: string[]; pm: string[]; full: string[] } = {
    am: [],
    pm: [],
    full: []
  };
  formRules = {
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
  };
  $refs!: {
    form: Form;
  };
  async initConfigs() {
    return (await Promise.all(
      ["bannerUrls", "sceneIntro", "itinerary", "quotes"].map(key =>
        Config.get({ key })
      )
    )).map(r => r.body.value);
  }
  submitBooking() {
    this.$refs.form.validate(valid => {
      valid && this.createBooking();
    });
  }
  async createBooking() {
    this.booking = (await Booking.save(this.booking)).body;
  }
  booked(date: string | Date, ampm: "am" | "pm" | "full" = "full") {
    if (typeof date !== "string") {
      date = moment(date).format("YYYY-MM-DD");
    }
    return this.availability[ampm].includes(date);
  }
  @Watch("booking.membersCount") onMembersCountChange(count: number) {
    const quote = this.quotes.filter(q => q.membersCount === count)[0];
    if (!quote) return;
    this.booking.price = quote.price;
  }
  @Watch("selectedDate") async onSelectedDateChange(
    date: string | Date,
    prevDate: string | Date
  ) {
    this.booking.date = moment(date).format("YYYY-MM-DD");
    delete this.booking.ampm;
    const checkMonth = moment(date).format("YYYY-MM");
    const prevCheckMonth = moment(prevDate).format("YYYY-MM");
    if (checkMonth !== prevCheckMonth) {
      this.availability = (await Booking.checkAvailability({
        month: checkMonth
      })).body;
    }
  }
  async created() {
    (<any>Vue).http.options.root = process.env.VUE_APP_API_BASE;
    (<any>Vue).http.interceptors.push(interceptor(this));
    // this.$user = await this.auth();
  }
  async mounted() {
    const [
      bannerUrls,
      sceneIntro,
      itinerary,
      quotes
    ] = await this.initConfigs();
    this.quotes = quotes.map((q: [number, number][]) => ({
      membersCount: q[0],
      price: q[1]
    }));
    this.imageUrls = bannerUrls;
    this.itinerary = itinerary;
    this.sceneIntro = sceneIntro;
    this.selectedDate = moment()
      .add(1, "day")
      .toDate();
  }
}

const interceptor = (vm: any) => {
  return (request: any) => {
    vm.isLoading = true;

    const token = window.localStorage.getItem("token");

    if (token) {
      request.headers.set("Authorization", token);
    }
    // stop request and return 401 response when no token exist except for login request
    // if (request.url !== "auth/login" && !window.localStorage.getItem("token")) {
    //   return request.respondWith(null, { status: 401 });
    // }
    return (response: any) => {
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

.el-calendar-table .el-calendar-day {
  padding: 0;
  .date-cell {
    box-sizing: border-box;
    padding: 8px;
    height: 100%;
    width: 100%;

    &.am-booked {
      background: linear-gradient(to bottom, #efecec 52%, transparent 48%);
    }
    &.pm-booked {
      background: linear-gradient(to bottom, transparent 52%, #efecec 48%);
    }
    &.booked {
      background: #efecec;
    }
  }
}

.is-selected .date-cell {
  border: 2px solid #409eff;
  padding: 6px !important;
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
