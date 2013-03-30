/// <reference path="_references.js" />

var viewModel = 
{
    blogs : ko.observableArray([]),
    selectedBlog: ko.observable(null),

    selectBlog: function(blog)
    {
        viewModel.selectedBlog(this);
        $(".right-section").show();
    },
    newBlog: function ()
    {
        this.blogs.push({
            Title: ko.observable("New " + this.blogs().length),
            Id: ko.observable(this.blogs().length + 1),
            Post: ko.observable("Post " + this.blogs().length),
            IsNew: ko.observable(true)
        });
    }
}

$(document).ready(function ()
{
    $(".right-section").hide();
    $.ajax(
        {
            url: "/api/Blogs",
            contentType: "text/json",
            type: "GET",
            success: function (data)
            {
                $.each(data, function (index)
                {
                    viewModel.blogs.push(toKoObserable(data[index]));
                });

                ko.applyBindings(viewModel);
            },
            error: function (data)
            {
                alert("ERROR");
            }
        });

    function toKoObserable(blog)
    {
        return {
            Id: ko.observable(blog.Id),
            Title: ko.observable(blog.Title),
            Post: ko.observable(blog.Post),
            Comments: ko.observable(blog.Comments),
            IsDeleted: ko.observable(blog.IsDeleted)
        };
    }
    
    $("#saveAll").click(function ()
    {
        var saveData = ko.toJS(viewModel.blogs);
        $.each(saveData, function (index)
        {
            var current = saveData[index];
            var action = "PUT";
            var stringyF = JSON.stringify(current);
            var vUrl = "/api/Blogs?Id="+current.Id;
            if (current.IsNew)
            {
                action = "POST";
                vUrl = "/api/Blogs";
            }
            $.ajax(
            {
                url: vUrl,
                contentType: "application/json;charset=utf-8",
                type: action,
                data: JSON.stringify(current)
            });
        });

    });
});