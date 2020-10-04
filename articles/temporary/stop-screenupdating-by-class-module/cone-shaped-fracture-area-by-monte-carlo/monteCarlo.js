class MonteCarlo {
  constructor () {
    this.innerPoints = []
    this.outerPoints = []
    this.area = 0
  }

  // 面積を求める領域を囲む長方形を求める
  boundingBox (shape) {
  	if (shape[0] === "and") {
      return shape.slice(1).map(this.boundingBox.bind(this))
        .reduce((p, c) => [
          Math.max(p[0], c[0]),
          Math.max(p[1], c[1]),
          Math.min(p[2], c[2]),
          Math.min(p[3], c[3])
        ])
  
    } else if (shape[0] === "or") {
      return shape.slice(1).map(this.boundingBox.bind(this))
        .reduce((p, c) => [
          Math.min(p[0], c[0]),
          Math.min(p[1], c[1]),
          Math.max(p[2], c[2]),
          Math.max(p[3], c[3])
        ])
    
    } else if (shape[0] === "rectangle") {
      return shape.slice(1)
    
    } else if (shape[0] === "circle") {
      return [
        shape[1] - shape[3],
        shape[2] - shape[3],
        shape[1] + shape[3],
        shape[2] + shape[3]
      ]
    }
  }

  // min～maxの実数乱数を生成する関数
  randBetween(min, max) {
  	return Math.random() * (max - min) + min
  }

  // 点が面積を求めたい図形の内側だったらtrueを返す
  // shapeデータが図形の組み合わせなので、再帰的にチェックする
  isInner (shape, point) {
  	if (shape[0] === "and") {
      for (let i = 1; i < shape.length; i++) {
        if (!this.isInner(shape[i], point)) return false
      }
      return true
  
    } else if (shape[0] === "or") {
      for (let i = 1; i < shape.length; i++) {
        if (this.isInner(shape[i], point)) return true
      }
      return false
    
    } else if (shape[0] === "rectangle") {
      return shape[1] <= point[0] && point[0] < shape[3]
        && shape[2] <= point[1] && point[1] < shape[4]
    
    } else if (shape[0] === "circle") {
      return (point[0] - shape[1]) ** 2 + (point[1] - shape[2]) ** 2
        <= shape[3] ** 2
    }
  }

  // 計算起点
	calc (digits, shape) {
    this.innerPoints = []
    this.outerPoints = []
    const imax = (10 ** digits) ** 2
    const [xmin, ymin, xmax, ymax] = this.boundingBox(shape)
  	let count = 0
    
    for (let i = 0; i < imax; i++) {
    	const point = [
    		this.randBetween(xmin, xmax),
    		this.randBetween(ymin, ymax)
      ]

      // 計算結果を図で表示したかったので、生成した点を図形内外で分けて保持している
      // 図にする必要が無ければ、次のように1行で済ませていい
      // if (this.isInner(shape, point)) this.count++
    	if (this.isInner(shape, point)) {
       	count++
        this.innerPoints.push(point)
      } else {
       	this.outerPoints.push(point)
      }
    }
  	this.area = this.roundDigits(
    	digits,
      (xmax - xmin) * (ymax - ymin) * count / imax
    )
  }
  
  // 面積を返すゲッター
  getArea () {
  	return this.area
  }

  // 生成した点を取り出すためのゲッター
  // 面積さえ求まればいいときは、不要
  getPoints () {
  	return {
    	inner: this.innerPoints,
      outer: this.outerPoints
    }
  }

  // 有効桁数に丸める処理
  roundDigits (digits, value) {
    if (value <= 0) return 0
    const n = Math.floor(Math.log10(value))
    const e = 10 ** (digits - n - 1)
    return Math.round(value * e) / e
  }
}

// ココから先は表示のためのコードなのであんまり関係ない
// ただし、vm.data.shapeは計算対象の形状データなので、これだけは必要
const SvgLine = {
  props: ['properties'],
  template: `<line
    :x1="properties.x1"
    :y1="properties.y1"
    :x2="properties.x2"
    :y2="properties.y2"
    stroke="#000"
  ></line>`
}

