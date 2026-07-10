// tests go here; this will not be compiled when this package is used as an extension.

Acebott.adc7828SetAddress(ADC7828_I2C_ADDRESS.ADDR_0x48)
let adc7828Value = Acebott.adc7828ReadChannel(Acebott.ADC7828Channel.CH0)
basic.showNumber(adc7828Value)
