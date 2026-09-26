var current_language = "en";



var show_page = function(_page)
{
    // Show page.
    $("div[page]").addClass("hidden");
    $("div[page='" + _page + "']").removeClass("hidden");

    // Highlight button.
    $("button[page]").removeClass("highlighted");
    $("button[page='" + _page + "']").addClass("highlighted");
};



function set_loading_screen(_text)
{
    var value = langs[current_language][_text];

    if (value === undefined)
    {
        value = _text;
    }

    $(".loader-wrapper h1").text(value);

    show_loading_screen(true);
}



function show_loading_screen(_value)
{
    if (_value)
    {
        $(".loader-wrapper h1").show();
        $(".loader-wrapper").show();
    }
    else
    {
        $(".loader-wrapper h1").hide();
        $(".loader-wrapper").hide();
    }
}



function show_message(_msg)
{
    var msg = langs[current_language][_msg];

    if (msg === undefined)
    {
        msg = _msg;
    }

    $(".message-inner .progress-bar").hide();
    $(".message-inner button").hide();

    $(".message-inner p").text(msg);

    $(".message-outer").show();
}



function show_message_with_button(_msg)
{
    var msg = langs[current_language][_msg];

    if (msg === undefined)
    {
        msg = _msg;
    }

    $(".message-inner .progress-bar").hide();
    $(".message-inner button").show();

    $(".message-inner p").text(msg);

    $(".message-outer").show();
}



function show_message_with_progress(_msg, _progress)
{
    if (_progress <= 0.01)
    {
        $(".message-inner .progress-bar .progress-fill").css("width", "0%");
    }

    $(".message-inner button").hide();
    $(".message-inner .progress-bar").show();

    $(".message-inner p").text(_msg + " (" + _progress + "%)");
    $(".message-inner .progress-bar .progress-fill").css("width", _progress + "%");

    $(".message-outer").show();
}



var update_language = function()
{
    var text = $("a[lang='" + current_language + "']").text();

    $("#setlanguage").html(text);
    
    $("[label]").each(function()
    {
        var label = $(this).attr("label");

        var value = langs[current_language][label];

        $(this).html(value);
    });
};



var update_playername = function()
{
    if (typeof app !== 'undefined')
    {
        var playerName = app.get_convar("player_name");

        $("#setplayername").val(playerName);
    }
};



function clear_servers_list()
{
    $("#serverslist tbody").html(null);
}



function add_server(_ip, _port, _name, _tags, _players_count, _max_players_count, _last_ping)
{
    const tagsList = _tags.split(",");

    var tags = [];

    tagsList.forEach(function(tag)
    {
        tags += "<div class='tag'>";
        tags += tag;
        tags += "</div>";
    });

    $("#serverslist tbody").append("<tr ip='" + _ip + "' port='" + _port + "'><td>" + _name + "</td><td>" + tags + "</td><td>" + _players_count + " / " + _max_players_count + "</td><td>" + _last_ping + "</td></tr>");
}



function resolve_ip(_data, _default_port)
{
    if (_data)
    {
        if (_data.match(/^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)(?:\:(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/g))
        {   
            if(_data.match(/:/g))
            {
                var split = _data.split(':');

                return { "address": split[0], "port": parseInt(split[1]) };
            }

            return { "address": _data, "port": _default_port };
        }
    }

    return null;
}



function get_text_width(_text, _font)
{
    var canvas = document.getElementById("canvas");

    if (!canvas)
    {
        canvas = document.createElement("canvas");
    }

    const context = canvas.getContext("2d");
    context.font = _font;

    const metrics = context.measureText(_text);

    return metrics.width;
}



function add_patreon_member(_name, _tier)
{
    let tierClass = _tier.toLowerCase();

    $("#patreonmemberslist tbody").append("<tr><td class='patreon'>" + _name + "</td><td class='" + tierClass + "'>" + _tier + "</td></tr>");
}



$(document).ready(function()
{
    $(".message-outer").hide();

    if (typeof app !== 'undefined')
    {
        // Read config.
        current_language = app.get_convar("language");

        var auto_load_plugins = app.get_convar("auto_load_plugins");

        $("#toggleloadplugins").prop("checked", auto_load_plugins);
    }
    
    // Load language.
    update_language();

    // Load player name.
    update_playername();

    // By default, we show the home page.
    show_page("home");

    // Handle pages opening.
    $("button[page]").click(function()
    {
        var page = $(this).attr("page");

        show_page(page);
    });

    // Handle direct connect button click.
    $("#direct_connect_button").click(function()
    {
        var value = $("#direct_connect_input").val();

        var ip = resolve_ip(value, 4674);

        if (ip)
        {
            show_message("connecting");
    
            // Connect to the server.
            app.connect(ip.address, ip.port);
        }
        else
        {
            show_message_with_button("invalid_ip");
        }
    });

    // Handle refresh servers list button.
    $("#refresh").click(function()
    {
        app.refresh_servers_list();
    });

    // Dropdowns manager.
    $("#setlanguage").click(function()
    {
        if ($("#setlanguage-dropdown").css("display") == "none")
        {
            $("#setlanguage-dropdown").css("display", "block");
        }
        else
        {
            $("#setlanguage-dropdown").css("display", "none");
        }
    });

    $("#setlanguage-dropdown a").click(function()
    {
        current_language = $(this).attr("lang");

        update_language();

        $("#setlanguage-dropdown").css("display", "none");

        app.set_convar("language", current_language);
    });

    $("#toggleloadplugins").change(function()
    {
        if (typeof app !== 'undefined')
        {
            var auto_load_plugins = $(this).is(":checked");

            app.set_convar("auto_load_plugins", auto_load_plugins);
        }
    });

    // Handle quit button click.
    $("#exitgame").click(function()
    {
        if (typeof app !== 'undefined')
        {
            app.quit();
        }
    });
});



// Servers list connect.
$("#serverslist").on("click", "tbody tr", function()
{
    var ip = $(this).attr("ip");
    var port = $(this).attr("port");

    show_message("connecting");

    // Connect to the server.
    app.connect(ip, parseInt(port));
});



// Search bar
$("#search").on("change paste keyup", function()
{
    var value = $(this).val().toLowerCase();

    $("#serverslist tbody tr").each(function()
    {
        var text = $(this).text().toLowerCase();

        if (text.includes(value))
        {
            $(this).show();
        }
        else
        {
            $(this).hide();
        }
    });
});



// Message buttons.
$(".message-inner").on("click", "button", function()
{
    $(".message-outer").hide();
});



// [Settings] Player name
$("#setplayername").on("keyup", function()
{
    if (typeof app !== 'undefined')
    {
        var input = $(this).val();

        app.set_convar("player_name", input);
    }
});