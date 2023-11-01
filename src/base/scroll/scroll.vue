<template>
  <div ref="wrapper">
    <!-- 注意这个插槽是关键！也是scroll组件能够包裹其他组件的原因 -->
    <slot></slot> 
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "@better-scroll/core";
import myPullUp from "@better-scroll/pull-up";
export default {
  props: {
    // 1. probeType 为 0，在任何时候都不派发 scroll 事件，
    // 2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
    // 3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
    // 4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
    probeType: {
      type: Number,
      default: 3,
    },
    // 作用：better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。但是自定义的 click 事件会阻止一些原生组件的行为，如 checkbox 的选中等，所以一旦滚动列表中有一些原生表单组件，推荐的做法是监听 tap 事件，如下。
    click: {
      type: Boolean,
      default: true,
    },
    // 数据
    dataInfo: {
      type: Array,
      default: null,
    },
    // 监听滑动
    listenScroll: {
      type: Boolean,
      default: false,
    },
    // 下拉到底部触发scrollToEnd
    pullup: {
      type: Boolean,
      default: false,
    },
    // 是否滑动的时候隐藏键盘
    beforeScroll: {
      type: Boolean,
      default: false,
    },
    // 初始化延时时间
    refreshDelay: {
      type: Number,
      default: 20,
    },
  },
  mounted() {
    // 初始化
    this._initScroll();
    // this.$watch("dataInfo", (newVal, oldVal) => {
    //   if (newVal.length > 0) {
    //     this.$nextTick(() => {          
    //       this.refresh();
    //     });
    //   }
    // });
  },
  methods: {
    // 初始化
    _initScroll() {
      BScroll.use(myPullUp);    
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true,
        pullUpLoad: true,
      });

      // this.scroll.on("pullingUp", () => {
      //   this.refresh();
      // });

      console.log("scroll obj==>" , this.scroll) // 初始化后打印scroll对象属性
      // 当需要监听滑动的时候
      if (this.listenScroll) {
        let self = this;
        this.scroll.on("scroll", (pos) => {
          self.$emit("scroll", pos);
        });
      }
      // 上拉到底部刷新数据
      if (this.pullup) { // suggest组件传递此属性
        this.scroll.on("scrollEnd", () => {
          // console.log(this.scroll.y)
          // console.log('max:' + (this.scroll.maxScrollY))
          //判断是否下拉到底，<=号右边的括号不能少
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit("scrollToEnd"); // 向suggest组件传递此事件
            // this.scroll.maxScrollY += 200
          }
        });
      }
      // 是否滑动的时候隐藏键盘
      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll"); // 向suggest组件传递此事件
        });
      }
      
    },
    // 方法代理
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    // 重置
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    // 滚动到
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    // 滚动到元素
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
  },
};
</script>

<style scoped lang="stylus" ></style>
