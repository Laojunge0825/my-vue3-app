<template>
  <div class="tree-container">
    <a-card title="Vue3 Tree 组件示例" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showAddModal = true">
          <template #icon><plus-outlined /></template>
          新增节点
        </a-button>
        <a-button style="margin-left: 8px" @click="fetchOrgTreeData">
          <template #icon><reload-outlined /></template>
          刷新数据
        </a-button>
      </template>

      <a-row>
        <a-card title="组织树" class="inner-card">
          <div class="tree-org-container">
            <a-spin :spinning="loading">
              <vue3-tree-org
                v-if="treeData"
                :data="treeData"
                :props="{ id: 'id', pid: 'pid', label: 'label', children: 'children' }"
                :center="true"
                :scalable="false"
                :toolBar="{ scale: false, expand: false, fullScreen: false, zoom: false }"
                :node-draggable="true"
                :draggable="true"
                :horizontal="true"
                :collapsable="true"
              >
              </vue3-tree-org>
              <div v-else class="empty-tree">
                <a-empty description="暂无组织数据" />
              </div>
            </a-spin>
          </div>
        </a-card>
      </a-row>
      <a-row>
        <a-card title="节点详情" class="inner-card">
          <a-empty v-if="!currentNode" description="请选择一个节点查看详情" />
          <div v-else>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="节点ID">{{
                currentNode.id || currentNode.key
              }}</a-descriptions-item>
              <a-descriptions-item label="节点名称">{{
                currentNode.label || currentNode.title
              }}</a-descriptions-item>
              <a-descriptions-item label="创建时间">{{
                currentNode.createTime || '2023-04-01 12:00:00'
              }}</a-descriptions-item>
              <a-descriptions-item label="更新时间">{{
                currentNode.updateTime || '2023-04-01 12:00:00'
              }}</a-descriptions-item>
            </a-descriptions>
          </div>
        </a-card>
      </a-row>
    </a-card>

    <!-- 添加节点弹窗 -->
    <a-modal
      :open="showAddModal"
      title="添加节点"
      @update:open="updateAddModalVisible"
      @ok="confirmAdd"
      @cancel="cancelAdd"
    >
      <a-form>
        <a-form-item label="父节点">
          <span>{{ addForm.parentKey ? getNodeNameById(addForm.parentKey) : '根节点' }}</span>
        </a-form-item>
        <a-form-item label="节点名称">
          <a-input
            :value="addForm.title"
            @update:value="updateAddFormTitle"
            placeholder="请输入节点名称"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑节点弹窗 -->
    <a-modal
      :open="showEditModal"
      title="编辑节点"
      @update:open="updateEditModalVisible"
      @ok="confirmEdit"
      @cancel="cancelEdit"
    >
      <a-form>
        <a-form-item label="节点名称">
          <a-input
            :value="editForm.title"
            @update:value="updateEditFormTitle"
            placeholder="请输入节点名称"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue'
  import { OrgTreeApi } from '../api'
  import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import 'vue3-tree-org/lib/vue3-tree-org.css'

  // 定义类型
  interface TreeNode {
    id: string
    label: string
    children?: TreeNode[]
    [key: string]: any
  }

  export default defineComponent({
    components: {
      PlusOutlined,
      EditOutlined,
      DeleteOutlined,
      ReloadOutlined
    },

    setup() {
      // 加载状态
      const loading = ref(false)

      // 树形数据
      const treeData = ref<TreeNode>()

      // 当前选中节点
      const selectedNodeId = ref<string | null>(null)
      const currentNode = ref<TreeNode | null>(null)

      // 展开和选中的键
      const expandedKeys = ref<string[]>([])
      const selectedKeys = ref<string[]>([])

      // 添加节点表单
      const showAddModal = ref(false)
      const addForm = reactive({
        parentKey: null as string | null,
        title: ''
      })

      // 编辑节点表单
      const showEditModal = ref(false)
      const editForm = reactive({
        key: '',
        title: ''
      })

      /**
       * 处理Modal visible状态变化
       */
      const updateAddModalVisible = (val: boolean) => {
        showAddModal.value = val
      }

      const updateEditModalVisible = (val: boolean) => {
        showEditModal.value = val
      }

      /**
       * 处理Input值变化
       */
      const updateAddFormTitle = (val: string) => {
        addForm.title = val
      }

      const updateEditFormTitle = (val: string) => {
        editForm.title = val
      }

      /**
       * 加载组织树数据
       */
      const fetchOrgTreeData = async () => {
        loading.value = true
        try {
          const res = await OrgTreeApi.getStructure()

          // 从响应中获取实际数据
          treeData.value = res.data || []
          console.log(treeData.value)
        } catch (error) {
          console.error('获取组织树失败:', error)
          message.error('获取组织树失败')
        } finally {
          loading.value = false
        }
      }

      /**
       * 处理节点点击事件
       * @param {object} node - 被点击的节点
       */
      const handleNodeClick = (node: any) => {
        selectedNodeId.value = node.id
        currentNode.value = node
      }

      /**
       * 处理节点拖拽结束事件
       * @param {object} data - 拖拽事件数据
       */
      const handleDragEnd = (data: any) => {
        console.log('拖拽结束:', data)
        // 这里可以调用API更新节点位置
      }

      /**
       * 添加根节点
       */
      const addRootNode = () => {
        addForm.parentKey = null
        addForm.title = ''
        showAddModal.value = true
      }

      /**
       * 添加子节点
       * @param {object} node - 父节点
       */
      const addChildNode = (node: any) => {
        addForm.parentKey = node.id
        addForm.title = ''
        showAddModal.value = true
      }

      /**
       * 编辑节点
       * @param {object} node - 要编辑的节点
       */
      const editNode = (node: any) => {
        editForm.key = node.id
        editForm.title = node.label
        showEditModal.value = true
      }

      /**
       * 删除节点
       * @param {object} node - 要删除的节点
       */
      const deleteNode = async (node: any) => {
        try {
          await OrgTreeApi.deleteNode(node.id)
          message.success('删除成功')
          fetchOrgTreeData()
        } catch (error) {
          console.error('删除节点失败:', error)
          message.error('删除节点失败')
        }
      }

      /**
       * 确认添加节点
       */
      const confirmAdd = async () => {
        if (!addForm.title.trim()) {
          message.warning('请输入节点名称')
          return
        }

        try {
          const params = {
            parentId: addForm.parentKey,
            name: addForm.title
          }
          await OrgTreeApi.addNode(params)
          message.success('添加成功')
          showAddModal.value = false
          fetchOrgTreeData()
        } catch (error) {
          console.error('添加节点失败:', error)
          message.error('添加节点失败')
        }
      }

      /**
       * 取消添加节点
       */
      const cancelAdd = () => {
        showAddModal.value = false
      }

      /**
       * 确认编辑节点
       */
      const confirmEdit = async () => {
        if (!editForm.title.trim()) {
          message.warning('请输入节点名称')
          return
        }

        try {
          const params = {
            id: editForm.key,
            name: editForm.title
          }
          await OrgTreeApi.updateNode(params)
          message.success('更新成功')
          showEditModal.value = false
          fetchOrgTreeData()
        } catch (error) {
          console.error('更新节点失败:', error)
          message.error('更新节点失败')
        }
      }

      /**
       * 取消编辑节点
       */
      const cancelEdit = () => {
        showEditModal.value = false
      }

      /**
       * 根据ID获取节点名称
       * @param {string} id - 节点ID
       * @returns {string} 节点名称
       */
      const getNodeNameById = (id: string): string => {
        // 递归查找节点
        const findNode = (nodes: any[]): any => {
          for (const node of nodes) {
            if (node.id === id) {
              return node
            }
            if (node.children && node.children.length > 0) {
              const found = findNode(node.children)
              if (found) return found
            }
          }
          return null
        }

        const node = findNode(treeData.value)
        return node ? node.label : '未知节点'
      }

      // 组件挂载时加载树形数据
      onMounted(() => {
        fetchOrgTreeData()
      })

      return {
        loading,
        treeData,
        selectedNodeId,
        currentNode,
        expandedKeys,
        selectedKeys,
        showAddModal,
        addForm,
        showEditModal,
        editForm,
        fetchOrgTreeData,
        handleNodeClick,
        handleDragEnd,
        addRootNode,
        addChildNode,
        editNode,
        deleteNode,
        confirmAdd,
        cancelAdd,
        confirmEdit,
        cancelEdit,
        getNodeNameById,
        updateAddModalVisible,
        updateEditModalVisible,
        updateAddFormTitle,
        updateEditFormTitle
      }
    }
  })
