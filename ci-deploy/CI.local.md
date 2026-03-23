# CI Deploy Configuration

## 基本信息
- VersionID: 1308        # 版本ID（从CI系统获取）
- EnvID: 412             # 环境ID（从CI系统获取）
- SubjectID: 62          # 项目ID（从CI系统获取）
- Repository: aipaas	 # 镜像仓库

## 注意
# AccessKey 已移至系统环境变量 CI_ACCESS_KEY 中配置
# 请确保已设置环境变量：CI_ACCESS_KEY

## 获取方式

### VersionID
1. 登录CI系统: https://ci.uban360.com
2. 进入应用详情页
3. 在URL或页面中找到VersionID

### EnvID
1. 在CI系统中查看环境列表
2. 找到目标环境对应的ID
3. 开发环境通常 EnvID: 412

### SubjectID
1. 在CI系统中查看项目详情
2. 找到项目对应的SubjectID

### Repository
1. 镜像仓库的名字
2. 从CI中获取。

### AccessKey (环境变量配置)
1. 登录CI系统
2. 进入个人设置页面
3. 生成或查看AccessKey
4. 配置到系统环境变量 CI_ACCESS_KEY

#### Windows 设置环境变量
方法一（推荐，永久生效）：
  1. 右键"此电脑" -> 属性 -> 高级系统设置 -> 环境变量
  2. 在"用户变量"区域点击"新建"
  3. 变量名：CI_ACCESS_KEY
  4. 变量值：your-access-key-here
  5. 重启终端使环境变量生效

方法二（临时，仅当前会话有效）：
  PowerShell: $env:CI_ACCESS_KEY = "your-access-key-here"
  CMD: set CI_ACCESS_KEY=your-access-key-here

#### macOS 设置环境变量
方法一（推荐，永久生效）：
  echo 'export CI_ACCESS_KEY="your-access-key-here"' >> ~/.zshrc
  source ~/.zshrc

方法二（临时，仅当前会话有效）：
  export CI_ACCESS_KEY="your-access-key-here"
