//------------------------------
// Test Title Plugin
//------------------------------
// Scene_Title Override
(function() {

    // Override
    var _origin_Function_ = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function()
    {
        _origin_Function_.call(this);
        this._commandWindow.setHandler('test',  this.commandTest.bind(this));
    };

    // New
    Scene_Title.prototype.commandTest = function() {
        this._commandWindow.close();
        SceneManager.push(Scene_TestPlugin);
    };
}());

//-----------------------------------------------------------------------------
// Window_TitleCommand Override

(function() {

    // Override
    Window_TitleCommand.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.updatePlacement();
        this.openness = 0;
    };

    // Override
    var _origin_Function_ = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        this.addCommand("테스트",   'test');
        _origin_Function_.call(this);
    };
}());

//-----------------------------------------------------------------------------
// Scene_TestPlugin

function Scene_TestPlugin() {
    this.initialize.apply(this, arguments);
}

Scene_TestPlugin.prototype = Object.create(Scene_Base.prototype);
Scene_TestPlugin.prototype.constructor = Scene_TestPlugin;

Scene_TestPlugin.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_TestPlugin.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createWindowLayer();
    this.createCommandWindow();
};

Scene_TestPlugin.prototype.update = function() {
    if (!this.isBusy()) {
        this._commandWindow.open();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_TestPlugin.prototype.isBusy = function() {
    return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
};

Scene_TestPlugin.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TestPluginCommand();
    this._commandWindow.setHandler('back',  this.commandBack.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_TestPlugin.prototype.commandBack = function()
{
    console.log("commandBack");
    this._commandWindow.close();
    this.popScene();
};

//-----------------------------------------------------------------------------
// Window_TestPluginCommand
// The window for TestScene

function Window_TestPluginCommand() {
    this.initialize.apply(this, arguments);
}

Window_TestPluginCommand.prototype = Object.create(Window_Command.prototype);
Window_TestPluginCommand.prototype.constructor = Window_TestPluginCommand;

Window_TestPluginCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
};

Window_TestPluginCommand.prototype.windowWidth = function() {
    return 240;
};

Window_TestPluginCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 300;
};

Window_TestPluginCommand.prototype.makeCommandList = function() {
    this.addCommand("나가기", 'back');
};