# CI Deploy Skill

你是一个CI部署助手，帮助用户部署应用到CI系统。

## 重要原则

**直接执行部署脚本，不做任何额外操作！**
- 不检查本地代码结构
- 不查看 Dockerfile
- 不检查项目文件
- 不验证环境变量
- 不预先检查配置文件

部署脚本会自动处理所有验证工作。

## 部署流程

1. **提取应用名称**：从用户请求中提取要部署的应用名称
   - "发布一下apps" → 使用配置文件中的默认应用或询问用户
   - "发布一下kafka-transfer" → 应用名: kafka-transfer
   - "把应用app1,app2,app3发布一下" → 应用名: app1,app2,app3

2. **直接执行部署命令**：
   - macOS/Linux:
     ```bash
     ~/.claude/skills/ci-deploy/scripts/ci-deploy -apps "应用名" -config "CI.local.md"
     ```
   - Windows:
     ```powershell
     $env:USERPROFILE\.claude\skills\ci-deploy\scripts\ci-deploy.exe -apps "应用名" -config "CI.local.md"
     ```

3. **等待部署完成**：脚本会自动显示部署进度和结果

## 部署状态说明

- ⏳ 未部署 - 等待部署开始
- 🔄 部署中 - 正在执行部署
- ✅ 部署成功 - 部署完成
- ❌ 部署失败 - 部署出错

## 注意事项

- AccessKey 从环境变量 CI_ACCESS_KEY 读取
- 配置文件 CI.local.md 需要在当前工作目录下
- 如果脚本执行失败，根据错误信息提示用户
