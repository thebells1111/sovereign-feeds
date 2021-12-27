export function longpress(node, [threshold, swiper]) {
  const handle_mousedown = () => {
    if (swiper) {
      swiper.allowSlideNext = false;
      swiper.allowSlidePrev = false;
    }
    let start = Date.now();

    const timeout = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longpress'));
    }, threshold);

    const cancel = () => {
      if (Date.now() - start < threshold) {
        node.dispatchEvent(new CustomEvent('shortpress'));
      }
      clearTimeout(timeout);
      node.removeEventListener('mouseup', cancel);
      node.removeEventListener('touchend', cancel);
    };

    node.addEventListener('mouseup', cancel);
    node.addEventListener('touchend', cancel);
  };

  node.addEventListener('mousedown', handle_mousedown);
  node.addEventListener('touchstart', handle_mousedown);

  return {
    update([newThreshold, newSwiper]) {
      threshold = newThreshold;
      swiper = newSwiper;
    },
    destroy() {
      node.removeEventListener('mousedown', handle_mousedown);
      node.removeEventListener('touchstart', handle_mousedown);
    },
  };
}
