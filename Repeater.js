

var $hw = function (appId, extend) {
    this.o = extend
    var $ = function (selector) {
        return document.querySelectorAll(selector)
    }

    this.appId = appId;
    this.app = $("*[hw-app=" + appId + "]")[0]
    this.html = $("*[hw-app=" + appId + "]")[0].innerHTML

    var self = this;

    this.run = function () {

        
        self.app.innerHTML = self.html;
        var r = document.querySelector("*[hw-app=" + self.appId + "]")

        while (r.querySelector("*[hw-source]") != null) {

            bindInnerElement(r)

        }

        r.innerHTML = generateHTML(r.innerHTML)


    }



    function generateRepeated(r) {


        var html = r.innerHTML
        var dataHTML = ""
        var data = eval("self.o." + r.getAttribute("hw-source"))

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


        dataHTML = generateHTML(dataHTML)



        return dataHTML
    }

    function generateHTML(html) {
        var leftBrace = "[[", rightBrace = "]]"

        var dataHTML = ""
        var arr = html.split(rightBrace);
        for (var i = 0; i < arr.length; i++) {
            var value = (arr[i].split(leftBrace))[1]
            
            dataHTML += (arr[i].replace(leftBrace + value, eval(value)));



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




