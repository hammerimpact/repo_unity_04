/*:
 * NOTE: 노트.
 *
 * @plugindesc plugindesc 테스트 테스트
 * @author author 테스트
 *
 * @help help 테스트
 *
 * @param BooleanType
 * @desc BooleanType 테스트.
 * OFF - false     ON - true
 * Default: ON 테스트
 * @default true
 *
 * @param FileType
 * @desc FileType 테스트
 * Default: MadeWithMv 테스트
 * @default Test11
 * @require 1
 * @dir img/
 * @type file
 *
 * @param IntType
 * @desc IntType 테스트
 * Default: 120
 * @default 120
 *
 * @param StringType
 * @desc StringType 테스트
 * Default: test
 * @default test
 *
 */

(function() {
    function toNumber(str, def) {
        return isNaN(str) ? def : +(str || def);
    }

    var parameters = PluginManager.parameters('TestPlugin');
    var bBooleanType = JSON.parse(parameters['BooleanType']);
    var szFilePath = String(parameters['FileType']);
    var nIntType = toNumber(parameters['IntType'], 120);
    var szStringType = String(parameters['StringType']);
    var a = 10;
})();