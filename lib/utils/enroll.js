const zclId = require('zcl-id')
const sleep = require('./sleep')

function write(endpoint, coordinatorAddr) {
  const writeRec = {
    attrId: zclId.attr('ssIasZone', 'iasCieAddr').value,
    dataType: zclId.attrType('ssIasZone', 'iasCieAddr').value,
    attrData: coordinatorAddr,
  }
  return endpoint.foundation('ssIasZone', 'write', [writeRec], { direction: 0 })
}

function enroll(endpoint, zoneId = 3) {
  const enrollRec = {
    enrollrspcode: 0x00,
    zoneid: zoneId,
  }
  return endpoint.functional('ssIasZone', 'enrollRsp', [enrollRec])
}

module.exports = async function runEnrollLoop(endpoint, coordinatorAddr, zoneId) {
  try {
    await write(endpoint, coordinatorAddr)
    await sleep(1000)
    await enroll(endpoint, zoneId)
  } catch (err) {
    await sleep(1000)
    await runEnrollLoop(endpoint, coordinatorAddr, zoneId)
  }
}
