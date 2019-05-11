import VueResource from "vue-resource";
import Vue from "vue";

Vue.use(VueResource);

export const Config = Vue.resource("config{/key}", null, {
  update: { method: "PATCH" }
});
export const Booking = Vue.resource("booking{/id}", null, {
  update: { method: "PATCH" }
});
