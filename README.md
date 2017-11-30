### 安装和使用 
```
git clone https://github.com/wavelynn/csssteps.git 

cd csssteps && npm install

# 当前目录下output
node cli.js -d assets/666

# 输出调试信息
node cli.js -d assets/666 -v

# 只选择3n+1的帧数
node cli.js -d assets/666 -w 3n+1

# 不压缩图片 
node cli.js -d assets/666 -w 3n+1 -c false
```

