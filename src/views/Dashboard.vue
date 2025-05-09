<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">工作台</h1>
    <div class="dashboard-content">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card title="总访问量" :bordered="false">
            <template #extra>
              <a-tag color="blue">日</a-tag>
            </template>
            <p class="card-value">8,846</p>
            <p class="card-footer">
              <span>较昨日</span>
              <a-tag color="green"> <arrow-up-outlined /> 12% </a-tag>
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card title="用户总数" :bordered="false">
            <template #extra>
              <a-tag color="purple">总</a-tag>
            </template>
            <p class="card-value">1,245</p>
            <p class="card-footer">
              <span>较上周</span>
              <a-tag color="green"> <arrow-up-outlined /> 5.6% </a-tag>
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card title="订单量" :bordered="false">
            <template #extra>
              <a-tag color="cyan">月</a-tag>
            </template>
            <p class="card-value">2,356</p>
            <p class="card-footer">
              <span>较上月</span>
              <a-tag color="red"> <arrow-down-outlined /> 2.3% </a-tag>
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card title="成交额" :bordered="false">
            <template #extra>
              <a-tag color="gold">年</a-tag>
            </template>
            <p class="card-value">¥ 328,560</p>
            <p class="card-footer">
              <span>目标完成</span>
              <a-tag color="green">67%</a-tag>
            </p>
          </a-card>
        </a-col>
      </a-row>

      <div class="section">
        <a-card title="待办事项" :bordered="false">
          <a-list size="large">
            <a-list-item>
              <a-checkbox>完成第一季度数据分析报告</a-checkbox>
            </a-list-item>
            <a-list-item>
              <a-checkbox>处理用户反馈问题</a-checkbox>
            </a-list-item>
            <a-list-item>
              <a-checkbox>优化系统性能</a-checkbox>
            </a-list-item>
          </a-list>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'

  export default defineComponent({
    name: 'Dashboard',
    components: {
      ArrowUpOutlined,
      ArrowDownOutlined
    },
    setup() {
      return {}
    }
  })
</script>

<style scoped>
  .dashboard-container {
    padding: 0;
  }

  .dashboard-title {
    font-size: 24px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 20px;
  }

  .dashboard-content {
    width: 100%;
  }

  .card-value {
    font-size: 28px;
    font-weight: bold;
    margin: 16px 0;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(0, 0, 0, 0.45);
  }

  .section {
    margin-top: 24px;
  }
</style>
