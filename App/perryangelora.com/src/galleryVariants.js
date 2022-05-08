const easing = [0.175, 0.85, 0.42, 0.96];

const galleryVariant = {
  galleryStart: {
    y:10,
    opacity: 0,
    transition: {
      ease: easing,
      duration: 0.4,
    }
  },
  galleryEnter: {
    y: 0,
    opacity: 1,
    transition: {
      ease: easing,
      duration: 0.4,
    }
  },
  galleryExit: {
    y: -10,
    opacity:0,
    transition: {
      ease: easing,
      duration: 0.3
    }
  }
};

module.exports = { galleryVariant };