const SvgCircle = {
  props: ['properties'],
  template: `<circle
    :cx="properties.cx"
    :cy="properties.cy"
    :r="properties.r"
    :stroke="properties.color"
    fill="none"
  ></circle>`
}

const ShapeView = {
  props: [
  	'viewBox',
    'drawingData'
  ],
  components: {
    SvgLine,
    SvgCircle
  },
  template: `<svg width="800" height="600" :viewBox="viewBox">
    <component
      v-for="(v, k) in drawingData"
      :key="k"
      :is="'svg-' + v.type"
      :properties="v.properties"
    ></component>
  </svg>`
}

const vm = new Vue({
  el: '#app',
  components: {
    ShapeView
  },
  data: {
    area: 0,
    points: { inner: [], outer: [] },
    viewBox: "0 0 1 1",
    shape: [
    	"and",
      [
      	"or",
      	["rectangle", -500, -500, 500, 250]
      ],
      [
      	"or",
        ["circle", 100, 100, 300],
        ["circle", -100, 100, 300]
      ]
  	]
  },
  methods: {
    compute: function () {
      const mc = new MonteCarlo()
      mc.calc(3, this.shape)
    	this.area = mc.getArea()
      this.points = mc.getPoints()
    },
    drawingBoundingBox: function (shape) {
      if (shape[0] === "and") {
        return shape.slice(1).map(this.drawingBoundingBox).reduce((p, c) =>
          [Math.min(p[0], c[0]), Math.min(p[1], c[1]), Math.max(p[2], c[2]), Math.max(p[3], c[3])])
    
      } else if (shape[0] === "or") {
        return shape.slice(1).map(this.drawingBoundingBox).reduce((p, c) =>
          [Math.min(p[0], c[0]), Math.min(p[1], c[1]), Math.max(p[2], c[2]), Math.max(p[3], c[3])])
      
      } else if (shape[0] === "rectangle") {
        return shape.slice(1)
      
      } else if (shape[0] === "circle") {
        return [shape[1] - shape[3], shape[2] - shape[3], shape[1] + shape[3], shape[2] + shape[3]]
      }
    },
    buildDrawingData: function (shape) {
      if (shape[0] === "and") {
        return shape.slice(1).flatMap(this.buildDrawingData)
    
      } else if (shape[0] === "or") {
        return shape.slice(1).flatMap(this.buildDrawingData)
      
      } else if (shape[0] === "rectangle") {
        return [
          { type: "line", properties: { x1: shape[1], y1: -shape[2], x2: shape[3], y2: -shape[2] } },
          { type: "line", properties: { x1: shape[3], y1: -shape[2], x2: shape[3], y2: -shape[4] } },
          { type: "line", properties: { x1: shape[3], y1: -shape[4], x2: shape[1], y2: -shape[4] } },
          { type: "line", properties: { x1: shape[1], y1: -shape[4], x2: shape[1], y2: -shape[2] } }
        ]
      
      } else if (shape[0] === "circle") {
        return [
          { type: "circle", properties: { cx: shape[1], cy: -shape[2], r: shape[3], color: "#000" } }
        ]
      }
    },
    calcViewBox: function () {
      const vb = this.drawingBoundingBox(this.shape).map(v => v * 1.25)
    	return [vb[0], - vb[3], vb[2] - vb[0], vb[3] - vb[1]].join(" ")
    },
  },
  computed: {
    drawingData: function () {
      const dd = this.buildDrawingData(this.shape)
    	const pti = this.points.inner.slice(-5000).map(([x, y]) => ({ type: "circle", properties: { cx: x, cy: -y, r: 1, color: "#cf2104" } }))
      const pto = this.points.outer.slice(-1000).map(([x, y]) => ({ type: "circle", properties: { cx: x, cy: -y, r: 1, color: "#0421cf" } }))
      this.viewBox = this.calcViewBox()
      return [...dd, ...pti, ...pto]
    }
  },
  template: `<div>
    <button @click.prepend="compute">計算</button>
    <p>面積：{{area}}</p>
    <shape-view
      :viewBox="viewBox"
      :drawingData="drawingData"
    ></shape-view>
  </div>`
})