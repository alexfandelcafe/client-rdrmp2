var was_pressed_before = false;
var is_chat_box_open = false;

var timeout = null;



function set_chatbox_open(_value)
{
    is_chat_box_open = _value;

    if (timeout != null)
    {
        clearTimeout(timeout);
    }

    if (_value)
    {
        $("#chatbox").fadeIn(200);

        $("#header").show();
        $(".input-icons").show();
        $("#input").focus();
    }
    else
    {
        $("#chatbox").fadeOut(200);
    }
}



function set_chatbox_servertitle(_title)
{
    $("#servertitle").text(_title);
}



function set_chatbox_ping(_ping)
{
    $("#ping").text(_ping + " ms");
}



function send_chat_message(_str)
{
    if (!is_chat_box_open)
    {
        if (timeout != null)
        {
            clearTimeout(timeout);
        }

        $("#header").hide();
        $(".input-icons").hide();
        $("#chatbox").fadeIn(200);
    }

    var count = $("#output > p").length;

    if (count > 50)
    {
        $("#output").find("p:first").remove();
    }

    $("#output").append(_str);

    var textarea = $("#output");
        
    textarea.scrollTop(textarea[0].scrollHeight);

    if (!is_chat_box_open)
    {
        timeout = setTimeout(() =>
        {
            $("#chatbox").fadeOut(200);
        }, 5200);
    }
}



$(document).ready(function()
{
    $("#chatbox").hide();
    $(".input-icons").hide();
    $("#header").hide();
});



$("#input").on("keydown", function(_event)
{
    if (_event.which == 13 && !was_pressed_before)
    {
        _event.preventDefault();
            
        var value = $(this).val();

        app.send_chat_message(value);

        $(this).val(null);

        was_pressed_before = true;
    }
});



$("#input").on("keyup", function(_event)
{
    was_pressed_before = false;
});