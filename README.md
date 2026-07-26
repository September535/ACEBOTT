# ACEBOTT

> 面向 BBC micro:bit 与 ACEBOTT 硬件模块的 Microsoft MakeCode 扩展集合。

## 主要功能

- GPIO、LED、继电器和激光模块控制
- 直流电机、舵机和小车运动控制
- RGB 灯与点阵显示
- 超声波、DHT11、BMP280、ADC7828 等传感器支持
- TM1650 数码管、LCD1602 和 OLED 显示支持
- 按键、摇杆、巡线和振动电机支持
- ACEBOTT micro:bit 小车专用积木

## 安装

1. 打开 [Microsoft MakeCode for micro:bit](https://makecode.microbit.org/)。
2. 新建项目并进入“扩展”。
3. 搜索以下仓库地址并导入：

```text
https://github.com/September535/ACEBOTT
```

## 快速开始

```typescript
Acebott.motors(50, 50)
basic.pause(1000)
Acebott.stopcar()
```

不同硬件模块可能使用不同的 GPIO、I²C 或串口连接。运行示例前，请根据所用套件确认端口、供电和模块型号。

## 源码结构

- `Acebott.ts`：通用硬件与传感器积木
- `AcebottMicrobit.ts`：micro:bit 小车相关功能
- `AcebottColor.ts`：颜色相关功能
- `AcebottOled.ts`：OLED 显示支持
- `AcebottServo.ts`：舵机支持
- `AcebottBMP280.ts`：BMP280 传感器支持
- `AcebottADC7828.ts`：ADC7828 支持

## 支持平台

- BBC micro:bit
- Microsoft MakeCode / PXT

## 开发

在 MakeCode 中依次选择“导入”→“导入 URL”，粘贴本仓库地址即可编辑扩展。

## 许可证

MIT