</script>

<style lang="scss" scoped>
  .tree-container {
    width: 100%;
  }

  /* 关键样式 */
  .inner-card {
    height: 100vh; /* 根据实际布局调整 */
    min-height: 600px; /* 最小高度保障 */
    margin-bottom: 16px;
    width: 100%;
  }

  .tree-org-container {
    height: calc(100% - 40px); /* 扣除卡片头部高度 */
    position: relative;
    width: 100%;
    min-height: 300px;
    overflow: auto;
    padding: 16px;

    .tree-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h2 {
        margin: 0;
      }

      .operations {
        display: flex;
        gap: 8px;
      }
    }

    .tree-content {
      height: calc(100% - 60px);
      overflow: auto;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 16px;
    }

    .custom-node {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.3s;

      &.selected-node {
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
      }

      .node-actions {
        display: none;
        margin-left: 16px;

        .anticon {
          margin: 0 4px;
          cursor: pointer;

          &:hover {
            color: #1890ff;
          }
        }
      }

      &:hover {
        background-color: #f5f5f5;

        .node-actions {
          display: flex;
        }
      }
    }

    .empty-tree {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .tree-wrapper {
    height: 100%;
    overflow: auto; /* 添加滚动条 */
  }

  /* 修复ant-design组件默认样式 */
  :deep(.ant-card-body) {
    padding: 0 !important;
    height: 100%;
  }

  :deep(.ant-spin-nested-loading) {
    height: 100%;
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }

  .custom-node-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 4px 0;
  }

  .tree-node-action {
    display: none;
    margin-left: 8px;
  }

  .custom-node-label:hover .tree-node-action {
    display: inline-flex;
  }

  :deep(.org-tree-node-label) {
    position: relative;
  }

  :deep(.org-tree-node) {
    padding: 10px;
    margin: 10px;
  }

  :deep(.tree-org-node__inner) {
    min-width: 120px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
  }

  :deep(.org-tree-node-label:hover) {
    background-color: #f0f5ff;
  }

  :deep(.org-tree-node__children) {
    margin-top: 15px;
  }

  /* 响应式布局 */
  @media screen and (max-width: 768px) {
    .ant-col-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .inner-card {
      margin-bottom: 16px;
    }
  }
</style>
