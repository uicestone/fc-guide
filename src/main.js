import Vue from "vue";
import {
  Button,
  Carousel,
  CarouselItem,
  Card,
  Table,
  TableColumn,
  Col,
  Row,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  DatePicker,
  Radio,
  RadioGroup,
  Calendar
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";

[
  Button,
  Carousel,
  CarouselItem,
  Card,
  Table,
  TableColumn,
  Col,
  Row,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  DatePicker,
  Radio,
  RadioGroup,
  Calendar
].forEach(c => Vue.use(c));

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
