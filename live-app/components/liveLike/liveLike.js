const queue = {};
let timer = 0;
let canvas = null;
let ctx = null;
const WIDTH = 90;
const HEIGHT = 300;
const badges = {};

Component({
  properties: {
    likeCount: {
      type: Number,
      value: 0,
      observer: "likeChange"
    }
  },
  methods: {
    likeChange(newVal, oldVal) {
      if (newVal - oldVal > 0) {
        this.likeClick();
      }
    },

    likeClick() {
      const image1 = "./images/bg1.png";
      const image2 = "./images/bg2.png";
      const image3 = "./images/bg3.png";
      const image4 = "./images/bg4.png";
      const image5 = "./images/bg5.png";
      const image6 = "./images/bg6.png";
      const anmationData = {
        id: new Date().getTime(),
        timer: 0,
        opacity: 0,
        pathData: this.generatePathData(),
        image: [image1, image2, image3, image4, image5, image6],
        imageIndex: Math.floor(Math.random() * (5 - 0 + 1)) + 0,
        factor: {
          speed: 0.01, // 运动速度，值越小越慢
          t: 0 //  贝塞尔函数系数
        }
      };
      if (Object.keys(queue).length > 0) {
        queue[anmationData.id] = anmationData;
      } else {
        queue[anmationData.id] = anmationData;
        this.bubbleAnimate();
      }
    },

    getRandom(min, max) {
      return Math.random() * (max - min) + min;
    },

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    generatePathData() {
      const p0 = {
        x: 40,
        y: 400
      };
      const p1 = {
        x: this.getRandom(20, 30),
        y: this.getRandom(200, 300)
      };
      const p2 = {
        x: this.getRandom(0, 80),
        y: this.getRandom(100, 200)
      };
      const p3 = {
        x: this.getRandom(0, 80),
        y: this.getRandom(0, 50)
      };
      return [p0, p1, p2, p3];
    },

    updatePath(data, factor) {
      const p0 = data[0]; // 三阶贝塞尔曲线起点坐标值
      const p1 = data[1]; // 三阶贝塞尔曲线第一个控制点坐标值
      const p2 = data[2]; // 三阶贝塞尔曲线第二个控制点坐标值
      const p3 = data[3]; // 三阶贝塞尔曲线终点坐标值

      const t = factor.t;

      /*计算多项式系数*/
      const cx1 = 3 * (p1.x - p0.x);
      const bx1 = 3 * (p2.x - p1.x) - cx1;
      const ax1 = p3.x - p0.x - cx1 - bx1;

      const cy1 = 3 * (p1.y - p0.y);
      const by1 = 3 * (p2.y - p1.y) - cy1;
      const ay1 = p3.y - p0.y - cy1 - by1;

      /*计算xt yt的值 */
      const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x;
      const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y;
      return {
        x,
        y
      };
    },
    bubbleAnimate() {
      Object.keys(queue).forEach(key => {
        const anmationData = queue[+key];
        const {
          x,
          y
        } = this.updatePath(
          anmationData.pathData,
          anmationData.factor
        );
        const speed = anmationData.factor.speed;
        anmationData.factor.t += speed;
        // console.log('imageIndex=>', anmationData.imageIndex);
        // ctx.drawImage(anmationData.image[anmationData.imageIndex], x, y, 40, 40);

        const image = canvas.createImage();
        image.onload = () => {
          ctx.drawImage(image, x, y, 40, 40)
        }
        image.src = anmationData.image[anmationData.imageIndex];

        if (anmationData.factor.t > 1) {
          delete queue[anmationData.id];
        }
      });
      // ctx.draw();
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (Object.keys(queue).length > 0) {
        timer = setTimeout(() => {
          this.bubbleAnimate();
        }, 20);
      } else {
        clearTimeout(timer);
        const query = wx.createSelectorQuery().in(this);
        query.select('#bubble')
          .fields({
            node: true,
            size: true
          })
          .exec((res) => {
            // canvas = res[0].node
            // ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
          })


        // ctx.draw(); // 清空画面
      }
    }
  },

  ready() {
    // ctx = wx.createCanvasContext("bubble", this);

    const query = wx.createSelectorQuery().in(this);
    query.select('#bubble')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        canvas = res[0].node
        ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      })
  },

  detached() {
    if (timer) {
      clearTimeout(timer);
    }
  }
});