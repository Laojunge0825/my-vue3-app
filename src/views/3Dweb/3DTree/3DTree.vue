<template>
    <ThreeTree :tree-data="sampleData" />
  </template>
  
  <script setup>
  import ThreeTree from './components/ThreeTree.vue';
  import { ref } from 'vue';
  
  // 直接在组件中定义模拟数据
  const sampleData = ref({
    id: 1,
    name: 'Root',
    children: [
      { 
        id: 2, 
        name: 'Branch 1',
        children: [
          { 
            id: 4, 
            name: 'Leaf 1-1',
            children: [
              { id: 8, name: 'Leaf 1-1-1', temperature: 18 },
              { id: 9, name: 'Leaf 1-1-2', temperature: 19.4 }
            ],
            temperature: 31.2 // 自动计算子节点最高温度
          },
          { id: 5, name: 'Leaf 1-2', temperature: 19.8 },
          { id: 12, name: 'Leaf 1-3', temperature: 30.4 },
          { id: 13, name: 'Leaf 1-4', temperature: 26.4 },
          { id: 14, name: 'Leaf 1-5', temperature: 22.4 },
          { id: 15, name: 'Leaf 1-6', temperature: 20.4 },
          { id: 16, name: 'Leaf 1-7', temperature: 21.4 },
        ],
        temperature: 31.2 // 自动计算子节点最高温度
      },
      { 
        id: 3,
        name: 'Branch 2',
        children: [
          { 
            id: 6,
            name: 'Leaf 2-1',
            children: [
              { id: 10, name: 'Leaf 2-1-1', temperature: 27.9 },
              { id: 11, name: 'Leaf 2-1-2', temperature: 33.4 }
            ],
            temperature: 33.4 // 自动计算子节点最高温度
          },
          { id: 7, name: 'Leaf 2-2', temperature: 30.1 }
        ],
        temperature: 33.4 // 自动计算子节点最高温度
      }
    ],
    temperature: 33.4 // 根节点显示全树最高温度
  });
  
  // 温度颜色映射函数
  const tempColorRanges = [
    { min: 18, max: 25, color: 0x0000ff }, // 蓝色
    { min: 25, max: 28, color: 0x00ff00 }, // 绿色
    { min: 28, max: 30, color: 0xffff00 }, // 黄色
    { min: 30, max: 35, color: 0xff0000 }  // 红色
  ];
  
  const getTempColor = (temp) => {
    const range = tempColorRanges.find(r => temp >= r.min && temp <= r.max);
    return range?.color || 0x888888;
  };
  
  // 温度计算函数
  const calculateMaxTemperature = (node) => {
    if (!node.children) return node.temperature;
  
    let maxTemp = -Infinity;
    node.children.forEach(child => {
      const childTemp = calculateMaxTemperature(child);
      maxTemp = Math.max(maxTemp, childTemp);
    });
  
    node.temperature = maxTemp;
    return maxTemp;
  };
  
  // 初始化时计算所有节点的温度
  calculateMaxTemperature(sampleData.value);
  </script>