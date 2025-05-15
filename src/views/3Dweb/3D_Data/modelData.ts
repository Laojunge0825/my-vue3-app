/**
 * 数据中心模型数据
 * 描述了舱体、箱子、堆、组的层级结构
 */
export interface DataCenterItem {
  cabinNo: number // 舱体编号
  boxNo: number // 箱子编号
  rackNo: number // 堆编号
  packNo: number // 组编号
  t: number // 温度值
}

/**
 * 数据中心样本数据
 */
export const dataCenterData: DataCenterItem[] = [
  {
    cabinNo: 1,
    boxNo: 1,
    rackNo: 1,
    packNo: 1,
    t: 28.0
  },
  {
    cabinNo: 1,
    boxNo: 1,
    rackNo: 1,
    packNo: 2,
    t: 28.0
  },
  {
    cabinNo: 1,
    boxNo: 1,
    rackNo: 2,
    packNo: 1,
    t: 18.0
  },
  {
    cabinNo: 1,
    boxNo: 1,
    rackNo: 2,
    packNo: 2,
    t: 20.0
  },
  {
    cabinNo: 1,
    boxNo: 1,
    rackNo: 3,
    packNo: 1,
    t: 18.0
  },
  {
    cabinNo: 1,
    boxNo: 1,
    rackNo: 3,
    packNo: 2,
    t: 18.0
  },
  {
    cabinNo: 1,
    boxNo: 2,
    rackNo: 1,
    packNo: 1,
    t: 18.0
  },
  {
    cabinNo: 1,
    boxNo: 2,
    rackNo: 1,
    packNo: 2,
    t: 28.0
  },
  {
    cabinNo: 1,
    boxNo: 2,
    rackNo: 2,
    packNo: 1,
    t: 28.0
  },
  {
    cabinNo: 1,
    boxNo: 2,
    rackNo: 2,
    packNo: 2,
    t: 18.0
  },
  {
    cabinNo: 1,
    boxNo: 3,
    rackNo: 1,
    packNo: 1,
    t: 28.0
  },
  {
    cabinNo: 1,
    boxNo: 3,
    rackNo: 1,
    packNo: 2,
    t: 21.0
  },
  {
    cabinNo: 1,
    boxNo: 3,
    rackNo: 2,
    packNo: 1,
    t: 20.0
  },
  {
    cabinNo: 1,
    boxNo: 3,
    rackNo: 2,
    packNo: 2,
    t: 18.0
  },
  {
    cabinNo: 2,
    boxNo: 1,
    rackNo: 1,
    packNo: 1,
    t: 16.0
  },
  {
    cabinNo: 2,
    boxNo: 1,
    rackNo: 1,
    packNo: 2,
    t: 28.0
  },
  {
    cabinNo: 2,
    boxNo: 1,
    rackNo: 2,
    packNo: 1,
    t: 19.0
  },
  {
    cabinNo: 2,
    boxNo: 1,
    rackNo: 2,
    packNo: 2,
    t: 21.0
  },
  {
    cabinNo: 2,
    boxNo: 2,
    rackNo: 1,
    packNo: 1,
    t: 28.0
  },
  {
    cabinNo: 2,
    boxNo: 2,
    rackNo: 1,
    packNo: 2,
    t: 28.0
  },
  {
    cabinNo: 2,
    boxNo: 2,
    rackNo: 2,
    packNo: 1,
    t: 30.0
  },
  {
    cabinNo: 2,
    boxNo: 2,
    rackNo: 2,
    packNo: 2,
    t: 36.0
  },
  {
    cabinNo: 2,
    boxNo: 2,
    rackNo: 2,
    packNo: 3,
    t: 25.0
  },
  {
    cabinNo: 2,
    boxNo: 2,
    rackNo: 2,
    packNo: 4,
    t: 16.0
  }
]

/**
 * 将扁平数据转换为层级结构
 * @returns 层级结构的数据
 */
export function transformDataToHierarchy() {
  const hierarchy = new Map()

  // 构建嵌套结构
  dataCenterData.forEach(item => {
    // 处理舱体层级
    if (!hierarchy.has(item.cabinNo)) {
      hierarchy.set(item.cabinNo, new Map())
    }
    const cabin = hierarchy.get(item.cabinNo)

    // 处理箱子层级
    if (!cabin.has(item.boxNo)) {
      cabin.set(item.boxNo, new Map())
    }
    const box = cabin.get(item.boxNo)

    // 处理堆层级
    if (!box.has(item.rackNo)) {
      box.set(item.rackNo, new Map())
    }
    const rack = box.get(item.rackNo)

    // 存储组对象
    rack.set(item.packNo, {
      packNo: item.packNo,
      t: item.t,
      cabinNo: item.cabinNo,
      boxNo: item.boxNo,
      rackNo: item.rackNo
    })
  })

  return hierarchy
}

/**
 * 获取温度对应的颜色
 * @param temp 温度值
 * @returns 对应颜色的十六进制值
 */
export function getTempColor(temp: number) {
  // 定义温度颜色区间
  const tempRanges = [
    { min: 0, max: 20, color: 0x0000ff }, // 蓝色 - 低温
    { min: 20, max: 25, color: 0x00ff00 }, // 绿色 - 正常温度
    { min: 25, max: 30, color: 0xffff00 }, // 黄色 - 偏高温度
    { min: 30, max: 100, color: 0xff0000 } // 红色 - 高温
  ]

  // 确保温度值有效
  const validTemp = Number.isFinite(temp) ? temp : 25

  // 查找匹配的温度区间
  const matchedRange = tempRanges.find(range => validTemp >= range.min && validTemp <= range.max)

  // 返回匹配的颜色或默认灰色
  return matchedRange?.color || 0x888888
}
