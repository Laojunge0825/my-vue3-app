<template>
  <div ref="container" class="scene-container">
    <!-- 信息面板 -->
    <div class="info-panel">
      <h3>数据中心可视化</h3>
      <p>总共舱体: {{ cabinCount }} | 箱子: {{ boxCount }} | 组件: {{ packCount }}</p>
    </div>

    <!-- 工具提示组件 -->
    <ToolTip
      :visible="tooltip.visible"
      :x="tooltip.x"
      :y="tooltip.y"
      :title="tooltip.title"
      :content="tooltip.content"
    />
  </div>
</template>

<script setup lang="ts">
  /**
   * 数据中心3D可视化组件
   *
   * 实现了以下功能:
   * 1. 舱体(Cabin) -> 箱子(Box) -> 堆(Rack) -> 组(Pack) 的嵌套层级结构
   * 2. 鼠标悬停在组模型上时高亮显示
   * 3. 点击组模型时显示详细信息
   */
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import ToolTip from './components/ToolTip.vue'
  import { dataCenterData, transformDataToHierarchy, getTempColor } from './modelData'

  // 场景容器引用
  const container = ref<HTMLElement | null>(null)

  // 场景相关变量
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let controls: OrbitControls
  let raycaster: THREE.Raycaster
  let mouse: THREE.Vector2
  let packObjects: THREE.Mesh[] = [] // 存储所有Pack对象用于交互

  // 数据统计
  const cabinCount = computed(() => new Set(dataCenterData.map(item => item.cabinNo)).size)
  const boxCount = computed(() => {
    const uniqueBoxes = new Set()
    dataCenterData.forEach(item => uniqueBoxes.add(`${item.cabinNo}-${item.boxNo}`))
    return uniqueBoxes.size
  })
  const packCount = computed(() => dataCenterData.length)

  // 工具提示状态
  const tooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    content: {}
  })

  /**
   * 初始化Three.js场景
   */
  function initThree() {
    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff) // 设置为白色背景

    // 创建相机
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 70, 170) // 调整相机位置，增加高度和距离以更好地查看模型

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    container.value?.appendChild(renderer.domElement)

    // 创建轨道控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 50 // 设置最小缩放距离
    controls.maxDistance = 300 // 设置最大缩放距离
    controls.maxPolarAngle = Math.PI * 0.85 // 限制垂直旋转角度，防止相机移到模型下方
    controls.enablePan = true // 启用平移

    // 创建光源
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7) // 增强环境光强度
    scene.add(ambientLight)

    // 平行光模拟太阳光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(50, 100, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 10
    directionalLight.shadow.camera.far = 200
    directionalLight.shadow.camera.left = -50
    directionalLight.shadow.camera.right = 50
    directionalLight.shadow.camera.top = 50
    directionalLight.shadow.camera.bottom = -50
    scene.add(directionalLight)

    // 地面模型已移除

    // 创建射线检测器
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    // 事件监听器
    window.addEventListener('resize', onWindowResize)
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('click', onClick)
  }

  /**
   * 创建数据中心模型
   * 构建舱体->箱子->堆->组的嵌套层级结构
   */
  function createDataCenterModel() {
    // 将扁平数据转换为层级结构
    const hierarchy = transformDataToHierarchy()

    let cabinXOffset = 0
    const baseYOffset = 25 // 添加基础Y轴偏移，使模型整体向上移动
    const cabinSpacing = 60 // 舱体之间的固定最小间距

    // 遍历舱体
    hierarchy.forEach((cabinMap, cabinNo) => {
      // 创建舱体组
      const cabinGroup = new THREE.Group()
      cabinGroup.name = `cabin-${cabinNo}`
      cabinGroup.position.set(cabinXOffset, baseYOffset, 0) // 应用Y轴偏移

      // 计算当前舱体的实际宽度
      const cabinWidth = 50 * cabinMap.size + 5

      // 创建舱体外壳
      const cabinOuterGeometry = new THREE.BoxGeometry(cabinWidth, 55, 50)
      const cabinOuterMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff, // 白色
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      })
      const cabinOuter = new THREE.Mesh(cabinOuterGeometry, cabinOuterMaterial)
      cabinOuter.position.set(cabinWidth / 2 - 25, 0, 0) // 调整外壳位置使其包围所有箱子
      cabinGroup.add(cabinOuter)

      let boxXOffset = 0
      const boxSpacing = 8 // 箱子之间的间距

      // 遍历箱子
      cabinMap.forEach((boxMap, boxNo) => {
        // 创建箱子组
        const boxGroup = new THREE.Group()
        boxGroup.name = `box-${cabinNo}-${boxNo}`
        boxGroup.position.set(boxXOffset, 0, 0)

        // 箱子尺寸
        const boxWidth = 45

        // 创建箱子外壳
        const boxOuterGeometry = new THREE.BoxGeometry(boxWidth, 50, 45) // 适当减小箱子尺寸
        const boxOuterMaterial = new THREE.MeshPhongMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide
        })
        const boxOuter = new THREE.Mesh(boxOuterGeometry, boxOuterMaterial)
        boxGroup.add(boxOuter)

        // 调整堆模型在箱子内的分布方式
        let rackXOffset = -14 // 减小X轴偏移
        let rackZOffset = -14 // 减小Z轴偏移
        const rackWidthX = 16 // 堆的X轴宽度
        const rackWidthZ = 14 // 堆的Z轴宽度
        const rackSpacingX = 12 // 堆之间的X轴间距
        const rackSpacingZ = 16 // 堆之间的Z轴间距

        // 遍历堆
        boxMap.forEach((rackMap, rackNo) => {
          // 创建堆组
          const rackGroup = new THREE.Group()
          rackGroup.name = `rack-${cabinNo}-${boxNo}-${rackNo}`

          // 计算堆的位置，确保正确排列
          const row = Math.floor((rackNo - 1) / 2)
          const col = (rackNo - 1) % 2
          const xPos = rackXOffset + col * (rackWidthX + rackSpacingX) // 根据堆宽度和间距计算
          const zPos = rackZOffset + row * (rackWidthZ + rackSpacingZ) // 根据堆宽度和间距计算
          rackGroup.position.set(xPos, 0, zPos)

          // 创建堆外壳
          const rackOuterGeometry = new THREE.BoxGeometry(rackWidthX, 40, rackWidthZ) // 使用变量定义尺寸
          const rackOuterMaterial = new THREE.MeshPhongMaterial({
            color: 0x44ff44,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
          })
          const rackOuter = new THREE.Mesh(rackOuterGeometry, rackOuterMaterial)
          rackGroup.add(rackOuter)

          // 调整堆内部组件的起始垂直位置，确保在堆内部完全可见
          let packYOffset = -14 // 修改了初始垂直位置
          const packHeight = 3 // 组的高度
          const packSpacing = 3 // 组之间的垂直间距

          // 遍历组
          rackMap.forEach((packData, packNo) => {
            // 创建组(服务器)
            const packWidth = 14 // 组的宽度
            const packDepth = 12 // 组的深度
            const packGeometry = new THREE.BoxGeometry(packWidth, packHeight, packDepth) // 使用变量定义尺寸
            const packMaterial = new THREE.MeshStandardMaterial({
              color: getTempColor(packData.t),
              metalness: 0.6,
              roughness: 0.2
            })

            const packMesh = new THREE.Mesh(packGeometry, packMaterial)
            packMesh.name = `pack-${cabinNo}-${boxNo}-${rackNo}-${packNo}`
            packMesh.position.y = packYOffset

            // 存储数据到用户数据
            packMesh.userData = {
              ...packData,
              type: 'pack',
              originalColor: packMaterial.color.clone()
            }

            // 添加到数组以便交互
            packObjects.push(packMesh)

            rackGroup.add(packMesh)
            packYOffset += packHeight + packSpacing // 动态计算下一个组的位置
          })

          boxGroup.add(rackGroup)
        })

        cabinGroup.add(boxGroup)
        boxXOffset += boxWidth + boxSpacing // 根据箱子宽度和间距动态计算下一个箱子位置
      })

      scene.add(cabinGroup)

      // 根据当前舱体的宽度计算下一个舱体的起始位置
      // 当前舱体宽度 + 固定间距
      cabinXOffset += cabinWidth + cabinSpacing
    })
  }

  /**
   * 窗口大小调整处理
   */
  function onWindowResize() {
    if (!camera || !renderer) return

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  /**
   * 鼠标移动处理
   * @param event 鼠标事件
   */
  function onMouseMove(event: MouseEvent) {
    // 清除之前的高亮
    resetHighlight()

    // 计算鼠标归一化坐标
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // 执行射线检测
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(packObjects)

    if (intersects.length > 0) {
      const intersected = intersects[0].object as THREE.Mesh
      const userData = intersected.userData

      // 只处理组(Pack)对象
      if (userData.type === 'pack') {
        // 设置高亮
        setHighlight(intersected)

        // 显示工具提示
        tooltip.value = {
          visible: true,
          x: event.clientX + 15,
          y: event.clientY + 15,
          title: `Pack #${userData.packNo}`,
          content: {
            '舱体(Cabin)': userData.cabinNo,
            '箱子(Box)': userData.boxNo,
            '堆(Rack)': userData.rackNo,
            '组(Pack)': userData.packNo,
            温度: `${userData.t}°C`
          }
        }
      } else {
        // 如果不是组对象，隐藏工具提示
        tooltip.value.visible = false
      }
    } else {
      // 没有相交，隐藏工具提示
      tooltip.value.visible = false
    }
  }

  /**
   * 点击事件处理
   * @param event 鼠标事件
   */
  function onClick(event: MouseEvent) {
    // 计算鼠标归一化坐标
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // 执行射线检测
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(packObjects)

    if (intersects.length > 0) {
      const intersected = intersects[0].object as THREE.Mesh
      const userData = intersected.userData

      // 只处理组(Pack)对象
      if (userData.type === 'pack') {
        console.log('Clicked Pack:', userData)
        // 可以添加点击后的其他操作，如弹出更详细的信息面板
      }
    }
  }

  /**
   * 设置高亮效果
   * @param object 要高亮的对象
   */
  function setHighlight(object: THREE.Mesh) {
    const material = object.material as THREE.MeshStandardMaterial
    // 保存原始颜色到用户数据
    object.userData.originalEmissive = material.emissive.clone()
    // 设置发光效果
    material.emissive.set(0x444444)
    // 添加光晕效果
    object.scale.set(1.05, 1.05, 1.05)
  }

  /**
   * 清除所有对象的高亮效果
   */
  function resetHighlight() {
    // 遍历所有组对象，重置发光和缩放
    packObjects.forEach(object => {
      const material = object.material as THREE.MeshStandardMaterial
      if (object.userData.originalEmissive) {
        material.emissive.copy(object.userData.originalEmissive)
      } else {
        material.emissive.set(0x000000)
      }
      object.scale.set(1, 1, 1)
    })
  }

  /**
   * 动画循环
   */
  function animate() {
    requestAnimationFrame(animate)

    // 更新控制器
    controls.update()

    // 渲染场景
    renderer.render(scene, camera)
  }

  /**
   * 设置初始相机动画
   * 自动将相机旋转到一个更好的观察位置
   */
  function setupInitialCameraAnimation() {
    // 将相机放置在侧面
    camera.position.set(160, 90, 0)
    // 设置相机目标点，针对调整后的模型位置
    controls.target.set(55, 25, 0)
    controls.update()

    // 创建动画定时器
    let animationStep = 0
    const totalSteps = 120 // 动画总帧数

    function animateCamera() {
      animationStep++

      // 计算相机新位置
      const angle = (Math.PI / 2) * (1 - animationStep / totalSteps)
      const radius = 180 // 增加半径以便能够看到更多模型

      // 计算X和Z坐标，让相机从侧面旋转到正面
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)

      // 更新相机位置
      camera.position.set(x, 75, z) // 增加相机高度
      controls.update()

      // 如果动画未完成，继续
      if (animationStep < totalSteps) {
        requestAnimationFrame(animateCamera)
      }
    }

    // 启动动画
    animateCamera()
  }

  // 生命周期钩子
  onMounted(() => {
    // 初始化Three.js场景
    initThree()

    // 创建数据中心模型
    createDataCenterModel()

    // 设置相机初始动画
    setupInitialCameraAnimation()

    // 启动动画循环
    animate()
  })

  onUnmounted(() => {
    // 移除事件监听器
    window.removeEventListener('resize', onWindowResize)
    if (renderer) {
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('click', onClick)
    }

    // 释放资源
    if (renderer) {
      renderer.dispose()
    }

    // 清除引用
    packObjects = []
  })
</script>

<style scoped>
  .scene-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .info-panel {
    position: absolute;
    top: 20px;
    right: 20px;
    max-width: 200px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    z-index: 10;
  }

  .info-panel h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    color: #4a9eff;
  }

  .info-panel p {
    margin: 5px 0;
    font-size: 14px;
  }
</style>
