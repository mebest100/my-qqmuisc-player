<template>
  <!-- 歌手页面 -->
  <scroll
    class="listview"
    :dataInfo="singers"
    :listenScroll="listenScroll"
    ref="listview"
    :probeType="probeType"
    @scroll="scroll"
  >
    <!-- 歌手列表 -->
    <ul>
      <li
        v-for="(group, index) in singers"
        :key="index"
        class="list-group"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            v-for="(item, index) in group.items"
            :key="index"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <img v-lazy="item.avatar" alt="" class="avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧入口 -->
    <!-- onShortcutTouchStart 对应鼠标点击时左边列表滚动
    onShortcutTouchMove对应鼠标滑动时左边列表滚动 -->
    <div
      @touchstart="onShortcutTouchStart"
      class="list-shortcut"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <!-- data-index是自定义html属性, 左右联动实际是通过currentIndex来控制的，
        因为只有currentIndex === index时字母才高亮 -->
        <li
          v-for="(item, index) in shortcutList"
          :key="index"
          class="item"
          :data-index="index"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import { getData } from "common/js/dom";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  props: {
    // 父组件传递属性
    singers: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    // 子组件本地属性
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
    };
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  components: {
    Scroll,
  },
  computed: {
    // 返回右侧快速入口A-Z
    shortcutList() {
      return this.singers.map((group) => {
        return group.title.substr(0, 1);
      });
    },
    // 计算标题显示
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.singers[this.currentIndex]
        ? this.singers[this.currentIndex].title
        : "";
    },
  },
  methods: {
    // 点击
    onShortcutTouchStart(e) {
      // 获取右侧快速入口的data-index属性的值，也就是歌手列表的索引值
      let anchorIndex = getData(e.target, "index");
      // 获取滑动起点的Y坐标值
      let firstTouch = e.touches[0]; // 计算滑动距离，首先需要有一个touch对象
      this.touch.y1 = firstTouch.pageY; // touch.y1对应当前函数不是必须的，但是对于计算鼠标移动距离却是需要的，
      // 因为需要touch.y1标注鼠标移动的初始位置

      this.touch.anchorIndex = anchorIndex; // 构造this.touch.anchorIndex的目的也是记录滑动起点对应的dom元素索引
      this._scrollTo(this.touch.anchorIndex); // 因为这样当鼠标移动结束时，就能增量计算dom元素的索引
    },
    // 移动
    onShortcutTouchMove(e) {
      let endTouch = e.touches[0];
      this.touch.y2 = endTouch.pageY; // 记录鼠标滑动结束的位置

      // 移动的距离 / 每个元素的高度 = 移动了几个元素
      let distance = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + distance;
      this._scrollTo(anchorIndex);
    },
    // 给父组件调用的，重置底部bottom
    refresh() {
      this.$refs.listview.scroll.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    // 移动到
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }

      this.scrollY = -this.listHeight[index];
      // scrollToElement方法继承自scroll.vue组件
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    // 计算每个分组的所在的高度
    _calulateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    // 子组件向父组件派发事件，让外部知道点击的是哪个条目
    selectItem(item) {
      this.$emit("select", item);
    },
  },
  watch: {
    singers(newVal, oldVal) {
      if (newVal.length > 0) {
        console.log("singer数据已就绪，数据长度为==>", newVal.length)
        // 歌手数据就绪时，才计算左边歌手列表的高度
        this.$nextTick(() => {  
          this._calulateHeight();        
          this.refresh();
          
        });
      }
    },
    // 根据分组所在的高度确定是第几个分组
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部继续往下拉，newY>0
      if (newY >= 0) {
        this.currentIndex = 0;
        return;
      }
      // 在两个相邻歌手分组之间滚动
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (!height2 || (-newY >= height1 && -newY < height2)) {
          this.currentIndex = i;
          // 滑动时标题栏呗覆盖处理
          this.diff = height2 + newY;
          // console.log(this.diff)
          return;
        }
      }
      this.currentIndex = 0;
    },
    // 监听diff
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px, 0)`;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: -1px;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
