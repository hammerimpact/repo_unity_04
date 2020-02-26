/*:
 *
 * @plugindesc Top Window_Help Always show/hide in Scene_Map and set text with tracing values.
 * @author HammerMan
 *
 * @help
 * 맵 씬에서 화면 최상단에 헬프 윈도우를 띄우고, 텍스트를 실시간 갱신하는 플러그인입니다.
 * 이벤트 명령의 스크립트에서 아래와 같은 함수들을 쓸 수 있습니다.
 *
 * (1) MapTopHelp.SetActive(인자);
 * 맵 씬일 경우 헬프 윈도우 표시 상태를 세팅합니다. 인자 true : 표시 / false : 비표시
 *
 * (2) MapTopHelp.SetTextFormat(텍스트);
 * 맵 씬일 경우 헬프 윈도우에 표시할 텍스트의 포맷을 세팅합니다.
 *
 * (3) MapTopHelp.ClearTracingValues();
 * 텍스트의 Tracing Value들의 세팅 정보를 삭제합니다.
 *
 * (4) MapTopHelp.AddTracingValue(id, type, param)
 * 텍스트의 Tracing Value 데이터를 추가합니다.
 * id : 데이터의 고유 id (텍스트 표시할때 구분용)
 * type : 데이터의 종류
 * param : 데이터 추적에 필요한 추가 데이터
 *
 * type과 param의 종류
 * 'variable' : 게임 변수. param은 변수의 게임상 ID.
 * 'gold' : 소지금. param은 0.
 * 'item_count' : 소지 아이템 갯수. param은 아이템의 게임상 ID.
 * 'actor_hp' : 액터 HP. param은 액터의 게임상 ID.
 *
 * 사용 예시
 * : ID가 0002인 액터의 현재 HP와 소지금을 표시하고 싶은 경우
 * (HelpHeightLine은 2로 설정)
 *
 * [스크립트]
 * MapTopHelp.SetActive(true);
 * MapTopHelp.SetTextFormat("액터2 HP : {101}\n소지금 {202}");
 * MapTopHelp.ClearTracingValues();
 * MapTopHelp.AddTracingValue(101, 'actor_hp', 2);
 * MapTopHelp.AddTracingValue(202, 'gold', 0);
 *
 * [결과]
 * "액터2 HP : 430
 * 소지금 1000"
 *
 * 주의사항
 * SetTextFormat로 설정할 텍스트에는 절대로 중괄호({ , })를 넣지 말것.
 * 줄바꿈을 함수로 지원하진 않으므로 줄바꿈 문자"\n"을 적절히 사용할것.
 *
 *
 * @param HelpHeightLine
 * @desc 헬프 윈도우의 높이 줄 단위 설정(기본 1줄). 게임 실행중에 직접 바꾸면 정상작동 보장안됨.
 * Default: 1
 * @default 1
 *
 */

function MapTopHelp()
{

};

// Enum
MapTopHelp.EnumTracingValueType = {
    NONE        : 'none',
    VARIABLE    : 'variable',
    GOLD        : 'gold',
    ITEM_COUNT  : 'item_count',
    ACTOR_HP    : 'actor_hp',

    // 추가할 옵션이 있다면, 이 부분에 추가하고 GetValueText 를 설정할것.
};

// Member Variables Set in PluginsManager
(function(){
    var parameters = PluginManager.parameters('MapTopHelp');
    MapTopHelp.textLine = Number(parameters["HelpHeightLine"]) || 1;
}());

// Member Variables
MapTopHelp.helpActive       = false;
MapTopHelp.textFormat       = "";
MapTopHelp.tracingValues    = [];

MapTopHelp.SetActive = function (_active)
{
    MapTopHelp.helpActive = _active;
};

MapTopHelp.SetTextFormat = function(_textFormat)
{
    MapTopHelp.textFormat = _textFormat;
};

MapTopHelp.ClearTracingValues = function()
{
    MapTopHelp.tracingValues = [];
};

MapTopHelp.AddTracingValue = function(_id, _type, _param)
{
    MapTopHelp.tracingValues.push({ id : _id, type : _type, param : _param});
};

MapTopHelp.GetValueText = function(type, param)
{
    if (type == MapTopHelp.EnumTracingValueType.VARIABLE)
    {
        return $gameVariables.value(param).toString();
    }
    else if (type == MapTopHelp.EnumTracingValueType.GOLD)
    {
        return $gameParty.gold().toString();
    }
    else if (type == MapTopHelp.EnumTracingValueType.ITEM_COUNT)
    {
        if (param >= 0 && param < $dataItems.length)
        {
            var item = $dataItems[param];
            if ($gameParty.hasItem(item, false))
                return $gameParty.numItems(item).toString();
        }

        return "";
    }
    else if (type == MapTopHelp.EnumTracingValueType.ACTOR_HP)
    {
        if (param >= 0 && param < $dataActors.length)
        {
            var targetActor = $gameActors.actor(param);
            if (targetActor != null)
                return targetActor.hp.toString();
        }

        return "";
    }
    else
    {
        return "";
    }
};

MapTopHelp.GetShowText = function()
{
    var retVal = MapTopHelp.textFormat;
    for (var i = 0; i < MapTopHelp.tracingValues.length; ++i)
        retVal = retVal.replace("{" + MapTopHelp.tracingValues[i].id + "}", MapTopHelp.GetValueText(MapTopHelp.tracingValues[i].type, MapTopHelp.tracingValues[i].param));

    return retVal;
};

(function()
{
    SceneManager.RefreshMapTopHelp = function()
    {
        if (this._scene.constructor === Scene_Map)
            this._scene.RefreshMapTopHelp();
    };

    var _map_top_help_scene_map_create = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function()
    {
        _map_top_help_scene_map_create.call(this);
        this.CreateMapTopHelpWindow();
    };

    Scene_Map.prototype.CreateMapTopHelpWindow = function()
    {
        this._mapTopHelpWindow = new Window_Help(MapTopHelp.textLine);
        this.RefreshMapTopHelp();
        this.addWindow(this._mapTopHelpWindow);
    };

    var _map_top_help_scene_map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function()
    {
        _map_top_help_scene_map_update.call(this);

        if (this._active)
        {
            if (!SceneManager.isSceneChanging()) {
                this.RefreshMapTopHelp();
            }
        }
    };

    Scene_Map.prototype.RefreshMapTopHelp = function()
    {
        if (MapTopHelp.helpActive != this._mapTopHelpWindow.visible)
        {
            if (MapTopHelp.helpActive)
                this._mapTopHelpWindow.show();
            else
                this._mapTopHelpWindow.hide();
        }

        if (this._text != MapTopHelp.GetShowText())
            this._mapTopHelpWindow.setText(MapTopHelp.GetShowText());
    };
}());