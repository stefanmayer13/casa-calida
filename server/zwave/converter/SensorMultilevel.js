/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = function convert(commandClass, sensorType) {
    const sensorKeys = Object.keys(sensorType.data);
    return sensorKeys
        .filter((sensorKey) => {
            return !isNaN(parseInt(sensorKey, 10));
        })
        .map((sensorKey) => {
            const sensor = sensorType.data[sensorKey];
            return {
                commandClass,
                type: sensorType.name,
                name: sensor.sensorTypeString.value,
                value: sensor.val.value,
                scale: sensor.scaleString.value,
                valueType: 'number',
                lastUpdate: sensor.updateTime,
            };
        });
};
