
var $hw = function (appId) {

    var $ = function (selector) {
        return document.querySelectorAll(selector)
    }


    this.appId = appId;
    this.app = $("*[hw-app=" + appId +"]")[0]
    this.html = $("*[hw-app=" + appId + "]")[0].innerHTML

    var self = this;

    this.run = function () {
        self.app.innerHTML = self.html;
        var r = document.querySelector("*[hw-app=" + self.appId + "]" )
        var k = r
        while (k.querySelector("*[hw-source]") != null) {

            bindInnerElement(r)

        }

        k.innerHTML = generateHTML(k.innerHTML,"[[","]]","window")


    }



    function generateRepeated(r) {


        var html = r.innerHTML
        var dataHTML = ""
        var data = eval("window." + r.getAttribute("hw-source"))
        r.removeAttribute("hw-source");
        if (data != null) {
            data.forEach(function (d) {
                var arr = html.split("}}");
                for (var i = 0; i < arr.length; i++) {
                    var value = (arr[i].split("{{"))[1]
                    dataHTML += (arr[i].replace("{{" + value, eval("d." + value)));


                }

            })
        }


        dataHTML = generateHTML(dataHTML, "[[", "]]", "window")



        return dataHTML
    }

    function generateHTML(html, leftBrace, rightBrace, obj) {
        var dataHTML = ""
        var arr = html.split(rightBrace);
        for (var i = 0; i < arr.length; i++) {
            var value = (arr[i].split(leftBrace))[1]
            dataHTML += (arr[i].replace(leftBrace + value, eval(obj + "." + value)));
        }
        return dataHTML
    }



    function bindInnerElement(r) {

        if (r.querySelector("*[hw-source]") == null) {
            r.innerHTML = generateRepeated(r)

        }
        else {
            r = r.querySelector("*[hw-source]")
            bindInnerElement(r);
        }

    }


}

