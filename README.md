# simpleSwipe

实现一个简单的swipe，主要是提供思路。

大致流程

1.touchstart时，记录坐标
2.touchmove时，计算手指移动的距离，改变元素的transform或left
3.touchend时，判断是否应该滑到下一页，也就是判断是不是有效滑动。

目前只提供最基本的功能：图片滑动和item-icon的切换。希望能给大家带来帮助。

用法：

html结构

    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide"></div>
            <div class="swiper-slide"</div>
            <div class="swiper-slide"></div>
        </div>
    </div>

初始化

window.simpleSwipe(document.querySelector('.swiper-container'), 
{
  showIcon: true
});

