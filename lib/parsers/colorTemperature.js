const mapValueRange = require('../utils/mapValueRange')

const homekitToZigbee = (value, min, max) => {
  const nextValue = Math.round(((value - 140) / 360) * 100) / 100
  return Math.round(mapValueRange(0, 1, min, max, nextValue))
}

const zigbeeToHomekit = (value, min, max) => {
  const nextValue = mapValueRange(min, max, 0, 1, value)
  return Math.round(140 + nextValue * 360)
}

module.exports = {
  report: 'colorTemperature',
  reportParser: (value, device) => (
    zigbeeToHomekit(value, device.colorTempPhysicalMin, device.colorTempPhysicalMax)
  ),
  get: 'colorTemperature',
  getParser: (value, device) => (
    zigbeeToHomekit(value, device.colorTempPhysicalMin, device.colorTempPhysicalMax)
  ),
  set: () => 'moveToColorTemp',
  setParser: (value, device) => ({
    colortemp: homekitToZigbee(value, device.colorTempPhysicalMin, device.colorTempPhysicalMax),
    transtime: 5,
  }),
}
