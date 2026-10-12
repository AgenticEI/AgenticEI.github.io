# ParallelWorld project page

新版英文论文主页，原生 HTML / CSS / JavaScript，无需安装依赖或构建。

## 查看
双击 index.html 即可查看。视频、论文和图像均位于 assets/，可以离线访问。引用复制在本地文件模式下若受浏览器限制，会自动选中文本供手动复制。

本地服务器预览：`python -m http.server 8000`，然后打开 http://localhost:8000。

## 更新原 GitHub Pages 仓库
将本目录内所有内容（包括 assets 和 .nojekyll）复制到 Chen-Min-22/ParallelWorld-page 的发布分支根目录，提交并推送。保留仓库原有的 GitHub Pages 分支设置即可。无需使用 Node.js。

当前 Code 链接：https://github.com/AgenticEI/ParallelWorld
arXiv 按钮指向 https://arxiv.org/abs/2608.22971；随页面附带的新版 PDF 仍保留在 assets/ParallelWorld.pdf。

## 内容来源与更新
- 标题、作者、摘要、方法和实验数据来自用户提供的 12 页新版论文。
- paradigms.png / pipeline.png / qualitative.png 为新版论文原图。
- ESI-Bench 全部 28 行结果与 LIBERO-Pro 全部 9 行结果以 HTML 表格呈现。
- 修正旧页面「全部 28 个子任务提升」：新版为相对 Active Exploration 的 26/28 个子任务提升。
- 新增 LIBERO-Pro、adaptive search width 消融和方法局限。
- 视频来自用户提供的宣传视频.mp4，时长约 77 秒，H.264/AAC，1280×720；仅重封装以启用 faststart，不重新压缩。
- BibTeX 已加入 arXiv:2608.22971（cs.AI）。

## 常用修改
- 页面文案与链接：index.html
- 配色和响应式布局：styles.css
- 结果切换与引用复制：script.js
- 视频：assets/parallelworld-demo.mp4
- 视频封面：assets/video-poster.jpg
- 论文：assets/ParallelWorld.pdf

PDF 中的 GitHub Repo: xxx 是原文件内容，网页 Code 按钮已使用正确仓库地址。
