# 易经六十四卦数字化项目需求文档

## 项目概述
开发批量生成《易经》六十四卦卡片的自动化工具，实现以下核心功能：
- 基于模板的卦象卡片批量生成
- PNG图片格式批量导出
- ZIP压缩包一键下载
- 响应式古籍风格UI设计

## 功能需求

### 1. 数据驱动生成
- 卦象数据存储于<mcfile name="data.js" path="e:/VSCode/yijing/data.js"></mcfile>
- 支持卦名、卦辞、爻位等结构化数据
- 卦画通过CSS类名动态渲染

### 2. 批量导出系统
- 使用Puppeteer实现HTML转PNG（分辨率900x1200）
- 生成文件命名规则：hexagram_[卦序].html/png
- 每日构建版本号（YYYY-MM-DD格式）

### 3. 打包下载功能
- 前端集成JSZip实现浏览器端压缩
- 下载按钮固定定位在右下角
- 压缩包包含所有卦象文件及版本说明

## 技术方案

### 前端架构
```mermaid
graph TD
A[HTML模板] --> B(数据注入)
B --> C[动态卦画渲染]
C --> D[样式优化]
D --> E[浏览器端打包]
```

### 生成工具链
- 模板引擎：ES6 Template Literals
- 截图工具：Puppeteer@13.7.0
- 压缩库：JSZip@3.10.1

## 实施计划

| 阶段 | 交付物 | 耗时 |
|------|--------|------|
| 数据建模 | data.js | 2天 |
| 模板开发 | template.html | 3天 |
| 生成系统 | generate.js | 2天 |
| 测试部署 | 64卦文件 | 1天 |

## 附件
- 现有参考文件：<mcfile name="tun.html" path="e:/VSCode/yijing/tun.html"></mcfile>
- 原始资料：<mcfile name="易经.md" path="e:/VSCode/yijing/易经.md"></mcfile>