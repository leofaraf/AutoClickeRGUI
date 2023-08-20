<div align="center">
  
  ![Logo](src-tauri/icons/128x128.png)
  # AutoClickeRGUI   
  
  ![Static Badge](https://img.shields.io/badge/window-passing-e) ![Static Badge](https://img.shields.io/badge/license-MIT-blue)  ![Static Badge](https://img.shields.io/badge/real_cps-1200-e)   
  This is a quick autoclicker written in Rust.
  The development path is opensourse.
  If you want to contribute to the    
  development, you can [write to me](https://t.me/leofaraf) or contribute to this project yourself!
</div>

### CPS banchmark
If you want to check the real CPS/s of this software, then:
- If you have chosen the setting without delays or set CPS>100, then tests in browser will not work. they can't capture that many clicks and usually break, in which case native apps are the way to go. Native ones measure CPS more accurately if you set it to the maximum 1000 clicks per second, they show a real result of about 490 CPS / s, but after the function of disabling the delay, it breaks down and does not register clicks at all and freezes, or shows something around 270 CPS / s , which in no way can be true, real CPS/s = 1200 in no delay mode.
### Currently creating support for MasOC and Linux
Location the release build `./build/AutoClickeRGUI.exe`
