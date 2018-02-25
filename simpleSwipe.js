(function() {
  function simpleSwipe(container, options) {
    if (!container) return;

    options = options || {};
    var element = container.children[0];
    var itemLen = element.querySelectorAll(".swiper-slide").length;
    var itemWidth = container.offsetWidth;
    var showIcon = options.showIcon;
    var speed = options.speed || 300;
    var oldActiveIndex = 0;
    var isScrolling; //页面是否正在滚动

    if (!!showIcon) {
      createIconList();
      activeIcon();
    }

    var style = element.style,
      transform = "transform" in style ? "transform" : "webkitTransform",
      transitionDuration =
        "transitionDuration" in style
          ? "transitionDuration"
          : "webkitTransitionDuration";

    var curItem = 0; //当前显示的item

    var start = {},
      delta = {};

    function itemAdd() {
      curItem = Math.min(curItem + 1, itemLen - 1);
    }

    function itemMius() {
      curItem = Math.max(curItem - 1, 0);
    }

    function curMove() {
      return -curItem * itemWidth;
    }

    function createIconList() {
      var fragment = document.createDocumentFragment(),
        swiperItem = document.createElement("div"),
        tempNode;
      swiperItem.classList.add("swiper-item");
      fragment.appendChild(swiperItem);
      for (var i = 0; i < itemLen; i++) {
        tempNode = document.createElement("div");
        tempNode.classList.add("swiper-item-icon");
        swiperItem.appendChild(tempNode);
      }
      container.appendChild(fragment);
    }

    function activeIcon(index) {
      if (oldActiveIndex == index) {
        return;
      }
      index = index == undefined ? 0 : index;
      var swiperItemIcon = container.querySelector(".swiper-item").children;
      swiperItemIcon[oldActiveIndex].classList.remove("active");
      swiperItemIcon[index].classList.add("active");
      oldActiveIndex = index;
    }

    var events = {
      handleEvent: function(e) {
        switch (e.type) {
          case "touchstart":
            this.start(e);
            break;
          case "touchmove":
            this.move(e);
            break;
          case "touchend":
            this.end(e);
            break;
        }
      },

      start: function(e) {
        var touches = e.touches[0];

        start = {
          x: touches.pageX,
          y: touches.pageY,

          time: +new Date()
        };

        delta = {};

        isScrolling = void 0;

        style[transitionDuration] = "";

        element.addEventListener("touchmove", this, false);
        element.addEventListener("touchend", this, false);
      },

      move: function(e) {
        //判断多手指触摸，return
        if (e.touches[0].length > 1) return;

        var touches = e.touches[0];

        delta = {
          x: touches.pageX - start.x,
          y: touches.pageY - start.y
        };

        //当页面滚动时，swipe就不滚动了,或者 当swipe滚动时，页面就不滚动了
        if (isScrolling === undefined) {
          isScrolling = !!(
            isScrolling || Math.abs(delta.x) < Math.abs(delta.y)
          );
        }

        if (!isScrolling) {
          e.preventDefault(); //阻止页面滚动

          //如果第一个
          //或者最后一个
          if (
            (curItem == 0 && delta.x > 0) ||
            (curItem == itemLen - 1 && delta.x < 0)
          ) {
            //到边界阻止滑动
            //delta.x = 0;

            delta.x /= 3;
          }

          var moveX = delta.x + curMove();

          style[transform] = "translate3d(" + moveX + "px, 0, 0)";
        }
      },

      end: function(e) {
        var duration = +new Date() - start.time;

        var isValidSlide =
          (duration < 260 && Math.abs(delta.x) < 80) ||
          Math.abs(delta.x) > itemWidth / 3;

        //方向
        //小于0 -- 手指左滑
        //大于0 -- 手指右滑
        //等于0 -- 说明未滑动，或者
        var direction = delta.x < 0;

        if (isValidSlide && delta.x != 0) {
          if (direction) {
            itemAdd();
          } else {
            itemMius();
          }
        }

        style[transform] = "translate3d(" + curMove() + "px, 0, 0)";
        style[transitionDuration] = speed + "ms";

        !!showIcon && activeIcon(curItem);

        element.removeEventListener("touchmove", this, false);
        element.removeEventListener("touchend", this, false);
      }
    };

    element.addEventListener("touchstart", events, false);
  }

  window.simpleSwipe = simpleSwipe;
})();
