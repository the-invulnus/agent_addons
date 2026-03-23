---
name: ci-deploy
description: "一个用于部署应用到CI系统的Claude技能，支持单应用和多应用部署，并提供实时状态监控。"
---

# CI Deploy Skill

一个用于部署应用到CI系统的Claude技能，支持单应用和多应用部署，并提供实时状态监控。支持 Windows、macOS (Intel/Apple Silicon) 和 Linux。

## 触发条件

当用户请求发布或部署应用时触发，例如：
- "发布一下apps"
- "把应用kafka-transfer发布一下"
- "部署kafka-transfer"
- "把应用kafka-transfer,app1,app2发布一下"

## 重要原则

**收到请求后直接执行部署脚本，不做任何额外操作：**
- 不检查本地代码结构
- 不查看 Dockerfile
- 不检查项目文件
- 不预先验证环境变量或配置文件

部署脚本会自动处理所有验证工作。

## 使用方式

提取应用名称后直接执行部署命令：

**macOS / Linux**
```bash
~/.claude/skills/ci-deploy/scripts/ci-deploy -apps "应用名" -config "CI.local.md"
```

**Windows**
```powershell
$env:USERPROFILE\.claude\skills\ci-deploy\scripts\ci-deploy.exe -apps "应用名" -config "CI.local.md"
```

## 前置条件

### 1. 环境变量配置（必需）
- `CI_ACCESS_KEY`: 用户访问密钥，从CI系统个人设置页面获取

### 2. 项目配置文件
在当前项目目录下创建 `CI.local.md` 配置文件，包含：
- VersionID: 版本ID
- EnvID: 环境ID
- SubjectID: 项目ID

## 部署状态

- ⏳ 未部署 - 等待部署开始
- 🔄 部署中 - 正在执行部署
- ✅ 部署成功 - 部署完成
- ❌ 部署失败 - 部署出错

## 注意事项

- AccessKey 从环境变量 CI_ACCESS_KEY 读取
- 配置文件 CI.local.md 需要在当前工作目录下
- 部署监控最长等待10分钟
