<template lang="pug">
  #app
    .block
      el-carousel(trigger='click' height='250px')
        el-carousel-item(v-for='url in imageUrls' :key='url')
          img(:src='url')
      el-card.box-card
        .clearfix(slot='header')
          span 景点介绍
        .text 景点介绍景点介绍景点介绍景点介绍，景点介绍景点介绍景点介绍，景点介绍景点介绍景点介绍。
      el-card.box-card
        .clearfix(slot='header')
          span 路线与时长
        .text 路线与时长路线与时长，路线与时长，路线与时长。路线与时长路线与时长。
      el-card.box-card
        .clearfix(slot='header')
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
</template>

<script>
export default {
  name: "app",
  data() {
    const quotesRaw = [
      [1, 800],
      [2, 1200],
      [3, 1600],
      [4, 2000],
      [5, 2400],
      [6, 2800],
      [7, 3200],
      [8, 3600]
    ];
    const quotes = quotesRaw.map(i => ({ membersCount: i[0], price: i[1] }));
    const imageUrls = [
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557505020755&di=7a4f3a7a2c788f136ab6930a8010826a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201806%2F17%2F20180617134701_RjfdE.jpeg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557505020755&di=662ab5fa12462f24bd8d3dc6dba09f6c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0101cc58ada297a801219c77f23c96.jpg%401280w_1l_2o_100sh.jpg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557505020755&di=36c7fd2647056e5a18d33d82b64ad4aa&imgtype=0&src=http%3A%2F%2Fimglf0.ph.126.net%2FzSbqVU--8g24tShNU79dtA%3D%3D%2F978407019063974577.jpg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557505020755&di=f20beac857b8c2833448bb3f4583d8f7&imgtype=0&src=http%3A%2F%2Fphoto.tuchong.com%2F2511444%2Ff%2F20234982.jpg"
    ];
    return {
      imageUrls,
      quotes
    };
  },
  components: {}
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
  text-align: center;
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
}
</style>
